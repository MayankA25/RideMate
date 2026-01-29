import React, { useRef } from "react";
import ReportForm from "../ReportForm/ReportForm";
import { useAuthStore } from "../../store/useAuthStore";
import useReportStore from "../../store/useReportStore";
import toast from "react-hot-toast";

export default function SubmitReportModal() {
  const { specificUser } = useAuthStore();
  const { submitReport, reportDetails } = useReportStore();
  const ref = useRef(null);
  return (
    <dialog id={`my_report_submission_modal`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Report {specificUser?.firstName}</h3>
        <ReportForm />
        <div className="modal-action">
          <form method="dialog" className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button ref={ref} className="btn">Close</button>
          </form>
          <button
            className="btn btn-error text-white"
            onClick={() => {
              if (reportDetails.reason.trim().length == 0)
                return toast.error("Reason is required");
              submitReport(specificUser?._id);
              ref.current.click();
            }}
          >
            Report
          </button>
        </div>
      </div>
    </dialog>
  );
}
