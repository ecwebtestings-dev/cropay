import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import { validateSignUp } from "../../validators/index";
import InputField from "../../components/common/InputFields";
import { Loader2, Lock, Mail, Phone, User, } from "lucide-react";
import Layout from "./Layout";
import UseAuthForm from "./UseAuthForm";

export default function Register() {

    const {register} =useAuth();
    const navigate =useNavigate()
    
    const {values,errors,formError,loading,handleInputChange,HandleSubmit}=UseAuthForm({
        intialValues:{name:"",phone:"",email:"",password:""},
        validate:validateSignUp,
        onSubmit: async (formValues)=>{
            await register(formValues);
            navigate('/dashboard')
        },
        fallbackError:'Registration failed. Please try again',
    });


  return (
    <Layout
        title="Sign Up"
        subtitle="Your Journey Starts here"
        error={formError}
        googlelabel="Sign Up with Google"
        >
      
        <form onSubmit={HandleSubmit} noValidate className=" space-y-1">
            <InputField
                label='Full Name'
                name='name'
                type="text"
                onChange={handleInputChange}
                value ={values.name}
                Icon={User}
                placeholder='Full names'
                error={errors.name}
                autoComplete='name'
            />

            <InputField
                label='Phone Number'
                name='phone'
                type="tel"
                Icon={Phone}
                autoComplete='tel'
                placeholder="+256700123456"
                value={values.phone}
                onChange={handleInputChange}
                error={errors.phone}
            />

            <InputField
                label='Email Address'
                name='email'
                type="email"
                Icon={Mail}
                placeholder='yourname@gmail.com'
                autoComplete='email'
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
            />

            <InputField
                label='Password'
                name='password'
                type="password"
                Icon={Lock}
                autoComplete='new-password'
                placeholder='At least 8 characters'
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}

            />

            <button 
                disabled={loading}
                type="submit"
                className="w-full h-11 rounded-md bg-sidebar font-semibold text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ?<Loader2 className="h-4 w-4 animate-spin"/>:'Register'}
            </button>
        </form>

        
        <p className="mt-5 text-center text-sm text-sidebar">
            Already have an account?{" "}
            <Link to='/login' className="font-semibold text-sidebar hover:cursor-pointer">
            Login
            </Link>
        </p>
      
    </Layout>
  )
}
