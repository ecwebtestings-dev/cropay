import axios from "axios";

import {getToken } from "../utils/tokenStorage";

// PUBLIC AUTHENTICATION ENDPOINTS.
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/resetPassword",
  "/oauth/callback",
  "/oauth/google",
  "/email/verification-notification",
];

// API BASE URL.
const API_URL = import.meta.env.VITE_API_URL?.trim();


//AXIOS INSTANCE.
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// CHECK WHETHER A REQUEST IS A PUBLIC AUTH REQUEST.
const isPublicAuthRequest = (url = "") => {
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
};


// GET THE TOKEN ATTACHED TO AN AXIOS REQUEST.
const getRequestToken = (config) => {
  const headers = config?.headers;

  const authorization =
    headers?.get?.("Authorization") ??
    headers?.Authorization ??
    headers?.authorization;

  if (!authorization) return null;

  return authorization.replace(/^Bearer\s+/i, "");
};


// ATTACH THE CURRENT TOKEN TO EVERY REQUEST.
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // DO NOT SEND AN OLD AUTHORIZATION HEADER.
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);



// EXTRACT FIELD VALIDATION ERRORS.
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;

  if (!errors) return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
}



// ERROR MESSAGE
export function getErrorMessage(error) {
  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (!error.response) {
    return "Not connected. Check your internet.";
  }

  const { status, data } = error.response;
  const requestUrl = error.config?.url || "";

  const isAuthRequest = isPublicAuthRequest(requestUrl);

  // SESSION EXPIRATION IS HANDLED BY AUTHCONTEXT.
  if ([401, 419].includes(status) && !isAuthRequest) {
    return "";
  }

  if (status === 422) {
    const firstFieldError = Object.values(getFieldErrors(error))[0];

    return (
      firstFieldError || data?.message || "Please check the form and try again."
    );
  }

  if (status === 429) {
    return "Too many requests. Please wait and try again.";
  }

  if (status === 401) {
    return data?.message === "Unauthenticated."
      ? "Invalid email or password."
      : data?.message || "Invalid email or password.";
  }

  if (status === 403) {
    return data?.message || "You don't have permission to access this.";
  }

  if (status >= 500) {
    return "Server error. Please try again later.";
  }

  return data?.message || "Something went wrong.";
}

// HANDLE API RESPONSE ERRORS.
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // IGNORE PUBLIC AUTH REQUESTS AND OTHER HTTP ERRORS.
    if (![401, 419].includes(status) || isPublicAuthRequest(requestUrl)) {
      return Promise.reject(error);
    }

    // GET THE TOKEN USED BY THE FAILED REQUEST.
    const requestToken = getRequestToken(error.config);

    // GET THE CURRENTLY SAVED TOKEN.
    const currentToken = getToken();

    // IGNORE REQUESTS THAT BELONG TO AN OLD SESSION.
    if (!currentToken || requestToken !== currentToken) {
      return Promise.reject(error);
    }

    // PREVENT MULTIPLE SESSION-EXPIRATION EVENTS.
    if (!window.__cropPaySessionExpired) {
      window.__cropPaySessionExpired = true;

      // AUTHCONTEXT WILL CLEAR THE SESSION.
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);

export default api;
