import React from "react";
import Header from "../Header/Header";
import AddRideAlertModal from "../AddRideAlertModal/AddRideAlertModal";
import { Plus } from "lucide-react";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import { useEffect } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import RideAlertItem from "../RideAlertItem/RideAlertItem";
import RideAlertItemSkeleton from "../RideAlertItemSkeleton/RideAlertItemSkeleton";

export default function RideAlert() {
  const { getRideAlerts, setRideAlert, loading, rideAlerts } = useRideAlertStore();
  const { setPlaces } = useSuggestionStore();

  useEffect(() => {
    getRideAlerts();
  }, []);
  return (
    <div className="w-[78%] m-auto h-full">
      <div className="flex flex-col py-10 gap-5">
        <Header headerTitle={"Ride Alerts"} />
        <hr className="text-white/40" />
        <div className="flex flex-col gap-10">
          <AddRideAlertModal />
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Ride Alerts (0)</h1>
            <div
              className="flex items-center justify-center gap-3 bg-indigo-800/40 p-2.5 rounded-xl font-bold py-3 cursor-pointer"
              onMouseOver={()=>{
                setRideAlert({
                  pickup: {
                    coordinates: [],
                    address: "",
                    addressLine1: "",
                    place_id: "",
                  },
                  destination: {
                    coordinates: [],
                    address: "",
                    addressLine1: "",
                    place_id: "",
                  },
                  departureDate: "",
                  numberOfPassengers: 1,
                });
                setPlaces([])
              }}
              onClick={() => {
                
                document.getElementById("my_add_ride_alert_modal").showModal();
              }}
            >
              <Plus />
              <h1>New Alert</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 py-5">
          { loading ? [...Array(10)].map((_, index)=>{
            return (
              <RideAlertItemSkeleton key={index}/>
            )
          }) :  rideAlerts.map((rideAlert, index)=>{
            return (
              <RideAlertItem key={index} rideAlert={rideAlert}/>
            )
          })}
        </div>
      </div>
    </div>
  );
}
