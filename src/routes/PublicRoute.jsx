import { Navigate, Outlet } from "react-router-dom";
import { ROLE_HOME } from "../config/Roles";
import { useAuth } from "../context/AuthContext"


//LOGIN,REGISTER,AND FORGOT PASSWORD
export default function PublicRoute() {
    const {user}=useAuth();

    const home =user? ROLE_HOME[user.role]:null;
    if (home) return <Navigate to={home} replace/>

  return <Outlet/>
}
