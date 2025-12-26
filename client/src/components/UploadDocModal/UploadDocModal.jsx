import { Check, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { uploadFile } from "../../../utils/upload";
import { useAuthStore } from "../../store/useAuthStore";

export default function UploadDocModal({ document, index }) {
  const [status, setStatus] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const { submitDocuments } = useAuthStore();

  const handleDocumnetUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("files", file);
    const urls = await uploadFile(formData);
    setStatus("uploaded");
    setDocUrl(urls[0]);
    console.log(urls);
  };
  return (
    <dialog id={`my_upload_doc_modal_${index}`} className="modal">
      <div className="modal-box py-12">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setStatus(false);
              setDocUrl("");
            }}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          {document} <br />{" "}
          <span className="text-sm font-medium">
            Upload Your {index == 1 ? "Aadhar Card" : "Driving License"} for{" "}
            {index == 1 ? "verification" : "creating new rides"}
          </span>
        </h3>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col justify-center">
            <p className="py-4 w-full flex items-center gap-5">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-primary w-full"
                onChange={handleDocumnetUpload}
              />
              {status == "uploading" && <Loader2 className="animate-spin" />}
              {status == "uploaded" && <Check className="text-green-400" />}
            </p>
            {status == "uploaded" && (
              <a href={docUrl} target="_blank" className="btn btn-primary">
                Show Document
              </a>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-primary absolute right-6 bottom-3 bg-indigo-500/10 border border-indigo-500 rounded-lg hover:bg-indigo-500"
                onClick={() => {
                  submitDocuments(
                    index == 1
                      ? { aadharCard: docUrl }
                      : { drivingLicense: docUrl }
                  );
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
