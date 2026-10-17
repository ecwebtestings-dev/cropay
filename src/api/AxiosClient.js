import axios from "axios";
import toast from "react-hot-toast";

import { clearSession, getToken } from "../utils/tokenStorage";

// PUBLIC AUTH ENDPOINTS:
const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/resetPassword",
  "/oauth",
];

// API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
    return "Cannot reach the server. Check your internet connection.";

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
  if (status === 401) return data?.message || "Session timeout. Please login again.";
  if (status === 403)
    return data?.message || "You don't have permission to access this.";
  if (status >= 500) return "Server error. Please try again later.";

  return data?.message || "Something went wrong.";
}

// RESPONSE HANDLING
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = getErrorMessage(error);

    error.message = error.userMessage;

    const status = error.response?.status;
    const url = error.config?.url || "";
    const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((path) =>url.includes(path));

    // NETWORK  ERRORS
    if (!error.response || status >= 500) {
      toast.error(error.userMessage, { id: "server-error" });
      error.handled = true;
    }
    // RATE LIMITING
    else if (status === 429) {
      toast.error(error.userMessage, { id: "rate-limit" });
      error.handled = true;
    }
    // SESSION EXPIRY
    else if (
      status === 401 &&
      !isPublicAuthCall &&
      !error.config?.skipAuthRedirect
    ) {
      clearSession();
      toast.error("Session timeout. Please log in again.", {
        id: "session-expired",
      });
      error.handled = true;
      window.location.assign("/login");
    }

    return Promise.reject(error);
  }
);

export default api;