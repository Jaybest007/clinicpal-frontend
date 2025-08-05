import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { QueList, QueActions } from "../types";

/**
 * Hook for managing patient queue operations
 */
export const useQueue = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [queList, setQueList] = useState<QueList[]>([]);
  
  const hasFetchedQueue = useRef(false);

  // Fetch queue list
  const fetchQueList = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_QUEUE}`,
        createApiRequest(token)
      );
      setQueList(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch queue on token change (only once)
  useEffect(() => {
    if (!token || hasFetchedQueue.current) return;
    fetchQueList();
    hasFetchedQueue.current = true;
  }, [token, fetchQueList]);

  // Queue actions (call, seen, remove)
  const QueActions = useCallback(
    async (credentials: QueActions) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.QUE_ACTIONS}`,
          credentials,
          createApiRequest(token)
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
    [token, fetchQueList]
  );

  return {
    loading,
    queList,
    fetchQueList,
    QueActions,
    
    // For socket updates
    setQueList,
  };
};