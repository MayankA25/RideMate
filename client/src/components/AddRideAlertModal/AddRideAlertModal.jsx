import React from "react";
import { useState } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import RideForm from "../RideForm/RideForm";

export default function AddRideAlertModal() {
    const { addRideAlert } = useRideAlertStore();
  return (
    <dialog id={"my_add_ride_alert_modal"} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Ride Alert</h3>
        <div className="py-4">
          <RideForm type={"alert"} />
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button className="btn btn-primary" onClick={()=>{
                addRideAlert()
            }}>Create</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
