import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useSocket } from "./SocketContext";
import { clinipalDB } from "../db/clinipal-db";
import { useAuth } from "./AuthContext";

//====New Patient data that is going to the backend interface
export interface newPatientData {
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
export interface PatientsData {
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
export interface nextOfKinData {
  id: number;
  full_name: string;
  address: string;
  phone: string;
  relationship: string;
  patient_id: string;
}

//interface for report 
export interface report{
    patient_id: string;
    report: string;
    wrote_by: string;
    order_to_pharmacy: boolean;
    order_to_lab: boolean;
    ultrasound_order: boolean; 
    xray_order: boolean;
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
    result: string;
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

interface orderResult {
    id: string;
    wrote_by: string;
    patient_id: string;
    orderResults: string;
}

export interface Transaction{
  id: number;
  amount: string;
  created_at: string;
  created_by: string;
  department: string;
  description: string;
  hospital_id: string;
  name: string;
  notes: string;
  patient_id: string;
  payers_name: string;
  payment_method: string;
  payment_status: string;
  receipt_id: string | null;
}

interface billingDetails{
  payers_name: string;
  patient_id : string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  notes: string;
}

interface externalBilling{
  payers_name: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  notes: string;
}

export interface externalBillingData {
  id: number;
  payers_name: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  notes: string;
  created_at: string;
  created_by: string;

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
  fetchExternalOrder: () => Promise<void>;
  newPatient: newPatient[];
  setNewPatient: React.Dispatch<React.SetStateAction<newPatient[]>>;
  orderResult: (credentials: orderResult) => Promise<void>;
  newBilling: (credentials: billingDetails) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  transactions: Transaction[];
  setPatientReport: React.Dispatch<React.SetStateAction<fetchReport[]>>;
  xrayData: pharmacyData[];
  fetchXrayData: () => Promise<void>;
  patientPaymentHistory: Transaction[];
  fetchPatientPaymentHistory: (patient_id: string) => Promise<void>;
  externalBilling: (credentials: externalBilling) => Promise<void>;
  fetchExternalBilling: () => Promise<void>;
  externalBillingData: externalBillingData[];
}

const dashboardContext = createContext<dashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [patientsData, setPatientsData] = useState<PatientsData[]>([]);
  const [patientReport, setPatientReport] = useState<fetchReport[]>([]);
  const [nextOfKinData, setNextOfKinData] = useState<nextOfKinData[]>([]);
  const [appointments, setAppointments] = useState<fetchedAppointment[]>([]);
  const [admittedPatientReport, setAdmittedPatientReport] = useState<fetchReport[]>([]);
  const [pharmacyData, setPharmacyData] = useState<pharmacyData[]>([]);
  const [labData, setLabData] = useState<pharmacyData[]>([]);
  const [ultrasoundData, setUltrasoundData] = useState<pharmacyData[]>([]);
  const [xrayData, setXrayData] = useState<pharmacyData[]>([]);
  const [externalOrder, setExternalOrders] = useState<fetchedExterOrder[]>([]);
  const [queList, setQueList] = useState<QueList[]>([]);
  const [newPatient, setNewPatient] = useState<newPatient[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [patientPaymentHistory, setPatientPaymentHistory] = useState<Transaction[]>([]);
  const [externalBillingData, setExternalBillingData] = useState<externalBillingData[]>([]);
  const { user } = useAuth(); 
  // Use refs to avoid unnecessary fetches
  const hasFetchedPatients = useRef(false);
  const hasFetchedAppointments = useRef(false);
  const hasFetchedQueue = useRef(false);
  const hasFetchedAdmittedReports = useRef(false);

  const socket = useSocket();

  // Ensure axios sends cookies with every request
  axios.defaults.withCredentials = true;

  // ================ Fetch all patients only once per session
  const fetchAllPatients = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/patients/fetchPatients"
      );
      setPatientsData(response.data.patients);
      setNextOfKinData(response.data.next_of_kin);

      // Save to Dexie for offline use
      if (response.data.patients?.length) {
        clinipalDB.patientsData.clear().then(() => {
          clinipalDB.patientsData.bulkAdd(response.data.patients);
        });
      }
      if (response.data.next_of_kin?.length) {
        clinipalDB.nextOfKin.clear().then(() => {
          clinipalDB.nextOfKin.bulkAdd(response.data.next_of_kin);
        });
      }
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  useEffect(() => {
    if (!user) return;
    if (hasFetchedPatients.current) return;
    fetchAllPatients();
    hasFetchedPatients.current = true;
  }, [fetchAllPatients, user]); // <-- Add user as dependency

  //============ Add new patient
  const addNewPatient = useCallback(
    async (credentials: newPatientData) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/patients/addPatient",
          credentials
        );
        toast.success(response.data.success);
        setNewPatient(response.data.newPatient);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [socket, user]
  );

  //=========== Socket listeners
  useEffect(() => {
    if (!socket) return;
    if (!user) return;

    const handlePatientAdded = ({ patients, next_of_kin }: any) => {
      setPatientsData(patients);
      setNextOfKinData(next_of_kin);
      toast.info("A new patient was added!");
    };
    const handleQuePatient = (queList: any) => {
      setQueList(queList);
      toast.info("A patient was added to the queue!");
    };
    const handleQueActions = (queue: any) => {
      setQueList(queue);
      toast.info("A patient was updated in the queue!");
    };

    socket.on("patientAdded", handlePatientAdded);
    socket.on("quePatient", handleQuePatient);
    socket.on("queActions", handleQueActions);

    return () => {
      socket.off("patientAdded", handlePatientAdded);
      socket.off("quePatient", handleQuePatient);
      socket.off("queActions", handleQueActions);
    };
  }, [socket, user]);

  //=============== New report
  const newReport = useCallback(
    async (credentials: report) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/reports/newReport",
          credentials
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  //================= Admit patient
  const admitPatient = useCallback(
    async (credentials: admission) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/patients/admitPatient",
          credentials
        );
        toast.success(response.data.success);
        fetchAllPatients();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, user]
  );

  //================ Queue patient
  const quePatient = useCallback(
    async (credentials: admission) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/patients/quePatient",
          credentials
        );
        toast.success(response.data.success);
        setQueList((prev: QueList[]) => [...prev, response.data.queList]);
        fetchAllPatients();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, user]
  );

  //================= Fetch queue list only once per session
  const fetchQueList = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/patients/fetchQueue"
      );
      setQueList(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  useEffect(() => {
    if (!user) return;
    if (hasFetchedQueue.current) return;
    fetchQueList();
    hasFetchedQueue.current = true;
  }, [fetchQueList, user]); // <-- Add user as dependency

  //================= Queue actions
  const QueActions = useCallback(
    async (credentials: QueActions) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/patients/queActions",
          credentials
        );
        toast.success(response.data.success);
        fetchQueList();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchQueList, user]
  );

  // Fetch admitted patient report only once per session
  const fetch_Admitted_Patient_Report = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/reports/fetch_admitted_patient_reports"
      );
      setAdmittedPatientReport(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  useEffect(() => {
    if (!user) return;
    if (hasFetchedAdmittedReports.current) return;
    fetch_Admitted_Patient_Report();
    hasFetchedAdmittedReports.current = true;
  }, [fetch_Admitted_Patient_Report, user]); // <-- Add user as dependency

  // Fetch patient report
  const fetchPatientReport = useCallback(
    async (credentials: discharge) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/reports/fetchPatientReport",
          credentials
        );
        setPatientReport(response.data);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  //================== Discharge patient
  const dischargePatient = useCallback(
    async (credentials: discharge) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/patients/dischargePatient",
          credentials
        );
        toast.success(response.data.success);
        fetchAllPatients();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, user]
  );

  //================ Add appointment
  const addAppointment = useCallback(
    async (credentials: appointment) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/appointments/addAppointment",
          credentials
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  //============== Fetch appointments only once per session
  const fetchAppointment = useCallback(async () => {
    if (!user) return;
    if (hasFetchedAppointments.current) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/appointments/fetchAppointments"
      );
      setAppointments(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  useEffect(() => {
    if (!user) return;
    if (hasFetchedAppointments.current) return;
    fetchAppointment();
    hasFetchedAppointments.current = true;
  }, [fetchAppointment, user]); // <-- Add user as dependency

  //================ Fetch pharmacy data
  const fetchPharmacyData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/pharmacy/fetchPharmacyData"
      );
      setPharmacyData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  // Fetch laboratory data
  const handleApiError = (err: any) => {
    const code = err?.response?.status;
    if (code === 403) {
      window.location.reload();
      return;
    }
    const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || "An error occurred";
    toast.error(errorMessage);
  };

  //=========== fetch lab data
  const fetchLaboratoryData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/laboratory/fetchLaboratoryData"
      );
      setLabData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  //=========== Update pharmacy order status
  const updatePharmacyOrderStatus = useCallback(
    async (credentials: pharmacyOrderStatus) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/pharmacy/updateOrderStatus",
          credentials
        );
        toast.success(response.data.success);
        fetchPharmacyData();
        fetchLaboratoryData();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPharmacyData, fetchLaboratoryData, user]
  );

  //================ Update laboratory order status
  const updateLaboratoryOrderStatus = useCallback(
    async (credentials: labOrderderStatus) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/laboratory/updateOrderStatus",
          credentials
        );
        toast.success(response.data.success);
        fetchLaboratoryData();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchLaboratoryData, user]
  );

  // Fetch ultrasound data
  const fetchUltrasoundData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/ultrasound/fetchUltrasoundData"
      );
      setUltrasoundData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  //================= Update ultrasound order status
  const updateUltrasoundOrderStatus = useCallback(
    async (credentials: labOrderderStatus) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/ultrasound/updateOrderStatus",
          credentials
        );
        toast.success(response.data.success);
        fetchUltrasoundData();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUltrasoundData, user]
  );

  //================fetch x-ray ==========
  const fetchXrayData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/x-ray/fetchXrayData"
      );
      setXrayData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  //===================== Submit external order
  const submitExternalOrder = useCallback(
    async (credentials: externalOrder) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/external/submitExternalOrder",
          credentials
        );
        toast.success(response.data.success);
        fetchUltrasoundData();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUltrasoundData, user]
  );

  // ======================Fetch external orders
  const fetchExternalOrder = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/external/fetchOrder",
        { timeout: 10000 }
      );
      if (Array.isArray(response.data)) {
        setExternalOrders(response.data);
      } else {
        toast.error("Unexpected response format from server.");
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  //================Order result
  const orderResult = useCallback(
    async (credentials: orderResult) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/external/submitResult",
          credentials
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // =============== add new billing
  const newBilling = useCallback(async (credentials: billingDetails) => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "https://clinicpal.onrender.com/api/cashier/addBill",
        credentials
      );
      toast.success(response.data.success);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ============ fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/cashier/fetchTransactions"
      );
      setTransactions(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  useEffect(() => {
    if (!user) return;
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, [transactions, fetchTransactions, user]); // <-- Add user as dependency

  // ========= fetch a particular patient's payment history
  const fetchPatientPaymentHistory = useCallback(
    async (patientId: string) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `https://clinicpal.onrender.com/api/cashier/fetchPatientPaymentHistory/${patientId}`
        );
        setPatientPaymentHistory(response.data);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  //======== external billing ===============
  const externalBilling = useCallback(
    async (credentials: externalBilling) => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await axios.post(
          "https://clinicpal.onrender.com/api/cashier/externalBilling",
          credentials
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  //================= fetch external billing records =================
  const fetchExternalBilling = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await axios.get(
        "https://clinicpal.onrender.com/api/cashier/fetchExternalBilling"
      );
      setExternalBillingData(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [user]); // <-- Add user as dependency

  // Memoize context value to avoid unnecessary rerenders
  const contextValue = useMemo(
    () => ({
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
      fetchPharmacyData,
      pharmacyData,
      updatePharmacyOrderStatus,
      labData,
      fetchLaboratoryData,
      updateLaboratoryOrderStatus,
      quePatient,
      queList,
      QueActions,
      fetchQueList,
      fetchUltrasoundData,
      ultrasoundData,
      updateUltrasoundOrderStatus,
      submitExternalOrder,
      externalOrder,
      fetchExternalOrder,
      newPatient,
      setNewPatient,
      orderResult,
      newBilling,
      transactions,
      fetchTransactions,
      setPatientReport,
      fetchXrayData,
      xrayData,
      patientPaymentHistory,
      fetchPatientPaymentHistory,
      externalBilling,
      fetchExternalBilling,
      externalBillingData
    }),
    [
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
      fetchPharmacyData,
      pharmacyData,
      updatePharmacyOrderStatus,
      fetchLaboratoryData,
      labData,
      updateLaboratoryOrderStatus,
      quePatient,
      queList,
      QueActions,
      fetchQueList,
      fetchUltrasoundData,
      ultrasoundData,
      updateUltrasoundOrderStatus,
      submitExternalOrder,
      externalOrder,
      fetchExternalOrder,
      newPatient,
      setNewPatient,
      orderResult,
      newBilling,
      transactions,
      fetchTransactions,
      setPatientReport,
      fetchXrayData,
      xrayData,
      patientPaymentHistory,
      fetchPatientPaymentHistory,
      externalBilling,
      fetchExternalBilling,
      externalBillingData
    ]
  );

  return <dashboardContext.Provider value={contextValue}>{children}</dashboardContext.Provider>;
};

export const useDashboard = (): dashboardContextType => {
  const context = useContext(dashboardContext);
  if (!context) throw new Error("useDashboard must be used inside DashboardProvider");
  return context;
};

