import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, LoaderCircle, CircleCheck } from "lucide-react";
import toast from "react-hot-toast";

import { resetPassword } from "../../api/authApi";
import { validatePassword, PASSWORD_MIN_LENGTH } from "../../validators/password";
import Layout from "./Layout";
import InputField from "../../components/common/InputFields";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  // READ THE TOKEN ONCE, THEN REMOVE IT FROM THE ADDRESS BAR
  const [token] = useState(() => searchParams.get("token") || "");

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(!token);

  useEffect(() => {
    // REMOVE TOKEN FROM ADDRESS BAR
    window.history.replaceState({}, "", window.location.pathname);
    //SECURE TOKEN
    const meta = document.createElement("meta");
    meta.name = "referrer";
    meta.content = "no-referrer";
    document.head.appendChild(meta);
    return () => {document.head.removeChild(meta);};
    }, []);

    
  // INPUT CHANGE HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  // VALIDATE EMAIL
  const validate = () => {
    const newErrors = {};

    const passwordError = validatePassword(values.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  // FORM SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setFormError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      setSuccess(true);
      toast.success("Password updated successfully.");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 400 || status === 401 || status === 410) {
        // TOKEN INVALID
        setLinkInvalid(true);
      } else if (status === 422) {
        const serverErrors = data?.errors || {};
        setErrors({
          password: serverErrors.password?.[0] || "",
          confirmPassword: serverErrors.confirmPassword?.[0] || "",
        });
        if (!serverErrors.password && !serverErrors.confirmPassword) {
          setFormError(data?.message || "Please check your password.");
        }
      } else if (status === 429) {
        setFormError("Too many attempts. Please try again later.");
      } else if (!err.response) {
        setFormError("Unable to connect to the server. Please try again.");
      } else {
        setFormError("Unable to reset your password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (success) {
    return (
      <Layout
        title=""
        subtitle="Your password has been changed. You can now sign in with your new password."
      >
        <div className="flex flex-col items-center py-8 text-center">
          <CircleCheck className="mb-4 h-12 w-12 text-sidebar" />
            <h1>Password Reset</h1>
            <p>Your password has been successfully reset, Click below to login</p>
          <Link
            to="/login"
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-sidebar px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
             Login
          </Link>
        </div>
      </Layout>
    );
  }

  // INVALID / EXPIRED / MISSING LINK STATE
  if (linkInvalid) {
    return (
      <Layout
        title="Request reset instructions"
        subtitle="This password reset link is no longer valid."
      >
        <div className="flex flex-col items-center py-8 text-center">
          <Link
            to="/forgot-password"
            className="flex w-full items-center justify-center rounded-xl bg-sidebar px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Request 
          </Link>
        </div>
      </Layout>
    );
  }

  // RESET FORM
  return (
    <Layout
      title="Reset password"
      subtitle="Choose a new password for your CropPay account."
      error={formError}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputField
          label="New Password"
          Icon={Lock}
          type="password"
          name="password"
          placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
          required
        />

        <InputField
          label="Confirm Password"
          Icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </Layout>
  );
}