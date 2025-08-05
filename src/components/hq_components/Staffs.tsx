import { FaSearch, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

interface StaffsProps {
  filteredStaffs: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  newRole: string;
  setNewRole: (role: string) => void;
  editingStaffId: string;
  setEditingStaffId: (id: string) => void;
  updateStaffRole: (data: { id: string; newRole: string }) => Promise<any>;
  deleteUser: (data: { id: string }) => Promise<any>;
}

export const Staffs: React.FC<StaffsProps> = ({
  filteredStaffs,
  searchTerm,
  setSearchTerm,
  newRole,
  setNewRole,
  editingStaffId,
  setEditingStaffId,
  updateStaffRole,
  deleteUser,
}) => {
  
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

  const handleDeleteUser = async (staffId: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteUser({ id: staffId });
        toast.success("Staff deleted successfully");
      } catch (error) {
        toast.error("Failed to delete staff");
      }
    }
  };

  return (
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
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {staff.created_at
                    ? new Date(staff.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-900">
                    {staff.firstname} {staff.lastname}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {staff.id}
                  </div>
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
                        <option value="lab technician">Lab Technician</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="cashier">Cashier</option>
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      staff.role === 'super admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : staff.role === 'doctor'
                        ? 'bg-blue-100 text-blue-800'
                        : staff.role === 'nurse' || staff.role === 'junior nurse'
                        ? 'bg-green-100 text-green-800'
                        : staff.role === 'unactivated'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {staff.role || "Unassigned"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{staff.phone || "N/A"}</div>
                  <div className="text-xs text-gray-500">{staff.email || ""}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingStaffId(staff.id);
                        setNewRole(staff.role || "");
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded px-3 py-1 transition"
                    >
                      Update Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(staff.id)}
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
          <div className="text-center text-gray-500 py-6">
            <div className="flex justify-center mb-2">
              <FaUser className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No staff records found</p>
            <p className="text-sm text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>
      
      {/* Pagination placeholder */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredStaffs.length}</span> staff members
        </div>
      </div>
    </section>
  );
};