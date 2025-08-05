import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FiFileText, FiUser, FiClock, FiChevronDown, FiX, FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Define the type for a single report
interface Report {
  patient_id: string;
  full_name: string;
  report: string;
  wrote_by: string;
  created_at: string;
}

export const AdmittedReport: React.FC = () => {
  const { admittedPatientReport, loading } = useDashboard();
  
  // Ensure reports is always an array
  const reports: Report[] = Array.isArray(admittedPatientReport)
    ? admittedPatientReport
    : admittedPatientReport && Array.isArray(admittedPatientReport)
      ? admittedPatientReport
      : [];

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [expandedPatients, setExpandedPatients] = useState<Record<string, boolean>>({});

  // Group by patient_id
  const groupedReports = reports.reduce((acc, report) => {
    const key = report.patient_id;
    if (!acc[key]) acc[key] = { patient: report.full_name, reports: [] as Report[] };
    acc[key].reports.push(report);
    return acc;
  }, {} as Record<string, { patient: string; reports: Report[] }>);

  // Toggle patient expansion
  const togglePatient = (patientId: string) => {
    setExpandedPatients(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  // Check if a patient is expanded
  const isExpanded = (patientId: string) => {
    return !!expandedPatients[patientId];
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-blue-600 font-medium">Loading reports...</span>
        </div>
      ) : Object.entries(groupedReports).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <FiFileText className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Admitted Patient Reports</h3>
            <p className="text-gray-500">
              There are currently no reports for admitted patients. Reports will appear here when created.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedReports).map(([patientId, { patient, reports }]) => (
            <div 
              key={patientId}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Patient Header */}
              <div 
                onClick={() => togglePatient(patientId)}
                className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient}</h3>
                    <p className="text-xs text-gray-500">
                      ID: <span className="font-mono">{patientId.toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {reports.length} Report{reports.length !== 1 ? 's' : ''}
                  </span>
                  <FiChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isExpanded(patientId) ? 'transform rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>

              {/* Reports List */}
              <AnimatePresence>
                {isExpanded(patientId) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-gray-100 px-6 py-2">
                      {reports.map((report, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          onClick={() => setSelectedReport(report)}
                          className="py-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors px-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-1">
                              <FiMessageSquare className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                <div>
                                  <p className="text-sm text-gray-900 font-medium line-clamp-2">
                                    {report.report}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    <span className="font-medium">By:</span> {report.wrote_by}
                                  </p>
                                </div>
                                <div className="mt-1 sm:mt-0 flex items-center text-xs text-gray-500">
                                  <FiClock className="mr-1 w-3 h-3" />
                                  {new Date(report.created_at).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Report Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Medical Report</h3>
                    <p className="text-sm text-gray-500">
                      Patient: {selectedReport.full_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Metadata Section */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Written By</p>
                    <p className="text-sm font-medium text-gray-900">{selectedReport.wrote_by}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created On</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedReport.created_at).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Report Content */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Report Details</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-inner overflow-auto max-h-[40vh] whitespace-pre-wrap">
                    {selectedReport.report.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-3 text-gray-800 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
