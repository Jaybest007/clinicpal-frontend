import { FaTimes } from "react-icons/fa"
import { useDashboard } from "../context/DashboardContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface NewApointment {
  isOpen: boolean;
  onClose: () => void;
}

interface appointment{
    patient_id: string;
    doctor_name: string;
    time: string;
    notes: string;
}

export const AppointmentForm = ({isOpen, onClose}:NewApointment ) => {
    const {user} = useAuth();
    const {patientsData, addAppointment, loading,  fetchAppointment} = useDashboard();
    const [appointmentData, setAppointmentData] = useState<appointment>({
        patient_id: "",
        doctor_name: "",
        time: "",
        notes: "",
    });
    const [error, setError] = useState({
        patient_id: "",
        doctor_name: "",
        time: "",
        notes: "",
    });

     useEffect(() => {
        if (user?.name) {
          setAppointmentData((prev) => ({ ...prev, doctor_name: user.name }));
        }
        
      }, [user?.name]);

// ===========handle input change===============
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setAppointmentData(prev => ({...prev, [name]: value}));
        setError(prev => ({...prev, [name]: ""}));
    }
    
// ============handle submit===============
    const handleSubmit = async (event:React.FormEvent) => {
        event.preventDefault();

        const {patient_id, doctor_name, time, notes} = appointmentData;

        const newError = {
            patient_id: patient_id.trim() ? "" : "Patient id is required.",
            doctor_name: doctor_name.trim() ? "" : "Doctor's name is required.",
            time: time.trim() ? "" : "Time is required.",
            
        }
         notes.trim()

        // Check if time is in the past
        if (time && new Date(time) < new Date()) {
            newError.time = "Appointment time must be in the future.";
        }
        
        const hasError = Object.values(newError).some(err => err !== "");
        
        if(hasError){
            setError(prev => ({...prev, ...newError})); 
            return
        }
        
        try{
            await addAppointment(appointmentData);
            fetchAppointment()
            setAppointmentData({
                patient_id: "",
                doctor_name: "",
                time: "",
                notes: "",
            })
            setError({ patient_id: "", doctor_name: "", time: "", notes: "" })
            onClose()
        }catch(err: any){
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
            toast.success(errorMessage)
        }
    }



    if (!isOpen) return null;
    return(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm px-2 py-8 overflow-y-auto">
            <div className="relative w-full max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-12 border border-blue-100 animate-fade-in mt-5">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Modal header */}
                    <section className="relative">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                            aria-label="Close modal"
                            onClick={onClose}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold text-blue-900 border-b pb-3 mb-6">
                            New Appointment
                        </h2>

                        {/* Patient ID Dropdown */}
                        <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Patient 
                        </label>
                        <select
                            name="patient_id"
                            onChange={handleInputChange}
                            value={appointmentData.patient_id}
                            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">-- Choose Patient --</option>
                            {patientsData
                                .filter(patient => patient.patient_id && patient.full_name)
                                .map((patient) => (
                                    <option key={patient.patient_id} value={patient.patient_id}>
                                    {patient.full_name.toUpperCase()} ===||=== {patient.patient_id.toUpperCase()}
                                    </option>
                            ))}
                        </select>
                        {error.patient_id && (
                                <p className="text-red-600 text-sm mt-1">{error.patient_id}</p>
                                )}
                        </div>

                        {/* Doctor Name */}
                        <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Doctors Name 
                        </label>
                        <input
                            name="doctor_name"
                            type="text"
                            value={user?.name}
                            disabled
                            onChange={handleInputChange}
                            placeholder="Enter attending doctor's name"
                            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {error.doctor_name && (
                                <p className="text-red-600 text-sm mt-1">{error.doctor_name}</p>
                                )}
                        </div>

                        {/* Date & Time Input */}
                        <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Appointment Time 
                        </label>
                        <input
                            name="time"
                            type="datetime-local"
                            onChange={handleInputChange}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {error.time && (
                                <p className="text-red-600 text-sm mt-1">{error.time}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (optional) 
                        </label>
                        <textarea
                            name="notes"
                            rows={4}
                            onChange={handleInputChange}
                            value={appointmentData.notes}
                            className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                            placeholder="Add any relevant notes about the appointment..."
                        ></textarea>
                        {error.notes && (
                                <p className="text-red-600 text-sm mt-1">{error.notes}</p>
                                )}
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="pt-2 text-right">
                        <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow transition-all"
                        >
                        {loading ? "Schedulling appointment...." : "📅 Create Appointment"}
                        </button>
                    </div>
                </form>

            </div>
            
        </div>
    )   
}