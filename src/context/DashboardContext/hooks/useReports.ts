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
  // Replace single loading state with granular loading states
  const [patientReportLoading, setPatientReportLoading] = useState(false);
  const [admittedReportLoading, setAdmittedReportLoading] = useState(false);
  const [newReportLoading, setNewReportLoading] = useState(false);
  const [archivedReport, setArchivedReport] = useState<fetchReport[]>([]);  
  const [patientReport, setPatientReport] = useState<fetchReport[]>([]);
  const [admittedPatientReport, setAdmittedPatientReport] = useState<fetchReport[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const hasFetchedAdmittedReports = useRef(false);

  // Create new report
  const newReport = useCallback(
    async (credentials: report) => {
      if (!token) return;
      
      try {
        setNewReportLoading(true);
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
        setNewReportLoading(false);
      }
    },
    [token]
  );

  // Fetch admitted patient reports
  const fetch_Admitted_Patient_Report = useCallback(async () => {
    if (!token) return;
    
    try {
      setAdmittedReportLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_ADMITTED_REPORTS}`,
        createApiRequest(token)
      );
      setAdmittedPatientReport(response.data);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setAdmittedReportLoading(false);
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
        setPatientReportLoading(true);
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
        setPatientReportLoading(false);
      }
    },
    [token]
  );

  //Archive report
  const archiveReport = useCallback(
    async (patient_id: string) => {
      if (!token) return;

      try {
        setArchiveLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ARCHIVE_REPORT}`,
          { patient_id },
          createApiRequest(token)
        );
        fetchArchivedReports()
        toast.success(response.data.success);
        setArchiveLoading(false);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      }
    },
    [token]
  );

  //unachive report 
  const unarchiveReport = useCallback(
    async (patient_id: string) => {

      if(!token) return;

      try{
        setArchiveLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.UNARCHIVE_REPORT}`, { patient_id},
          createApiRequest(token)
        );
        fetchArchivedReports()
        setArchiveLoading(false);
        toast.success(response.data.success);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      }

    },[token])

  //fetch report
  const fetchArchivedReports = useCallback( async() => {
    if(!token) return;

    try{
      setArchiveLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_ARCHIVED_REPORTS}`,
        createApiRequest(token)
      );
      setArchivedReport(response.data);
      setArchiveLoading(false);
    } catch (err: any) {
      handleApiError(err);
      throw err;
    }
  },[token])

  return {
    // Granular loading states
    patientReportLoading,
    admittedReportLoading,
    newReportLoading,
    archiveLoading,
    // For backward compatibility
    loading: patientReportLoading || admittedReportLoading || newReportLoading || archiveLoading,
    // Data
    patientReport,
    admittedPatientReport,
    archivedReport,
    // Actions
    newReport,
    fetch_Admitted_Patient_Report,
    fetchPatientReport,
    setPatientReport,
    fetchArchivedReports,
    archiveReport,
    unarchiveReport,
  };
};