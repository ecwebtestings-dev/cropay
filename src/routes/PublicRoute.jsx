import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLE_HOME } from "../config/Roles";
import { useAuth } from "../context/AuthContext"
import PageLoader from "../components/common/PageLoader";


//LOGIN,REGISTER,AND FORGOT PASSWORD
export default function PublicRoute() {
    const {user,loading}=useAuth();
    const location = useLocation()

    if(loading) return <PageLoader/>;

    if(user){
      const target =location.state?.from?.pathname || ROLE_HOME[user.role];
      if (target) return <Navigate to={target} replace/>
    }

  return <Outlet/>
}
