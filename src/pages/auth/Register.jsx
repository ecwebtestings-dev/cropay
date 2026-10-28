import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateSignUp } from "../../validators/index";
import InputField from "../../components/common/InputFields";
import { Leaf, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import Layout from "./Layout";
import UseAuthForm from "./UseAuthForm";
import { ROLE_HOME } from "../../config/Roles";
import { PATHS } from "../../routes/paths";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { values, errors, loading, handleInputChange, HandleSubmit } =
    UseAuthForm({
      intialValues: { name: "", phone: "", email: "", password: "" },
      validate: validateSignUp,
      onSubmit: async (formValues) => {
        const newUser = await register(formValues);

        if (newUser) {
          navigate(ROLE_HOME[newUser?.role] || PATHS.unauthorized);
          return;
        }

        toast.success("Account created. Please sign in");
        navigate(PATHS.login, { replace: true });
      },
      fallbackError: "Registration failed. Please try again",
    });

  return (
    <Layout
      title="Create Account"
      subtitle="Join AgriConnect and start growing"
      googlelabel="Sign Up with Google"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#2f5a3a] hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={HandleSubmit} noValidate className="space-y-4">
        <InputField
          label="Full Name"
          name="name"
          type="text"
          Icon={User}
          placeholder="Full Name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={handleInputChange}
        />

        <InputField
          label="Phone Number"
          name="phone"
          type="tel"
          Icon={Phone}
          placeholder="+256700123456"
          autoComplete="tel"
          value={values.phone}
          error={errors.phone}
          onChange={handleInputChange}
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          Icon={Mail}
          placeholder="Email Address"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={handleInputChange}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          Icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="relative flex h-14 w-full items-center justify-center rounded-xl bg-[#1f3524] text-base font-semibold text-white
            transition hover:bg-[#2a4630] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Register"}
          {!loading && (
            <Leaf
              className="absolute right-5 h-5 w-5 text-[#9ccf6e]"
              aria-hidden="true"
            />
          )}
        </button>

        <p className="text-[.9rem] text-muted flex items-center justify-center">
          Already have an account?
          <Link to="/login" className="text-semibold">Sign in</Link>
        </p>
      </form>
    </Layout>
  );
}
