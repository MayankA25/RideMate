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
import Header from "../Header/Header";

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
        <Header headerTitle={"Rides"}/>
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
            ) : (rides.length != 0 ? rides.map((ride, index) => {
              return (
                <RideCard key={index} ride={ride} index={index} />
              );
            }) : <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="font-bold text-xl">No Rides Available</h1> 
              <p className="font-bold text-sm cursor-pointer text-indigo-300">Create Ride Alert?</p>
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
