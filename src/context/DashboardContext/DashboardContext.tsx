import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { usePatients } from "./hooks/usePatients";
import { useQueue } from "./hooks/useQueue";
import { useReports } from "./hooks/useReports";
import { useAppointments } from "./hooks/useAppointments";
import { useOrders } from "./hooks/useOrders";
import { useTransactions } from "./hooks/useTransactions";
import { useSocketEvents } from "./services/socketService";
import { useInventory } from "./hooks/useInventory";
import type { DashboardContextType } from "./types";

/**
 * Dashboard Context - Orchestrates all dashboard-related state and operations
 * 
 * This context provides a centralized interface for:
 * - User authentication and authorization
 * - Patient management and records
 * - Medical reports and documentation
 * - Appointment scheduling
 * - Medical orders (pharmacy, lab, imaging)
 * - Patient queue management
 * - Billing and transaction processing
 * - Real-time updates via WebSocket
 * - Inventory management
 */

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize all domain-specific hooks
  const auth = useAuth();
  const patients = usePatients(auth.token);
  const queue = useQueue(auth.token);
  const reports = useReports(auth.token);
  const appointments = useAppointments(auth.token);
  const orders = useOrders(auth.token);
  const transactions = useTransactions(auth.token, auth.role);
  
  // Get user data and token from your auth context or storage
  const [userRole, setUserRole] = useState<string>("");
  const [token, setToken] = useState<string>("");
  
  // Initialize user data
  useEffect(() => {
    // Get user data from localStorage or another source
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userToken = userData.token || '';
    const role = userData.role || '';
    
    setToken(userToken);
    setUserRole(role);
  }, []);
  
  // Pass role directly to useInventory instead of relying on context
  const inventoryData = useInventory(token, userRole);

  // Set up real-time socket events
  useSocketEvents(
    patients.setPatientsData,
    patients.setNextOfKinData,
    queue.setQueList
  );

  // Compose the context value from all hooks
  const contextValue = useMemo(
    (): DashboardContextType => ({
      // Authentication
      token: auth.token,
      role: userRole,
      
      // Global loading state (combine loading states if needed)
      loading: patients.loading || queue.loading || reports.loading || 
               appointments.loading || orders.loading || inventoryData.loading,
               
      // Granular loading states for transactions
      billingLoading: transactions.billingLoading,
      transactionsLoading: transactions.transactionsLoading,
      patientHistoryLoading: transactions.patientHistoryLoading,
      externalBillingLoading: transactions.externalBillingLoading,
      
      // Granular loading states for reports
      patientReportLoading: reports.patientReportLoading,
      admittedReportLoading: reports.admittedReportLoading,
      newReportLoading: reports.newReportLoading,
      archiveLoading: reports.archiveLoading,

      // Patient Management
      patientsData: patients.patientsData,
      nextOfKinData: patients.nextOfKinData,
      newPatient: patients.newPatient,
      addNewPatient: patients.addNewPatient,
      fetchAllPatients: patients.fetchAllPatients,
      admitPatient: patients.admitPatient,
      dischargePatient: patients.dischargePatient,
      quePatient: patients.quePatient,
      setNewPatient: patients.setNewPatient,

      // Medical Reports
      patientReport: reports.patientReport,
      admittedPatientReport: reports.admittedPatientReport,
      newReport: reports.newReport,
      fetchPatientReport: reports.fetchPatientReport,
      fetch_Admitted_Patient_Report: reports.fetch_Admitted_Patient_Report,
      setPatientReport: reports.setPatientReport,
      archivedReport: reports.archivedReport,
      fetchArchivedReports: reports.fetchArchivedReports,
      archiveReport: reports.archiveReport,
      unarchiveReport: reports.unarchiveReport,

      // Appointments
      appointments: appointments.appointments,
      addAppointment: appointments.addAppointment,
      fetchAppointment: appointments.fetchAppointment,

      // Medical Orders
      pharmacyData: orders.pharmacyData,
      labData: orders.labData,
      ultrasoundData: orders.ultrasoundData,
      xrayData: orders.xrayData,
      externalOrder: orders.externalOrder,
      fetchPharmacyData: orders.fetchPharmacyData,
      fetchLaboratoryData: orders.fetchLaboratoryData,
      fetchUltrasoundData: orders.fetchUltrasoundData,
      fetchXrayData: orders.fetchXrayData,
      fetchExternalOrder: orders.fetchExternalOrder,
      updatePharmacyOrderStatus: orders.updatePharmacyOrderStatus,
      updateLaboratoryOrderStatus: orders.updateLaboratoryOrderStatus,
      updateUltrasoundOrderStatus: orders.updateUltrasoundOrderStatus,
      submitExternalOrder: orders.submitExternalOrder,
      orderResult: orders.orderResult,

      // Queue Management
      queList: queue.queList,
      QueActions: queue.QueActions,
      fetchQueList: queue.fetchQueList,

      // Billing & Transactions
      transactions: transactions.transactions,
      patientPaymentHistory: transactions.patientPaymentHistory,
      externalBillingData: transactions.externalBillingData,
      newBilling: transactions.newBilling,
      fetchTransactions: transactions.fetchTransactions,
      fetchPatientPaymentHistory: transactions.fetchPatientPaymentHistory,
      setPatientPaymentHistory: transactions.setPatientPaymentHistory,
      externalBilling: transactions.externalBilling,
      fetchExternalBilling: transactions.fetchExternalBilling,
      updatePaymentStatus: transactions.updatePaymentStatus,

      // Inventory Management
      inventory: inventoryData.inventory,
      inventoryLoading: inventoryData.loading,
      inventoryError: inventoryData.error,
      transactionHistory: inventoryData.transactionHistory,
      transactionLoading: inventoryData.transactionLoading,
      transactionError: inventoryData.transactionError,
      fetchInventory: inventoryData.fetchInventory,
      fetchInventoryItem: inventoryData.fetchInventoryItem,
      fetchInventoryCategories: inventoryData.fetchInventoryCategories,
      fetchTransactionHistory: inventoryData.fetchTransactionHistory,
      addInventoryItem: inventoryData.addInventoryItem,
      updateInventoryItem: inventoryData.updateInventoryItem,
      updateInventoryItemStatus: inventoryData.updateInventoryItemStatus,
      deleteInventoryItem: inventoryData.deleteInventoryItem,
      processSale: inventoryData.processSale,
      processRestock: inventoryData.processRestock,
      getStockStatus: inventoryData.getStockStatus,
    }),
    [auth, patients, queue, reports, appointments, orders, transactions, inventoryData, userRole]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Hook to access the Dashboard context
 * Must be used within a DashboardProvider
 */
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

