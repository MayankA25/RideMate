import { ChevronRight, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import RemovePassengerConfirmationModal from "../RemovePassengerConfirmModal/RemovePassengerConfirmationModal";

export default function PassengerItem({ rideId, index, passenger, passengerJoinedAt }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center w-full gap-4">
      <RemovePassengerConfirmationModal
        rideId={rideId}
        index={index}
        passenger={passenger}
      />
      <div
        className="flex items-center justify-between py-4 px-2 rounded-lg hover:bg-base-200 w-full cursor-pointer"
        onClick={() => {
          navigate(`/account/${passenger._id}`);
        }}
      >
        <div className="flex items-center gap-4">
          <img
            src={passenger.profilePic}
            className="size-10 rounded-full"
            alt=""
          />
          <div className="flex flex-col justify-center">
            <h1 className="font-bold">{passenger.firstName}</h1>
            <p className="font-semibold text-sm text-white/40">Joined At: {new Date().toDateString()}, {`${new Date().getHours()}`.padStart(2, "0")}:{`${new Date().getMinutes()}`.padStart(2, "0")}</p>
          </div>
        </div>
        <ChevronRight />
      </div>
      <div
        className="flex items-center justify-center hover:bg-base-200 p-2 rounded-full cursor-pointer hover:text-red-300"
        onClick={() => {
          document
            .getElementById(`my_remove_passenger_modal_${index}`)
            .showModal();
        }}
      >
        <X className="size-4.5" />
      </div>
    </div>
  );
}
