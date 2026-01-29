import { AlignCenter, Loader2, Plus, X } from "lucide-react";
import React, { useRef, useState } from "react";
import useReportStore from "../../store/useReportStore";
import toast from "react-hot-toast";
import { uploadFile } from "../../../utils/upload";

export default function ReportForm() {
  const { reportDetails, setReportDetails } = useReportStore();
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  const handleFileUpload = async(index, e)=>{
    setLoading(true);
    const file = e.target.files[0];
    if(!file) return; 
    const formData = new FormData();

    formData.append('files', file);

    console.log("Form Data: ", formData)

    toast.promise(async()=>{
      const urls = await uploadFile(formData);
      console.log("URLs: ", urls[0]);
      const docs = [...reportDetails.docs];
      docs.splice(index, 1, urls[0]);
      setReportDetails({ docs: docs });
      setLoading(false);
    }, {
      success: "Uploaded",
      loading: "Uploading",
      error: "Error While Uploading File"
    })
  }
  return (
    <div className="flex flex-col justify-center py-4 gap-3">
      <div className="flex flex-col justify-center gap-1">
        <label htmlFor="info" className="font-semibold">
          Reason
        </label>
        <input
          type="text"
          name="info"
          value={reportDetails.reason || ""}
          className="input input-primary focus:outline-0 focus:bg-base-200"
          placeholder="Give your reason"
          onChange={(e)=>{
            setReportDetails({ reason: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col justify-center gap-1">
        <label htmlFor="doc" className="font-semibold">
          Documents (if necessary)
        </label>
        <div className="flex flex-col justify-center gap-3">
          {reportDetails.docs.map((_, index) => {
            return (
              <div ref={ref} key={index} id={`item-${index}`} className="flex items-center gap-3 ">
                <input
                  type="file"
                  className="file-input file-input-primary focus:outline-0 focus:bg-base-200"
                  onChange={(e)=>{
                    handleFileUpload(index, e);
                  }}
                />
                {loading && ref.current.id == `item-${index}` && <Loader2 className="text-primary animate-spin"/>}
                {index == reportDetails.docs.length - 1 ? (
                  reportDetails.docs.length < 3 && <div
                    className="flex items-center justify-center bg-indigo-600/40 py-2 rounded-md px-4 cursor-pointer font-bold gap-1"
                    onClick={() => {
                      if (reportDetails.docs.length < 3) {
                        const tempDocs = [...reportDetails.docs, ""];
                        setReportDetails({docs: tempDocs});
                      }
                    }}
                  >
                    <Plus />
                    <span>Add</span>
                  </div>
                ) : (
                  <div className="flex itmes-center justify-center p-1 rounded-md hover:bg-indigo-500/20 transition-all duration-200 cursor-pointer" onClick={()=>{
                    if(reportDetails.docs.length > 1){
                        const tempDocs = [...reportDetails.docs];
                        tempDocs.splice(index, 1);
                        setReportDetails({docs: tempDocs});
                    }
                  }}>
                    <X className="size-5"/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
