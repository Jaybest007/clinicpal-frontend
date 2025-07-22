import axios from "axios";
import React, { createContext,  useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSocket } from "./SocketContext";

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
  admission_status: boolean;
  admission_reason: string;
  visit_on: string;
  visit_reason: string;
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
    order_to_pharmacy: boolean;
    order_to_lab: boolean;
    ultrasound_order: boolean; 
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
    admission_status: boolean;
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

//interface for pharmacy fetched data
interface pharmacyData {    
    id: any;
    full_name: string;
    patient_id: string;
    order_data: string;
    status: string;
    requested_by: string;
    updated_at: string;
    created_at: string;
}

//====interface for pharmacy order status
interface pharmacyOrderStatus {
    id: any;
    status: string;
    updated_at: string;
}
//====interface for laboratory order status
interface labOrderderStatus {
    id: string;
    status: string;
    updated_at: string;
}

//======interface for que patient
interface QueList {
  id: number;
  patient_id: number;
  patient_fullname: string;
  visit_reason: string;
  assigned_doctor: string;
  checked_in_at: string; // or Date if you'll parse it
  status: string;
  qued_by: string;
}

//====intetface for que actions
interface QueActions{
    patient_id: any;
    action: string;
    performed_by: any;
}

interface externalOrder {
    full_name: string;
    age: string;
    order_type: "lab" | "xray" | "ultrasound" | "motuary";
    order_data: string;
    sent_by: string;
}
interface fetchedExterOrder{
    id: string;
    name: string;
    age: number;
    order_type: string;
    order_data: string;
    hospital: string;
    created_on: string;
}

interface newPatient {
    full_name: string;
    address: string;
    patient_id: string;
    phone: string;
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
    pharmacyData: pharmacyData[];
    fetchPharmacyData: () => Promise<void>;
    updatePharmacyOrderStatus: (credentials: pharmacyOrderStatus) => Promise<void>;
    fetchLaboratoryData: () => Promise<void>;
    labData: pharmacyData[];
    updateLaboratoryOrderStatus: (credentials: labOrderderStatus) => Promise<void>;
    quePatient: (credentials: admission) => Promise<void>;
    queList: QueList[];
    QueActions: (credentials: QueActions) => Promise<void>;
    fetchQueList: () => Promise<void>;
    fetchUltrasoundData: () => Promise<void>;
    ultrasoundData: pharmacyData[];
    updateUltrasoundOrderStatus: (credentials: labOrderderStatus) => Promise<void>;
    submitExternalOrder: (credentials: externalOrder) => Promise<void>;
    externalOrder: fetchedExterOrder[];
    fetchExternalOrder: ()=> Promise<void>;
    newPatient: newPatient[];
    setNewPatient: React.Dispatch<React.SetStateAction<newPatient[]>>;
}
const dashboardContext = createContext<dashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [patientsData, setPatientsData] = useState<PatientsData[]>([]);
    const [patientReport, setPatientReport ] = useState<fetchReport[]>([]);
    const [nextOfKinData, setNextOfKinData] = useState<nextOfKinData[]>([]);
    const [appointments, setAppointments] = useState<fetchedAppointment[]>([]);
    const [admittedPatientReport, setAdmittedPatientReport] = useState<fetchReport[]>([]);
    const [pharmacyData, setPharmacyData] = useState<pharmacyData[]>([]);
    const [labData, setLabData] = useState<pharmacyData[]>([]);
    const [ultrasoundData, setUltrasoundData] = useState<pharmacyData[]>([]);
    const [externalOrder, setExternalOrders] = useState<fetchedExterOrder[]>([])
    const [queList, setQueList] = useState<QueList[]>([]);
    const [newPatient, setNewPatient] = useState<newPatient[]>([]);
    const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("clinicpal_user");
    return stored ? JSON.parse(stored).token : null;
    });
    const hasFetchedPatients = useRef(false);
    const hasFetchedAppointments = useRef(false);

    const socket = useSocket();

 

    //====useEffect to get token from localStorage on initial render====
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
            const response = await axios.get("https://clinicpal.onrender.com/api/patients/fetchPatients", 
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
        "https://clinicpal.onrender.com/api/patients/addPatient",
        credentials,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.success);
      setNewPatient(response.data.newPatient); 
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [token, socket]
);

//====socket listener for new patient====
useEffect(() => {
  if (!socket) return;

  socket.on("patientAdded", ( {patients, next_of_kin} ) => {
    setPatientsData(patients); // Keep as object for ConfirmationPage
    setNextOfKinData(next_of_kin);
    toast.info("A new patient was added!");
  });

  socket.on("quePatient", (queList) => {
    setQueList(queList);
    toast.info("A patient was added to the queue!");
  });
  
  socket.on("queActions", (queue) => {
    setQueList(queue);
    toast.info("A patient was updated in the queue!");
  })
  return () => {
    socket.off("patientAdded");
    socket.off("quePatient");
    socket.off("queActions");
  };
}, [socket]);

//==================send report ======
    const newReport = useCallback(async (credentials: report) =>{
         if (!token) return;
        try{
            setLoading(true);
            const response = await axios.post("https://clinicpal.onrender.com/api/reports/newReport", 
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
            const response = await axios.post("https://clinicpal.onrender.com/api/patients/admitPatient", 
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


//============que patient to visit=============
    const quePatient = useCallback(async (credentials: admission) => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await axios.post("https://clinicpal.onrender.com/api/patients/quePatient", 
                credentials, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response.data.success);
            setQueList((prev: any) => [...prev, response.data.queList]);
            fetchAllPatients();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchAllPatients, token]);

//============FETCH ALL QUEUED PATIENTS===========
    const fetchQueList = useCallback(async () => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.get("https://clinicpal.onrender.com/api/patients/fetchQueue", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setQueList(response.data);
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
}, [token]);

useEffect(() => {
    if (!token) return;
    if (!queList.length) {
        fetchQueList();
    }
}, [token, fetchQueList]);

//===============end of FETCHING OF QUEUED PATIENTS=================\\

//============actions for que patients===========
    const QueActions = useCallback(async (credentials:QueActions) => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await axios.post("https://clinicpal.onrender.com/api/patients/queActions", 
                credentials, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response.data.success);
           fetchQueList();
            
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
        
    }
    , [token, fetchQueList]);
//============FETCH ALL ADMITTED PATIENTS REPORT==================
    const fetch_Admitted_Patient_Report = useCallback( async() => {
        if (!token) return;
        try{
            setLoading(true);
            const response = await axios.get("https://clinicpal.onrender.com/api/reports/fetch_admitted_patient_reports",
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
            const response =  await axios.post("https://clinicpal.onrender.com/api/reports/fetchPatientReport", 
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
            const response = await axios.post("https://clinicpal.onrender.com/api/patients/dischargePatient", 
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
            const response = await axios.post("https://clinicpal.onrender.com/api/appointments/addAppointment",
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
            const response = await axios.get("https://clinicpal.onrender.com/api/appointments/fetchAppointments",
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

//=================fetch pharmacy data========================
const fetchPharmacyData = useCallback(async () => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.get("https://clinicpal.onrender.com/api/pharmacy/fetchPharmacyData", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setPharmacyData(response.data);
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    }
    finally {
        setLoading(false);
    }
}, [token]);

//=====update order status in pharmacy data
const updatePharmacyOrderStatus = useCallback(async (credentials: pharmacyOrderStatus ) => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.post("https://clinicpal.onrender.com/api/pharmacy/updateOrderStatus", 
            credentials, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success(response.data.success);
        fetchPharmacyData(); 
        fetchLaboratoryData();
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
},[token]);

//========fetch laboratory data==============
const fetchLaboratoryData = useCallback(async () => { 
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.get("https://clinicpal.onrender.com/api/laboratory/fetchLaboratoryData", 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        setLabData(response.data);
        
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
},[token])

//============update laboratory order status================
const updateLaboratoryOrderStatus = useCallback(async (credentials: labOrderderStatus) => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.post("https://clinicpal.onrender.com/api/laboratory/updateOrderStatus", 
            credentials, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success(response.data.success);
        fetchLaboratoryData();
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
}, [token, fetchLaboratoryData]);
//========================end ================

//============fetch ultrasound order ================
const fetchUltrasoundData = useCallback(async () => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.get("https://clinicpal.onrender.com/api/ultrasound/fetchUltrasoundData", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUltrasoundData(response.data);
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    }
    finally {
        setLoading(false);
    }
},[token]); 

//============ultrasound order action ================
const updateUltrasoundOrderStatus = useCallback(async (credentials: labOrderderStatus) => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.post("https://clinicpal.onrender.com/api/ultrasound/updateOrderStatus", 
            credentials, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success(response.data.success);
        fetchUltrasoundData();
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
}, [token, fetchUltrasoundData]);


//===========submit external order==============
const submitExternalOrder = useCallback(async (credentials: externalOrder) => {
    if (!token) return;
    try {
        setLoading(true);
        const response = await axios.post("https://clinicpal.onrender.com/api/external/submitExternalOrder", 
            credentials, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success(response.data.success);
        fetchUltrasoundData();
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
    } finally {
        setLoading(false);
    }
}, [token, fetchUltrasoundData]);

//========== fetch external orer ============
const fetchExternalOrder = useCallback(async () => {
  if (!token) return;
  try {
    setLoading(true);
    const response = await axios.get(
      "https://clinicpal.onrender.com/api/external/fetchOrder",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 seconds timeout for reliability
      }
    );
    
    if (Array.isArray(response.data)) {
      setExternalOrders(response.data);
    } else {
      toast.error("Unexpected response format from server.");
    }
    
  } catch (err: any) {
   
    toast.error("Unable to fetch external orders. Please try again.");
    
  } finally {
    setLoading(false);
  }
}, [token]);






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
  appointments,  fetchPharmacyData,pharmacyData, updatePharmacyOrderStatus, labData,
  fetchLaboratoryData, updateLaboratoryOrderStatus, quePatient, queList, QueActions, fetchQueList,fetchUltrasoundData,
  updateUltrasoundOrderStatus, submitExternalOrder,
  ultrasoundData, externalOrder, fetchExternalOrder, newPatient, setNewPatient
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
  appointments, fetchPharmacyData,pharmacyData, 
  updatePharmacyOrderStatus, fetchLaboratoryData, labData,
  updateLaboratoryOrderStatus, quePatient , queList, QueActions, fetchQueList, fetchUltrasoundData, ultrasoundData,
  updateUltrasoundOrderStatus, submitExternalOrder, externalOrder, fetchExternalOrder, newPatient, setNewPatient


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

