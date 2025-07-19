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
      <div className="p-8 text-center text-neutral-500 dark:text-neutral-300 bg-white dark:bg-neutral-900 rounded-lg shadow-lg mt-8">
        <span className="text-3xl">🚫</span>
        <div className="mt-2 text-lg font-medium">No patients in queue.</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary-700 dark:text-primary-200 mb-6 flex items-center gap-2">
        <span className="text-3xl">🩺</span> Patient Queue
      </h2>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        {waitingList.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-300 text-lg">🕑 No waiting patients yet.</div>
        ) : (
          <table className="min-w-full table-auto text-sm sm:text-base">
            <thead>
              <tr>
                {["#", "Check-In Time", "Patient ID", "Full Name", "Visit Reason", "Status", "Queued By", "Actions"].map(header => (
                  <th
                    key={header}
                    className="px-3 py-3 text-left font-semibold text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {waitingList.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-primary-100 dark:hover:bg-primary-950 transition"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(item.checked_in_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{item.patient_id}</td>
                  <td className="px-3 py-2 font-semibold">{item.patient_fullname.toUpperCase()}</td>
                  <td className="px-3 py-2">{item.visit_reason}</td>
                  <td className="px-3 py-2">
                    <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{item.qued_by}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/reports/${item.patient_id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md font-medium shadow transition"
                      >
                        View
                      </Link>
                      <button
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md font-medium shadow transition"
                        onClick={() =>
                          setConfirmModal({
                            type: "remove",
                            patient_id: item.patient_id,
                            full_name: item.patient_fullname
                          })
                        }
                      >
                        Remove
                      </button>
                      <button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium shadow transition"
                        onClick={() =>
                          setConfirmModal({
                            type: "called",
                            patient_id: item.patient_id,
                            full_name: item.patient_fullname
                          })
                        }
                      >
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
      <section className="mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-700 dark:text-primary-200 mb-6 flex items-center gap-2">
          <span className="text-3xl">📞</span> Called Patients
        </h2>
        {calledList.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-300 text-lg">🕑 No called patients yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
            <table className="min-w-full table-auto text-sm sm:text-base">
              <thead>
                <tr>
                  {["#", "Check-In", "ID", "Name", "Reason", "Status", "Doctor", "Actions"].map(header => (
                    <th
                      key={header}
                      className="px-3 py-3 text-left font-semibold text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-primary-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calledList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-primary-100 dark:hover:bg-primary-950 transition"
                  >
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(item.checked_in_at).toLocaleString()}</td>
                    <td className="px-3 py-2">{item.patient_id}</td>
                    <td className="px-3 py-2 font-semibold">{item.patient_fullname.toUpperCase()}</td>
                    <td className="px-3 py-2">{item.visit_reason}</td>
                    <td className="px-3 py-2">
                      <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{item.assigned_doctor}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/reports/${item.patient_id}`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-md font-medium shadow transition"
                        >
                          View
                        </Link>
                        <button
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md font-medium shadow transition"
                          onClick={() =>
                            setConfirmModal({
                              type: "seen",
                              patient_id: item.patient_id,
                              full_name: item.patient_fullname
                            })
                          }
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

      {/* 🔒 Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm p-6">
            <h2 className="text-lg font-bold text-primary-700 dark:text-primary-200 mb-3">Confirm Action</h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6">
              Are you sure you want to <span className="font-semibold text-primary-700 dark:text-primary-200">{confirmModal.type}</span> <span className="font-semibold">{confirmModal.full_name}</span> from the queue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-neutral-300 hover:bg-neutral-400 text-neutral-800 rounded font-medium transition"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 ${
                  confirmModal.type === "remove"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } text-white rounded font-medium transition`}
                onClick={handleActionConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          table thead {
        display: none;
          }
          table, tbody, tr, td {
        display: block;
        width: 100%;
          }
          tr {
        margin-bottom: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        background: var(--tw-bg-opacity,1) theme('colors.white');
          }
          td {
        padding: 0.75rem 1rem;
        border: none;
        position: relative;
          }
          td:before {
        content: attr(data-label);
        font-weight: 600;
        color: #64748b;
        display: block;
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
          }
        }
      `}</style>
    </div>
  );
};

export default QueList;
