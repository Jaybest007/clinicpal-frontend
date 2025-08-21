import React from "react"
import { useDashboard } from "../context/DashboardContext"

interface DischargeBtnProps {
    patient_id: string; // or number, depending on your data model
    onClose?: () => void; // Make onClose an optional prop in the interface
}

export const DischargeBtn: React.FC<DischargeBtnProps> = ({ patient_id, onClose }) => {
    const { dischargePatient, loading } = useDashboard();

    const discharge = async() => {
        try{
            await dischargePatient({patient_id: patient_id});
            // Only call onClose if it exists
            if (onClose) {
                onClose();
            }
        }catch(err: any){
            console.error("Error discharging patient:", err);
            // You could add error toast notification here
        }
    }

    return (
        <button
            className='bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-md text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 flex items-center justify-center gap-2'
            onClick={discharge}
            disabled={loading}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Discharging...
                </>
            ) : (
                "Discharge"
            )}
        </button>
    );
}