import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import RideForm from "../RideForm/RideForm";
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { useRideStore } from "../../store/userRideStore";

export default function AddRideAlertModal() {
  const { addRideAlert, creating, rideAlertErrorMsg, rideAlert } = useRideAlertStore();
  const { validateSearchDetails } = useRideStore();

  useEffect(()=>{
    if(rideAlertErrorMsg.trim().length == 0) return;
    // toast.(rideAlertErrorMsg)
    toast("Ride Already Present", {
      icon: "⚠️"
    })
  }, [rideAlertErrorMsg]);

  const ref = useRef(null);

  return (
    <dialog id={"my_add_ride_alert_modal"} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Ride Alert</h3>
        <div className="py-4">
          <RideForm type={"alert"} />
        </div>
        <div className="modal-action">
          <div className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button ref={ref} className="btn">Close</button>
            </form>
            <button
              className="btn btn-primary"
              disabled={creating}
              onClick={() => {

                if(!validateSearchDetails(rideAlert)) return toast.error("Provide Valid Details")

                toast.promise(addRideAlert(), {
                  loading: "Creating..."
                });
              }}
            >
              { creating ? <Loader2 className="animate-spin"/> : "Create" }
            </button>
          </div>
        </div>
      </div>
      <Toaster/>
    </dialog>
  );
}
