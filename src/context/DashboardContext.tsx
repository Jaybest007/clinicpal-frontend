import axios from "axios";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


//====New Patient data that is going to the backend interface
interface newPatientData {
        full_name: string;
        address: string;
        gender: string;
        age: string;
        phone: string;
        nok_full_name: string;
        nok_address: string;
        nok_phone: string;
        nok_relationship: string;
        done_by: string;
}

//===fetched patients data interface
interface PatientsData {
  id: number;
  patient_id: string;
  full_name: string;
  address: string;
  age: number;
  phone: string;
  gender: "male" | "female";
  admission_status: number;
  admission_reason: string;
  created_at: string; 
}

//interface for next of kin data
interface nextOfKinData {
  id: number;
  full_name: string;
  address: string;
  phone: string;
  relationship: string;
  patient_id: string;
}

//interface for report 
interface report{
    patient_id: string;
    report: string;
    wrote_by: string;
}

//interface for admission
interface admission{
    patient_id: string;
    reason: string;
    wrote_by: string;
}


interface dashboardContextType {
    addNewPatient: (credentials: newPatientData) => Promise<void>;
    patientsData: PatientsData[];
    nextOfKinData: nextOfKinData[];
    loading: boolean;
    fetchAllPatients: () => Promise<void>;
    newReport: (credentials: report) => Promise<void>;
    admitPatient: (credentials: admission) => Promise<void>;
}

const dashboardContext = createContext<dashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [patientsData, setPatientsData] = useState<PatientsData[]>([]);
    const [nextOfKinData, setNextOfKinData] = useState<nextOfKinData[]>([])

    //====fetch all patients======
    const fetchAllPatients = useCallback(async () =>{
        try{
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/patients/fetchPatients");
            setPatientsData(response.data.patients);
            setNextOfKinData(response.data.next_of_kin);
        }catch(err: any){
            toast.error(err?.response?.data?.error || "Unable to fetch data");
            throw err
        } finally{
            setLoading(false);
        }
    }, [])

    //=====refresh and fetch patients data =====
    useEffect(() => {
    if (!patientsData.length) {
        fetchAllPatients();
    }
    }, [fetchAllPatients, patientsData]);


    //=====send new Patients Data =====
    const addNewPatient = useCallback(async (credentials: newPatientData) =>{
       
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/patients/newPatient", credentials);
            toast.success(response.data.success);
       }catch(err: any){
            throw err;

       }finally{
        setLoading(false);

       }
    },[])

    //=====send report ======
    const newReport = useCallback(async (credentials: report) =>{
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/patients/newReport", credentials);
            toast.success(response.data.success);
        }catch(err: any){
            throw err
        }finally{
            setLoading(false)
        }
    },[])

    //====admit patient====
    const admitPatient = useCallback(async (credentials: admission) => {
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/patients/admitPatient", credentials);
            toast.success(response.data.success);
            fetchAllPatients();
        }catch(err: any){
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(errorMessage)
            throw err
        }finally{
            setLoading(false)
        }
    },[fetchAllPatients])


    return(
        <dashboardContext.Provider value={{addNewPatient, loading, patientsData, fetchAllPatients, newReport, nextOfKinData, admitPatient }}>
            {children}
        </dashboardContext.Provider>
    )
}
export const useDashboard = () => {
    const context = useContext(dashboardContext);
    
    if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
    return context;
}