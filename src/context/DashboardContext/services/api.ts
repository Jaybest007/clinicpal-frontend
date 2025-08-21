
// Base API configuration
export const API_BASE_URL = "https://clinicpal.onrender.com/api";

/**
 * Create axios instance with default config
 */
export const createApiRequest = (token: string | null) => {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  // Patients
  FETCH_PATIENTS: "/patients/fetchPatients",
  ADD_PATIENT: "/patients/addPatient",
  ADMIT_PATIENT: "/patients/admitPatient",
  DISCHARGE_PATIENT: "/patients/dischargePatient",
  QUE_PATIENT: "/patients/quePatient",
  FETCH_QUEUE: "/patients/fetchQueue",
  QUE_ACTIONS: "/patients/queActions",

  // Reports
  NEW_REPORT: "/reports/newReport",
  FETCH_ADMITTED_REPORTS: "/reports/fetch_admitted_patient_reports",
  FETCH_PATIENT_REPORT: "/reports/fetchPatientReport",
  FETCH_ARCHIVED_REPORTS: "/reports/fetchArchivedReports",
  ARCHIVE_REPORT: "/reports/archiveReport",
  UNARCHIVE_REPORT: "/reports/unarchiveReport",

  // Appointments
  ADD_APPOINTMENT: "/appointments/addAppointment",
  FETCH_APPOINTMENTS: "/appointments/fetchAppointments",

  // Orders
  FETCH_PHARMACY: "/pharmacy/fetchPharmacyData",
  UPDATE_PHARMACY_STATUS: "/pharmacy/updateOrderStatus",
  FETCH_LABORATORY: "/laboratory/fetchLaboratoryData",
  UPDATE_LABORATORY_STATUS: "/laboratory/updateOrderStatus",
  FETCH_ULTRASOUND: "/ultrasound/fetchUltrasoundData",
  UPDATE_ULTRASOUND_STATUS: "/ultrasound/updateOrderStatus",
  FETCH_XRAY: "/x-ray/fetchXrayData",
  SUBMIT_EXTERNAL_ORDER: "/external/submitExternalOrder",
  FETCH_EXTERNAL_ORDER: "/external/fetchOrder",
  SUBMIT_RESULT: "/external/submitResult",

  // Billing
  ADD_BILL: "/cashier/addBill",
  FETCH_TRANSACTIONS: "/cashier/fetchTransactions",
  FETCH_PATIENT_PAYMENT_HISTORY: "/cashier/fetchPatientPaymentHistory",
  EXTERNAL_BILLING: "/cashier/externalBilling",
  FETCH_EXTERNAL_BILLING: "/cashier/fetchExternalBilling",
  PAYMENT_ACTIONS: "/cashier/paymentActions",

  //Inventory
  ADD_INVENTORY_ITEM: "/inventory/addInventoryItem",
  FETCH_INVENTORY: "/inventory/fetchInventory",
  UPDATE_INVENTORY_ITEM: "/inventory/updateInventoryItem",
  DELETE_INVENTORY_ITEM: "/inventory/deleteInventoryItem",
  FETCH_INVENTORY_CATEGORIES: "/inventory/fetchInventoryCategories",
  FETCH_INVENTORY_ITEM: "/inventory/fetchInventoryItem",
  UPDATE_INVENTORY_ITEM_STATUS: "/inventory/updateInventoryItemStatus",
} as const; 