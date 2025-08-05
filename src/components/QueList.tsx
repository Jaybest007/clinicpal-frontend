import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle,  FiPhoneCall, FiEye, FiUserCheck } from "react-icons/fi";

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "waiting") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <FiClock className="w-3 h-3" />
        Waiting
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
      <FiPhoneCall className="w-3 h-3" />
      Called
    </span>
  );
};

// Empty state component
const EmptyQueue = ({ type }: { type: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center"
  >
    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-3">
      {type === "waiting" ? (
        <FiClock className="w-6 h-6 text-slate-400" />
      ) : (
        <FiUserCheck className="w-6 h-6 text-slate-400" />
      )}
    </div>
    <h3 className="text-slate-700 font-medium mb-1">No {type} patients</h3>
    <p className="text-slate-500 text-sm max-w-md mx-auto">
      {type === "waiting" 
        ? "There are no patients currently waiting to be seen."
        : "There are no patients who have been called."}
    </p>
  </motion.div>
);

const QueList: React.FC = () => {
  const { queList, QueActions, fetchQueList, loading } = useDashboard();
  const { user } = useAuth();
  const [confirmModal, setConfirmModal] = useState<
    null | {
      type: "remove" | "called" | "seen";
      patient_id: string;
      full_name: string;
    }
  >(null);

  const waitingList = useMemo(() => queList.filter(p => p.status === "waiting"), [queList]);
  const calledList = useMemo(() => queList.filter(p => p.status === "called"), [queList]);

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

  // Get action label and color based on action type
  const getActionProps = (type: "remove" | "called" | "seen") => {
    switch (type) {
      case "remove":
        return {
          label: "Remove Patient",
          icon: <FiXCircle className="w-5 h-5" />,
          color: "bg-red-600 text-white",
          description: "Remove this patient from the queue"
        };
      case "called":
        return {
          label: "Call Patient",
          icon: <FiPhoneCall className="w-5 h-5" />,
          color: "bg-green-600 text-white",
          description: "Mark this patient as called"
        };
      case "seen":
        return {
          label: "Mark as Seen",
          icon: <FiCheckCircle className="w-5 h-5" />,
          color: "bg-amber-600 text-white",
          description: "Mark this patient as seen by doctor"
        };
    }
  };

  return (
    <div className="space-y-6 ">
      {/* Waiting Patients Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Waiting Patients</h2>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            {waitingList.length} patient{waitingList.length !== 1 ? 's' : ''}
          </span>
        </div>

        {waitingList.length === 0 ? (
          <EmptyQueue type="waiting" />
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Patient</th>
                  <th className="px-4 py-2 hidden md:table-cell">Reason</th>
                  <th className="px-4 py-2 hidden lg:table-cell">Status</th>
                  <th className="px-4 py-2 hidden md:table-cell">Queued By</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {waitingList.map((item, i) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="hover:bg-blue-50/60"
                    >
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {new Date(item.checked_in_at).toLocaleString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
                            {item.patient_fullname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 truncate max-w-[140px]">
                              {item.patient_fullname}
                            </div>
                            <div className="text-xs text-slate-500">
                              ID: {item.patient_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell truncate max-w-[200px]">
                        {item.visit_reason || "Not specified"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                        {item.qued_by}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/reports/${item.patient_id}`}
                            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs transition"
                          >
                            <FiEye className="w-3 h-3" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                type: "called",
                                patient_id: String(item.patient_id),
                                full_name: item.patient_fullname,
                              })
                            }
                            className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded text-xs transition"
                          >
                            <FiPhoneCall className="w-3 h-3" />
                            <span className="hidden sm:inline">Call</span>
                          </button>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                type: "remove",
                                patient_id: String(item.patient_id),
                                full_name: item.patient_fullname,
                              })
                            }
                            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded text-xs transition"
                          >
                            <FiXCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Called Patients Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Called Patients</h2>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {calledList.length} patient{calledList.length !== 1 ? 's' : ''}
          </span>
        </div>

        {calledList.length === 0 ? (
          <EmptyQueue type="called" />
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Patient</th>
                  <th className="px-4 py-2 hidden md:table-cell">Reason</th>
                  <th className="px-4 py-2 hidden lg:table-cell">Status</th>
                  <th className="px-4 py-2 hidden md:table-cell">Doctor</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {calledList.map((item, i) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                      className="hover:bg-blue-50/60"
                    >
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                        {new Date(item.checked_in_at).toLocaleString(undefined, { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium flex-shrink-0">
                            {item.patient_fullname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 truncate max-w-[140px]">
                              {item.patient_fullname}
                            </div>
                            <div className="text-xs text-slate-500">
                              ID: {item.patient_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell truncate max-w-[200px]">
                        {item.visit_reason || "Not specified"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                        {item.assigned_doctor || "Not assigned"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/reports/${item.patient_id}`}
                            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs transition"
                          >
                            <FiEye className="w-3 h-3" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                type: "seen",
                                patient_id: String(item.patient_id),
                                full_name: item.patient_fullname,
                              })
                            }
                            className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs transition"
                          >
                            <FiCheckCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Seen</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className={`p-4 ${getActionProps(confirmModal.type).color}`}>
                <div className="flex items-center gap-3">
                  {getActionProps(confirmModal.type).icon}
                  <h3 className="text-lg font-semibold">{getActionProps(confirmModal.type).label}</h3>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0 mt-0.5">
                    {confirmModal.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{confirmModal.full_name}</p>
                    <p className="text-sm text-slate-500">Patient ID: {confirmModal.patient_id}</p>
                    <p className="text-sm text-slate-600 mt-2">
                      {getActionProps(confirmModal.type).description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm flex items-center gap-2 ${
                      getActionProps(confirmModal.type).color.replace("text-white", "")
                    } hover:opacity-90 transition`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {getActionProps(confirmModal.type).icon}
                        Confirm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QueList;
