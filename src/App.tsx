
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
import { Appointment } from "./pages/Appointment";
import LandingPage from "./pages/LandingPage";
import { PageNotFound } from "./utilities/PageNotFound";
import { HospitalRegistration } from "./pages/HospitalRegistration";
import { HospitalDashboard } from "./pages/HospitalDashboard";
import HqLogin from "./pages/HqPages/HqLogin";
import HospitalProtectedRoute from "./utilities/HospitalProtectedRoute";
import { HqPatients } from "./pages/HqPages/HqPatients";
import HqReports from "./pages/HqPages/HqReports";
import {Pharmacy} from "./pages/Pharmacy";
import { Laboratory } from "./pages/Laboratory"; 
import { Ultrasound } from "./pages/Ultrasound"; // Importing the Ultrasound page


function App() {
  return (
    <BrowserRouter>
    <DashboardProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/onboarding" element={<HospitalRegistration />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/patients" element={<ProtectedRoute> <Patients /> </ProtectedRoute> } />
        <Route path="/reports/:patient_id" element={<ProtectedRoute> <Reports /> </ProtectedRoute> } />
        <Route path="/reports/" element={<ProtectedRoute> <Reports /> </ProtectedRoute> } />
        <Route path="/appointments/" element={<ProtectedRoute> <Appointment /> </ProtectedRoute> } />
        <Route path="/pharmacy" element={<ProtectedRoute> <Pharmacy /> </ProtectedRoute>} />
        <Route path="/laboratory" element={<ProtectedRoute> <Laboratory /> </ProtectedRoute>} />
        <Route path="/ultrasound" element={<ProtectedRoute> <Ultrasound /> </ProtectedRoute>} />

        {/* Hospital Routes */}

        <Route path="/hq_login" element={<HqLogin />} />
        <Route path="/hq" element={<HospitalProtectedRoute><HospitalDashboard /></HospitalProtectedRoute>} />
        <Route path="/hq/patients" element={<HospitalProtectedRoute><HqPatients /></HospitalProtectedRoute>} />
        <Route path="/hq/reports" element={<HospitalProtectedRoute><HqReports /></HospitalProtectedRoute>} />
      </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}


export default App;