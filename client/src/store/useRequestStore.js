import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useUserStore } from "./useUserStore";


export const useRequestStore = create((set, get)=>({
    requests: [],

    requestsCopy: [],


    getRequests: async()=>{
        try{
            const response = await axiosInstance.get("/requests/getallrequests");
            console.log("Requests: ", response.data.requests);
            set({ requests: response.data.requests, requestsCopy: response.data.requests })
        }catch(e){
            console.log(e);
        }
    },

    approveRequest: async(userId, documentName)=>{
        console.log("User ID: ", userId);
        const { updateSpecificUser } = useUserStore.getState()
        try{
            const tempReq = [...get().requests];
            const foundIndex = tempReq.findIndex((req, index)=>req.userId._id == userId);
            console.log("Found Index: ", foundIndex);
            tempReq[foundIndex].userId[`${documentName}Status`] = 'verified';
            set({ requests: tempReq })
            const response = await axiosInstance.put("/requests/approvedoc", {
                userId: userId,
                documentName: documentName
            });
            console.log(response.data);
            updateSpecificUser(userId, documentName, 'verified');
            toast.success(response.data.msg)

        }catch(e){
            console.log(e);
            toast.error("Error While Approving Docuemnt")
        }
    },

    rejectRequest: async(userId, documentName)=>{
        const { updateSpecificUser } = useUserStore.getState();
        try{
            const tempReq = [...get().requests];
            const foundIndex = tempReq.findIndex((req, index)=>req.userId._id == userId);
            const documentIndex = tempReq[foundIndex].documents.findIndex((doc, index)=>Object.keys(doc)[0] == documentName);
            console.log("Document Index: ", documentIndex)
            tempReq[foundIndex].documents.splice(documentIndex, 1);
            if(tempReq[foundIndex].documents.length == 0){
                tempReq.splice(foundIndex, 1);
            }
            set({ requests: tempReq });
            const response = await axiosInstance.put("/requests/rejectdoc", {
                userId: userId,
                documentName: documentName
            });
            console.log(response.data);
            updateSpecificUser(userId, documentName, 'not verified');
            toast.success(response.data.msg)
        }catch(e){
            console.log(e);
            toast.error("Error While Approving Document")
        }
    },

    filterRequests: (val)=>{
        if(val.trim().length == 0){
            set({ requests: get().requestsCopy });
            return;
        }

        const filteredRequests = get().requestsCopy.filter((request, index)=>{
            return (request.userId.firstName.startsWith(val) || request.userId.lastName.startsWith(val) || request.userId.email.startsWith(val))
        });

        set({ requests: filteredRequests });
    }
}))