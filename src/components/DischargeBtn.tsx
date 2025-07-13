import React from "react"
import { useDashboard } from "../context/DashboardContext"

interface DischargeBtnProps {
    patient_id: string; // or number, depending on your data model
}

export const DischargeBtn: React.FC<DischargeBtnProps> = ({patient_id}) => {
    const {dischargePatient, loading} = useDashboard();

    const discharge = async() => {
        try{
            await dischargePatient({patient_id: patient_id});
        }catch(err: any){
            
        }
    }

    return <button 
        className='bg-lime-600 hover:bg-lime-500 px-5 py-3 rounded-md text-white'
        onClick={discharge}
        >
            {loading ? "Discharging..." : "Discharge"}
        </button>
}