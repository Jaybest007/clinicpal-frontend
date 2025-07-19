import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { FaUser, FaUserInjured, FaStethoscope } from "react-icons/fa";
import NewPatient from "../components/NewPatient";
import ReportForm from "../components/ReportForm";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

import QueList from "../components/QueList";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - ClinicPal App";
  }, []);

  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { user, logout } = useAuth();
  const { patientsData, queList } = useDashboard();
  const Total_admitted = Array.isArray(patientsData)
    ? patientsData.filter((p) => p.admission_status === true).length
    : 0;
  const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const Total_Discharged = Array.isArray(patientsData) 
    ?  patientsData.filter((p) => {
      if (!p.discharged_on) return false;
      const dischargedDate = new Date(p.discharged_on);
      return dischargedDate >= oneDayAgo && dischargedDate <= new Date()}).length : 0;

  const toggleNewPatient = () => {
    setShowNewPatient((prev) => !prev);
    if (showReportModal) setShowReportModal(false);
  };

  const toggleReport = () => {
    setShowReportModal((prev) => !prev);
    if (showNewPatient) setShowNewPatient(false);
  };


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
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 pt-8 px-2 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Sticky Action Bar */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex flex-col sm:flex-row items-center sm:justify-between px-4 md:px-8 py-3 rounded-t-xl shadow-sm mb-4 gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-900 text-center sm:text-left">
              Welcome, {user?.name || "Doctor"}
            </h2>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md shadow transition"
                onClick={toggleNewPatient}
              >
                {showNewPatient ? "Close Patient Form" : "Add New Patient"}
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-md shadow transition"
                onClick={toggleReport}
              >
                {showReportModal ? "Close Report Form" : "Add Report"}
              </button>
            </div>
          </div>


          {/* Stat Cards */}
          <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-2">
            <StatCard title="Total Patients" icon={FaUser} value={patientsData.length} />
            <StatCard title="Admitted" icon={FaUserInjured} value={Total_admitted} />
            <StatCard title="Discharged" icon={FaUserInjured} value={Total_Discharged} />
            <StatCard title="Que List" icon={FaUser} value={queList.length} />
            <StatCard
              title="Visited Patients Today"
              icon={FaUser}
              value={
                patientsData.filter(patient => {
                  const visitTime = new Date(patient.visit_on).getTime();
                  const now = Date.now();
                  return visitTime >= now - 24 * 60 * 60 * 1000;
                }).length
              }
            />

          </div>

          {/* Summary Card - Clinical Detail */}
            <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-8 border-t-4 border-blue-500 ">
            <h3 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-3">
              <FaStethoscope className="text-blue-500" />
              Clinic Summary
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              You're managing a total of{" "}
              <span className="font-bold text-blue-900">{patientsData.length}</span> patients today.
              There are currently{" "}
              <span className="text-green-600 font-bold">{Total_admitted} admitted</span> and
              <span className="text-red-500 font-bold ml-1">{Total_Discharged} discharged</span>. Stay sharp!
            </p>
            </div>

          {/* Dynamic Forms & Admitted Patients */}
          <div className="space-y-8">
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
            <div>
              <QueList />
            </div>
          </div>
        </div>
      </main>
    </div>
);

      
  
};

export default Dashboard;
