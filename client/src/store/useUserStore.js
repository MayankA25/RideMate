import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useUserStore = create((set, get)=>({
    allUsers: [],


    getAllUsers: async()=>{
        try{
            const response = await axiosInstance.get("/users/getusers");
            console.log("Response: ", response.data);

            set({ allUsers: response.data.users });

        }catch(e){
            console.log(e);
            toast.error("Error While Getting Users");
        }
    }
}))