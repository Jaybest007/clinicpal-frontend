import Dexie from "dexie";
import type { Table } from "dexie";
import type { newPatientData, PatientsData, nextOfKinData, report } from "../context/DashboardContext";
import type { SyncQueueItem, SyncLogItem, SyncMetadata, QueueSyncItem } from "./syncModels";

// Define typed tables with sync metadata
type PatientWithSync = newPatientData & SyncMetadata;
type PatientDataWithSync = PatientsData & SyncMetadata;
type NextOfKinWithSync = nextOfKinData & SyncMetadata;
type ReportWithSync = report & SyncMetadata;

// Define queue interface
export interface QueueItem {
  id: string;
  patient_id: string;
  patient_fullname: string;
  visit_reason: string;
  assigned_doctor: string;
  checked_in_at: string;
  status: 'waiting' | 'called' | 'seen' | 'removed';
  qued_by: string;
  updated_at?: string;
  updated_by?: string;
  _syncStatus?: string;
  _syncTimestamp?: number;
  _deleted?: boolean;
  _deletedAt?: string;
}

class ClinicPalDB extends Dexie {
  patients!: Table<PatientWithSync, number>;
  patientsData!: Table<PatientDataWithSync, number>;
  nextOfKin!: Table<NextOfKinWithSync, number>;
  reports!: Table<ReportWithSync, number>;
  syncQueue!: Table<SyncQueueItem, number>;
  syncLog!: Table<SyncLogItem, number>;
  queue!: Table<QueueItem, string>;
  queueSync!: Table<QueueSyncItem, string>;

  constructor() {
    super("ClinicPalDB");
    
    // Original schema (version 1)
    this.version(1).stores({
      patients: "++id, full_name, address, age, phone, nok_full_name, nok_address, nok_phone, nok_relationship, done_by",
      patientsData: "++id, full_name, address, age, phone, gender, admission_status, admission_reason, visit_on, visit_reason, discharged_on, admitted_on, created_at",
      nextOfKin: "++id, full_name, address, phone, relationship",
      reports: "++id, patient_id, report, wrote_by, order_to_pharmacy, order_to_lab, ultrasound_order, xray_order"
    });
    
    // Version 2 adds queue and sync tables
    this.version(2).stores({
      syncQueue: "++id, url, method, endpoint, entityType, entityId, tempId, timestamp, retries, priority",
      syncLog: "++id, operation, entityType, entityId, timestamp, status",
      queue: "id, patient_id, status, checked_in_at, _syncStatus",
      queueSync: "id, queueId, action, timestamp, processed"
    });
  }
}

export const clinipalDB = new ClinicPalDB();
export const patients = clinipalDB.patients;
export const patientsData = clinipalDB.patientsData;
export const nextOfKin = clinipalDB.nextOfKin;
export const reports = clinipalDB.reports;
export const queue = clinipalDB.queue;
export const queueSync = clinipalDB.queueSync;