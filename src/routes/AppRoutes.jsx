
import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/farmers/Dashboard";
import AppToaster from "../components/common/Toaster";


export default function AppRoutes() {
  return (
    <>
    <AppToaster/>

      <Routes>
      
      {/* Redirect the home page to the dashboard */}
      <Route
        path="/"
        element={<Login/>}
      />
      <Route path="register" element={<Register/>}/>
      <Route path="dashboard" element={<Dashboard/>}/>
    
    </Routes>
    </>
    
  );
}

