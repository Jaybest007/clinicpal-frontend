import React from 'react';
import { FaUserInjured, FaCalendarAlt, FaUserMd, FaChartLine, FaBed } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";

interface DashboardAnalyticsProps {
  staffs: any[];
  patientsData: any[];
  loading: boolean;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  staffs,
  patientsData,
  loading
}) => {
  // Calculate analytics
  const totalStaff = Array.isArray(staffs) ? staffs.length : 0;
  const totalPatients = Array.isArray(patientsData) ? patientsData.length : 0;
  const totalAdmitted = Array.isArray(patientsData) 
    ? patientsData.filter(p => p.admission_status === true).length 
    : 0;

  // Calculate patients visited this month
  const patientsThisMonth = Array.isArray(patientsData) 
    ? patientsData.filter(patient => {
        if (!patient.visit_on) return false;
        const visitDate = new Date(patient.visit_on);
        const now = new Date();
        return (
          visitDate.getFullYear() === now.getFullYear() &&
          visitDate.getMonth() === now.getMonth()
        );
      }).length
    : 0;
  
  const currentMonth = new Date().toLocaleString('default', {month: 'long'});
  const monthlyVisitPercentage = totalPatients ? Math.round((patientsThisMonth / totalPatients) * 100) : 0;

  const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'default' }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? '...' : value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${
          variant === 'success' ? 'bg-green-100 text-green-600' :
          variant === 'warning' ? 'bg-yellow-100 text-yellow-600' :
          variant === 'danger' ? 'bg-red-100 text-red-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-w-full">
        <StatCard 
          title="Total Patients" 
          icon={FaUserInjured} 
          value={totalPatients} 
          subtitle="Registered in system"
          variant="default"
        />
        
        <StatCard 
          title="Staff Members" 
          icon={FaUserMd} 
          value={totalStaff} 
          subtitle="Active personnel"
          variant="default"
        />
        
        <StatCard
          title="Monthly Visits"
          icon={FaCalendarAlt}
          value={patientsThisMonth}
          subtitle={`${currentMonth} visits`}
          variant={monthlyVisitPercentage > 20 ? "success" : "warning"}
        />
        
        <StatCard 
          title="Critical Cases" 
          icon={TiWarning} 
          value={0} 
          subtitle="Require attention"
          variant="danger"
        />
        
        <StatCard 
          title="Admitted" 
          icon={FaBed} 
          value={totalAdmitted} 
          subtitle="Currently in hospital"
          variant={totalAdmitted > 5 ? "warning" : "success"}
        />
        
        <StatCard 
          title="Admission Rate" 
          icon={FaChartLine} 
          value={totalPatients ? `${Math.round((totalAdmitted / totalPatients) * 100)}%` : "0%"} 
          subtitle="Of total patients"
          variant="default"
        />
      </div>
    </div>
  );
};