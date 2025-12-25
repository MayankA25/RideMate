import React from "react";
import { useRideStore } from "../../store/userRideStore";

export default function DeleteRideConfirmation({ index, rideId, pickup, destination, departureDate }) {
    const { deleteRide } = useRideStore();
  return (
    <dialog id={`my_ride_deletion_confirmation_modal_${index}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Ride</h3>
        <p className="py-4 font-semibold">Are you sure that you want to delete ride from <span className="font-bold text-indigo-400">{pickup}</span> to <span className="font-bold text-indigo-400">{destination}</span> scheduled at <span className="font-bold text-indigo-400">{departureDate}</span>?</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-3">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">No</button>
            <button className="btn btn-primary" onClick={()=>{
                deleteRide(rideId)
            }} >Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
