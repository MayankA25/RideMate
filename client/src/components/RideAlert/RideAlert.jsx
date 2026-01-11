import React from "react";
import Header from "../Header/Header";
import AddRideAlertModal from "../AddRideAlertModal/AddRideAlertModal";
import { Plus } from "lucide-react";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import { useEffect } from "react";

export default function RideAlert() {
  const { getRideAlerts } = useRideAlertStore();

  useEffect(()=>{
    getRideAlerts();
  }, [])
  return (
    <div className="w-[78%] m-auto h-full">
      <div className="flex flex-col py-10 gap-5">
        <Header headerTitle={"Ride Alerts"} />
        <hr className="text-white/40" />
        <div className="flex flex-col gap-10">
          <AddRideAlertModal/>
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Ride Alerts (0)</h1>
            <div className="flex items-center justify-center gap-3 bg-indigo-800/40 p-2.5 rounded-xl font-bold py-3 cursor-pointer" onClick={()=>{
              document.getElementById("my_add_ride_alert_modal").showModal()
            }}>
              <Plus/>
              <h1>New Alert</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
        </div>
      </div>
    </div>
  );
}
