import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { PATHS } from "./paths";
import { ROLE_HOME } from "../config/Roles";
import { Loader2 } from "lucide-react";

export default function Oauthcallback() {
    const {loginWithToken}= useAuth();
    const navigate =useNavigate();

    const started =useRef(false)

    useEffect(()=>{
        if(started.current) return;
        started.current =true;

        const token = new URLSearchParams(window.location.hash.replace(/^#/,"")).get("token");
        window.history.replaceState({},"",window.location.pathname);

        const failed = new URLSearchParams(window.location.search).get("error")
        const backToLogin =(message)=>{
            toast.error(message,{id:"oauth-error"});
            navigate(PATHS.login,{replace:true});
        };

        if(failed || !token){
            backToLogin("Google sign-in failed.Please try again")
            return
        }

        loginWithToken(token,true)
        .then((user)=>{
            const role =user?.role?.toString().trim().toLowerCase();
            navigate(ROLE_HOME[role] || PATHS.unauthorized,{replace:true});

        })
        .catch((err)=>{
            if(err.handled){
                navigate(PATHS.login,{replace:true});
                return;
            }
            backToLogin("Goofle sign-in failed.")
        })
    },[loginWithToken,navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-sidebar">
      <Loader2 size={36} className="animate-spin" />
      <p className="text-sm text-muted">Signing you in with Google...</p>
    </div>
  )
}
