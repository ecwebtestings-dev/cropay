import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loader2, Lock, Mail } from "lucide-react"
import InputField from "../../components/common/InputFields";
import { validateLogin } from "../../validators/index";
import UseAuthForm from "./UseAuthForm";
import Layout from "./Layout";
import { ROLE_HOME } from "../../config/Roles";
import { PATHS } from "../../routes/paths";

export default function Login() {
    const {login} = useAuth();
    const navigate =useNavigate();

    const {values,errors,loading,handleInputChange,HandleSubmit}=UseAuthForm({
      
      intialValues:{ email:"",password:"",remember:true},
        validate:validateLogin,
        onSubmit: async ({email,password,remember})=>{

        //RETURN SIGNINUSER
        const signedInUser = await login({email,password},remember);
        navigate(ROLE_HOME[signedInUser?.role] || PATHS.unauthorized);
        
      },
      fallbackError:"Unable to login. Please try again.",
    })
    
  
  
  return (
    <Layout
        title="Sign In"
        subtitle="Log in to your CropPay account"
        googlelabel="Continue with Google" 
      >
      
            {/**FORM */}
            <form onSubmit={HandleSubmit} noValidate className="mt-8 space-y-2">
              <InputField
                label="Email"
                name="email"
                type="text"
                Icon={Mail}
                placeholder='name@gmail.com'
                value={values.email}
                error={errors.email}
                onChange={handleInputChange}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                Icon={Lock}
                placeholder='Atleast 6+ characters'
                value={values.password}
                error={errors.password}
                onChange={handleInputChange}
              />

              <div className="flex items-center justify-between gap-2 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-bold">

                  <input
                   type="checkbox" 
                   name="remember"
                   checked={values.remember}
                   onChange={handleInputChange}
                   className="h-4 w-4 rounded accent-sidebar"
                   />
                  Remeber me</label>


                  <Link
                    to="/forgot-password"
                    className="font-medium text-muted cursor-pointer"
                  >Forgot password</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-md inline-flex items-center justify-center bg-sidebar text-sm font-semibold text-white hover:bg-sidebar disabled::cursor-not-allowed  hover:cursor-pointer"
                >
                  {loading? <Loader2 className="animate-spin"/>:'Login'}
                </button>

            </form>
          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-muted hover:underline">
              Register
            </Link>
          </p>
    </Layout>
  )
}
