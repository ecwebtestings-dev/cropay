
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppToaster from "../components/common/Toaster";
import PageLoader from "../components/common/PageLoader";
import DashboardLayout from "../components/layout/DashboardLayout";

import { ROLES } from "../config/Roles";
import { PATHS } from "./paths";

import HomeRedirect from "../pages/Home";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Authentication pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OAuthCallback from "./Oauthcallback";
import Transactions from "../pages/farmers/transactions/Transactions";
import Settings from "../pages/farmers/settings/Settings";
import Users from "../pages/admin/Users";
import AuditLogs from "../pages/admin/Auditlogs";
import AdminSettings from "../pages/admin/Settings";
import Categories from "../pages/admin/ProduceCatergory";


// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/farmers/dashboard/Dashboard"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashBoard"));
const Unauthorized = lazy(() => import("../pages/errorspages/Unathorized"));
const NotFound = lazy(() => import("../pages/errorspages/NotFound"));

export default function AppRoutes() {
  return (
    <>
      <AppToaster />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomeRedirect />} />

          {/*PUBLIC*/}
          <Route element={<PublicRoute />}>
            <Route path={PATHS.login} element={<Login />} />
            <Route path={PATHS.register} element={<Register />} />
            <Route path={PATHS.forgotPassword} element={<ForgotPassword />}/>
            
          </Route>

          {/* PASSWORD RESET*/}
          <Route path={PATHS.resetPassword} element={<ResetPassword />}/>
          <Route path={PATHS.unauthorized} element={<Unauthorized />}/>
          <Route path={PATHS.oauthCallback} element={<OAuthCallback/>} /> 
          {/* USER/FARMER */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.FARMER]} />}>
            <Route element={<DashboardLayout />}>
              <Route path={PATHS.dashboard} element={<Dashboard />}/>
              <Route path={PATHS.transactions} element={<Transactions/>}/>
              <Route path={PATHS.settings} element={<Settings/>}/>
            </Route>
          </Route>

          {/* ADMIN/SUPER_ADMIN*/}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}/>}>
            <Route element={<DashboardLayout />}>
              <Route path={PATHS.admin} element={<Navigate to={PATHS.adminDashboard}replace/>}/>
              <Route path={PATHS.adminDashboard} element={<AdminDashboard />}/>
              <Route path={PATHS.adminUsers} element={<Users/>}/>
              <Route path={PATHS.adminLogs} element={<AuditLogs/>}/>
              <Route path={PATHS.adminSettings} element={<AdminSettings/>}/>
              <Route path={PATHS.adminCategories} element={<Categories/>}/>
              <Route />
            </Route>
          </Route>

          {/* ELSE*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
