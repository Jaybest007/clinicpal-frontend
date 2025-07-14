import React, { useState } from "react";

import StatCard from "../components/StatCard";
import { FaSearch, FaUser, FaUserInjured } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { useHospital } from "../context/HospitalContext";
import { toast } from "react-toastify";
import { useDashboard } from "../context/DashboardContext";
import { HqNavBar } from "../components/HqNavBar";


export const HospitalDashboard = () => {
  const { hospitalData, staffs, deleteUser, updateStaffRole } = useHospital();
  const {patientsData} = useDashboard()
  const totalStaff = Array.isArray(staffs) ? staffs.length : 0;
  const totalPatients = patientsData.length;
  const totalAdmitted = patientsData.filter(patient => patient.admission_status === 1).length;
  //========edit user role=========\\
  const [editingStaffId, setEditingStaffId] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");

  const handleUpdateRole = async (event: React.FormEvent<HTMLFormElement>, staffId: string) => {
    event.preventDefault();

    if (newRole.trim() === "") {
      toast.error("Select a role");
      return;
    }

    try {
      await updateStaffRole({ id: staffId, newRole });
      setEditingStaffId("");
      setNewRole("");
    } catch (err: any) {
      toast.error("Unable to update role");
    }
  };
//===============end ===========\\

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* ====== Navbar ====== */}
      <HqNavBar/>

      {/* ====== Main Content ====== */}
      <main className="flex-1 pt-8 px-2 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Overview Bar */}
          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow-sm">
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p>Hospital ID: {hospitalData?.hospital_id.toUpperCase()}</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 m-2">
            <StatCard title="Total Patients" icon={FaUserInjured} value={totalPatients} />
            <StatCard title="Staffs" icon={FaUser} value={totalStaff} />
            <StatCard title="Patients this month" icon={FaUser} value={150} />
            <StatCard title="Critical cases" icon={TiWarning} value={5} />
            <StatCard title="Admitted Patients" icon={FaUser} value={totalAdmitted} />
          </div>

          {/* Staff Table */}
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">Staff Overview</h1>

            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search by name or ID"
                className="w-full bg-blue-50 text-gray-800 placeholder:text-gray-500 rounded-md py-2 pl-10 pr-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead className="bg-gray-100 text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-3 text-left border-b">DOR</th>
                    <th className="px-6 py-3 text-left border-b">Name</th>
                    <th className="px-6 py-3 text-left border-b">Role</th>
                    <th className="px-6 py-3 text-left border-b">Phone Number</th>
                    <th className="px-6 py-3 text-left border-b">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {Array.isArray(staffs) &&
                    staffs.map((staff, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 border-b">
                          {staff.created_at
                            ? new Date(staff.created_at).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "N/A"}
                        </td>
                        <td className="px-6 py-3 border-b">{staff.firstName} {staff.lastName}</td>
                        <td className="px-6 py-3 border-b">
                          {editingStaffId === staff.id ? (
                            <form onSubmit={(e) => handleUpdateRole(e, staff.id)} className="flex items-center space-x-2">
                              <select
                                name="Role"
                                value={newRole}
                                className="px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => setNewRole(e.target.value)}
                              >
                                <option value="">Select Role</option>
                                <option value="super admin">Super Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                                <option value="junior nurse">Junior Nurse</option>
                                <option value="unactivated">Deactivate</option>
                              </select>
                              <button type="submit"  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
                                Confirm
                              </button>
                              <button type="button" onClick={() => setEditingStaffId("")} className="text-gray-500 text-sm hover:underline">
                                Cancel
                              </button>
                            </form>
                          ) : (
                            staff.role
                          )}
                        </td>
                        <td className="px-6 py-3 border-b">{staff.phone}</td>
                        <td className="px-6 py-3 border-b">
                          <div className="flex gap-3">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded px-3 py-1 transition"
                              onClick={() => setEditingStaffId(staff.id)}
                            >
                              Update Role
                            </button>
                            <button
                              onClick={async () => await deleteUser({ id: staff.id })}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded px-3 py-1 transition"
                            >
                              Delete User
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
