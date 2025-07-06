import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import { FaUser, FaUserInjured, FaStethoscope, } from "react-icons/fa";
import NewPatient from "../components/NewPatient";
import Report from "../components/ReportForm";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import AdmittedPage from "../components/AdmittedPage";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - ClinicPal App";
  }, []);

  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { user } = useAuth();
  const { patientsData } = useDashboard();
  const Total_admitted = Array.isArray(patientsData) ? patientsData.filter(p => p.admission_status === 1).length : 0;


  const toggleNewPatient = () => {
    setShowNewPatient((prev) => !prev);
    if (showReport) setShowReport(false);
  };

  const toggleReport = () => {
    setShowReport((prev) => !prev);
    if (showNewPatient) setShowNewPatient(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <NavBar />

      <main className="flex-1 pt-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header */}
          <h2 className="text-3xl font-bold text-sky-900">
            Welcome, {user?.name || "Doctor"}
          </h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2">
            <StatCard title="Total Patients" icon={FaUser} value={patientsData.length} />
            <StatCard title="Admitted" icon={FaUserInjured} value={Total_admitted} />
            <StatCard title="Discharged" icon={FaUserInjured} value={10} />
          </div>


          {/* Summary Card - Clinical Detail */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaStethoscope className="text-blue-500" />
              Clinic Summary
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You're managing a total of <span className="font-medium">{patientsData.length}</span> patients today.
              There are currently <span className="text-green-600 font-medium">{Total_admitted} admitted</span> and
              <span className="text-red-500 font-medium ml-1">10 discharged</span>. Stay sharp!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-500 transition"
              onClick={toggleNewPatient}
            >
              {showNewPatient ? "Close Patient Form" : "Add New Patient"}
            </button>

            <button
              className="bg-lime-600 text-white px-5 py-3 rounded-lg shadow hover:bg-lime-500 transition"
              onClick={() => alert("Discharge functionality coming soon")}
            >
              Discharge Patient
            </button>

            <button
              className="bg-yellow-600 text-white px-5 py-3 rounded-lg shadow hover:bg-yellow-500 transition"
              onClick={toggleReport}
            >
              {showReport ? "Close Report Form" : "Add Report"}
            </button>
          </div>

          {/* Dynamic Forms */}
          <div className="space-y-6">
            {showNewPatient && <NewPatient />}
            {showReport && <Report />}
            <AdmittedPage/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
