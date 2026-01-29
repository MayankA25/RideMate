import React from "react";
import useReportStore from "../../store/useReportStore";

export default function ReportItem({ report }) {
  const { deleteReport } = useReportStore();
  return (
    <div className="collapse bg-base-200 py-3">
      <input type="radio" name="my-accordion-1" />
      <div className="collapse-title font-semibold">
        <div className="flex items-center justify-between">
          <span className="text-xl">
            Reported by: {report.reportedBy.firstName} (
            {report.reportedBy.email}){" "}
          </span>
        </div>
      </div>
      <div className="collapse-content text-sm flex flex-col gap-8">
        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-md">Reason: </span>
            <span className="font-bold text-md">{report.info}</span>
          </div>
          {report.relevantDocs.length > 0 && (
            <div className="flex items-start gap-8">
              <span className="font-bold">Documents: </span>
              <div className="flex flex-col justify-start gap-3">
                {report.relevantDocs.map((doc, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-semibold">Document 1 - </span>
                      <a href={doc} target="_blank" className="btn btn-primary">
                        Show
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <button
          className="btn btn-error text-white font-bold w-full"
          onClick={() => {
            deleteReport(report._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
