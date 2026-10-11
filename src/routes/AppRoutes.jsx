
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AppToaster from "../components/common/Toaster";
import Dashboard from "../components/dashboard/Dashboard";


export default function AppRoutes() {
  return (
    <>
    <AppToaster/>

      <Routes>
      
      {/* Redirect the home page to the dashboard */}
      <Route path="/login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/" element={<Dashboard/>}/>
    
    </Routes>
    </>
    
  );
}

