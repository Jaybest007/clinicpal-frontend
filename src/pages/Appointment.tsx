import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AppointmentForm } from "../components/AppointmentForm";
import { useDashboard } from "../context/DashboardContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

export const Appointment = () => {
  useEffect(() => {
    document.title = "Appointments - ClinicPal App";
    const allowedRoles = ["super admin", "doctor", "nurse"];
    if (user?.role && !allowedRoles.includes(user.role)) {
    navigate("/reports");
  }

  }, []);
  const {user} = useAuth()
  const { appointments, loading } = useDashboard();
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
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const statusStyles: Record<AppointmentType["status"], string> = {
    upcoming: "bg-yellow-500/10 text-yellow-900 border border-yellow-500 font-bold",
    completed: "bg-green-600/10 text-green-800 border border-green-600 font-bold",
    missed: "bg-rose-600/10 text-rose-800 border border-rose-600 font-bold",
  };

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

  return user?.role === "unactivated" ? (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-slate-200">
    <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto border border-red-200">
      <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Restricted</h1>
      <p className="text-gray-700 mb-6">
        Your account is inactive. Please contact your hospital administrator to activate access to the dashboard.
      </p>
      <button
        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  </div>
) : (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-8 py-4 rounded-t-xl shadow-sm mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight">
            Appointments
          </h1>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base sm:px-6 px-3 py-2 rounded-lg font-medium shadow transition-all"
          >
            ➕ Schedule Appointment
          </button>
        </div>

        <section className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 space-y-8">
          <div className="flex items-center justify-center gap-3">
            {["yesterday", "today", "tomorrow"].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as typeof currentView)}
                className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                  currentView === view
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          <header className="mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-blue-800">
              {currentView === "yesterday"
                ? "Yesterday’s Appointments"
                : currentView === "tomorrow"
                ? "Tomorrow’s Appointments"
                : "Today's Appointments"}
            </h2>
            <p className="text-sm text-slate-500">
              Review, track, and manage appointments.
            </p>
          </header>

          <div className="overflow-auto rounded border border-slate-200 shadow-sm">
            {loading ? 
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z" />
                </svg>
                Loading appointments...
              </div>
            </div>
            : <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Doctor</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.length > 0 ? (
                  filteredList.map((appt, index) => (
                    <tr
                      key={appt.id}
                      className="hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {appt.time ? (
                          new Date(appt.time).toLocaleTimeString("en-NG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        ) : (
                          <span className="italic text-slate-400">No time</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {appt.patient_name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {appt.doctor_name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full tracking-wide ${
                            statusStyles[appt.status] || ""
                          }`}
                        >
                          {appt.status === "upcoming" && "⏳"}
                          {appt.status === "completed" && "✅"}
                          {appt.status === "missed" && "❌"}
                          {appt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs font-medium text-blue-600 hover:underline">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-600 italic">
                      No appointments for {currentView}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>}
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
