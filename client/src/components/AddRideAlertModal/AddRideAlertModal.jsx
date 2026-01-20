import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import RideForm from "../RideForm/RideForm";
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { useRideStore } from "../../store/userRideStore";
import FoundMatchModal from "../FoundMatchModal/FoundMatchModal";

export default function AddRideAlertModal() {
  const { addRideAlert, creating, rideAlert, matchFound } = useRideAlertStore();
  const { validateSearchDetails } = useRideStore();

  const ref = useRef(null);

  useEffect(()=>{
    if(matchFound){
      document.getElementById(`my_found_match_modal`).showModal()
    }
  }, [matchFound]);

  return (
    <dialog id={"my_add_ride_alert_modal"} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Ride Alert</h3>
        <div className="py-4">
          <RideForm type={"alert"} />
        </div>
        <FoundMatchModal/>
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

                toast.promise(addRideAlert(false), {
                  loading: "Creating..."
                });
                if(!matchFound){
                  ref.current.click()
                }
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
