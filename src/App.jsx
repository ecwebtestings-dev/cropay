
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import SessionExpiredModal from "./components/common/ExpiredSessionModal.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
        <SessionExpiredModal/>
      </BrowserRouter>
    </>
  );
}