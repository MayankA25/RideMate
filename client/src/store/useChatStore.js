import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { Group } from "lucide-react";


const useChatStore = create((set, get)=>({

    messages: [],

    online: -1,

    selectedGroup: {},

    joinRoom: (rideId)=>{
        const { socket } = useAuthStore.getState();

        socket.emit("join-room", { rideId });
        set({ online: get().online + 1 });
    },

    leaveRoom: (rideId)=>{
        const { socket } = useAuthStore.getState();

        socket.emit("leave-room", { rideId });
        set({ online: get().online -1 });
    },

    getSelectedGroup: async(groupId)=>{
        try{
            const response = await axiosInstance.get("/group/getgroup", {
                params: {
                    groupId: groupId
                }
            });
            console.log("Response: ", response.data);
            set({ selectedGroup: response.data.group });
        }catch(e){
            console.log(e);
        }
    },

    getMessages: async(groupId)=>{
        try{
            const response = await axiosInstance.get("/chat/getmessages", {
                params: {
                    groupId: groupId
                }
            });
            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
        }
    },

    sendMessage: async(senderId, groupId, text)=>{
        try{
            const response = await axiosInstance.post("/chat/sendmessage", {
                senderId: senderId,
                groupId: groupId,
                text: text
            });

            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
        }
    }
}))


export default useChatStore;