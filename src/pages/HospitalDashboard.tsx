import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaUser, FaUserInjured } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import StatCard from "../components/StatCard";
import { HqNavBar } from "../components/HqNavBar";
import { useHospital } from "../context/HospitalContext";
import { useDashboard } from "../context/DashboardContext";

export const HospitalDashboard = () => {
  const { hospitalData, staffs, deleteUser, updateStaffRole, loading, fetchStaffs } = useHospital();
  const { patientsData = [] } = useDashboard();

  const [editingStaffId, setEditingStaffId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
          staff.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalStaff = filteredStaffs.length;
  const totalPatients = patientsData.length;
  const totalAdmitted = patientsData.filter(p => p.admission_status === true).length;

  const handleUpdateRole = async (
    e: React.FormEvent<HTMLFormElement>,
    staffId: string
  ) => {
    e.preventDefault();

    if (newRole.trim() === "") {
      toast.error("Please select a role.");
      return;
    }

    try {
      await updateStaffRole({ id: staffId, newRole });
      setEditingStaffId("");
      setNewRole("");
      toast.success("Role updated successfully.");
    } catch {
      toast.error("Unable to update role.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <HqNavBar />

      <main className="max-w-7xl mx-auto py-8 px-4 space-y-10">
        {/* Overview Header */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-900">Hospital Overview</h1>
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            Hospital ID:{" "}
            <span className="text-blue-700 font-bold break-all">
              {hospitalData?.hospital_id?.toUpperCase() ?? "—"}
            </span>
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <StatCard title="Total Patients" icon={FaUserInjured} value={totalPatients} />
          <StatCard title="Staff Members" icon={FaUser} value={totalStaff} />
          <StatCard
            title="Visited this Month"
            icon={FaUser}
            value={
              patientsData.filter(patient => {
                const visitDate = new Date(patient.visit_on);
                const now = new Date();
                return (
                  visitDate.getFullYear() === now.getFullYear() &&
                  visitDate.getMonth() === now.getMonth()
                );
              }).length
            }
          />
          <StatCard title="Critical Cases" icon={TiWarning} value={5} />
          <StatCard title="Admitted" icon={FaUser} value={totalAdmitted} />
        </div>

        {/* Staff Table */}
        <section className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-slate-200">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl font-semibold text-blue-800">Staff Overview</h2>

            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-md border border-blue-300 bg-blue-50 text-sm text-blue-900 placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </header>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">DOR</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredStaffs.map((staff) => (
                  <tr key={staff.id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {staff.created_at
                        ? new Date(staff.created_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {staff.firstname} {staff.lastname}
                    </td>
                    <td className="px-4 py-3">
                      {editingStaffId === staff.id ? (
                        <form onSubmit={(e) => handleUpdateRole(e, staff.id)} className="flex items-center gap-2">
                          <select
                            value={newRole}
                            className="px-2 py-1 text-sm border border-blue-300 rounded-md bg-blue-50 text-blue-800 focus:outline-none"
                            onChange={(e) => setNewRole(e.target.value)}
                          >
                            <option value="">Select Role</option>
                            <option value="super admin">Super Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="nurse">Nurse</option>
                            <option value="junior nurse">Junior Nurse</option>
                            <option value="unactivated">Deactivate</option>
                          </select>
                          <button
                            type="submit"
                            className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStaffId("")}
                            className="text-slate-500 text-xs hover:underline"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <span className="font-medium text-slate-700">{staff.role}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{staff.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingStaffId(staff.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded px-3 py-1 transition"
                        >
                          Update Role
                        </button>
                        <button
                          onClick={async () => await deleteUser({ id: staff.id })}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded px-3 py-1 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(Array.isArray(filteredStaffs) && filteredStaffs.length === 0) && (
              <div className="text-center text-gray-500 italic py-6">No staff records found.</div>
            )}
          </div>
        </section>
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
