import ReportForm from "../report/ReportForm";
import { useState } from "react";

interface BtnProp{
    patient_id: string;
}
export const ReportBtn = ({patient_id}: BtnProp) => {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <>
      <button
        className="bg-yellow-600 hover:bg-yellow-500 px-3 py-2 rounded-md text-white"
        onClick={() => setShowReportModal(true)}
        type="button"
      >
        Report
      </button>
      <ReportForm
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        patient_id={patient_id}
      />
    </>
  );
};