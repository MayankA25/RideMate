import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useSuggestionStore } from "./useSuggestionStore";

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

    creating: false,

    matchFound: false,

    setRideAlert: (val)=>{
        console.log("Ride Alert Object: ", val);
        set({ rideAlert: { ...get().rideAlert, ...val } });
    },

    setMatchFound: (val)=>{
        set({ matchFound: val });
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


    addRideAlert: async(createAnyway)=>{
        set({ rideAlertErrorMsg: "" });
        const { setSearchDetails } = useSuggestionStore.getState();
        const { pickup, destination, departureDate, numberOfPassengers } = get().rideAlert;
        try{
            set({ creating: true });
            const response = await axiosInstance.post("/ridealerts/addridealert", {
                pickup: JSON.stringify(pickup),
                destination: JSON.stringify(destination),
                departureDate: departureDate,
                numberOfPassengers: numberOfPassengers,
                createAnyway: createAnyway
            });
            console.log("Response: ", response.data);

            if(response.data.rideAlertAlreadyExists){
                return toast.error("Ride Alert Already Exists");
            }

            if(response.data.matchFound && !createAnyway){
                set({ matchFound: true });
                setSearchDetails({
                    pickup: pickup,
                    destination: destination,
                    departureDate: departureDate,
                    numberOfPassengers: numberOfPassengers
                })
                return;
            }
            toast.success("Ride Alert Created");
        }catch(e){
            console.log(e);
            // throw new Error("Error While Adding Ride")
            toast.error("Error While Adding Ride Alert")
        }finally{
            set({ creating: false });
        }
    }

}))