import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { appointment, fetchedAppointment } from "../types";

/**
 * Hook for managing appointment scheduling
 */
export const useAppointments = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<fetchedAppointment[]>([]);
  
  const hasFetchedAppointments = useRef(false);

  // Add new appointment
  const addAppointment = useCallback(
    async (credentials: appointment) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ADD_APPOINTMENT}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch appointments
  const fetchAppointment = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_APPOINTMENTS}`,
        createApiRequest(token)
      );
      setAppointments(response.data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch appointments on token change (only once)
  useEffect(() => {
    if (!token || hasFetchedAppointments.current) return;
    fetchAppointment();
    hasFetchedAppointments.current = true;
  }, [fetchAppointment, token]);

  return {
    loading,
    appointments,
    addAppointment,
    fetchAppointment,
  };
};