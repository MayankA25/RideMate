import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000/"

export const useAuthStore = create((set, get)=>({
    authenticated: false,

    user: null,
    socket: null,

    editAccountDetails: {
        phone: "",
        country: "",
        state: "",
        gender: ""
    },

    specificUser: null,

    checking: false,

    getUser: async()=>{
        try{
            set({ checking: true })
            const response = await axiosInstance.get("/auth/getuser");
            console.log(response.data);
            const user = response.data.user;
            user && get().connectSocket(user._id);
            toast.success("Logged In Successfully");
            set({ authenticated: true, user: response.data.user });
        }catch(e){
            console.log(e);
            set({ authenticated: false, user: null });
        }
        finally{
            set({ checking: false })
        }
    },

    setUser: async(userObj)=>{
        set({ user: userObj })
    },

    login: ()=>{
        window.location.href = "http://localhost:5000/api/auth/login";

    },

    logout: async()=>{
        try{
            const response = await axiosInstance.post("/auth/logout");
            console.log(response.data);
            set({ authenticated: false, user: null });
            get().disconnectSocket();
            toast.success("Logged Out Successfylly")
        }catch(e){
            console.log(e);
        }
    },

    connectSocket: async(userId)=>{
        // const { user } = get();
        console.log("Connecting Socket...");
        if(get().socket ) return;

        console.log("Herereeeeee")
        
        const socket = io(BASE_URL, {
            transports: ["websocket"],
            query: {
                userId: userId
            }
        })

        socket.connect();

        set({ socket });
    },

    disconnectSocket: async()=>{
        const { socket } = get();

        if(socket?.connected) socket.disconnect()
    },

    setEditAccountDetails: async(obj)=>{
        set({ editAccountDetails: { ...get().editAccountDetails, ...obj } });
        console.log(get().editAccountDetails);
    },

    updateProfilePicture: async(url)=>{
        const { user } = get();
        if(user.profilePic == url) return;
        try{
            const response = await axiosInstance.put("/auth/updateprofilepicture", {
                userId: user._id,
                profilePic: url
            });
            console.log(response.data);
            return toast.success("Profile Picture Updated");
        }catch(e){
            console.log(e);
            return toast.error("Error While Updating Profile Picture")
        }
    },

    submitEditAccountDetails: async()=>{
        const { setUser, user, editAccountDetails } = get();
        try{
            const response = await axiosInstance.post("/auth/submitform", {
                id: user._id,
                phone: editAccountDetails.phone,
                country: editAccountDetails.country,
                state: editAccountDetails.state,
                profilePic: user.profilePic
            });

            console.log("Data: ", response.data);

            const updatedUser = response.data.updatedUser;

            setUser(updatedUser);

            toast.success("Updated Account Details Succesfully");

        }catch(e){
            console.log(e);
            toast.error("Error While Submitting Form");
        }
    },

    submitDocuments: async(documentObj)=>{
        const { user, setUser } = useAuthStore.getState();
        try{
            console.log("Doc Obj: ", documentObj);
            if(documentObj?.aadharCard?.trim()?.length == 0 || documentObj?.drivingLicense?.trim()?.length == 0) return;
            const response = await axiosInstance.post("/auth/submitdocument", {id: user._id, ...documentObj});
            console.log("Response: ", response.data);
            setUser(response.data.updatedUser);
            return toast.success("Document Submitted! Wait Till Verfied");
        }catch(e){
            console.log("Error: ", e);
            toast.error("Error While Uploading Document")
        }
    },

    getUserById: async(id)=>{
        try{
            const response = await axiosInstance.get("/auth/getspecificuser", {
                params: {
                    id: id
                }
            });
            console.log("Response: ", response);
            set({ specificUser: response.data.user })
        }catch(e){
            console.log(e);
        }
    }
}))