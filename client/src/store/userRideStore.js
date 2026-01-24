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

  cancelling: false,
  joining: false,
  gettingRides: false,
  gettingRideInfo: false,

  validateSearchDetails: (searchDetails) => {
    const { pickup, destination, departureDate, numberOfPassengers } =
      searchDetails;

    if (
      pickup.coordinates.length == 0 ||
      pickup.address.trim().length == 0 ||
      pickup.place_id.trim().length == 0 ||
      destination.coordinates.length == 0 ||
      destination.address.trim().length == 0 ||
      destination.place_id.trim().length == 0 ||
      departureDate.trim().length == 0 ||
      numberOfPassengers <= 0
    )
      return false;

    return true;
  },

  getAllRides: async () => {
    const { searchDetails } = useSuggestionStore.getState();
    try {
      set({ gettingRides: true });
      const response = await axiosInstance.get("/rides/getrides", {
        params: {
          pickup: JSON.stringify(searchDetails.pickup),
          destination: JSON.stringify(searchDetails.destination),
          departureDate: searchDetails.departureDate,
          seats: searchDetails.numberOfPassengers,
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
    } finally {
      set({ gettingRides: false });
    }
  },

  addRide: async () => {
    const { user, socket } = useAuthStore.getState();
    const { rideDetails } = useSuggestionStore.getState();
    // const { rideDetails } = get();
    try {
      set({ gettingRides: true });
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
    } finally {
      set({ gettingRides: false });
    }
  },

  getDriverRides: async () => {
    const { user } = useAuthStore.getState();
    try {
      set({ gettingRides: true });
      const response = await axiosInstance.get("/rides/getdriverrides", {
        params: {
          driverId: user._id,
        },
      });
      console.log("Driver Rides: ", response.data);
      set({ driverRides: response.data.rides });
    } catch (e) {
      console.log(e);
    } finally {
      set({ gettingRides: false });
    }
  },

  updateRide: async (rideId) => {
    const { rideDetails } = useSuggestionStore.getState();
    try {
      set({ gettingRides: true });
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
    } finally {
      set({ gettingRides: false });
    }
  },

  deleteRide: async (rideId) => {
    const { socket } = useAuthStore.getState();
    try {
      set({ gettingRides: true });
      const tempRides = [...get().driverRides];
      const foundIndex = tempRides.findIndex(
        (ride, index) => ride._id == rideId
      );
      tempRides.splice(foundIndex, 1);
      set({ driverRides: tempRides });
      const response = await axiosInstance.delete("/rides/removeride", {
        params: {
          rideId: rideId,
        },
      });
      console.log("Response: ", response.data);
      socket.emit("leave-room", { rideId: rideId });
    } catch (e) {
      console.log(e);
    } finally {
      set({ gettingRides: false });
    }
  },

  getRideInfo: async (rideId) => {
    const { setStartCoords, setEndCoords } = useMapStore.getState();
    try {
      set({ gettingRideInfo: true });
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
    } finally {
      set({ gettingRideInfo: false });
    }
  },

  joinRide: async (rideId, userId) => {
    const { socket } = useAuthStore.getState();
    const rides = [...get().rides];
    try {
      set({ joining: true });
      const foundIndex = rides.findIndex((ride, index) => ride._id == rideId);

      const response = await axiosInstance.post("/rides/joinride", {
        rideId: rideId,
        userId: userId,
      });

      console.log("Response: ", response.data);

      rides.splice(foundIndex, 1, response.data.ride);

      set({ rides: rides, selectedRide: response.data.ride });

      socket.emit("join-room", { rideId: rideId });
    } catch (e) {
      console.log(e);
      toast.error("Error While Joining Ride");
    } finally {
      set({ joining: false });
    }
  },

  cancelRide: async (rideId) => {
    const bookedRides = [...get().bookedRides];
    console.log("Ride Id: ", rideId);
    try {
      set({ cancelling: true });
      const response = await axiosInstance.post("/rides/cancelride", {
        rideId: rideId,
      });
      console.log("Response: ", response.data);

      const foundIndex = bookedRides.findIndex((ride, index) => {
        return rideId == ride._id;
      });
      console.log("Found Index: ", foundIndex);

      bookedRides.splice(foundIndex, 1);

      set({ bookedRides: bookedRides });

      toast.success("Ride Cacelled Succesfully");
    } catch (e) {
      console.log(e);
    } finally {
      set({ cancelling: false });
    }
  },

  checkIfUserIsPassenger: (ride) => {
    // const { selectedRide } = get();
    const { user } = useAuthStore.getState();

    console.log("Ride: ", ride);

    if (user?._id == ride?.driver?._id) return true;

    const passengers = ride?.passengers;

    console.log("Passengers: ", passengers);

    const foundIndex = passengers?.findIndex((passenger, index) => {
      return passenger._id == user?._id;
    });

    console.log("Found Index: ", foundIndex);

    return foundIndex != -1;
  },

  getBookedRides: async () => {
    try {
      set({ gettingRides: true });
      const response = await axiosInstance.get("/rides/getbookedrides");
      console.log("Response: ", response.data);

      set({ bookedRides: response.data.rides });
    } catch (e) {
      console.log(e);
    } finally {
      set({ gettingRides: false });
    }
  },

  removePassenger: async (rideId, passengerId) => {
    const driverRides = [...get().driverRides];
    try {
      const response = await axiosInstance.post("/rides/removepassenger", {
        rideId: rideId,
        passengerId: passengerId,
      });

      const foundIndex = driverRides.findIndex((ride, index) => {
        return ride._id == rideId;
      });

      console.log("Found Index: ", foundIndex);

      driverRides.splice(foundIndex, 1, response.data.ride);

      set({ driverRides: driverRides });

      console.log("Response: ", response.data);
    } catch (e) {
      console.log(e);
    }
  },
}));
