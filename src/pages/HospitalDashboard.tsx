import { useState, useEffect } from "react";
import { useHospital } from "../context/HospitalContext";

import { HqNavBar } from "../components/hq_components/HqNavBar";
import { Staffs } from "../components/hq_components/Staffs";
import { DashboardAnalytics } from "../components/hq_components/DashboardAnalytics";
import { usePatients } from "../context/DashboardContext/hooks/usePatients";

export const HospitalDashboard = () => {
  const hospitalDetail = localStorage.getItem("hospital_data");
  const token = JSON.parse(hospitalDetail || "{}").token;

  const { hospitalData, staffs, deleteUser, updateStaffRole, loading } = useHospital();
  const { patientsData = [], fetchAllPatients } = usePatients(token);

  const [editingStaffId, setEditingStaffId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  // Make sure hospital token is used by passing it to localStorage before fetching
  useEffect(() => {
    if (!hasFetched && hospitalData) {
      // Ensure the hospital token is available in localStorage
      fetchAllPatients();
      setHasFetched(true);
    }
  }, [fetchAllPatients, hasFetched, hospitalData]);


  
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
      </main>
    </div>
  );
};
