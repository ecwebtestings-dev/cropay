import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import PageLoader from "../components/common/PageLoader";
import { PATHS } from "./paths";
import { ROLE_HOME } from "../config/Roles";

export default function ProtectedRoute({allowedRoles}) {
  const {user,loading} =useAuth();
  const location =useLocation()

  if(loading) return <PageLoader/>

  
  if(!user) {
    return <Navigate to={PATHS.login} replace state={{from:location}}/>
  }

  //ACCEPY A SINGLE ROLE OR AN ARRAY
  const roles = allowedRoles?[].concat(allowedRoles):null

  //USER ROLE EXISTS IN ROLES ARRAY
  if(roles && !roles.includes(user.role)){
    return <Navigate to={ROLE_HOME[user.role] || PATHS.unauthorized} replace/>
  }
  
  return <Outlet/>
  
}
