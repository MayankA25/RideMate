import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useUserStore = create((set, get)=>({
    allUsers: [],

    allUsersCopy: [],

    userRides: [],

    getAllUsers: async()=>{
        try{
            const response = await axiosInstance.get("/users/getusers");
            console.log("Response: ", response.data);

            set({ allUsers: response.data.users, allUsersCopy: response.data.users });

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
    },

    getUserRides: async(userId)=>{
        try{
            const response = await axiosInstance.get("/rides/getuserrides", {
                params: {
                    userId: userId
                }
            });
            console.log("Response: ", response.data);
            set({ userRides: response.data.rides })
        }catch(e){
            console.log(e);
        }
    },

    removeRide: async(rideId)=>{
        try{

            const rides = [...get().userRides];

            const foundIndex = rides.findIndex((ride, index)=>ride._id == rideId);

            rides.splice(foundIndex, 1);
            set({ userRides: rides });

            const response = await axiosInstance.delete("/rides/removeride", {
                params: {
                    rideId: rideId
                }
            });
            console.log("Response: ", response.data);
            toast.success("Ride Removed Successfully");
        }catch(e){
            console.log(e);
            toast.success("Error While Removing Ride")
        }
    },

    filterUsers: (val)=>{
        if(val.trim().length == 0){
            set({ allUsers: get().allUsersCopy })
            return;
        }
        const usersCopy = [...get().allUsersCopy];

        const filteredUsers = usersCopy.filter((user, index)=>{
            return (user.firstName.startsWith(val) || user.lastName.startsWith(val) || user.email.startsWith(val))
        })

        console.log("Filtered Users: ", filteredUsers);

        set({ allUsers: filteredUsers })
    }
}))