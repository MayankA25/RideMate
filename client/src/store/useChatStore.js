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
        console.log("Group Id: ", groupId);
        try{
            const response = await axiosInstance.get("/chat/getmessages", {
                params: {
                    groupId: groupId
                }
            });
            console.log("Response: ", response.data);
            set({ messages: response.data.messages })
        }catch(e){
            console.log(e);
        }
    },

    sendMessage: async(senderId, groupId, text, rideId)=>{
        try{
            const response = await axiosInstance.post("/chat/sendmessage", {
                senderId: senderId,
                groupId: groupId,
                text: text,
                rideId: rideId
            });

            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
        }
    },

    subscribeToGroupMessages: ()=>{
        const { socket } = useAuthStore.getState();

        socket.on("newGroupMessage", (message)=>{
            const messages = [...get().messages];
            console.log("Messages: ", messages);
            console.log("New Message from socket: ", message);
            messages.push(message);
            console.log("New Messages: ", messages);
            set({ messages: messages });
        })
    },

    unsubscribeToGroupMessages: async()=>{
        const { socket } = useAuthStore.getState();
        socket.off('newGroupMessage')
    }

}))


export default useChatStore;