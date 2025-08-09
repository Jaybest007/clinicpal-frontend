import { useState, useEffect,  } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useHospital } from "../context/HospitalContext";
import { useDashboard } from "../context/DashboardContext";
import { HqNavBar } from "../components/hq_components/HqNavBar";
import { Staffs } from "../components/hq_components/Staffs";
import { DashboardAnalytics } from "../components/hq_components/DashboardAnalytics";

export const HospitalDashboard = () => {
  const { hospitalData, staffs, deleteUser, updateStaffRole, loading, fetchStaffs } = useHospital();
  const { patientsData = [] } = useDashboard();

  const [editingStaffId, setEditingStaffId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch latest staff data when hospitalData changes
  useEffect(() => {
    if (hospitalData && (!staffs || staffs.length === 0)) {
      fetchStaffs();
    }
    // eslint-disable-next-line
  }, [hospitalData, staffs, fetchStaffs]);

  // Filter staff by search term
  const filteredStaffs = Array.isArray(staffs)
    ? staffs.filter(
        staff =>
          staff.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalStaff = filteredStaffs.length;
  const totalPatients = Array.isArray(patientsData) ? patientsData.length : 0;
  const totalAdmitted = Array.isArray(patientsData) 
    ? patientsData.filter(p => p.admission_status === true).length 
    : 0;

  // Handle refresh
  const handleRefresh = async () => {
    if (loading || refreshing) return;
    setRefreshing(true);
    try {
      await fetchStaffs();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <HqNavBar />

      <main className="max-w-7xl mx-auto py-8 px-4 space-y-10">
        {/* Enhanced Overview Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">Hospital Overview</h1>
            <div className="flex items-center gap-3">
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Hospital ID:{" "}
                <span className="text-blue-700 font-bold break-all">
                  {hospitalData?.hospital_id?.toUpperCase() ?? "—"}
                </span>
              </p>
              
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="ml-2 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Refresh data"
              >
                <FiRefreshCw className={`h-4 w-4 ${(loading || refreshing) ? "animate-spin text-blue-500" : ""}`} />
              </button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="border-t border-gray-100 px-6 py-2.5 bg-gray-50 rounded-b-xl text-xs text-gray-600 font-medium">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <div>Staff: <span className="text-gray-900">{totalStaff}</span></div>
              <div>Patients: <span className="text-gray-900">{totalPatients}</span></div>
              <div>Admitted: <span className="text-gray-900">{totalAdmitted}</span></div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
  <DashboardAnalytics
    staffs={staffs ?? []}
    patientsData={patientsData}
    loading={loading}
  />

        {/* Staff Table */}
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
        
        {/* Enhanced Loading Indicator */}
        {(loading || refreshing) && (
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-[1px] flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
              <span className="text-blue-700 font-semibold">
                {refreshing ? "Refreshing data..." : "Loading hospital data..."}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};