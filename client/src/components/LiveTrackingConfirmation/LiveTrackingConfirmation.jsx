import React from "react";
import { useRideStore } from "../../store/userRideStore";

export default function LiveTrackingConfirmation({ rideId }) {
    const { toggleLiveTracking, selectedRide } = useRideStore()
  return (
    <dialog id={`my_live_tracking_confirmation_modal`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Live Tracking!</h3>
        <p className="py-4 font-semibold">Are you sure that you want to {selectedRide?.isLiveTrackingEnabled ? "disable" : "enable"} live tracking for this ride ?</p>
        <div className="modal-action">
          <form method="dialog" className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button className="btn btn-primary" onClick={()=>{
                toggleLiveTracking(rideId);
            }}>Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
