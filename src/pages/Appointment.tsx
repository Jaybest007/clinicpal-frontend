import { useEffect, useState, useMemo } from "react";
import NavBar from "../components/NavBar";
import { AppointmentForm } from "../components/AppointmentForm";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiUserPlus, FiRefreshCw, FiCheckCircle, FiXCircle, FiAlertCircle, FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";

// Define the shape of each appointment
interface AppointmentType {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  time: string | null;
  status: "upcoming" | "completed" | "missed";
  notes: string;
  created_at: string;
}

// Status badge component
const StatusBadge = ({ status }: { status: AppointmentType["status"] }) => {
  const statusConfig = {
    upcoming: {
      icon: <FiClock className="w-3 h-3" />,
      label: "UPCOMING",
      className: "bg-yellow-500/10 text-yellow-700 border border-yellow-200"
    },
    completed: {
      icon: <FiCheckCircle className="w-3 h-3" />,
      label: "COMPLETED",
      className: "bg-green-600/10 text-green-700 border border-green-200" 
    },
    missed: {
      icon: <FiXCircle className="w-3 h-3" />,
      label: "MISSED",
      className: "bg-rose-600/10 text-rose-700 border border-rose-200"
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Date navigation component
const DateNavigation = ({ currentView, setCurrentView }: { 
  currentView: "yesterday" | "today" | "tomorrow"; 
  setCurrentView: (view: "yesterday" | "today" | "tomorrow") => void;
}) => {
  // Get proper date for the view
  const viewDate = useMemo(() => {
    const now = new Date();
    const date = new Date(now);
    
    if (currentView === "yesterday") date.setDate(now.getDate() - 1);
    if (currentView === "tomorrow") date.setDate(now.getDate() + 1);
    
    return date;
  }, [currentView]);
  
  // Format date as "Monday, 5 August" 
  const formattedDate = viewDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
      <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 p-1">
        <button 
          onClick={() => setCurrentView("yesterday")}
          disabled={currentView === "yesterday"}
          className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous day"
        >
          <FiChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div className="px-3 font-medium text-slate-700">
          {formattedDate}
        </div>
        <button 
          onClick={() => setCurrentView("tomorrow")}
          disabled={currentView === "tomorrow"}
          className="p-2 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next day"
        >
          <FiChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
        {["yesterday", "today", "tomorrow"].map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view as typeof currentView)}
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-md font-medium transition ${
              currentView === view
                ? "bg-blue-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ view }: { view: string }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
      <FiCalendar className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700 mb-2">No appointments</h3>
    <p className="text-slate-500 text-center max-w-md mb-6">
      There are no appointments scheduled for {view}. 
      You can add a new appointment using the button below.
    </p>
    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
      <FiUserPlus className="w-4 h-4" />
      <span>Schedule New Appointment</span>
    </button>
  </div>
);

export const Appointment = () => {
  useEffect(() => {
    document.title = "Appointments - ClinicPal App";
    const allowedRoles = ["super admin", "doctor", "nurse"];
    if (user?.role && !allowedRoles.includes(user.role)) {
      navigate("/reports");
    }
  }, []);
  
  const { user } = useAuth();
  const { appointments, loading } = useDashboard();
  const navigate = useNavigate();
  
  // Map fetchedAppointment[] to AppointmentType[] by ensuring 'id' exists
  const appointmentList: AppointmentType[] = (appointments || []).map((appt: any, idx: number) => ({
    id: appt.id ?? appt._id ?? String(idx),
    patient_id: appt.patient_id,
    patient_name: appt.patient_name,
    doctor_name: appt.doctor_name,
    time: appt.time ?? null,
    status: appt.status,
    notes: appt.notes,
    created_at: appt.created_at,
  }));
  
  const [currentView, setCurrentView] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const filterAppointmentsByView = (view: typeof currentView): AppointmentType[] => {
    const now = new Date();
    const targetDate = new Date(now);

    if (view === "yesterday") targetDate.setDate(now.getDate() - 1);
    if (view === "tomorrow") targetDate.setDate(now.getDate() + 1);

    return appointmentList.filter((appt) => {
      if (!appt.time) return false;
      const apptDate = new Date(appt.time);
      return isSameDate(apptDate, targetDate);
    });
  };

  const filteredList = filterAppointmentsByView(currentView);

  // If user is unactivated, show restricted access message
  if (user?.role === "unactivated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto border border-red-200"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h1>
          <p className="text-gray-700 mb-6">
            Your account is inactive. Please contact your hospital administrator to activate access to the dashboard.
          </p>
          <button
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
            onClick={() => window.location.reload()}
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white/90 backdrop-blur border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl shadow-sm mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight mb-1">
              Appointments
            </h1>
            <p className="text-sm text-slate-500">
              Manage and track patient appointments
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAppointmentModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </motion.button>
        </div>

        <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Date navigation */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-6 border-b border-slate-200">
            <DateNavigation currentView={currentView} setCurrentView={setCurrentView} />
            
            <header>
              <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                {currentView === "yesterday"
                  ? "Yesterday's Appointments"
                  : currentView === "tomorrow"
                  ? "Tomorrow's Appointments"
                  : "Today's Appointments"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {filteredList.length} appointment{filteredList.length !== 1 ? 's' : ''} scheduled
              </p>
            </header>
          </div>

          {/* Appointment list */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-600 animate-pulse">Loading appointments...</p>
                </div>
              </div>
            ) : filteredList.length === 0 ? (
              <EmptyState view={currentView} />
            ) : (
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Time</th>
                    <th className="px-6 py-3 text-left">Patient</th>
                    <th className="px-6 py-3 text-left">Doctor</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <AnimatePresence>
                    {filteredList.map((appt, index) => (
                      <motion.tr
                        key={appt.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-blue-50/60 transition cursor-pointer"
                        onMouseEnter={() => setHoveredRow(appt.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-700">
                          {appt.time ? (
                            <div className="flex items-center gap-1.5">
                              <FiClock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(appt.time).toLocaleTimeString("en-NG", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          ) : (
                            <span className="italic text-slate-400 flex items-center gap-1.5">
                              <FiClock className="w-3.5 h-3.5" />
                              No time
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                              {appt.patient_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">
                                {appt.patient_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                ID: {appt.patient_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-slate-400" />
                            <span>{appt.doctor_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <motion.button 
                            initial={{ opacity: hoveredRow === appt.id ? 1 : 0.7 }}
                            animate={{ opacity: hoveredRow === appt.id ? 1 : 0.7 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition text-xs font-medium"
                          >
                            <FiEye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <AppointmentForm
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
    </div>
  );
};
