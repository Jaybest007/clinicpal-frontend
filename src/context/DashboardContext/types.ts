import type { Dispatch, SetStateAction } from "react";

// ==================== PATIENT INTERFACES ====================
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

export interface nextOfKinData {
  id: number;
  full_name: string;
  address: string;
  phone: string;
  relationship: string;
  patient_id: string;
}

export interface newPatient {
  full_name: string;
  address: string;
  patient_id: string;
  phone: string;
}

// ==================== MEDICAL INTERFACES ====================
export interface report {
  patient_id: string;
  report: string;
  wrote_by: string;
  order_to_pharmacy: boolean;
  order_to_lab: boolean;
  ultrasound_order: boolean;
  xray_order: boolean;
}

export interface fetchReport {
  id: number;
  patient_id: string;
  full_name: string;
  report: string;
  wrote_by: string;
  created_at: string;
  admission_status: boolean;
}

export interface admission {
  patient_id: string;
  reason: string;
  wrote_by: string;
}

export interface discharge {
  patient_id: string;
}

// ==================== APPOINTMENT INTERFACES ====================
export interface appointment {
  patient_id: string;
  doctor_name: string;
  time: string;
  notes: string;
}

export interface fetchedAppointment {
  patient_id: string;
  patient_name: string;
  doctor_name: string;
  time: string;
  status: string;
  notes: string;
  created_at: string;
}

// ==================== ORDER INTERFACES ====================
export interface pharmacyData {
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

export interface pharmacyOrderStatus {
  id: any;
  status: string;
  updated_at: string;
}

export interface labOrderderStatus {
  id: string;
  status: string;
  updated_at: string;
}

export interface externalOrder {
  full_name: string;
  age: string;
  order_type: "lab" | "xray" | "ultrasound" | "motuary";
  order_data: string;
  sent_by: string;
}

export interface fetchedExterOrder {
  id: string;
  name: string;
  age: number;
  order_type: string;
  order_data: string;
  hospital: string;
  created_on: string;
}

export interface orderResult {
  id: string;
  wrote_by: string;
  patient_id: string;
  orderResults: string;
}

// ==================== QUEUE INTERFACES ====================
export interface QueList {
  id: number;
  patient_id: number;
  patient_fullname: string;
  visit_reason: string;
  assigned_doctor: string;
  checked_in_at: string;
  status: string;
  qued_by: string;
}

export interface QueActions {
  patient_id: any;
  action: string;
  performed_by: any;
}

// ==================== BILLING INTERFACES ====================
export interface Transaction {
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

export interface billingDetails {
  payers_name: string;
  patient_id: string;
  department: string;
  service: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  notes: string;
}

export interface externalBilling {
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

// ==================== CONTEXT TYPE ====================
export interface DashboardContextType {
  // Auth
  token: string | null;
  role: string | null;
  loading: boolean;

  // Patients
  patientsData: PatientsData[];
  nextOfKinData: nextOfKinData[];
  newPatient: newPatient[];
  addNewPatient: (credentials: newPatientData) => Promise<void>;
  fetchAllPatients: () => Promise<void>;
  admitPatient: (credentials: admission) => Promise<void>;
  dischargePatient: (credentials: discharge) => Promise<void>;
  quePatient: (credentials: admission) => Promise<void>;
  setNewPatient: Dispatch<SetStateAction<newPatient[]>>;

  // Reports
  patientReport: fetchReport[];
  admittedPatientReport: fetchReport[];
  newReport: (credentials: report) => Promise<void>;
  fetchPatientReport: (credentials: discharge) => Promise<void>;
  fetch_Admitted_Patient_Report: () => Promise<void>;
  setPatientReport: Dispatch<SetStateAction<fetchReport[]>>;

  // Appointments
  appointments: fetchedAppointment[];
  addAppointment: (credentials: appointment) => Promise<void>;
  fetchAppointment: () => Promise<void>;

  // Orders
  pharmacyData: pharmacyData[];
  labData: pharmacyData[];
  ultrasoundData: pharmacyData[];
  xrayData: pharmacyData[];
  externalOrder: fetchedExterOrder[];
  fetchPharmacyData: () => Promise<void>;
  fetchLaboratoryData: () => Promise<void>;
  fetchUltrasoundData: () => Promise<void>;
  fetchXrayData: () => Promise<void>;
  fetchExternalOrder: () => Promise<void>;
  updatePharmacyOrderStatus: (credentials: pharmacyOrderStatus) => Promise<void>;
  updateLaboratoryOrderStatus: (credentials: labOrderderStatus) => Promise<void>;
  updateUltrasoundOrderStatus: (credentials: labOrderderStatus) => Promise<void>;
  submitExternalOrder: (credentials: externalOrder) => Promise<void>;
  orderResult: (credentials: orderResult) => Promise<void>;

  // Queue
  queList: QueList[];
  QueActions: (credentials: QueActions) => Promise<void>;
  fetchQueList: () => Promise<void>;

  // Transactions
  transactions: Transaction[];
  patientPaymentHistory: Transaction[];
  externalBillingData: externalBillingData[];
  newBilling: (credentials: billingDetails) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchPatientPaymentHistory: (patient_id: string) => Promise<void>;
  externalBilling: (credentials: externalBilling) => Promise<void>;
  fetchExternalBilling: () => Promise<void>;
}