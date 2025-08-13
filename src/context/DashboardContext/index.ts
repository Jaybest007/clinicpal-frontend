/**
 * Main export file for Dashboard Context
 * 
 * This provides a clean interface for consuming the dashboard functionality
 * throughout your application.
 */

// Main context exports
export { DashboardProvider, useDashboard } from "./DashboardContext";

// Type exports for consumers
export type {
  DashboardContextType,
  PatientsData,
  newPatientData,
  nextOfKinData,
  report,
  fetchReport,
  admission,
  discharge,
  appointment,
  fetchedAppointment,
  pharmacyData,
  pharmacyOrderStatus,
  labOrderderStatus,
  QueList,
  QueActions,
  Transaction,
  billingDetails,
  externalBilling,
  externalBillingData,
  externalOrder,
  fetchedExterOrder,
  orderResult,
  newPatient,
  // Inventory types
  InventoryItem,
  NewInventoryItem,
  InventoryTransaction,
  InventoryTransactionItem,
  RestockItem,
  SaleData,
  TransactionFilters
} from "./types";

// Utility exports
export { handleApiError } from "./utils/errorHandler";
export { getUserFromStorage, getTokenFromStorage, getRoleFromStorage } from "./utils/storage";
export { API_BASE_URL, API_ENDPOINTS } from "./services/api";