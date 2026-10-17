import { lazy, Suspense } from "react";
import { Navigate, Routes,Route } from "react-router-dom";

import AppToaster from "../components/common/Toaster";
import PageLoader from "../components/common/PageLoader";
import DashboardLayout from "../components/layout/DashboardLayout";

import { ROLES } from "../config/Roles";
import { PATHS } from "./paths";
import HomeRedirect from "../pages/Home";
import PublicRoute from "./PublicRoute";

//RENDER ON LOAD
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
//import EmailVerification from "../pages/auth/EmailVerification";

import Unauthorized from "../pages/errors/Unathorized";
import ProtectedRoute from "./ProtectedRoute";


import Dashboard from "../pages/farmers/dashboard/Dashboard";
import SavingsGoals from "../pages/farmers/savings/SavingsGoal";
import AdminDashBoard from "../pages/admin/AdminDashBoard";
import NotFound from "../pages/errors/NotFound";


//APP PAGES
const UserDashboard = lazy(()=>import("../pages/farmers/dashboard/Dashboard"))
const SavingGoals =lazy(()=>import("../pages/farmers/savings/SavingsGoal"))
const adminDashBoard =lazy(()=>import("../pages/admin/AdminDashBoard"))
const unauthorized =lazy(()=>import("../pages/errors/Unathorized"))
const notFound =lazy(()=>import("../pages/errors/NotFound"))

export default function AppRoutes() {
  return (
    <>
    <AppToaster/>

    <Suspense fallback={<PageLoader/>}>
      <Routes>
        {/**HOME PAGE */}
        <Route path="/" element={<HomeRedirect/>}/>

          {/*GUESTS ONLY */}
        <Route element={<PublicRoute/>}>
            <Route path={PATHS.login} element={<Login/>}/>
            <Route path={PATHS.register} element={<Register/>}/>
            <Route path={PATHS.forgotPassword} element={<ForgotPassword/>}/>
        </Route>

        <Route path={PATHS.resetPassword} element={<ResetPassword/>}/>
        <Route path={PATHS.unauthorized} element={<Unauthorized/>}/>

        {/*USER/FARMER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={ROLES.FARMER}/>}>
          <Route element={<DashboardLayout/>}>
              <Route path={PATHS.dashboard} element={<Dashboard/>}/>
              <Route path={PATHS.savings} element={<SavingsGoals/>}/>

                {/*MORE ROUTES */}

          </Route>
        </Route>

        {/*ADMIN ROUTES */}
        <Route element={<DashboardLayout/>}>
          <Route path={PATHS.admin} element={<Navigate to={PATHS.adminDashboard} replace/>}>
            <Route path={PATHS.adminDashboard} element={<AdminDashBoard/>}/>

            {/**OTHERS ROUTES */}
          </Route>
        </Route>


        {/**ELSE */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Suspense>
    </>
  )
}
