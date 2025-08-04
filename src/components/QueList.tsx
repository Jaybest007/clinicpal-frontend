import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";

const QueList: React.FC = () => {
  const { queList, QueActions, fetchQueList, loading } = useDashboard();
  const { user } = useAuth();
  const [confirmModal, setConfirmModal] = React.useState<
    null | {
      type: "remove" | "called" | "seen";
      patient_id: string;
      full_name: string;
    }
  >(null);

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
    <div className="max-w-7xl mx-auto px-4 py-3 space-y-10">
      <header className="mb-2 ">
        <h1 className="text-4xl font-extrabold text-slate-800">Patient Queue</h1>
        <p className="text-sm text-gray-500 mt-2">
          Streamlined view of patient flow in the clinic.
        </p>
      </header>

      {[{ title: "Waiting Patients", list: waitingList }, { title: "Called Patients", list: calledList }].map(
        ({ title, list }, sectionIndex) => (
          <section key={sectionIndex}>
            <h2 className="text-2xl font-semibold mb-4 text-slate-700">{title}</h2>

            {list.length === 0 ? (
              <p className="text-gray-400 italic">No patients in this section.</p>
            ) : (
              <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                <table className="w-full text-sm md:text-base text-left text-gray-700">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      {[
                        "#",
                        "Time",
                        "Name",
                        "Reason",
                        "Status",
                        sectionIndex === 0 ? "Queued By" : "Doctor",
                        "Actions"
                      ].map((heading, idx) => (
                        <th key={idx} className="px-4 py-3 whitespace-nowrap">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {list.map((item, i) => (
                      <tr key={item.id} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3">{new Date(item.checked_in_at).toLocaleString(undefined, { timeStyle: 'short'})}</td>
                        <td className="px-4 py-3 font-medium">{item.patient_fullname}</td>
                        <td className="px-4 py-3 text-gray-600">{item.visit_reason}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">{item.status}</td>
                        <td className="px-4 py-3">
                          {sectionIndex === 0 ? item.qued_by : item.assigned_doctor}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              to={`/reports/${item.patient_id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                            >
                              View
                            </Link>

                            {sectionIndex === 0 ? (
                              <>
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      type: "called",
                                      patient_id: String(item.patient_id),
                                      full_name: item.patient_fullname,
                                    })
                                  }
                                  className="bg-lime-600 hover:bg-lime-700 text-white px-3 py-1 rounded-md text-xs"
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
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    type: "seen",
                                    patient_id: String(item.patient_id),
                                    full_name: item.patient_fullname,
                                  })
                                }
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-xs"
                              >
                                Seen
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      )}

      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-3">Confirm Action</h3>
            <p className="text-sm mb-5 text-gray-600">
              Are you sure you want to <strong>{confirmModal.type}</strong> {" "}
              <strong>{confirmModal.full_name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
