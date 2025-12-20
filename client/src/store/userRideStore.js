import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import { useSuggestionStore } from "./useSuggestionStore";
import toast from "react-hot-toast";
import { useMapStore } from "./useMapStore";

export const useRideStore = create((set, get) => ({
  rides: [],

  driverRides: [],

  edit: false,

  setEdit: async (val) => {
    set({ edit: val });
  },

  selectedRide: null,

  bookedRides: [],

  getAllRides: async () => {
    const { searchDetails } = useSuggestionStore.getState();
    try {
      const response = await axiosInstance.get("/rides/getrides", {
        params: {
          pickup: JSON.stringify(searchDetails.pickup),
          destination: JSON.stringify(searchDetails.destination),
          departureDate: searchDetails.departureDate,
        },
      });
      console.log("Rides: ", response.data);

      const rides = [...response.data.rides];

      // const filteredRides = rides.filter((ride, index)=>{
      //   const year = new Date(ride.departureDate).getFullYear();
      //   const month = `${new Date(ride.departureDate).getMonth() + 1}`.padStart(2, "0");
      //   const date = `${new Date(ride.departureDate).getDate()}`.padStart(2, "0");

      //   const newRideDepartureDate = `${year}-${month}-${date}`;
      //   console.log("Ride Departure Date: ", newRideDepartureDate);
      //   console.log("User Departure Date: ", departureDate)

      //   return newRideDepartureDate == departureDate;
      // });

      set({ rides: response.data.rides[0] ? rides : [] });
    } catch (e) {
      console.log(e);
      return toast.error("Error While Getting Available Rides");
    }
  },

  

  addRide: async () => {
    const { user, socket } = useAuthStore.getState();
    const { rideDetails } = useSuggestionStore.getState();
    // const { rideDetails } = get();
    try {
      const response = await axiosInstance.post("/rides/addride", {
        driverId: user._id,
        pickup: rideDetails.pickup,
        destination: rideDetails.destination,
        departureDate: rideDetails.departureDate,
        carName: rideDetails.carName,
        carColor: rideDetails.carColor,
        fare: rideDetails.fare,
        availableSeats: rideDetails.availableSeats,
      });
      console.log("Response: ", response.data);
      set({ driverRides: [...get().driverRides, response.data.newRide] });
      // socket.emit('join-room', { rideId: response.data.newRide._id });
    } catch (e) {
      console.log(e);
      throw new Error("Error While Adding Ride");
    }
  },

  getDriverRides: async () => {
    const { user } = useAuthStore.getState();
    try {
      const response = await axiosInstance.get("/rides/getdriverrides", {
        params: {
          driverId: user._id,
        },
      });
      console.log("Driver Rides: ", response.data);
      set({ driverRides: response.data.rides });
    } catch (e) {
      console.log(e);
    }
  },

  updateRide: async (rideId) => {
    const { rideDetails } = useSuggestionStore.getState();
    try {
      const response = await axiosInstance.put("/rides/updateride", {
        rideId: rideId,
        pickup: rideDetails.pickup,
        destination: rideDetails.destination,
        departureDate: rideDetails.departureDate,
        fare: rideDetails.fare,
        carName: rideDetails.carName,
        carColor: rideDetails.carColor,
        availableSeats: rideDetails.availableSeats,
      });

      console.log("Response: ", response.data);
    } catch (e) {
      console.log(e);
      throw new Error("Error While Updating Ride");
    }
  },

  deleteRide: async (rideId) => {
    const { socket } = useAuthStore.getState();
    try {
      const tempRides = [...get().driverRides];
      const foundIndex = tempRides.findIndex(
        (ride, index) => ride._id == rideId
      );
      tempRides.splice(foundIndex, 1);
      set({ driverRides: tempRides });
      const response = await axiosInstance.delete("/rides/deleteride", {
        params: {
          rideId: rideId,
        },
      });
      console.log("Response: ", response.data);
      socket.emit("leave-room", { rideId: rideId });
    } catch (e) {
      console.log(e);
    }
  },

  getRideInfo: async (rideId) => {
    const { setStartCoords, setEndCoords } = useMapStore.getState();
    try {
      const response = await axiosInstance.get("/rides/getrideinfo", {
        params: {
          rideId: rideId,
        },
      });

      console.log("Response: ", response.data);
      set({ selectedRide: response.data.ride });
    } catch (e) {
      console.log(e);
      toast.error("Error While Getting Ride Information");
    }
  },

  joinRide: async (rideId, userId) => {
    const { socket } = useAuthStore.getState();
    const rides = [...get().rides];
    try {
      const foundIndex = rides.findIndex((ride, index) => ride._id == rideId);

      const response = await axiosInstance.post("/rides/joinride", {
        rideId: rideId,
        userId: userId,
      });

      console.log("Response: ", response.data);

      rides.splice(foundIndex, 1, response.data.ride);

      set({ rides: rides });

      socket.emit("join-room", { rideId: rideId });
    } catch (e) {
      console.log(e);
      toast.error("Error While Joining Ride");
    }
  },

  checkIfUserIsPassenger: (ride) => {
    // const { selectedRide } = get();
    const { user } = useAuthStore.getState();

    const passengers = ride?.passengers;

    console.log("Passengers: ", passengers);

    const foundIndex = passengers?.findIndex((passenger, index) => {
      return passenger._id == user._id;
    });

    console.log("Found Index: ", foundIndex);

    return foundIndex != -1;
  },

  getBookedRides: async () => {
    try {
      const response = await axiosInstance.get("/rides/getbookedrides");
      console.log("Response: ", response.data);

      set({ bookedRides: response.data.rides });
    } catch (e) {
      console.log(e);
    }
  },
}));
