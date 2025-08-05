import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { report, fetchReport, discharge } from "../types";

/**
 * Hook for managing medical reports and patient records
 */
export const useReports = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [patientReport, setPatientReport] = useState<fetchReport[]>([]);
  const [admittedPatientReport, setAdmittedPatientReport] = useState<fetchReport[]>([]);
  
  const hasFetchedAdmittedReports = useRef(false);

  // Create new report
  const newReport = useCallback(
    async (credentials: report) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.NEW_REPORT}`,
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

  // Fetch admitted patient reports
  const fetch_Admitted_Patient_Report = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_ADMITTED_REPORTS}`,
        createApiRequest(token)
      );
      setAdmittedPatientReport(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch admitted reports on token change (only once)
  useEffect(() => {
    if (!token || hasFetchedAdmittedReports.current) return;
    fetch_Admitted_Patient_Report();
    hasFetchedAdmittedReports.current = true;
  }, [fetch_Admitted_Patient_Report, token]);

  // Fetch specific patient report
  const fetchPatientReport = useCallback(
    async (credentials: discharge) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.FETCH_PATIENT_REPORT}`,
          credentials,
          createApiRequest(token)
        );
        setPatientReport(response.data);
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
    patientReport,
    admittedPatientReport,
    newReport,
    fetch_Admitted_Patient_Report,
    fetchPatientReport,
    setPatientReport,
  };
};