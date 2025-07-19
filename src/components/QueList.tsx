import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QueList: React.FC = () => {
  const { queList, QueActions, fetchQueList } = useDashboard();
  const { user } = useAuth();

  const [confirmModal, setConfirmModal] = React.useState<null | {
    type: "remove" | "called" | "seen";
    patient_id: any;
    full_name: string;
  }>(null);

  const waitingList = React.useMemo(
    () => queList.filter((item) => item.status === "waiting"),
    [queList]
  );
  const calledList = React.useMemo(
    () => queList.filter((item) => item.status === "called"),
    [queList]
  );

  const handleActionConfirm = async () => {
    if (!confirmModal) return;
    await QueActions({
      patient_id: confirmModal.patient_id,
      action: confirmModal.type,
      performed_by: user?.name || "Unknown",
    });
    setConfirmModal(null);
    fetchQueList();
  };

  if (!queList || queList.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        🚫 No patients in queue.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">🩺 Patient Queue</h2>
      <div className="overflow-x-auto">
        {waitingList.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">🕑 No waiting patients yet.</div>
        ) : (
          <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {["N/A", "Check-In Time", "Patient ID", "Full Name", "Visit Reason", "Status", "Queued By", "Actions"].map(header => (
                  <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {waitingList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-sm">{new Date(item.checked_in_at).toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm">{item.patient_id}</td>
                  <td className="px-4 py-2 text-sm">{item.patient_fullname.toUpperCase()}</td>
                  <td className="px-4 py-2 text-sm">{item.visit_reason}</td>
                  <td className="px-4 py-2 text-sm">{item.status}</td>
                  <td className="px-4 py-2 text-sm">{item.qued_by}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/reports/${item.patient_id}`} className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md text-sm transition">View</Link>
                      <button className="text-white bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-md text-sm transition"
                        onClick={() =>
                          setConfirmModal({
                            type: "remove",
                            patient_id: item.patient_id,
                            full_name: item.patient_fullname
                          })
                        }>
                        Remove
                      </button>
                      <button className="text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-md text-sm transition"
                        onClick={() =>
                          setConfirmModal({
                            type: "called",
                            patient_id: item.patient_id,
                            full_name: item.patient_fullname
                          })
                        }>
                        Call
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 📞 Called Patients */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">📞 Called Patients</h2>
        {calledList.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-300">🕑 No called patients yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {["N/A", "Check-In", "ID", "Name", "Reason", "Status", "Doctor", "Actions"].map(header => (
                    <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-200">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {calledList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{new Date(item.checked_in_at).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{item.patient_id}</td>
                    <td className="px-4 py-2 text-sm">{item.patient_fullname.toUpperCase()}</td>
                    <td className="px-4 py-2 text-sm">{item.visit_reason}</td>
                    <td className="px-4 py-2 text-sm">{item.status}</td>
                    <td className="px-4 py-2 text-sm">{item.assigned_doctor}</td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/reports/${item.patient_id}`} className="text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md text-sm transition">View</Link>
                        <button className="text-white bg-yellow-600 hover:bg-yellow-500 px-3 py-1.5 rounded-md text-sm transition"
                          onClick={() =>
                            setConfirmModal({
                              type: "seen",
                              patient_id: item.patient_id,
                              full_name: item.patient_fullname
                            })
                          }>
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

      {/* 🔒 Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Confirm Action</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>{confirmModal.type}</strong> <strong>{confirmModal.full_name}</strong> from the queue?
            </p>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition" onClick={() => setConfirmModal(null)}>No</button>
              <button
                className={`px-4 py-2 ${confirmModal.type === "remove" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white rounded transition`}
                onClick={handleActionConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueList;
