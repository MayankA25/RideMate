import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


const useReportStore = create((set, get)=>({

    reportDetails: {
        reason: "",
        docs: ['']
    },

    reports: [],

    loading: false,

    setReportDetails: (obj)=>{
        set({ reportDetails: { ...get().reportDetails, ...obj }});
        console.log("Report Details: ", get().reportDetails)
    },

    getReports: async(userId)=>{
        try{
            set({ loading: true });
            const response = await axiosInstance.get("/reports/getreports", {
                params: {
                    userId: userId
                }
            });
            console.log("Reponse: ", response.data);
            set({ reports: response.data.reports });
        }catch(e){
            console.log(e);
            toast.error(e.response.data.msg)
        }finally{
            set({ loading: false });
        }
    },

    submitReport: async(userId)=>{
        try{
            const reportDetails = { ...get().reportDetails };
            reportDetails.reason = reportDetails.reason.trim();
            reportDetails.docs = reportDetails.docs.filter((elem, index)=>{
                return elem.trim().length != 0
            });
            console.log("New Report Details: ", reportDetails)
            const response = await axiosInstance.post("/reports/submitreport", {
                userId: userId,
                info: reportDetails.reason,
                relevantDocs: reportDetails.docs
            });
            console.log("Response: ", response.data);
            toast.success("Report Submitted");
            set({ reportDetails: { reason: "", docs: [''] } })
        }catch(e){
            console.log(e);
            toast.error(e.response.data.msg);
        }
    },

    deleteReport: async(reportId)=>{
        const reports = [...get().reports];
        try{    
            const response = await axiosInstance.delete("/reports/deletereport", {
                reportId: reportId
            });
            console.log("Response: ", response.data);
            const foundIndex = reports.findIndex((report, index)=>{
                return report._id == reportId
            });
            reports.splice(foundIndex, 1);
            set({ reports: reports })
            
        }catch(e){
            console.log(e);
            return toast.error(e.response.data.msg);
        }
    }

}))

export default useReportStore;