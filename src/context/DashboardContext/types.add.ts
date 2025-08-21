// Add granular loading states to the types.ts file
// These should be added to the DashboardContextType interface

// Example addition:
export interface DashboardContextType {
  // existing properties...

  // Granular loading states
  billingLoading: boolean;
  transactionsLoading: boolean;
  patientHistoryLoading: boolean;
  externalBillingLoading: boolean;

  // existing properties continue...
}
