
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from '../src/pages/Signup';
import Login from '../src/pages/Login';
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./utilities/ProtectedRoute";
import { DashboardProvider } from "./context/DashboardContext";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
    <DashboardProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/patients" element={<ProtectedRoute> <Patients /> </ProtectedRoute> } />
        <Route path="/reports" element={<ProtectedRoute> <Reports /> </ProtectedRoute> } />

      </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}


export default App;