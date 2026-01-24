import { Ellipsis, Trash2 } from "lucide-react";
import React from "react";
import DeleteRideAlertConfirmation from "../DeleteRideAlertConfirmation/DeleteRideAlertConfirmation";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useNavigate } from "react-router-dom";
import { useRideStore } from "../../store/userRideStore";

export default function RideAlertItem({ rideAlert }) {
  const { setSearchDetails, setInfoFilled } = useSuggestionStore();
  const { getAllRides } = useRideStore();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center bg-base-200 shadow-xl rounded-2xl">
      <DeleteRideAlertConfirmation rideAlertId={rideAlert._id} pickup={rideAlert.pickup} destination={rideAlert.destination} />
      <div className="flex items-center gap-3 rounded-2xl py-1 px-2 relative">
        <div className="flex items-center justify-center font-semibold text-sm py-2 bg-base-300 absolute top-0 w-full left-0 rounded-t-xl">
          <span className="text-sm font-bold">
            Created At:{" "}
            <span className="font-semibold">
              {new Date(rideAlert.createdAt).toDateString()}
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 w-full pt-5 relative">
          <span className="absolute top-0 right-0 cursor-pointer text-white/70 py-1" onClick={()=>{
            document.getElementById("my_delete_ride_alert_confirmation_modal").showModal()
          }}>
            <Trash2 className="text-red-300 size-4.5" />
          </span>
          <div className="flex items-center py-2 absolute top-0 gap-1.5">
            <div className="p-1.5 bg-red-400 rounded-full hover:scale-112 transition-all"></div>
            <div className="p-1.5 bg-yellow-400 rounded-full hover:scale-112 transition-all"></div>
            <div className="p-1.5 bg-green-400 rounded-full hover:scale-112 transition-all"></div>
          </div>
          <div className="flex items-center p-5 py-8 gap-10 pl-15">
            <div className="grid grid-cols-1 gap-8 relative ">
              <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full">
                {rideAlert.pickup.address}
              </h1>
              <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full before:bg-white">
                {rideAlert.destination.address}
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-end pr-[50%]">
            <h1 className="font-bold text-lg">
              {rideAlert.numberOfPassengers} Seats
            </h1>
          </div>
        </div>
      </div>
      {rideAlert.rides.length != 0 && <div className="flex items-center justify-center">
        <button className="btn btn-primary w-full font-bold" onMouseOver={()=>{
          setSearchDetails({
            pickup: rideAlert.pickup,
            destination: rideAlert.destination,
            departureDate: rideAlert.departureDate,
            numberOfPassengers: rideAlert.numberOfPassengers
          });
          setInfoFilled(true);
        }} onClick={()=>{
          getAllRides();
          navigate("/dashboard/rides")
        }}>View Rides ({rideAlert.rides.length})</button>
      </div>}
    </div>
  );
}
