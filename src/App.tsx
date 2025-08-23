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
import { Pharmacy } from "./pages/Pharmacy";
import { Laboratory } from "./pages/Laboratory";
import { Ultrasound } from "./pages/Ultrasound";
import ContactUs from "./components/landing_page/ContactUs";
import ConfirmationPage from "./pages/Confirmation";
import { useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { DepartmentsReportPrint } from "./components/print/DepartmentsReportPrint";
import { Cashier } from "./pages/Cashier";
import { BillReceipt } from "./components/print/BillReceipt";
import { Xray } from "./pages/Xray";
import { HqTransactions } from "./pages/HqPages/HqTransactions";
import { SalesReportPrint } from "./components/print/SalesReportPrint";
import PharmacyInventoryPage from "./pages/PharmacyInventoryPage";
import PrintableReport from "./components/print/PrintableReport";
import { PasswordRecovery } from "./pages/PasswordRecovery";
import ResetPassword from "./pages/ResetPassword";

function App() {
  // Get token from AuthContext
  const { user } = useAuth();
  const token = user?.token || "";

  return (
    <BrowserRouter>
      <SocketProvider token={token}>
        <DashboardProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/onboarding" element={<HospitalRegistration />} />
            <Route path="/forgot-password" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
            <Route path="/patients" element={<ProtectedRoute> <Patients /> </ProtectedRoute> } />
            <Route path="/reports/:patient_id" element={<ProtectedRoute> <Reports /> </ProtectedRoute> } />
            <Route path="/reports/" element={<ProtectedRoute> <Reports /> </ProtectedRoute> } />
            <Route path="/appointments/" element={<ProtectedRoute> <Appointment /> </ProtectedRoute> } />
            <Route path="/pharmacy" element={<ProtectedRoute> <Pharmacy /> </ProtectedRoute>} />
            <Route path="/laboratory" element={<ProtectedRoute> <Laboratory /> </ProtectedRoute>} />
            <Route path="/ultrasound" element={<ProtectedRoute> <Ultrasound /> </ProtectedRoute>} />
            <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/pharmacy/inventory" element={<ProtectedRoute><PharmacyInventoryPage /></ProtectedRoute>} />
            
            {/* Print Routes */}
            <Route path="/sales-report" element={<ProtectedRoute><SalesReportPrint /></ProtectedRoute>} />
            
            {/* Hospital Routes */}
            <Route path="/hq/login" element={<HqLogin />} />
            <Route path="/hq" element={<HospitalProtectedRoute><HospitalDashboard /></HospitalProtectedRoute>} />
            <Route path="/hq/patients" element={<HospitalProtectedRoute><HqPatients /></HospitalProtectedRoute>} />
            <Route path="/hq/reports" element={<HospitalProtectedRoute><HqReports /></HospitalProtectedRoute>} />
            <Route path="/print-report" element={<HospitalProtectedRoute><PrintableReport /></HospitalProtectedRoute>} />
            <Route path="/hq/transactions" element={<HospitalProtectedRoute><HqTransactions /></HospitalProtectedRoute>} />
            
            <Route path="/department-report/print" element={<DepartmentsReportPrint />} />
            <Route path="/cashier" element={<ProtectedRoute><Cashier /></ProtectedRoute>} />
            <Route path="/bill-receipt" element={<ProtectedRoute><BillReceipt /></ProtectedRoute>} />
            <Route path="/xray" element={<ProtectedRoute><Xray /></ProtectedRoute>} />
          </Routes>
        </DashboardProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;