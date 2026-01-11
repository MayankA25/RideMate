import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useRideAlertStore = create((set, get)=>({
    rideAlerts: [],

    rideAlert: {
        pickup: {
            coordinates: [],
            address: "",
            addressLine1: "",
            place_id: ""
        },
        destination: {
            coordinates: [],
            address: "",
            addressLine1: "",
            place_id: ""
        },
        departureDate: "",
        numberOfPassengers: 1
    },

    setRideAlert: (val)=>{
        console.log("Ride Alert Object: ", val);
        set({ rideAlert: { ...get().rideAlert, ...val } });
    },

    getRideAlerts: async()=>{
        try{
            const response = await axiosInstance.get("/ridealerts/getridealerts");
            console.log("Response: ", response.data);

            set({ rideAlerts: response.data.rideAlerts });
        }catch(e){
            console.log(e);
            toast.error("Error While Getting Ride Alerts")
        }
    },


    addRideAlert: async()=>{
        const { pickup, destination, departureDate, numberOfPassengers } = get().rideAlert;
        try{
            const response = await axiosInstance.post("/ridealerts/addridealert", {
                pickup: pickup,
                destination: destination,
                departureDate: departureDate,
                numberOfPassengers: numberOfPassengers
            });
            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
            toast.error("Error While Adding Ride Alert")
        }
    }

}))