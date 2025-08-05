import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { FaUser, FaUserInjured, FaStethoscope, FaSearch, FaClock } from "react-icons/fa";
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
    
  const visitedPatientsCount = Array.isArray(patientsData)
    ? patientsData.filter(patient => {
        if (!patient.visit_on) return false;
        const visitTime = new Date(patient.visit_on).getTime();
        const now = Date.now();
        return visitTime >= now - 24 * 60 * 60 * 1000;
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
  }, [isOnline, addNewPatient]);

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
      {/* Enhanced Integrated Header */}
      <main className="flex-1 px-2 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Sticky Action Bar */}
          <div className="sticky top-0 z-20 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Header gradient accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          
          <div className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Welcome and status section */}
              <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaStethoscope className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-900">
                    Welcome, <span className="font-bold">{user?.name || "Doctor"}</span>
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                        ${isOnline ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                      `}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleNewPatient}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner"
                >
                  {showNewPatient ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="hidden sm:inline">Close Form</span>
                      <span className="sm:hidden">Close</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="hidden sm:inline">Add Patient</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </button>
                
                <Link
                  to="/patients"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner"
                >
                  <FaSearch className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Find Patient</span>
                  <span className="sm:hidden">Find</span>
                </Link>
                
                <button
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

          {/* Stat Cards */}
          <div className="overflow-x-auto pb-1 mt-8 mb-6">
            <div className="inline-flex min-w-full gap-2 sm:gap-3 md:gap-4 px-1">
              <StatCard
                title="All Patients"
                icon={FaUser}
                value={patientsList.length}
                subtitle="Total registered"
                variant="primary"
                trend={{ value: 5, isUpGood: true }}
                loading={false}
              />
              <StatCard
                title="Admitted"
                icon={FaUserInjured}
                value={Total_admitted}
                subtitle="Currently admitted"
                variant="success"
                trend={{ value: Total_admitted > 0 ? 10 : 0, isUpGood: false }}
                loading={false}
              />
              <StatCard
                title="Discharged"
                icon={FaUserInjured}
                value={Total_Discharged}
                subtitle="Discharged in 24h"
                variant="danger"
                trend={{ value: Total_Discharged > 0 ? 15 : 0, isUpGood: true }}
                loading={false}
              />
              <StatCard
                title="Queue List"
                icon={FaUser}
                value={queList.length}
                subtitle="Waiting"
                variant="warning"
                trend={{ value: queList.length > 0 ? 8 : 0, isUpGood: false }}
                loading={false}
              />
              <StatCard
                title="Recent Visits"
                icon={FaClock}
                value={visitedPatientsCount}
                subtitle="Visited in 24h"
                variant="info"
                trend={{ value: visitedPatientsCount > 0 ? 12 : 0, isUpGood: true }}
                loading={false}
              />
            </div>
          </div>

          {/* Summary Card - Clinical Detail */}
          

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
        {/* Closing tag added for max-w-6xl container */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
