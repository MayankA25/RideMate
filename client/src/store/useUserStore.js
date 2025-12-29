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
    },

    updateSpecificUser: (userId, documentName, newStatus)=>{
        const users = [...get().allUsers];
        const foundIndex = users.findIndex((user, index)=>{
            return user._id == userId
        });

        const updatedUser = { ...users[foundIndex] };

        updatedUser[`${documentName == 'driverLicense' ? "drivingLicense" : documentName}Status`] = newStatus;

        users.splice(foundIndex, 1, updatedUser);

        set({ allUsers: users });
    }
}))