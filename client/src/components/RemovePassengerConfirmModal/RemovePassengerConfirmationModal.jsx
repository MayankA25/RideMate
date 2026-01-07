import React from "react";
import { useRideStore } from "../../store/userRideStore";

export default function RemovePassengerConfirmationModal({ rideId, index, passenger }) {
  const { removePassenger } = useRideStore();
  return (
    <dialog id={`my_remove_passenger_modal_${index}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Remove {passenger.firstName}</h3>
        <div className="flex flex-col justify-center font-semibold text-center">
          <p className="py-4">
            Are you sure that you want to remove{" "}
            <span className="text-indigo-300 font-bold">
              {passenger.firstName} ({passenger.email})
            </span>{" "}
            from this Ride.
          </p>
          <p className="text-red-300 text-center font-semibold text-sm">
            After removing passenger, passenger will no longer be able to view
            your personal details
          </p>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn font-bold">Close</button>
            <button className="btn btn-primary font-bold" onClick={()=>{
              removePassenger(rideId, passenger._id);
            }}>Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
