import { useState } from "react";
import { Mail, LoaderCircle } from "lucide-react";

import { validateEmail } from "../../validators";
import { forgotPassword } from "../../api/authApi";
import Layout from "./Layout";
import InputField from "../../components/common/InputFields";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setEmailSent(false);
    setEmailError("");
    setFormError("");
  };

  // INPUT CHANGE HANDLER
  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setFormError("");
  };

  // FORM SUBMISSION HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setEmailError("");
    setFormError("");


    // vVALIDATE EMAIL
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);
      setSubmittedEmail(email);
      setEmailSent(true);

    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 422) {
        setEmailError(
          data?.errors?.email?.[0] || "Please enter a valid email address."
        );
      } else if (status === 429) {
        setFormError("Too many attempts. Please try again later.");
      } else if (!err.response) {
        setFormError("Unable to connect to the server. Please try again.");
      } else {
        setFormError("Unable to process your request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title={emailSent ? "Check your email" : "Forgot password?"}
      subtitle={
        emailSent
          ? "Follow the instructions in the email to reset your CropPay password."
          : "Enter the email address associated with your CropPay account and we'll send you instructions to reset your password."
      }
      error={formError}
    >
      {emailSent ? (
        <div className="flex flex-col items-center py-8 text-center">
          <h2 className="text-lg font-semibold text-heading">
            Check your email
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            We have sent your password recovery instructions to {" "}
            <span className="font-medium text-heading">{submittedEmail}</span>,
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="mt-6 text-sm font-semibold text-sidebar transition hover:text-primary-500"
          >
            Try another email address
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            label="Email Address"
            Icon={Mail}
            type="email"
            name="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={handleChange}
            error={emailError}
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
                Sending...
              </>
            ) : (
              "Send Instructions"
            )}
          </button>
        </form>
      )}
    </Layout>
  );
}