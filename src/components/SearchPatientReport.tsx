import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FiLoader, FiSearch, FiXCircle, FiFile, FiUser, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Typing for patient report item
interface PatientReport {
  id: number;
  report: string;
  wrote_by: string;
  created_at: string;
}

// Report card sub-component for better modularity
const ReportCard = ({ report }: { report: PatientReport }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
    transition={{ duration: 0.2 }}
    className="bg-blue-50 border border-blue-100 hover:border-blue-200 rounded-lg p-3 shadow-sm hover:shadow transition-all duration-200"
  >
    <div className="flex items-start gap-2">
      <div className="mt-0.5 p-1.5 bg-blue-100 rounded-md text-blue-600">
        <FiFile className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-gray-800 text-sm mb-2 leading-relaxed">
          {report.report}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiUser className="w-3 h-3" />
            <span className="font-medium">{report.wrote_by}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            <span>
              {new Date(report.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center p-6 text-center"
  >
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
      <FiFile className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-gray-700 font-medium mb-1">No reports found</h3>
    <p className="text-gray-500 text-sm max-w-xs">
      We couldn't find any reports for this patient ID. Please check the ID and try again.
    </p>
  </motion.div>
);

export default function SearchPatientReport() {
  const [errors, setErrors] = useState<{ searchValue?: string }>({});
  const [searchValue, setSearchValue] = useState("");
  const { patientReport, fetchPatientReport, loading, setPatientReport } = useDashboard();

  // Fetch patient reports
  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue || searchValue.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        searchValue: "Patient ID is required.",
      }));
      return;
    }
    setErrors({});
    try {
      await fetchPatientReport({ patient_id: searchValue.toLowerCase() });
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        searchValue: "Failed to fetch report. Please try again.",
      }));
    }
  };

  // Clear search and patient report
  const handleClear = () => {
    setSearchValue("");
    setErrors({});
    setPatientReport([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 
                    overflow-hidden flex flex-col border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <FiSearch className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-gray-800">Patient Reports</h2>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          title="Clear search"
          disabled={loading}
        >
          <FiXCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Search form */}
      <div className="p-4 border-b border-gray-100">
        <form onSubmit={handleFetchReport} className="w-full">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Patient ID"
                className={`w-full pl-10 pr-3 py-2 border ${
                  errors.searchValue ? "border-red-300 bg-red-50" : "border-gray-200"
                } rounded-lg text-sm transition-colors duration-200
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100`}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setErrors((prev) => ({ ...prev, searchValue: "" }));
                }}
                disabled={loading}
              />
              {searchValue && !loading && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm hover:shadow
                        disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[90px]"
              disabled={loading}
            >
              {loading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <FiSearch className="w-4 h-4" /> 
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          {errors.searchValue && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1.5 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.searchValue}
            </motion.span>
          )}
        </form>
      </div>

      {/* Results area */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <FiLoader className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <span className="text-sm text-gray-500">Searching patient records...</span>
            </div>
          </div>
        )}
        
        <AnimatePresence>
          {!loading && searchValue.trim() !== "" && Array.isArray(patientReport) && (
            patientReport.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {patientReport.map((report: PatientReport, idx: number) => (
                  <ReportCard key={report.id ? report.id : idx} report={report} />
                ))}
              </div>
            )
          )}
        </AnimatePresence>
        
        {/* Initial state - no search performed yet */}
        {!loading && searchValue.trim() === "" && (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FiSearch className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-gray-600 font-medium mb-1">Search for patient reports</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Enter a patient ID to view their medical reports and history
            </p>
          </div>
        )}
      </div>
    </div>
  );
}