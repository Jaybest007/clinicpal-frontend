import Dexie from "dexie";
import type { Table } from "dexie";
import type { newPatientData, PatientsData, nextOfKinData, report } from "../context/DashboardContext";

class ClinicPalDB extends Dexie {
  patients!: Table<newPatientData, number>;
  patientsData!: Table<PatientsData, number>;
  nextOfKin!: Table<nextOfKinData, number>;
  reports!: Table<report, number>;

  constructor() {
    super("ClinicPalDB");
    this.version(1).stores({
      patients: "++id, full_name, address, age, phone, nok_full_name, nok_address, nok_phone, nok_relationship, done_by",
      patientsData: "++id, full_name, address, age, phone, gender, admission_status, admission_reason, visit_on, visit_reason, discharged_on, admitted_on, created_at",
      nextOfKin: "++id, full_name, address, phone, relationship",
      reports: "++id, patient_id, report, wrote_by, order_to_pharmacy, order_to_lab, ultrasound_order, xray_order"
    });
  }
}

export const clinipalDB = new ClinicPalDB();
export const patients = clinipalDB.patients;
export const patientsData = clinipalDB.patientsData;
export const nextOfKin = clinipalDB.nextOfKin;
export const reports = clinipalDB.reports;