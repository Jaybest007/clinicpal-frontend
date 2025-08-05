import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {  FaUserInjured,  FaCalendarAlt, FaUserMd, FaChartLine } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { FiRefreshCw } from "react-icons/fi";
import StatCard from "../components/StatCard";

import { useHospital } from "../context/HospitalContext";
import { useDashboard } from "../context/DashboardContext";
import { HqNavBar } from "../components/hq_components/HqNavBar";
import { Staffs } from "../components/hq_components/Staffs";

export const HospitalDashboard = () => {
  const { hospitalData, staffs, deleteUser, updateStaffRole, loading, fetchStaffs } = useHospital();
  const { patientsData = [] } = useDashboard();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [editingStaffId, setEditingStaffId] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch latest staff data when hospitalData changes
  useEffect(() => {
    if (hospitalData?.token && (!staffs || staffs.length === 0)) {
      fetchStaffs();
    }
    // eslint-disable-next-line
  }, []);

  // Filter staff by search term
  const filteredStaffs = Array.isArray(staffs)
    ? staffs.filter(
        staff =>
          staff.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const totalStaff = filteredStaffs.length;
  const totalPatients = patientsData.length;
  const totalAdmitted = patientsData.filter(p => p.admission_status === true).length;

  // Handler to refresh data
  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchStaffs();
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate patients visited this month
  const patientsThisMonth = patientsData.filter(patient => {
    const visitDate = new Date(patient.visit_on);
    const now = new Date();
    return (
      visitDate.getFullYear() === now.getFullYear() &&
      visitDate.getMonth() === now.getMonth()
    );
  }).length;
  
  // Get current month name
  const currentMonth = new Date().toLocaleString('default', {month: 'long'});
  
  // Calculate percentage of total patients visited this month
  const monthlyVisitPercentage = totalPatients ? Math.round((patientsThisMonth / totalPatients) * 100) : 0;
  
  // Calculate whether admission rate is concerning
  const isAdmissionRateHigh = totalPatients && (totalAdmitted / totalPatients) > 0.25; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <HqNavBar />

      <main className="max-w-7xl mx-auto py-8 px-4 space-y-10">
        {/* Overview Header */}
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
              onClick={refreshData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <StatCard 
            title="Total Patients" 
            icon={FaUserInjured} 
            value={totalPatients} 
            subtitle="Registered in system"
            variant="info"
            trend={{ value: 15, isUpGood: true }}
            loading={refreshing}
          />
          
          <StatCard 
            title="Staff Members" 
            icon={FaUserMd} 
            value={totalStaff} 
            subtitle="Active personnel"
            variant="primary"
            trend={{ 
              value: (staffs ? staffs.length : 0) !== totalStaff ? Math.abs((staffs ? staffs.length : 0) - totalStaff) : 0, 
              isUpGood: true 
            }}
            loading={refreshing}
          />
          
          <StatCard
            title="Monthly Visits"
            icon={FaCalendarAlt}
            value={patientsThisMonth}
            subtitle={`${currentMonth}`}
            variant={monthlyVisitPercentage > 20 ? "success" : "warning"}
            trend={{ 
              value: monthlyVisitPercentage, 
              isUpGood: true 
            }}
            loading={refreshing}
          />
          
          <StatCard 
            title="Critical Cases" 
            icon={TiWarning} 
            value={5} 
            subtitle="Require attention"
            variant="danger"
            trend={{ value: 2, isUpGood: false }}
            loading={refreshing}
          />
          
          <StatCard 
            title="Admitted" 
            icon={FaUserInjured} 
            value={totalAdmitted} 
            subtitle="Currently in hospital"
            variant={totalAdmitted > (totalPatients * 0.25) ? "warning" : "success"}
            trend={{ 
              value: totalPatients ? Math.round((totalAdmitted / totalPatients) * 100) : 0, 
              isUpGood: false 
            }}
            loading={refreshing}
          />
          
          <StatCard 
            title="Admission Rate" 
            icon={FaChartLine} 
            value={totalPatients ? `${Math.round((totalAdmitted / totalPatients) * 100)}%` : "0%"} 
            subtitle="Of total patients"
            variant={isAdmissionRateHigh ? "warning" : "info"}
            trend={{ 
              value: 5, 
              isUpGood: false 
            }}
            loading={refreshing}
          />
        </div>

        {/* Staff Table - Passing necessary props */}
        <Staffs 
          filteredStaffs={filteredStaffs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          newRole={newRole}
          setNewRole={setNewRole}
          editingStaffId={editingStaffId}
          setEditingStaffId={setEditingStaffId}
          updateStaffRole={updateStaffRole}
          deleteUser={deleteUser}
        />
        
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 text-blue-700 font-semibold">
              Loading hospital data...
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
