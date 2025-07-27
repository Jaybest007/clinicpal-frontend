import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FiLoader, FiSearch, FiXCircle } from "react-icons/fi";

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
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Search Patient</h2>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition"
          title="Clear search"
        >
          <FiXCircle className="text-lg" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
      <form onSubmit={handleFetchReport}>
        <div className="flex flex-col sm:flex-row gap-2 sticky">
          <input
            type="text"
            placeholder="Search by Name / Phone / Patient ID"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2788E3] text-sm"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setErrors((prev) => ({ ...prev, searchValue: "" }));
            }}
          />
          <button
            type="submit"
            className="bg-[#2788E3] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
            disabled={loading}
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <>
                <FiSearch /> <span className="hidden sm:inline">Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {errors.searchValue && (
        <span className="text-xs text-red-600 mt-1">{errors.searchValue}</span>
            )}

            {/* Show "No reports found" only after a search has been performed */}
            {searchValue.trim() !== "" &&
              !loading &&
              Array.isArray(patientReport) &&
              patientReport.length === 0 && (
                <div className="text-gray-500 text-md mt-4">
                  No reports found for this patient ID.
                </div>
              )}

            {Array.isArray(patientReport) &&
        patientReport.length > 0 &&
        patientReport.map((report: any, idx: number) => (
          <div
            key={report.id || idx}
            className="bg-blue-50 border border-blue-200 rounded-lg p-2"
          >
            <div className="text-gray-800 text-base mb-2">
              <span className="font-semibold">Report:</span> {report.report}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                <span className="font-medium">By:</span> {report.wrote_by}
              </span>
              <span>•</span>
              <span>
                {new Date(report.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}