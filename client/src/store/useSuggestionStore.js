import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useSuggestionStore = create((set, get)=>({

    places: [],

    rideDetails: {
        pickup: {
            coordinates: [],
            address: '',
            place_id: ''
        },
        destination: {
            coordinates: [],
            address: '',
            place_id: ''
        },
        departureDate: "",
        carName: "",
        carColor: "",
        fare: 0,
        availableSeats: 0
    },

    suggesting: false,

    searchDetails: {
        pickup: {
            coordinates: [],
            address: '',
            addressLine1: "",
            place_id: ''
        },
        destination: {
            coordinates: [],
            address: '',
            addressLine1: "",
            place_id: ''
        },
        departureDate: '',
        numberOfPassengers: 0
    },

    infoFilled: false,

    setInfoFilled: (val)=>{
        set({ infoFilled: val });
    },

    suggestPlace: async(place)=>{
        try{
            // set({ suggesting: true })
            if(place.trim().length == 0){
                set({ places: [] });
                return;
            }
            console.log("Place: ", place)
            const response = await axiosInstance.get("/suggestions/suggestplace", {
                params: {
                    place: place || ""
                }
            });
            const possiblePlaces = response.data.possiblePlaces;
            console.log("Possible Places: ", possiblePlaces);

            const placesInfo = possiblePlaces.features.map((place, index)=>{
                return { name: place.properties.name, info: place.properties.formatted, place_id: place.properties.place_id, coords: place.geometry.coordinates }
            });

            console.log("Places Info: ", placesInfo);
            set({ places: placesInfo })
        }catch(e){
            console.log(e);
        }finally{
            // set({ suggesting: false });
        }
    },

    setRideDetails: async(rideObj)=>{
        console.log({  ...get().rideDetails, ...rideObj });
        set({ rideDetails: { ...get().rideDetails, ...rideObj } })
    },

    setSearchDetails: async(searchObj)=>{
        console.log("Search Object: ", searchObj);
        set({ searchDetails: { ...get().searchDetails, ...searchObj } });
    },

    setPlaces: (places)=>{
        set({ places: places })
    },

    addRide: async()=>{
        const { user } = useAuthStore.getState();
        const { rideDetails } = get();
        try{
            const response = await axiosInstance.post("/rides/addride", {
                driverId: user._id,
                pickup: rideDetails.pickup,
                destination: rideDetails.destination,
                departureDate: rideDetails.departureDate,
                fare: rideDetails.fare,
                availableSeats: rideDetails.availableSeats
            });

            console.log("Response: ", response.data);
        }catch(e){
            console.log(e)
        }
    }

}))