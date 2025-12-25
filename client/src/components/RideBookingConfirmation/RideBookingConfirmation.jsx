import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRideStore } from "../../store/userRideStore";

export default function RideBookingConfirmation({
  index,
  pickup,
  destination,
  rideId,
  number
}) {
  const { user } = useAuthStore();
  const { joinRide, cancelRide } = useRideStore();
  return (
    <dialog id={`my_ride_confirm_modal_${index}_${number}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm {number == 0 ? "Booking" : "Cancellation"}</h3>
        <div className="flex flex-col justify-center">
          <p className="py-4 font-semibold">
            Are your sure you want to <span className="text-red-300 font-bold">{ number == 0 ? "book" : "cancel" }</span> ride from{" "}
            <span className="font-bold text-indigo-300">{pickup}</span> to{" "}
            <span className="font-bold text-indigo-300">{destination}</span> ?
          </p>
          <p className="font-semibold text-center text-red-200">After { number == 0 ? "booking" : "cancelling" } the ride your profile details will {number == 0 ? "be visible" : "no longer be visible"} to passengers and driver{number == 0 ? " until the ride is complete" : "."}</p>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                number == 0 ? joinRide(rideId, user._id) : cancelRide(rideId);
              }}
            >
              Yes
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
