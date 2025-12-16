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

export default function Rides() {
  const navigate = useNavigate();
  const { rides, getAllRides, joinRide, checkIfUserIsPassenger } =
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
            {rides.map((ride, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center bg-base-200 shadow-xl gap-3 rounded-2xl py-1 px-2"
                >
                  {/* <AddRideModal index={index} id={ride._id} /> */}
                  <RideBookingConfirmation
                    index={index}
                    pickup={ride.pickup.address}
                    destination={ride.destination.address}
                    rideId={ride._id}
                  />
                  <div className="grid grid-cols-4 w-full">
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
                      <button
                        disabled={checkIfUserIsPassenger(ride)}
                        className="btn btn-primary font-bold"
                        onClick={() => {
                          document
                            .getElementById(`my_ride_confirm_modal_${index}`)
                            .showModal();
                        }}
                      >
                        <User className="size-5" />
                        {checkIfUserIsPassenger(ride) ? "Booked" : "Book Now"}
                      </button>
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
                          <h1 className="font-bold text-lg">
                            {ride.driver.firstName}
                          </h1>
                          {(ride.driver.drivingLicenseStatus == 'verified' || ride.driver.aadharCardStatus == 'verified') && <BadgeCheck
                            className={`${
                              ((ride.driver.aadharCardStatus == "verified" &&
                                ride.driver.drivingLicenseStatus !=
                                  "verified") ||
                                (ride.driver.aadharCardStatus != "verified" &&
                                  ride.driver.drivingLicenseStatus ==
                                    "verified")) &&
                              "text-yellow-300"
                            } ${
                              ride.driver.aadharCardStatus == "verified" &&
                              ride.driver.drivingLicenseStatus == "verified" &&
                              "text-green-300"
                            }`}
                          />}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
