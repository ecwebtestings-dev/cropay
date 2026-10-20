
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { PATHS } from "./paths";
import { ROLE_HOME } from "../config/Roles";

export default function OAuthCallback() {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Read the token from ?token=...
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const failed = params.get("error");

    // Remove query parameters from the browser address bar.
    window.history.replaceState({},document.title,window.location.pathname);

    const backToLogin = (message) => {
      toast.error(message, { id: "oauth-error" });
      navigate(PATHS.login, { replace: true });
    };

    if (failed || !token) {
      backToLogin(
        failed
          ? "Google sign-in failed. Please try again."
          : "Authentication token was not received."
      );
      return;
    }

    loginWithToken(token, true)
      .then((user) => {
        if (!user) {
          backToLogin("Could not retrieve your account. Please log in again.");
          return;
        }

        const role = user.role?.toString().trim().toLowerCase();
        const destination = ROLE_HOME[role];

        if (!destination) {
          navigate(PATHS.unauthorized, { replace: true });
          return;
        }

        navigate(destination, { replace: true });
      })
      .catch((error) => {
        console.error("Google authentication failed:", error);

        if (error?.handled) {
          navigate(PATHS.login, { replace: true });
          return;
        }

        backToLogin(
          error?.userMessage || "Google sign-in failed. Please try again."
        );
      });
  }, [loginWithToken, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-sidebar">
      <Loader2 size={36} className="animate-spin" />

      <p className="text-sm text-muted">
        Signing you in with Google...
      </p>
    </div>
  );
}
