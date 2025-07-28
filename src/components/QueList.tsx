import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

const QueList: React.FC = () => {
  const { queList, QueActions, fetchQueList, loading } = useDashboard();
  const { user } = useAuth();

  const [confirmModal, setConfirmModal] = React.useState<null | {
    type: "remove" | "called" | "seen";
    patient_id: string;
    full_name: string;
  }>(null);

  const waitingList = React.useMemo(() => queList.filter(p => p.status === "waiting"), [queList]);
  const calledList = React.useMemo(() => queList.filter(p => p.status === "called"), [queList]);

  const handleAction = async () => {
    if (!confirmModal) return;

    await QueActions({
      patient_id: confirmModal.patient_id,
      action: confirmModal.type,
      performed_by: user?.name || "Unknown",
    });

    fetchQueList();
    setConfirmModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Queue</h1>
        <p className="text-sm text-gray-500">Manage patients as they move through the consultation process.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Waiting Patients</h2>
        {waitingList.length === 0 ? (
          <p className="text-gray-500 italic">No patients are currently waiting.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-md shadow-sm text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Time</th>
                  <th className="px-3 py-2 border">Name</th>
                  <th className="px-3 py-2 border">Reason</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Queued By</th>
                  <th className="px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waitingList.map((item, i) => (
                  <tr key={item.id} className="border-t bg-white">
                    <td className="px-3 py-2 border">{i + 1}</td>
                    <td className="px-3 py-2 border">{new Date(item.checked_in_at).toLocaleString()}</td>
                    <td className="px-3 py-2 border">{item.patient_fullname}</td>
                    <td className="px-3 py-2 border">{item.visit_reason}</td>
                    <td className="px-3 py-2 border">{item.status}</td>
                    <td className="px-3 py-2 border">{item.qued_by}</td>
                    <td className="px-3 py-2 border">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/reports/${item.patient_id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded whitespace-nowrap"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            setConfirmModal({
                              type: "called",
                              patient_id: String(item.patient_id),
                              full_name: item.patient_fullname,
                            })
                          }
                          className="bg-lime-600 hover:bg-lime-700 text-white px-2 py-1 rounded whitespace-nowrap"
                        >
                          Call
                        </button>
                        <button
                          onClick={() =>
                            setConfirmModal({
                              type: "remove",
                              patient_id: String(item.patient_id),
                              full_name: item.patient_fullname,
                            })
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded whitespace-nowrap"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Called Patients</h2>
        {calledList.length === 0 ? (
          <p className="text-gray-500 italic">No called patients yet.</p>
        ) : (
          <div className="overflow-x-auto ">
            <table className="w-full border rounded-md shadow-sm text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Time</th>
                  <th className="px-3 py-2 border">Name</th>
                  <th className="px-3 py-2 border">Reason</th>
                  <th className="px-3 py-2 border">Status</th>
                  <th className="px-3 py-2 border">Doctor</th>
                  <th className="px-3 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {calledList.map((item, i) => (
                  <tr key={item.id} className="border-t bg-white">
                    <td className="px-3 py-2 border">{i + 1}</td>
                    <td className="px-3 py-2 border">{new Date(item.checked_in_at).toLocaleString()}</td>
                    <td className="px-3 py-2 border">{item.patient_fullname}</td>
                    <td className="px-3 py-2 border">{item.visit_reason}</td>
                    <td className="px-3 py-2 border">{item.status}</td>
                    <td className="px-3 py-2 border">{item.assigned_doctor}</td>
                    <td className="px-3 py-2 border">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Link
                          to={`/reports/${item.patient_id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm text-center"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            setConfirmModal({
                              type: "seen",
                              patient_id: String(item.patient_id),
                              full_name: item.patient_fullname,
                            })
                          }
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded text-sm text-center"
                        >
                          Seen
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-65">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-medium mb-2">Confirm Action</h3>
            <p className="text-sm mb-4">Are you sure you want to <strong>{confirmModal.type}</strong> <strong>{confirmModal.full_name}</strong>?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded" 
                disabled={loading}
                >
                  Cancel
                </button>
              <button 
                onClick={handleAction} 
                className="bg-blue-600 text-white px-3 py-1 rounded" 
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueList;
