import Dexie from "dexie";
import type { Table } from "dexie";
import type { newPatientData, PatientsData, nextOfKinData, report } from "../context/DashboardContext";

/**
 * Dexie schema for ClinicPal offline storage.
 * - `patients`: Raw patient registration info (for syncing with backend).
 * - `patientsData`: Main patient records (as fetched from backend, for UI).
 * - `nextOfKin`: Next of kin records (as fetched from backend, for UI).
 * - `reports`: Patient reports.
 *
 * Always use unique keys (e.g., patient_id) to avoid sync conflicts.
 */
class ClinicPalDB extends Dexie {
  patients!: Table<newPatientData, number>;      // Local-only, for new patient registration (sync to backend)
  patientsData!: Table<PatientsData, number>;    // Fetched from backend, main patient table
  nextOfKin!: Table<nextOfKinData, number>;      // Fetched from backend, next of kin table
  reports!: Table<report, number>;

  constructor() {
    super("ClinicPalDB");
    this.version(1).stores({
      // Local new patient registration (before sync)
      patients: "++id, full_name, address, age, phone, nok_full_name, nok_address, nok_phone, nok_relationship, done_by",

      // Main patient table (as fetched from backend)
      patientsData: "++id, patient_id, full_name, address, age, phone, gender, admission_status, admission_reason, visit_on, visit_reason, discharged_on, admitted_on, created_at",

      // Next of kin table (as fetched from backend)
      nextOfKin: "++id, patient_id, full_name, address, phone, relationship",

      // Reports
      reports: "++id, patient_id, report, wrote_by, order_to_pharmacy, order_to_lab, ultrasound_order, xray_order"
    });
  }
}

export const clinipalDB = new ClinicPalDB();
export const patients = clinipalDB.patients;
export const patientsData = clinipalDB.patientsData;
export const nextOfKin = clinipalDB.nextOfKin;
export const reports = clinipalDB.reports;