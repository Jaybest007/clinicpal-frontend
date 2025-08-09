import React from 'react';
import { FiRefreshCw } from "react-icons/fi";

interface DashboardHeaderProps {
  hospitalData: any;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  hospitalData,
  onRefresh,
  loading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">Hospital Overview</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard & staff management</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <span className="font-medium">Hospital ID:</span>{" "}
          <span className="font-mono">
            {hospitalData?.hospital_id?.toUpperCase() ?? "—"}
          </span>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};