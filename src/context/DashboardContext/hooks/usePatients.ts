import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { clinipalDB } from "../../../db/clinipal-db"; // Adjust path to your IndexedDB
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { PatientsData, nextOfKinData, newPatientData, newPatient, admission, discharge } from "../types";
import { addToSyncQueue } from "../../../db/syncQueue";
import { SyncEntityType } from "../../../db/syncModels";
import { addPatientToQueueLocally } from "../../../db/patientHelpers";

/**
 * Hook for managing patient-related operations
 */
export const usePatients = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [patientsData, setPatientsData] = useState<PatientsData[]>([]);
  const [nextOfKinData, setNextOfKinData] = useState<nextOfKinData[]>([]);
  const [newPatient, setNewPatient] = useState<newPatient[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const hasFetchedPatients = useRef(false);

  // Fetch all patients
  const fetchAllPatients = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.FETCH_PATIENTS}`,
        createApiRequest(token)
      );
      
      setPatientsData(response.data.patients);
      setNextOfKinData(response.data.next_of_kin);

      // Save to Dexie for offline use
      if (response.data.patients?.length) {
        try {
          await clinipalDB.patientsData.clear();
          await clinipalDB.patientsData.bulkAdd(response.data.patients);
        } catch (dbError) {
          console.warn("Failed to cache patients data:", dbError);
          // Non-critical error, continue execution
        }
      }
      
      if (response.data.next_of_kin?.length) {
        try {
          await clinipalDB.nextOfKin.clear();
          await clinipalDB.nextOfKin.bulkAdd(response.data.next_of_kin);
        } catch (dbError) {
          console.warn("Failed to cache next of kin data:", dbError);
          // Non-critical error, continue execution
        }
      }
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch patients on token change (only once)
  useEffect(() => {
    if (!token || hasFetchedPatients.current) return;
    fetchAllPatients();
    hasFetchedPatients.current = true;
  }, [fetchAllPatients, token]);

  // Add new patient
  const addNewPatient = useCallback(
    async (credentials: newPatientData) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ADD_PATIENT}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
        setNewPatient(response.data.newPatient);
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Admit patient
  const admitPatient = useCallback(
    async (credentials: admission) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.ADMIT_PATIENT}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
        fetchAllPatients();
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.response?.data?.error;
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, token]
  );

  // Discharge patient
  const dischargePatient = useCallback(
    async (credentials: discharge) => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.DISCHARGE_PATIENT}`,
          credentials,
          createApiRequest(token)
        );
        toast.success(response.data.success);
        fetchAllPatients();
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, token]
  );

  // Queue patient
  const quePatient = useCallback(
    async (credentials: admission) => {
      try {
        setLoading(true);
        
        if (isOnline && token) {
          // Online mode: send to API
          const response = await axios.post(
            `${API_BASE_URL}${API_ENDPOINTS.QUE_PATIENT}`,
            credentials,
            createApiRequest(token)
          );
          toast.success(response.data.success);
          // Note: Socket will handle queue list updates
          fetchAllPatients();
        } else {
          // Offline mode: store in local DB and queue for sync
          try {
            // First get patient details
            const patient = await clinipalDB.patientsData.filter(
              (p: any) => p.patient_id === credentials.patient_id
            ).first();
            
            if (!patient) {
              toast.error("Patient not found in local database");
              throw new Error("Patient not found in local database");
            }
            
            // Use the new helper function to add to queue
            await addPatientToQueueLocally(
              credentials.patient_id,
              patient.full_name,
              credentials.reason,
              credentials.wrote_by
            );
            
            // Add to sync queue
            await addToSyncQueue({
              url: `${API_BASE_URL}${API_ENDPOINTS.QUE_PATIENT}`,
              method: 'POST',
              body: credentials,
              endpoint: 'queue',
              priority: 5,
              entityType: SyncEntityType.QUEUE,
              entityId: credentials.patient_id,
              tempId: `queue_${credentials.patient_id}_${Date.now()}`
            });
            
            fetchAllPatients();
          } catch (error) {
            console.error("Error adding to queue in local DB:", error);
            toast.error("Failed to add to queue offline");
            throw error;
          }
        }
      } catch (err: any) {
        handleApiError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAllPatients, token, isOnline]
  );

  return {
    // State
    loading,
    patientsData,
    nextOfKinData,
    newPatient,
    
    // Actions
    fetchAllPatients,
    addNewPatient,
    admitPatient,
    dischargePatient,
    quePatient,
    setNewPatient,
    
    // For socket updates
    setPatientsData,
    setNextOfKinData,
  };
};