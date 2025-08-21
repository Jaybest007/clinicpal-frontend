import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from "../services/api";
import type { QueList, QueActions } from "../types";
import { clinipalDB } from "../../../db/clinipal-db";

/**
 * Hook for managing patient queue operations
 */
export const useQueue = (token: string | null) => {
  const [loading, setLoading] = useState(false);
  const [queList, setQueList] = useState<QueList[]>([]);
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

  // Fetch queue list
  const fetchQueList = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      
      if (isOnline) {
        // Online: fetch from API and save to local DB
        const response = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.FETCH_QUEUE}`,
          createApiRequest(token)
        );
        
        // Store in IndexedDB for offline use
        try {
          await clinipalDB.transaction('rw', clinipalDB.queue, async () => {
            // Clear existing queue data that's not pending sync
            await clinipalDB.queue
              .filter((item: any) => !item._syncStatus || item._syncStatus === 'synced')
              .delete();
            
            // Add all items from API
            for (const item of response.data) {
              const queueItem = {
                id: item.id.toString(),
                patient_id: item.patient_id.toString(),
                patient_fullname: item.patient_fullname,
                visit_reason: item.visit_reason || '',
                assigned_doctor: item.assigned_doctor || '',
                checked_in_at: item.checked_in_at,
                status: mapApiStatusToLocal(item.status),
                qued_by: item.qued_by || '',
                updated_at: new Date().toISOString(),
                updated_by: 'system',
                _syncStatus: 'synced',
                _syncTimestamp: Date.now()
              };
              
              await clinipalDB.queue.put(queueItem);
            }
            
            console.log("Saved", response.data.length, "queue items to local DB");
          });
        } catch (dbError) {
          console.error("Error saving queue to local DB:", dbError);
          // Continue anyway, as this is just for offline caching
        }
        
        setQueList(response.data);
      } else {
        // Offline: get from local DB
        try {
          const localData = await clinipalDB.queue
            .filter((item: any) => !item._deleted)
            .toArray();
          
          // Convert local data to API format
          const apiFormattedData = localData.map(item => ({
            id: item.id,
            patient_id: item.patient_id,
            patient_fullname: item.patient_fullname,
            visit_reason: item.visit_reason || '',
            assigned_doctor: item.assigned_doctor || '',
            checked_in_at: item.checked_in_at,
            status: mapLocalStatusToApi(item.status),
            qued_by: item.qued_by || ''
          }));
          
          setQueList(apiFormattedData);
          console.log("Using offline queue data:", apiFormattedData.length, "items");
        } catch (error) {
          console.error("Error fetching from local DB:", error);
          setQueList([]);
        }
      }
    } catch (err: any) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, isOnline]);
  
  // Helper functions for status mapping
  const mapApiStatusToLocal = (status: string): 'waiting' | 'called' | 'seen' | 'removed' => {
    switch (status) {
      case 'waiting': return 'waiting';
      case 'called': return 'called';
      case 'seen': return 'seen';
      case 'removed': return 'removed';
      default: return 'waiting';
    }
  };
  
  const mapLocalStatusToApi = (status: 'waiting' | 'called' | 'seen' | 'removed'): string => {
    return status; // Same values in this case
  };

  // Auto-fetch queue on token change (only once)
  useEffect(() => {
    if (!token) return;
    fetchQueList();
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
    isOnline,
    
    // For socket updates
    setQueList,
  };
};