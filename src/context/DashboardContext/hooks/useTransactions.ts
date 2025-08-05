import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { 
  Transaction, 
  billingDetails, 
  externalBilling, 
  externalBillingData,
  updatePaymentStatus
} from "../types";

/**
 * Hook for managing billing and transaction operations
 */
export const useTransactions = (token: string | null, role: string | null) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [patientPaymentHistory, setPatientPaymentHistory] = useState<Transaction[]>([]);
  const [externalBillingData, setExternalBillingData] = useState<externalBillingData[]>([]);

  // Add new billing
  const newBilling = useCallback(
    async (credentials: billingDetails) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ADD_BILL}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (role !== "cashier" && role !== "super admin") return;
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_TRANSACTIONS}`,
        createApiRequest(token)
      );
      setTransactions(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  // Auto-fetch transactions for authorized roles
  useEffect(() => {
    if (!token || transactions.length > 0) return;
    fetchTransactions();
  }, [token, transactions.length, fetchTransactions]);

  // Fetch patient payment history
  const fetchPatientPaymentHistory = useCallback(
    async (patientId: string) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.FETCH_PATIENT_PAYMENT_HISTORY}/${patientId}`,
          createApiRequest(token)
        );
        setPatientPaymentHistory(response.data);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // External billing
  const externalBilling = useCallback(
    async (credentials: externalBilling) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.EXTERNAL_BILLING}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch external billing records
  const fetchExternalBilling = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_EXTERNAL_BILLING}`,
        createApiRequest(token)
      );
      setExternalBillingData(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update payment status
  const updatePaymentStatus = useCallback( async (credentials: updatePaymentStatus) => {
    if (!token) return;

    try{
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.PAYMENT_ACTIONS}`,
        { credentials },
        createApiRequest(token)
      );
      toast.success(response.data.success);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    transactions,
    patientPaymentHistory,
    externalBillingData,
    newBilling,
    fetchTransactions,
    fetchPatientPaymentHistory,
    externalBilling,
    fetchExternalBilling,
    updatePaymentStatus,
  };
};