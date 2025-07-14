import { FaChevronDown, FaTimes } from "react-icons/fa";
import { useDashboard } from "../context/DashboardContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface PatientReportProps {
  patient_id: string;
}
interface Report {
  patient_id: string;
  full_name: string;
  report: string;
  wrote_by: string;
  created_at: string;
}

// Union type to cover both possible structures
type PatientReportData = Report[] | { reports: Report[] } | undefined;

export const PatientReport: React.FC<PatientReportProps> = ({ patient_id }) => {
  const { fetchPatientReport, patientReport, loading } = useDashboard();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const allowedRoles = ["super admin", "doctor", "nurse"];
    // ✅ Check that user.role is defined before checking access
    if (user?.role && !allowedRoles.includes(user.role)) {
      navigate("/reports");
    }

    fetchReport();
  }, [navigate, user, patient_id]);

  async function fetchReport() {
    try {
      await fetchPatientReport({ patient_id });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Unable to fetch data"
      );
    }
  }

  // ✅ Safely extract reports from patientReport
  const typedReport = patientReport as PatientReportData;
  const reports: Report[] = Array.isArray(typedReport)
    ? typedReport
    : typedReport?.reports || [];

  const patientName = reports[0]?.full_name || "Unknown";

  return (
    <section className="px-2 py-4 md:px-5 lg:px-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        🧾 Patient Report
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <span className="text-blue-600 font-semibold text-lg animate-pulse">
            Loading reports...
          </span>
        </div>
      ) : reports.length === 0 ? (
        <p className="text-center text-slate-500 italic text-lg">
          No reports available for this patient.
        </p>
      ) : (
        <details
          open
          className="bg-white border border-blue-100 rounded-xl shadow-md group transition-all duration-200"
        >
          <summary className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-blue-50 transition font-semibold rounded-xl group-open:rounded-b-none">
            <div>
              <p className="text-base text-blue-900 font-bold tracking-wide">
                {patientName.toUpperCase()}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                ID: <span className="font-mono">{patient_id.toUpperCase()}</span>
              </p>
            </div>
            <FaChevronDown className="w-5 h-5 text-blue-400 group-open:rotate-180 transition-transform" />
          </summary>

          <div className="px-6 pb-4">
            <div className="divide-y divide-slate-100">
              {reports.map((report, ind) => (
                <div
                  key={ind}
                  className="py-4 hover:bg-blue-50 rounded-lg transition flex flex-col gap-2 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start gap-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm mt-1">
                      {ind + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 font-medium leading-snug">
                        📝 {report.report}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                        <span>
                          <span className="font-semibold">By:</span> {report.wrote_by}
                        </span>
                        <span>
                          <span className="font-semibold">At:</span>{" "}
                          {new Date(report.created_at).toLocaleString("en-NG", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      )}

      {/* 🧾 Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center px-4 py-8">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative animate-fade-in border border-blue-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              onClick={() => setSelectedReport(null)}
              aria-label="Close modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="px-8 pt-8 pb-4 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <span role="img" aria-label="Report">📝</span> Report Overview
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                <span>
                  Patient:{" "}
                  <span className="font-mono text-blue-800 text-sm">
                    {selectedReport.full_name.toUpperCase()}
                  </span>
                </span>
                <span>
                  Written By:{" "}
                  <span className="font-medium text-slate-700">
                    {selectedReport.wrote_by}
                  </span>
                </span>
                <span>
                  Created At:{" "}
                  <span className="text-slate-700 font-mono">
                    {new Date(selectedReport.created_at).toLocaleString("en-NG", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            </div>

            <div className="px-8 py-8 text-slate-700 text-base leading-relaxed">
              <h3 className="text-slate-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                Report Details
              </h3>
              <p className="bg-slate-50 border border-slate-200 text-black rounded-md p-4 whitespace-pre-wrap shadow-inner">
                {selectedReport.report}
              </p>
            </div>

            <div className="px-8 py-4 border-t border-slate-100 flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
