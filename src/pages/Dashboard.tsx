import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { FaUser, FaUserInjured, FaStethoscope, FaSearch } from "react-icons/fa";
import NewPatient from "../components/NewPatient";
import ReportForm from "../components/ReportForm";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import QueList from "../components/QueList";
import { Link } from "react-router-dom";
import { syncLocalPatientsToBackend, fetchAllPatients } from "../db/patientHelpers";
import { toast } from "react-toastify";
import type { PatientsData } from "../context/DashboardContext";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - ClinicPal App";
  }, []);

  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user, logout } = useAuth();
  const { patientsData, queList, addNewPatient } = useDashboard();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [localPatients, setLocalPatients] = useState<PatientsData[]>([]);
  const Total_admitted = Array.isArray(patientsData)
    ? patientsData.filter((p) => p.admission_status === true).length
    : 0;
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const Total_Discharged = Array.isArray(patientsData)
    ? patientsData.filter((p) => {
        if (!p.discharged_on) return false;
        const dischargedDate = new Date(p.discharged_on);
        return dischargedDate >= oneDayAgo && dischargedDate <= new Date();
      }).length
    : 0;

  const toggleNewPatient = () => {
    setShowNewPatient((prev) => !prev);
    if (showReportModal) setShowReportModal(false);
  };

  useEffect(() => {
    if (isOnline) {
      syncLocalPatientsToBackend(addNewPatient, fetchAllPatients);
    } else {
      toast.info("You are offline. Local changes will sync when back online.");
    }
  }, [isOnline, addNewPatient, fetchAllPatients]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are online. Data is synced.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warn("You are offline. Using locally saved data.");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      fetchAllPatients().then(setLocalPatients);
    }
  }, [isOnline]);

  const patientsList = isOnline ? patientsData : localPatients;

  // Enterprise dashboard styling: tighter layout, less whitespace, clear sections
  return user?.role === "unactivated" ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto border border-red-200">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h1>
        <p className="text-gray-700 mb-6">
          Your account is inactive. Please contact your hospital administrator to activate access to the dashboard.
        </p>
        <button
          className="px-5 py-2 mr-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100">
      <NavBar />
      {/* Status Indicator */}
      <div className="flex justify-end px-4 pt-2">
        <span
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
            ${isOnline ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
          `}
        >
          <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-yellow-500"} inline-block`} />
          {isOnline ? "Online - Live Data" : "Offline - Local Data"}
        </span>
      </div>
      <main className="flex-1 pt-2 px-2 md:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Sticky Action Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 flex flex-col sm:flex-row items-center sm:justify-between px-4 md:px-6 py-2 rounded-t-xl shadow-sm mb-2 gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-blue-900 text-center sm:text-left">
              Welcome, <span className="font-bold">{user?.name || "Doctor"}</span>
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md shadow transition"
                onClick={toggleNewPatient}
              >
                {showNewPatient ? "Close Patient Form" : "Add New Patient"}
              </button>
              <Link
                to="/patients"
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md shadow transition"
              >
                Find Patient <FaSearch />
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="overflow-x-auto pb-1">
            <div className="inline-flex min-w-full gap-2 sm:gap-3 md:gap-4 px-1">
              <StatCard title="All Patients" icon={FaUser} value={patientsList.length} />
              <StatCard title="Admitted" icon={FaUserInjured} value={Total_admitted} />
              <StatCard title="Discharged" icon={FaUserInjured} value={Total_Discharged} />
              <StatCard title="Que List" icon={FaUser} value={queList.length} />
              <StatCard
                title="Visited Patients"
                icon={FaUser}
                value={
                  Array.isArray(patientsData)
                    ? patientsData.filter(patient => {
                        const visitTime = new Date(patient.visit_on).getTime();
                        const now = Date.now();
                        return visitTime >= now - 24 * 60 * 60 * 1000;
                      }).length
                    : 0
                }
              />
            </div>
          </div>

          {/* Summary Card - Clinical Detail */}
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border-t-4 border-blue-500 w-full">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaStethoscope className="text-blue-500" />
              Clinic Summary
            </h3>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              You're managing a total of{" "}
              <span className="font-bold text-blue-900">{patientsData.length}</span> patients today.
              There are currently{" "}
              <span className="text-green-600 font-bold">{Total_admitted} admitted</span> and
              <span className="text-red-500 font-bold ml-1">{Total_Discharged} discharged</span>. Stay sharp!
            </p>
          </div>

          {/* Dynamic Forms & Admitted Patients */}
          <div className="space-y-6">
            {showNewPatient && (
              <div className="animate-fade-in">
                <NewPatient isOpen={showNewPatient} onClose={() => setShowNewPatient(false)} />
              </div>
            )}
            {showReportModal && (
              <div className="animate-fade-in">
                <ReportForm isOpen={showReportModal} onClose={() => setShowReportModal(false)} patient_id="" />
              </div>
            )}
            
          </div>
          <div>
              <QueList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
