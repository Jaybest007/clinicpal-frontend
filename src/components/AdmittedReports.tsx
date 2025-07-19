import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FaChevronDown, FaTimes } from "react-icons/fa";

// Define the type for a single report
interface Report {
  patient_id: string;
  full_name: string;
  report: string;
  wrote_by: string;
  created_at: string;
}

export const AdmittedReport: React.FC = () => {
  const { admittedPatientReport } = useDashboard();
 const reports: Report[] = admittedPatientReport || [];

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Group by patient_id
  const groupedReports = reports.reduce((acc, report) => {
    const key = report.patient_id;
    if (!acc[key]) acc[key] = { patient: report.full_name, reports: [] as Report[] };
    acc[key].reports.push(report);
    return acc;
  }, {} as Record<string, { patient: string; reports: Report[] }>);

  return (
    <section className="px-2 py-2 md:px-5 lg:px-10 ">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
        <span role="img" aria-label="Reports">🧾</span> Admitted Patient Report
      </h2>

      {Object.entries(groupedReports).length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-slate-500 italic text-lg">No admitted patient reports available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReports).map(([patientId, { patient, reports }]) => (
            <details
              key={patientId}
              className="bg-white border border-blue-100 rounded-xl shadow-md group transition-all duration-200"
            >
              <summary className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-blue-50/60 transition font-semibold rounded-xl group-open:rounded-b-none">
                <div>
                  <p className="text-base text-blue-900 font-bold tracking-wide">
                    {patient.toUpperCase()}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ID: <span className="font-mono">{patientId.toUpperCase()}</span>
                  </p>
                </div>
                <FaChevronDown className="w-5 h-5 text-blue-400 group-open:rotate-180 transition-transform" />
              </summary>

              <div className="px-6 pb-4">
                <div className="divide-y divide-slate-100">
                  {reports.map((report, index) => (
                    <div
                      key={index}
                      className="py-4 cursor-pointer hover:bg-blue-50 rounded-lg transition flex flex-col gap-1"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-800 font-medium truncate max-w-full">
                          📝 {report.report}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-1">
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
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Modal */}
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
                      minute: "2-digit"
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
