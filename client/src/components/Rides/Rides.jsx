import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  PenBox,
  User,
  X,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRideStore } from "../../store/userRideStore";
import { useEffect } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import RideBookingConfirmation from "../RideBookingConfirmation/RideBookingConfirmation";
import RideCard from "../RideCard/RideCard";
import RideSkeleton from "../RideSkeleton/RideSkeleton";

export default function Rides() {
  const navigate = useNavigate();
  const { rides, getAllRides, joinRide, checkIfUserIsPassenger, joining, gettingRides } =
    useRideStore();

  const { infoFilled, setInfoFilled } = useSuggestionStore();

  useEffect(() => {
    if (!infoFilled) {
      navigate("/dashboard/search");
    }
  }, []);

  return (
    <div className="w-[78%] h-full m-auto">
      <div className="flex flex-col py-10 gap-5">
        <div className="flex items-center px-3 gap-5">
          <span
            className="flex items-center transition-all cursor-pointer hover:bg-base-300 p-2 rounded-full"
            onClick={() => {
              navigate(-1);
              setInfoFilled(false);
              
            }}
          >
            <ArrowLeft className="size-5" />
          </span>
          <h1 className="font-bold text-xl">Rides</h1>
        </div>
        <hr className="text-white/15" />
        <div className="flex flex-col justify-center gap-10">
          {/* <div className="flex items-center">
            <input type="text" className='input input-primary w-full' placeholder='Search Rides' />
          </div> */}
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">
              Available Rides({rides.length})
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            {gettingRides ? (
              [...Array(4)].map((_, index)=>{
                return (
                  <RideSkeleton key={index} />
                )
              })
            ) : rides.map((ride, index) => {
              return (
                <RideCard key={index} ride={ride} index={index} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
