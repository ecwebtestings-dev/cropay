import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Leaf, Loader2, Lock, User } from "lucide-react"
import InputField from "../../components/common/InputFields"
import { validateLogin } from "../../validators/index"
import UseAuthForm from "./UseAuthForm"
import Layout from "./Layout"
import { ROLE_HOME } from "../../config/Roles"
import { PATHS } from "../../routes/paths"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const { values, errors, loading, handleInputChange, HandleSubmit } = UseAuthForm({
    intialValues: { email: "", password: "", remember: true },
    validate: validateLogin,
    onSubmit: async ({ email, password, remember }) => {
      const signedInUser = await login({ email, password }, remember)
      navigate(ROLE_HOME[signedInUser?.role] || PATHS.unauthorized)
    },
    fallbackError: "Unable to login. Please try again.",
  })

  return (
    <Layout googlelabel="Continue with Google">
      <form onSubmit={HandleSubmit} noValidate className="space-y-3">
        <InputField
          label="Email or Phone Number"
          name="email"
          type="text"
          Icon={User}
          placeholder="Email or Phone Number"
          autoComplete="username"
          value={values.email}
          error={errors.email}
          onChange={handleInputChange}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          Icon={Lock}
          placeholder="Password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={handleInputChange}
        />

        <div className="flex items-center justify-between gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-[#5d665e]">
            <input
              type="checkbox"
              name="remember"
              checked={values.remember}
              onChange={handleInputChange}
              className="h-4 w-4 rounded accent-[#1f3524]"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-[#2f6b2f] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative flex h-14 w-full items-center justify-center rounded-md bg-[#1f3524] text-base font-semibold text-white
            transition hover:bg-[#2a4630] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          {!loading && (
            <Leaf className="absolute right-5 h-5 w-5 text-[#9ccf6e]" />
          )}
        </button>

        <p className="text-[.9rem] text-muted flex items-center justify-center">
          New here?
          <Link to="/register">Create Account</Link>
        </p>
      </form>
    </Layout>
  );
}