import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { fetchReport } from '../../context/DashboardContext/types';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';

interface LocationState {
  reports: fetchReport[];
}

const PrintableReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reports } = (location.state as LocationState) || { reports: [] };
  const hospitalDetail = localStorage.getItem("hospital_data");
  const hospitalName = JSON.parse(hospitalDetail || "{}").name || "ClinicPal Hospital";

  useEffect(() => {
    // Auto-trigger print dialog when the page loads
    if (reports && reports.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [reports]);

  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-xl font-bold mb-4">No Report Data</h1>
          <p className="mb-6">No report data was provided. Please return to the reports page and try again.</p>
          <button 
            onClick={() => navigate('/hq/reports')}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft size={14} />
            <span>Back to Reports</span>
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Screen-only controls */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button 
          onClick={() => navigate('/hq/reports')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded flex items-center gap-2"
        >
          <FaArrowLeft size={14} />
          <span>Back to Reports</span>
        </button>
        
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-50 text-blue-700 rounded flex items-center gap-2 border border-blue-200"
        >
          <FaPrint size={14} />
          <span>Print</span>
        </button>
      </div>

      {/* Print document */}
      <div className="print:p-0">
        {/* Page header with hospital info */}
        <div className="text-center mb-6 pb-2 border-b">
          <h1 className="text-xl font-bold mb-1">{hospitalName}</h1>
          <p className="text-sm">Medical Report</p>
        </div>

        {/* Patient information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold">{reports[0].full_name.toUpperCase()}</h2>
          <p className="text-sm">
            <strong>Patient ID:</strong> {reports[0].patient_id.toUpperCase()}
          </p>
        </div>

        {/* Reports */}
        <div className="space-y-8">
          {reports.map((report) => (
            <div key={report.id} className="mb-1">
                <div className="text-xs text-gray-500 italic">
                {formatDate(report.created_at)} • {report.wrote_by}
              </div>
              <div className="border-b whitespace-pre-line text-gray-800 leading-relaxed">
                {report.report}
              </div>
              
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-xs text-center mt-12 pt-2 border-t text-gray-500">
          <p>This document is part of the patient's medical record.</p>
          <p>Printed on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
