import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5173";

export const useFormStore = create((set, get)=>({
    formDetails: {
        phone: "",
        country: "",
        state: "",
        profilePic: "",
        gender: ""
    },

    initialFormSubmitted: false,

    setFormDetails: async(obj)=>{
        set({ formDetails: { ...get().formDetails, ...obj } });
        console.log("Form Details: ", get().formDetails);
    },

    submitForm: async()=>{
        const { formDetails } = get();
        const { setUser, user } = useAuthStore.getState();
        try{
            const response = await axiosInstance.post("/auth/submitform", {
                id: user._id,
                phone: formDetails.phone,
                country: formDetails.country,
                state: formDetails.state,
                profilePic: formDetails.profilePic || user.profilePic,
                gender: formDetails.gender
            });

            console.log("Data: ", response.data);

            const updatedUser = response.data.updatedUser;

            setUser(updatedUser);

        }catch(e){
            console.log(e);
            if(e.response.status == 400){
                return toast.error("Invalid Phone Number")
            }
            toast.error("Error While Submitting Form");
        }
    }

}))