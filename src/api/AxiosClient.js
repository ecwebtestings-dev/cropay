import axios from "axios";

import { clearSession, getToken } from "../utils/tokenStorage";

// PUBLIC AUTH ENDPOINTS:
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/resetPassword",
  "/oauth/callback",
];

// API_URL
const API_URL = import.meta.env.VITE_API_URL?.trim();

if (!API_URL) {
  console.error(
    "VITE_API_URL is missing. Check your Vercel Environment Variables."
  );
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

// SEND SANCTUM TOKEN WITH EVERY REQUEST
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// FIELD VALIDATION ERRORS
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors;
  if (!errors) return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ])
  );
}

// USER ERROR MESSAGE 
export function getErrorMessage(error) {
  if (error.code === "ECONNABORTED")
    return "The request timed out. Please try again.";
  if (!error.response)
    return "Connection failed. Check your internet connection.";

  const { status, data } = error.response;

  if (status === 422) {
    const firstFieldError = Object.values(getFieldErrors(error))[0];
    return (
      firstFieldError ||
      data?.message ||
      "Please check the form and try again."
    );
  }
  if (status === 429)
    return "Too many requests. Please wait a minute and try again.";
 
  if (status === 401) {
    const requestUrl = error.config?.url || "";

    const isLoginRequest = requestUrl.includes("/login");

  if (isLoginRequest) {
    return data?.message === "Unauthenticated."
      ? "Invalid email or password."
      : data?.message || "Invalid email or password.";
  }

  return "Your session has expired. Please log in again.";
}

  if (status === 403)
    return data?.message || "You don't have permission to access this.";
  if (status >= 500) return "Server error. Please try again later.";

  return data?.message || "Something went wrong.";
}



 // RESPONSE HANDLING

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
        requestUrl.includes(path)
      );

      if (
        [401, 419].includes(status) &&
        !isAuthRequest &&
        !window.__cropPaySessionExpired
      ) {
        window.__cropPaySessionExpired = true;
        clearSession();
        window.dispatchEvent(new Event("auth:expired"));
      }
          return Promise.reject(error);
        }
      );


export default api;