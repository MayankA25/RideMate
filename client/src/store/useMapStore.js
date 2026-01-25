import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";



export const useMapStore = create((set, get)=>({
    startCoords: [0, 0],
    driverCoords: [0, 0],
    endCoords: [0, 0],

    loadingMap: false,

    isUserPassenger: false,

    isUserDriver: false,

    isLiveTrackingEnabled: false,

    setStartCoords: (coords)=>{
        console.log("Start Coords: ", coords);
        set({ startCoords: coords })
    },

    setDriverCoords: (coords)=>{
        console.log("Driver Coords: ", coords);
        set({ driverCoords: coords })
    },

    setEndCoords: (coords)=>{
        console.log("End Coords: ", coords);
        set({ endCoords: coords });
    },

    getRideCoordinates: async(rideId)=>{
        try{
            // const { socket, user } = useAuthStore();
            const { authenticated, user, socket } = useAuthStore.getState();
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

            const passengers = response.data.ride.passengers;

            // socket.emit("join-room", { rideId: response.data.ride._id });
            if(authenticated && passengers.includes(user?._id)){
                set({ isUserPassenger: true });
            }
            if(authenticated && response.data.ride.driver._id == user._id){
                set({ isUserDriver: true })
            }
            // if(passengers.includes(user._id)){
            //     set({ isUserPassenger: true })
            //     socket.emit("join-room", { rideId: rideId });
            // }

            set({ startCoords: startCoords, driverCoords: startCoords, endCoords: endCoords, isLiveTrackingEnabled: response.data.ride.isLiveTrackingEnabled });
        }catch(e){
            console.log(e);
        }finally{
            set({ loadingMap: false });
        }
    },

    // joinLiveSharingRoom: (rideId)=>{
    //     const { socket } = useAuthStore.getState();
    //     if(!rideId || !socket) return;
    //     socket.emit("join-room", { rideId: rideId, isMap: true })
    // },

    // leaveLiveSharingRoom: (rideId)=>{
    //     const { socket } = useAuthStore.getState();
    //     if(!rideId || !socket) return;
    //     socket.emit("leave-room", { rideId: rideId, isMap: true })
    // },

    shareLiveCoordinates: async(rideId, liveCoords)=>{
        if(get().isUserPassenger) return;
        try{
            const response = await axiosInstance.post("/rides/sharelivelocation", {
                rideId: rideId,
                liveCoords: liveCoords
            });
            console.log("Response: ", response.data);
        }catch(e){
            console.log(e);
            return toast.error(e.response.data.msg)
        }
    },

    subscribeToLiveLocation: async()=>{
        console.log("Inside subscribing")
        const { socket } = useAuthStore.getState();
        if(!socket) return;
        console.log("Subscribed....");
        socket.on("liveCoords", (liveCoords)=>{
            console.log("Obtained Driver Coords: ", liveCoords)
            set({ driverCoords: [liveCoords.latitude, liveCoords.longitude] });
        })
    },


    unsubscribeToLiveLocation: async()=>{
        const { socket } = useAuthStore.getState();

        socket.off("liveCoords");
    },

    joinLiveLocationRoom: (rideId)=>{
        const { socket } = useAuthStore.getState();
        if(!socket) return;

        socket.emit("join-room", {
            rideId: rideId,
            isMap: true
        })
    },

    leaveLiveLocationRoom: (rideId)=>{
        const { socket } = useAuthStore.getState();
        if(!socket) return;

        socket.emit("leave-room", {
            rideId: rideId,
            isMap: true
        })
    }
}))