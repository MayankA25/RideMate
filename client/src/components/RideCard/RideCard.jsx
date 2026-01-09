import React from "react";
import RideBookingConfirmation from "../RideBookingConfirmation/RideBookingConfirmation";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ChevronRight, MessageCircle, User, X } from "lucide-react";
import { useRideStore } from "../../store/userRideStore";
import { useUserStore } from "../../store/useUserStore";
import useChatStore from "../../store/useChatStore";

export default function RideCard({ ride, index }) {
    const navigate = useNavigate();

    const { rides, getAllRides, joinRide, checkIfUserIsPassenger, joining } =
        useRideStore();

    const { removeRide } = useUserStore();
    const { getSelectedGroup } = useChatStore();

    const params = useParams();
    const splittedParams = params['*'].split("/");
    console.log("Params: ", splittedParams);
  return (
    <div
      key={index}
      className="flex flex-col justify-center bg-base-200 shadow-xl gap-3 rounded-2xl py-1 px-2 relative"
    >
      {/* <AddRideModal index={index} id={ride._id} /> */}
      <RideBookingConfirmation
        index={index}
        pickup={ride.pickup.address}
        destination={ride.destination.address}
        rideId={ride._id}
        number={0}
      />
      <div className="flex items-center justify-center font-semibold text-sm py-1 bg-base-300 absolute top-0 w-full left-0 rounded-t-xl"><span className="font-bold mx-2">Published At:</span> { new Date(ride.createdAt).toDateString() }, { `${new Date(ride.createdAt).getHours()}`.padStart(2, "0") }:{ `${new Date(ride.createdAt).getMinutes()}`.padStart(2, "0") }</div>
      <div className="grid grid-cols-4 w-full pt-2">
        <div
          className="flex items-center p-5 py-8 gap-10 pl-15 cursor-pointer"
          onClick={() => {
            navigate(`/info/rides/${ride._id}`);
          }}
        >
          {/* <div className="grid grid-cols-1 gap-8">
                        <h1 className="font-semibold flex flex-col">
                          <span>{new Date(ride.departureDate).toLocaleDateString()}</span>
                          <span>{new Date(ride.departureDate).toLocaleTimeString()}</span>
                        </h1>
                        <h1 className="font-semibold flex flex-col">
                          <span>{new Date(ride.estimatedTimeOfArrival).toLocaleDateString()}</span> 
                          <span>{new Date(
                            ride.estimatedTimeOfArrival
                          ).toLocaleTimeString()}</span>
                        </h1>
                      </div> */}
          {/* <div className="grid grid-cols-1 place-items-center gap-0.05">
                        <Circle className="size-4" />
                        <div className="trnasform bg-white w-1 min-h-10"></div>
                        <Circle className="size-4 bg-white rounded-full" />
                      </div> */}
          <div
            className="grid grid-cols-1 gap-8 relative "
            onClick={() => {
              navigate(`/info/rides/${ride._id}`);
            }}
          >
            <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full">
              {ride.pickup.address.split(",")[0]}
            </h1>
            <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full before:bg-white">
              {ride.destination.address.split(",")[0]}
            </h1>
          </div>
        </div>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => {
            navigate(`/info/rides/${ride._id}`);
          }}
        >
          <h1 className="font-bold text-lg">
            {ride.passengers.length}/{ride.availableSeats}
          </h1>
        </div>
        <div
          className="flex items-center justify-center cursor-pointer"
          onClick={() => {
            navigate(`/info/rides/${ride._id}`);
          }}
        >
          <h1 className="font-bold text-lg">₹{ride.fare}</h1>
        </div>
        <div className="flex flex-col justify-center gap-3 p-3">
          {params?.id && (
            <button className="btn btn-primary text-white font-bold" onClick={()=>{
              navigate(`/dashboard/chat/${ride._id}`);
              getSelectedGroup(ride.group._id);
            }}><span><MessageCircle className="size-5"/></span>View Chat</button>
          )}
          <button
            disabled={ride?.passengers.length >= ride?.availableSeats || checkIfUserIsPassenger(ride) || joining}
            className="btn btn-primary font-bold"
            onClick={() => {
              document
                .getElementById(`my_ride_confirm_modal_${index}_${0}`)
                .showModal();
            }}
          >
            {ride?.passengers.length < ride?.availableSeats && <User className="size-5" />}
            { (ride.passengers.length >= ride.availableSeats && !checkIfUserIsPassenger(ride)) ? "Full" : (checkIfUserIsPassenger(ride) ? "Booked" : "Book Now")}
          </button>
          {params?.id && (
            <button className="btn btn-error text-white font-bold" onClick={()=>{
                removeRide(ride._id)
            }}><span><X className="size-5"/></span>Remove Ride</button>
          )}
        </div>
      </div>
      <hr className="opacity-30 w-[95%] m-auto" />
      <div
        className="flex items-center p-5 gap-4 w-full hover:bg-white/5 transition-all duration-200 rounded-2xl cursor-pointer"
        onClick={() => {
          navigate(`/account/${ride.driver._id}`);
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <img
              src={ride.driver.profilePic}
              className="rounded-full size-12"
              alt=""
            />
            <div className="flex items-center gap-2.5">
              <h1 className="font-bold text-lg">{ride.driver.firstName}</h1>
              {(ride.driver.drivingLicenseStatus == "verified" ||
                ride.driver.aadharCardStatus == "verified") && (
                <BadgeCheck
                  className={`${
                    ((ride.driver.aadharCardStatus == "verified" &&
                      ride.driver.drivingLicenseStatus != "verified") ||
                      (ride.driver.aadharCardStatus != "verified" &&
                        ride.driver.drivingLicenseStatus == "verified")) &&
                    "text-yellow-300"
                  } ${
                    ride.driver.aadharCardStatus == "verified" &&
                    ride.driver.drivingLicenseStatus == "verified" &&
                    "text-green-300"
                  }`}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}
