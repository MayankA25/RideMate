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

    rideAlertErrorMsg: "",

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
        set({ rideAlertErrorMsg: "" });
        const { setSearchDetails } = useSuggestionStore.getState();
        const { pickup, destination, departureDate, numberOfPassengers } = get().rideAlert;
        try{
            set({ creating: true });
            const response = await axiosInstance.post("/ridealerts/addridealert", {
                pickup: JSON.stringify(pickup),
                destination: JSON.stringify(destination),
                departureDate: departureDate,
                numberOfPassengers: numberOfPassengers
            });
            console.log("Response: ", response.data);

            if(response.data.matchFound){
                set({ matchFound: true, rideAlertErrorMsg: "Ride Already Present" });
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