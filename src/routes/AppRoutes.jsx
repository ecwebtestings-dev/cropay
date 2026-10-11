
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AppToaster from "../components/common/Toaster";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/farmers/dashboard/Dashboard";
import SavingsGoals from "../pages/farmers/savings/SavingsGoal";


export default function AppRoutes() {
  return (
    <>
    <AppToaster/>

      <Routes>
      
      {/* Redirect the home page to the dashboard */}
      <Route path="login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/" element={<DashboardLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/savings" element={<SavingsGoals/>}/>
        <Route/>
      </Route>
    
    </Routes>
    </>
    
  );
}

