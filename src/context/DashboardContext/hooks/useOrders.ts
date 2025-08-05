import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { 
  pharmacyData, 
  pharmacyOrderStatus, 
  labOrderderStatus,
  fetchedExterOrder,
  externalOrder,
  orderResult
} from "../types";

/**
 * Hook for managing medical orders (pharmacy, lab, ultrasound, xray)
 */
export const useOrders = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [pharmacyData, setPharmacyData] = useState<pharmacyData[]>([]);
  const [labData, setLabData] = useState<pharmacyData[]>([]);
  const [ultrasoundData, setUltrasoundData] = useState<pharmacyData[]>([]);
  const [xrayData, setXrayData] = useState<pharmacyData[]>([]);
  const [externalOrder, setExternalOrders] = useState<fetchedExterOrder[]>([]);

  // Fetch pharmacy data
  const fetchPharmacyData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_PHARMACY}`,
        createApiRequest(token)
      );
      setPharmacyData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch laboratory data
  const fetchLaboratoryData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_LABORATORY}`,
        createApiRequest(token)
      );
      setLabData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch ultrasound data
  const fetchUltrasoundData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_ULTRASOUND}`,
        createApiRequest(token)
      );
      setUltrasoundData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch X-ray data
  const fetchXrayData = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_XRAY}`,
        createApiRequest(token)
      );
      setXrayData(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update pharmacy order status
  const updatePharmacyOrderStatus = useCallback(
    async (credentials: pharmacyOrderStatus) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.UPDATE_PHARMACY_STATUS}`,
          credentials,
          createApiRequest(token)
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
    [token, fetchPharmacyData, fetchLaboratoryData]
  );

  // Update laboratory order status
  const updateLaboratoryOrderStatus = useCallback(
    async (credentials: labOrderderStatus) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.UPDATE_LABORATORY_STATUS}`,
          credentials,
          createApiRequest(token)
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
    [token, fetchLaboratoryData]
  );

  // Update ultrasound order status
  const updateUltrasoundOrderStatus = useCallback(
    async (credentials: labOrderderStatus) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.UPDATE_ULTRASOUND_STATUS}`,
          credentials,
          createApiRequest(token)
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
    [token, fetchUltrasoundData]
  );

  // Submit external order
  const submitExternalOrder = useCallback(
    async (credentials: externalOrder) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.SUBMIT_EXTERNAL_ORDER}`,
          credentials,
          createApiRequest(token)
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
    [token, fetchUltrasoundData]
  );

  // Fetch external orders
  const fetchExternalOrder = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_EXTERNAL_ORDER}`,
        {
          ...createApiRequest(token),
          timeout: 10000,
        }
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
  }, [token]);

  // Submit order result
  const orderResult = useCallback(
    async (credentials: orderResult) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.SUBMIT_RESULT}`,
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

  return {
    loading,
    pharmacyData,
    labData,
    ultrasoundData,
    xrayData,
    externalOrder,
    fetchPharmacyData,
    fetchLaboratoryData,
    fetchUltrasoundData,
    fetchXrayData,
    updatePharmacyOrderStatus,
    updateLaboratoryOrderStatus,
    updateUltrasoundOrderStatus,
    submitExternalOrder,
    fetchExternalOrder,
    orderResult,
  };
};