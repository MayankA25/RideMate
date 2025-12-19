import { create } from "zustand";
import { axiosInstance } from "../lib/axios";



export const useMapStore = create((set, get)=>({
    startCoords: [0, 0],
    endCoords: [0, 0],

    loadingMap: false,

    setStartCoords: (coords)=>{
        console.log("Start Coords: ", coords);
        set({ startCoords: coords })
    },

    setEndCoords: (coords)=>{
        console.log("End Coords: ", coords);
        set({ endCoords: coords });
    },

    getRideCoordinates: async(rideId)=>{
        try{
            set({ loadingMap: true });
            const response = await axiosInstance.get(`/rides/getrideinfo`, {
                params: {
                    rideId: rideId
                }
            });

            const startCoords = response.data.ride.pickup.coordinates.reverse();
            const endCoords = response.data.ride.destination.coordinates.reverse();

            console.log("Start Coords: ", startCoords);
            console.log("End Coords: ", endCoords);

            set({ startCoords: startCoords, endCoords: endCoords });
        }catch(e){
            console.log(e);
        }finally{
            set({ loadingMap: false });
        }
    }
}))