import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { CopyMinus, Group } from "lucide-react";
import toast from "react-hot-toast";


const useChatStore = create((set, get)=>({

    messages: [],

    online: -1,

    selectedGroup: {},

    replyToMessage: null,

    setReplyToMessage: (val)=>{
        console.log("Reply To Message Id: ", val);
        set({ replyToMessage: val })
    },

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

    updateMessage: async(messageId, text, rideId)=>{
        try{

            const response = await axiosInstance.put("/chat/updatemessage", {
                messageId: messageId,
                newText: text,
                rideId: rideId
            });
            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
            toast.error("Error While Updating Message");
        }
    },

    deleteMessage: async(messageId, rideId)=>{
        try {
            const response = await axiosInstance.delete("/chat/deletemessage", {
                params: {
                    messageId: messageId,
                    rideId: rideId
                }
            });

            console.log("Response: ", response.data);
        } catch (e) {
            console.log(e);
        }
    },

    reply: async(senderId, groupId, text, rideId)=>{
        try{
            const response = await axiosInstance.post("/chat/reply", {
                senderId: senderId,
                groupId: groupId,
                text: text,
                parentId: get().replyToMessage,
                rideId: rideId
            });
            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
            toast.error("Error While Replying")
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
        });

        socket.on("updatedGroupMessage", (message)=>{
            const messages = [...get().messages];
            console.log("Messages: ", messages);
            const foundIndex = messages.findIndex((msg, index)=>{
                return msg._id == message._id
            });
            console.log("Found Index: ", foundIndex);

            messages.splice(foundIndex, 1, message);

            console.log("New Messages: ", messages);
            set({ messages: messages })
        })

        socket.on("deletedGroupMessageId", (messageId)=>{
            const messages = [...get().messages];
            const foundIndex = messages.findIndex((message, index)=>{
                return message._id == messageId
            });

            if(foundIndex == -1) return;
            console.log("Found Index: ", foundIndex);

            messages.splice(foundIndex, 1);

            set({ messages: messages });

            toast.success("Deleted Message Successfully")
        })
    },

    unsubscribeToGroupMessages: async()=>{
        const { socket } = useAuthStore.getState();
        socket.off('newGroupMessage')
    }

}))


export default useChatStore;