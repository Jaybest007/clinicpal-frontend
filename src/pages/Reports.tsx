import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ReportForm from "../components/ReportForm";
import { AdmittedReport } from "../components/AdmittedReports";
import { PatientReport } from "../components/PatientReport";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Reports = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const {user} = useAuth()

  useEffect(() => {
    document.title = "Reports - ClinicPal App";
  }, []);
  const {patient_id} = useParams()

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-4 rounded-t-xl shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
            Reports
          </h1>
          {!patient_id && <button
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white px-6 py-2 text-base rounded-lg shadow transition-all font-semibold"
            aria-label="Log new report"
          >
            Log New Report
          </button>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admitted Reports Section */}
          <section className="flex-1 w-full">
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 space-y-4">
              {patient_id && (
                <>
                  <PatientReport patient_id={patient_id} />

                  {/* Right-aligned button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                    >
                      ✍️ Write Report for This Patient
                    </button>
                  </div>
                </>
              )}
              {!patient_id && <AdmittedReport />}
            </div>
          </section>
        </div>


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