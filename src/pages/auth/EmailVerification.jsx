import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {Mail,CheckCircle2,XCircle,Clock,RefreshCw,ArrowLeft,ArrowRight,} from "lucide-react";
import toast from "react-hot-toast";

import { getToken } from "../../utils/tokenStorage";
import { resendEmailVerification } from "../../api/authApi";
import Layout from "./Layout";

const VIEWS = {
  
  "check-email": {
    icon: Mail,
    title: "Check your email",
    message:
      "We've sent a verification link to your email address.Click Verify email address to activate your CropPay account.",
      color: "text-green-700",
      
  },
  success: {
    icon: CheckCircle2,
    title: "Email verified successfully!",
    message:
      "Your email address has been verified. You can now sign in to CropPay.",
    color: "text-green-700",
    
  },
  already_verified: {
    icon: CheckCircle2,
    title: "Email already verified",
    message:
      "Your email address has already been verified. You can sign in to your account.",
    color: "text-green-700",
    
  },
  expired: {
    icon: Clock,
    title: "Verification link expired",
    message:
      "Your verification link has expired. Request a new verification email to continue.",
    color: "text-amber-700",
    
  },
  invalid: {
    icon: XCircle,
    title: "Verification unsuccessful",
    message:
      "This verification link is invalid. Request a new verification email and try again.",
    color: "text-red-700",
    
  },
};

export default function EmailVerification() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // PAGE TO DISPLAY: check-email, success, already_verified, expired or invalid
  const status = searchParams.get("status") || location.state?.status || "check-email";

  // DISPLAY ONLY: navigate("/email-verification", { state: { email } }) AFTER REGISTER
  const email = location.state?.email || "";

  const view = VIEWS[status] || VIEWS.invalid;
  const Icon = view.icon;

  const isSuccess = status === "success" || status === "already_verified";

  // THE RESEND ROUTE IS PROTECTED, SO IT ONLY WORKS FOR A LOGGED-IN USER
  const [hasToken] = useState(() => Boolean(getToken()));

  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await resendEmailVerification();

      toast.success("A new verification email has been sent.");
    } catch (err) {
      if (err.handled) return; 
      toast.error(err.userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-md text-center">
        {/* Status icon */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${view.bg} ${view.color}`}
        >
          <Icon size={38} strokeWidth={1.8} />
        </div>

        <h2 className="text-2xl font-bold text-heading">{view.title}</h2>

        <p className="mt-3 text-sm leading-6 text-muted">{view.message}</p>

        {/* Email address */}
        {email && (
          <div className="mt-5 break-all rounded-xl border border-sidebar/20 bg-sidebar/5 px-4 py-3">
            <p className="text-sm font-semibold text-heading">{email}</p>
          </div>
        )}

        
        {/* Resend */}
        {!isSuccess && hasToken && (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sidebar px-4 py-3 text-sm font-semibold text-sidebar transition hover:bg-sidebar/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Sending..." : "Resend verification email"}
          </button>
        )}

        {/* Not logged in, sign in first, then request a new link */}
        {!isSuccess && !hasToken && (
          <>
            <p className="mt-6 text-sm text-muted">
              Sign in to your account to request a new verification email.
            </p>

            <Link
              to="/login"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Sign in
              <ArrowRight size={18} />
            </Link>
          </>
        )}

        {/* Success action */}
        {isSuccess && (
          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue to login
            <ArrowRight size={18} />
          </Link>
        )}

        {/* Back link: only when the main button isn't already a login button */}
        {!isSuccess && hasToken && (
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-sidebar"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        )}
      </div>
    </Layout>
  );
}