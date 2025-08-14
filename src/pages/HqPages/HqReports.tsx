import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HqNavBar } from "../../components/hq_components/HqNavBar";
import { useReports } from "../../context/DashboardContext/hooks/useReports";
import { FaPrint, FaSearch } from "react-icons/fa";
import type { discharge } from "../../context/DashboardContext/types";

const HqReports = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Reports - ClinicPal App";
  }, []);

  // Get the hospital token
  const hospitalDetail = localStorage.getItem("hospital_data");
  const token = JSON.parse(hospitalDetail || "{}").token;
  
  // Use the reports hook
  const { 
    loading, 
    patientReport, 
    fetchPatientReport 
  } = useReports(token);

  // State for search
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Handle search submit
  const handleSearch = () => {
    if (!searchTerm) return;
    
    const credentials: discharge = {
      patient_id: searchTerm
    };
    
    fetchPatientReport(credentials);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HqNavBar />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Reports</h1>
          <p className="text-gray-500 text-sm">Search and view medical reports for patients</p>
        </div>
        
        {/* Search card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
              <div className="relative">
                <input
                  id="patientId"
                  type="text"
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm.toLowerCase()}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div className="sm:self-end">
              <button
                onClick={handleSearch}
                disabled={!searchTerm || loading}
                className={`w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors ${
                  !searchTerm || loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Reports display area */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex justify-center items-center">
            <div className="animate-pulse text-gray-500">Loading reports...</div>
          </div>
        ) : patientReport && patientReport.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              {/* Patient info header with print button */}
              {patientReport[0] && (
                <div className="mb-6 pb-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {patientReport[0].full_name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                      ID: {patientReport[0].patient_id}
                    </p>
                  </div>
                  <button 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                    onClick={() => navigate('/print-report', { state: { reports: patientReport } })}
                    title="Print all reports"
                  >
                    <FaPrint size={16} />
                    <span className="font-medium">Print Reports</span>
                  </button>
                </div>
              )}
              
              {/* Reports list - note style */}
              <div className="space-y-6">
                {patientReport.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span className="font-medium">{formatDate(report.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span>Added by {report.wrote_by}</span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm">
                      {report.report}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 mb-2">
                {searchTerm ? "No reports found for this patient ID" : "Enter a patient ID to search for their medical reports"}
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-400">
                  Try checking the ID and search again
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HqReports;