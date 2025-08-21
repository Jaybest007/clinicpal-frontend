import { toast } from "react-toastify";
import { clinipalDB } from "./clinipal-db";
import type { QueueItem } from "./clinipal-db";
import type { newPatientData } from "../context/DashboardContext";
import type { QueList } from "../context/DashboardContext/types";

/**
 * Add a new patient to the local Dexie DB for later sync.
 * This only adds to the local 'patients' table (not patientsData or nextOfKin).
 */
export const addPatientToLocalDB = async (patient: newPatientData) => {
  try {
    await clinipalDB.patients.add({
      ...patient,
      created_at: new Date().toISOString(),
    } as newPatientData & { created_at: string });
    toast.success("Patient saved locally");
  } catch (error) {
    console.error("Error adding patient to local DB:", error);
    toast.error("Failed to save patient locally");
  }
};

/**
 * Sync all locally saved patients to the backend and remove them from the local queue after successful sync.
 * Pass addNewPatient and fetchAllPatients from your component/context.
 */
export const syncLocalPatientsToBackend = async (
  addNewPatient: (patient: newPatientData) => Promise<any>,
  fetchAllPatients: () => void
) => {
  const localPatients = await clinipalDB.patients.toArray();
  if (localPatients.length === 0) return;

  for (const patient of localPatients) {
    try {
      await addNewPatient(patient);
      fetchAllPatients();
      await clinipalDB.patients.delete((patient as any).id);
    } catch (error) {
      console.error("Sync failed for patient:", patient, error);
    }
  }
  toast.success("All locally saved patients synced");
};


export const fetchAllPatients = async () => {
  try {
    const patients = await clinipalDB.patientsData.toArray();
    return patients;
  } catch (error) {
    console.error("Error fetching all patients:", error);
    toast.error("Failed to fetch patients");
    return [];
  }
}

/**
 * Add a patient to the queue locally (for offline use)
 * Also updates patient's visit information
 */
export const addPatientToQueueLocally = async (
  patientId: string,
  patientName: string,
  visitReason: string,
  queuededBy: string
): Promise<void> => {
  try {
    // Create unique ID for queue entry
    const queueId = `queue_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create queue item
    const queueItem: QueueItem = {
      id: queueId,
      patient_id: patientId,
      patient_fullname: patientName,
      visit_reason: visitReason,
      assigned_doctor: "",
      checked_in_at: new Date().toISOString(),
      status: 'waiting',
      qued_by: queuededBy,
      updated_at: new Date().toISOString(),
      updated_by: queuededBy,
      _syncStatus: 'pending',
      _syncTimestamp: Date.now()
    };
    
    // Add to queue table
    await clinipalDB.queue.add(queueItem);
    
    // Update patient's visit information
    const patient = await clinipalDB.patientsData
      .filter(p => p.patient_id === patientId)
      .first();
      
    if (patient) {
      await clinipalDB.patientsData.update(patient.id, {
        visit_on: new Date().toISOString(),
        visit_reason: visitReason,
        _syncStatus: 'pending',
        _syncTimestamp: Date.now()
      });
    }
    
    toast.success("Patient added to queue successfully (offline)");
  } catch (error) {
    console.error("Error adding patient to queue locally:", error);
    toast.error("Failed to add patient to queue");
    throw error;
  }
};

/**
 * Fetch queue list from local IndexedDB for offline use
 * Returns queue data in the same format as the API for seamless integration
 */
export const fetchLocalQueueList = async (): Promise<QueList[]> => {
  try {
    // Try to get data from queue table first
    const queueItems = await clinipalDB.queue
      .filter(item => !item._deleted)
      .toArray();
    
    if (queueItems.length > 0) {
      // Convert local data to API format for consistency
      const apiFormattedData: QueList[] = queueItems.map(item => {
        // Handle legacy field names as fallback
        // @ts-ignore - Check for old property names
        const patientId = item.patient_id || item.patientId;
        // @ts-ignore
        const patientName = item.patient_fullname || item.patientName;
        // @ts-ignore
        const visitReason = item.visit_reason || item.visitReason || item.notes || "General checkup";
        // @ts-ignore
        const assignedDoctor = item.assigned_doctor || item.assignedDoctor || "";
        // @ts-ignore
        const checkedInAt = item.checked_in_at || item.checkedInAt;
        // @ts-ignore
        const quedBy = item.qued_by || item.queuededBy || "";
        
        return {
          id: item.id,
          patient_id: patientId, // Keep as string to match database schema
          patient_fullname: patientName,
          visit_reason: visitReason,
          assigned_doctor: assignedDoctor,
          checked_in_at: checkedInAt,
          status: mapLocalStatusToApi(item.status),
          qued_by: quedBy
        };
      });
      
      console.log("Using offline queue data:", apiFormattedData.length, "items");
      return apiFormattedData;
    }
    
    // Fallback: Create queue from patient data if queue table is empty
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentPatients = await clinipalDB.patientsData
      .filter(patient => {
        if (!patient.visit_on) return false;
        const visitDate = new Date(patient.visit_on);
        return visitDate >= oneDayAgo && 
               !patient.admission_status && // Not admitted
               !patient.discharged_on; // Not discharged
      })
      .toArray();
    
    // Transform to QueList format
    const queueList: QueList[] = recentPatients.map(patient => ({
      id: String(patient.id),
      patient_id: patient.patient_id, // Keep as string
      patient_fullname: patient.full_name,
      visit_reason: patient.visit_reason || "General checkup",
      assigned_doctor: "",
      checked_in_at: patient.visit_on,
      status: "waiting", // Default status
      qued_by: ""
    }));
    
    console.log("Using generated queue data from patients:", queueList.length, "items");
    return queueList;
  } catch (error) {
    console.error("Error fetching queue from local DB:", error);
    toast.error("Failed to fetch queue data offline");
    return [];
  }
}

/**
 * Maps local queue status to API status format
 */
const mapLocalStatusToApi = (status: 'waiting' | 'called' | 'seen' | 'removed'): string => {
  switch (status) {
    case 'waiting': return 'waiting';
    case 'called': return 'called';
    case 'seen': return 'seen';
    case 'removed': return 'removed';
    default: return 'waiting';
  }
};

/**
 * Perform queue actions locally (for offline use)
 * @param patientId The patient ID
 * @param action The action to perform: "remove", "called", or "seen"
 * @param performedBy The user who performed the action
 */
export const performQueueActionLocally = async (
  patientId: string,
  action: "remove" | "called" | "seen",
  performedBy: string
): Promise<void> => {
  try {
    // Find the queue item for this patient
    const queueItem = await clinipalDB.queue
      .filter(item => {
        return item.patient_id === patientId && !item._deleted;
      })
      .first();
      
    if (!queueItem) {
      toast.error("Patient not found in queue");
      return;
    }
    
    switch (action) {
      case "remove":
        // Mark as deleted rather than actually deleting
        await clinipalDB.queue.update(queueItem.id, {
          _deleted: true,
          _deletedAt: new Date().toISOString(),
          _syncStatus: 'pending',
          _syncTimestamp: Date.now()
        });
        toast.success("Patient removed from queue (offline)");
        break;
        
      case "called":
        await clinipalDB.queue.update(queueItem.id, {
          status: 'called',
          assigned_doctor: performedBy,
          updated_at: new Date().toISOString(),
          _syncStatus: 'pending',
          _syncTimestamp: Date.now()
        });
        toast.success("Patient called (offline)");
        break;
        
      case "seen":
        await clinipalDB.queue.update(queueItem.id, {
          status: 'seen',
          updated_at: new Date().toISOString(),
          _syncStatus: 'pending',
          _syncTimestamp: Date.now()
        });
        toast.success("Patient marked as seen (offline)");
        break;
    }
  } catch (error) {
    console.error(`Error performing queue action (${action}):`, error);
    toast.error(`Failed to perform action: ${action}`);
    throw error;
  }
};



export const syncLocalQueToBackend = async () => {
  
}