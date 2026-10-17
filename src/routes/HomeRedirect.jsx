import { Navigate } from "react-router-dom";
import PageLoader from "../components/common/PageLoader";
import { useAuth } from "../context/AuthContext"
import { PATHS } from "./paths";
import { ROLE_HOME } from "../config/Roles";

export default function HomeRedirect() {
    const {user,loading}=useAuth();
    //LOADING
    if(loading)return <PageLoader/>

    //NOT LOGGINED IN
    if(!user) return <Navigate to={PATHS.login} replace/>

  return <Navigate to={ROLE_HOME[user.role] || PATHS.unauthorized} replace/>
}
