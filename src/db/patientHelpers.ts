import { toast } from "react-toastify";
import { clinipalDB } from "./clinipal-db";
import type { newPatientData } from "../context/DashboardContext";

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