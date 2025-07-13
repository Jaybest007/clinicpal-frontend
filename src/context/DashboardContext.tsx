import axios from "axios";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
  discharged_on: string;
  admitted_on: string;
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

//===interface for Fetching of report
interface fetchReport {
    id: number;
    patient_id: string;
    full_name: string;
    report: string;
    wrote_by: string;
    created_at: string;
    admission_status: number;
}

//====interface for dischagre
interface discharge{
    patient_id: string;
}

//======interface appointment
interface appointment{
    patient_id: string;
    doctor_name: string;
    time: string;
    notes: string;
}

//inteface for fetched appointment
interface fetchedAppointment {
    patient_id: string;
    patient_name: string;
    doctor_name: string;
    time: string;
    status: string;
    notes: string;
    created_at: string;
}


interface dashboardContextType {
    addNewPatient: (credentials: newPatientData) => Promise<void>;
    patientsData: PatientsData[];
    nextOfKinData: nextOfKinData[];
    loading: boolean;
    fetchAllPatients: () => Promise<void>;
    newReport: (credentials: report) => Promise<void>;
    admitPatient: (credentials: admission) => Promise<void>;
    fetch_Admitted_Patient_Report: () => Promise<void>;
    admittedPatientReport: fetchReport[];
    dischargePatient: (credentials: discharge) => Promise<void>;
    patientReport: fetchReport[];
    fetchPatientReport: (credentials: discharge) => Promise<void>;
    addAppointment: (credentials: appointment) => Promise<void>;
    fetchAppointment: () => Promise<void>;
    appointments: fetchedAppointment[];

}

const dashboardContext = createContext<dashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [patientsData, setPatientsData] = useState<PatientsData[]>([]);
    const [patientReport, setPatientReport ] = useState<fetchReport[]>([]);
    const [nextOfKinData, setNextOfKinData] = useState<nextOfKinData[]>([]);
    const [appointments, setAppointments] = useState<fetchedAppointment[]>([]);
    const [admittedPatientReport, setAdmittedPatientReport] = useState<fetchReport[]>([]);
    const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("clinicpal_user");
    return stored ? JSON.parse(stored).token : null;
    });
    const hasFetchedPatients = useRef(false);
    const hasFetchedAppointments = useRef(false);


    useEffect(() => {
    const stored = localStorage.getItem("clinicpal_user");
    if (stored) {
        try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
            setToken(parsed.token);
        }
        } catch (err) {
        console.error("Failed to parse clinicpal_user:", err);
        setToken(null);
        }
    }
    }, []);
    //====fetch all patients======
    const fetchAllPatients = useCallback(async () =>{
          if (!token) return;
        try{
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/patients/fetchPatients", 
                {
                headers: {
                Authorization: `Bearer ${token}`
                }
            }
            );
            setPatientsData(response.data.patients);
            setNextOfKinData(response.data.next_of_kin);
        }catch(err: any){
            toast.error(err?.response?.data?.error || "Unable to fetch data");
            throw err
        } finally{
            setLoading(false);
        }
    }, [token])

    //=====refresh and fetch patients data =====
 useEffect(() => {
  if (!token || hasFetchedPatients.current) return;
  fetchAllPatients();
  hasFetchedPatients.current = true;
}, [fetchAllPatients, token]);



    //=====send new Patients Data =====
    const addNewPatient = useCallback(
  async (credentials: newPatientData) => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/patients/addPatient",
        credentials,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.success);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [token]
);



    //=====send report ======
    const newReport = useCallback(async (credentials: report) =>{
         if (!token) return;
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/reports/newReport", 
                credentials,
                {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            toast.success(response.data.success);
        }catch(err: any){
            throw err
        }finally{
            setLoading(false)
        }
    },[token])

    //====admit patient====
    const admitPatient = useCallback(async (credentials: admission) => {
         if (!token) return;
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/patients/admitPatient", 
                credentials,
                {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
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

//============FETCH ALL ADMITTED PATIENTS REPORT==================
    const fetch_Admitted_Patient_Report = useCallback( async() => {
        if (!token) return;
        try{
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/reports/fetch_admitted_patient_reports",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAdmittedPatientReport(response.data);
        }catch(err: any){
             toast.error(err?.response?.data?.error || "Unable to fetch data");
            throw err
        }finally{
            setLoading(false);
        }
    },[token])

    //=====refresh and fetch admitted patients reports =====
    useEffect(() => {
     if (!token) return;
        if (!admittedPatientReport.length) {
        fetch_Admitted_Patient_Report();
    }
    }, [fetch_Admitted_Patient_Report, patientsData]);
//===============end of FETCHING OF ADMITTED PATIENTS REPORTS===============

//============fetch a particular Patient============================
    const fetchPatientReport = useCallback( async(credentials: discharge) => {
         if (!token) return;
        try{
            setLoading(true)
            const response =  await axios.post("http://localhost:5000/api/reports/fetchPatientReport", 
                credentials, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setPatientReport(response.data);

        }catch (err: any){
            throw err
        }finally{
            setLoading(false)
        }
    },[token])

    
//============discharge patient ================
    const dischargePatient = useCallback( async(credentials: discharge) => {
        if (!token) return;
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/patients/dischargePatient", 
                credentials,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success(response.data.success);
                fetchAllPatients();
            
        }catch(err: any){
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(errorMessage)
            throw err
        }finally{
            setLoading(false);
        }
    },[token])

// ==========add Appointment ==================
    const addAppointment = useCallback(async (credentials: appointment) =>{
         if (!token) return;
        try{
            setLoading(true);
            const response = await axios.post("http://localhost:5000/api/appointments/addAppointment",
                credentials, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(response.data.success);
           
        }catch(err: any){
            throw err
        }finally{
            setLoading(false)
        }
    },[token])

//==========fetch all appointment ============
    const fetchAppointment = useCallback( async() => {
        try{
            if (!token) return;
            setLoading(true)
            const response = await axios.get("http://localhost:5000/api/appointments/fetchAppointments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAppointments(response.data)
        }catch(err: any){
            toast.error(err);
        }finally{
            setLoading(false);
        }
    },[token])
//====refesh and fetch the list if appointments is empty======


useEffect(() => {
  if (!token || hasFetchedAppointments.current) return;
  fetchAppointment();
  hasFetchedAppointments.current = true;
}, [fetchAppointment, token]);
//========================end ================


    const contextValue = useMemo(() => ({
  addNewPatient,
  loading,
  patientsData,
  fetchAllPatients,
  newReport,
  nextOfKinData,
  admitPatient,
  fetch_Admitted_Patient_Report,
  admittedPatientReport,
  dischargePatient,
  fetchPatientReport,
  patientReport,
  addAppointment,
  fetchAppointment,
  appointments,
}), [
  addNewPatient,
  loading,
  patientsData,
  fetchAllPatients,
  newReport,
  nextOfKinData,
  admitPatient,
  fetch_Admitted_Patient_Report,
  admittedPatientReport,
  dischargePatient,
  fetchPatientReport,
  patientReport,
  addAppointment,
  fetchAppointment,
  appointments,
]);

return (
  <dashboardContext.Provider value={contextValue}>
    {children}
  </dashboardContext.Provider>
);

}
export const useDashboard = () => {
    const context = useContext(dashboardContext);
    
    if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
    return context;
}