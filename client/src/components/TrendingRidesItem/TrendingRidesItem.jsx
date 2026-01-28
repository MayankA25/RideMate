import React from "react";
import { getFormattedDate } from "../../../utils/date";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import AddRideModal from "../AddRideModal/AddRideModal";

export default function TrendingRidesItem({ ride, index }) {
  const { setRideDetails } = useSuggestionStore();
  return (
    <>
      <AddRideModal index={index} />
      <div
        className="flex flex-col justify-center bg-white/3 border border-white/10 px-4 py-2 w-full rounded-lg cursor-pointer gap-2"
        onMouseOver={() => {
          setRideDetails({
            pickup: ride._id.pickup,
            destination: ride._id.destination,
            departureDate: getFormattedDate(
              new Date(ride._id.departureDate).toISOString(),
            ),
          });
        }}
        onClick={() => {
          document.getElementById(`my_add_ride_modal_${index}`).showModal();
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">
            {new Date(ride._id.departureDate).toDateString()}
          </span>
          <span className="text-sx font-bold">{ride.alertCount}</span>
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold">
            {ride._id.pickup.address}{" "}
            <span className="font-normal"> -- to -- </span>{" "}
            {ride._id.destination.address}
          </span>
        </div>
      </div>
    </>
  );
}
