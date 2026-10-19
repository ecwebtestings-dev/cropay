import { Navigate, Outlet } from "react-router-dom";
import { getRoleDestination} from "../config/Roles";
import { useAuth } from "../context/AuthContext"
import PageLoader from "../components/common/PageLoader";


//LOGIN,REGISTER,AND FORGOT PASSWORD
export default function PublicRoute() {
    const {user,loading}=useAuth();

    if(loading) return <PageLoader/>;

    if(user){<Navigate to={getRoleDestination(user.role)}/>}

  return <Outlet/>
}
