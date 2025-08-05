import { useEffect, useState } from "react";
import { FiFileText, FiEdit, FiFilePlus, FiClock, FiList } from "react-icons/fi";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import ReportForm from "../components/ReportForm";
import { AdmittedReport } from "../components/AdmittedReports";
import { PatientReport } from "../components/PatientReport";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'archived'
  const { user } = useAuth();
  const { patient_id } = useParams();

  useEffect(() => {
    document.title = "Reports - ClinicPal App";
  }, []);

  return user?.role === "unactivated" ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto border border-red-200">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h1>
        <p className="text-gray-700 mb-6">
          Your account is inactive. Please contact your hospital administrator to activate access to the dashboard.
        </p>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Enhanced Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FiFileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient_id ? "Patient Reports" : "Medical Reports"}
                </h1>
                <p className="text-sm text-gray-500">
                  {patient_id 
                    ? "View and manage reports for this patient" 
                    : "View and manage all patient medical reports"}
                </p>
              </div>
            </div>
            {!patient_id ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg 
                         shadow-sm hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                <FiFilePlus className="mr-2 h-5 w-5" />
                Create New Report
              </motion.button>
            ) : null}
          </div>
        </div>

        {/* Tabs - Only show when not viewing a specific patient */}
        {!patient_id && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab("current")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === "current"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FiList className={`mr-2 h-5 w-5 ${activeTab === "current" ? "text-blue-500" : "text-gray-400"}`} />
                  Current Reports
                </button>
                <button
                  onClick={() => setActiveTab("archived")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === "archived"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FiClock className={`mr-2 h-5 w-5 ${activeTab === "archived" ? "text-blue-500" : "text-gray-400"}`} />
                  Archived Reports
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Reports Section */}
          <section className="w-full">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">
                  {patient_id 
                    ? "Patient History & Reports" 
                    : activeTab === "current" 
                      ? "Recent Medical Reports" 
                      : "Archived Reports"}
                </h2>
                
                {/* Patient-specific button */}
                {patient_id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReportModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm 
                             rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 font-medium"
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Write Report
                  </motion.button>
                )}
              </div>
              
              {/* Reports Content */}
              <div className="p-6">
                {patient_id ? (
                  <PatientReport patient_id={patient_id} />
                ) : (
                  <AdmittedReport />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Report Form Modal */}
        <ReportForm
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          patient_id={patient_id ?? ""}
        />
      </main>
    </div>
  );
};

export default Reports;