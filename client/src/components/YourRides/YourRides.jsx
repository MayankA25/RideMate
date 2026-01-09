import { ArrowLeft, BadgeCheck, ChevronRight, Circle, MessageCircle, Pen, PenBox, Plus, User, User2, X } from "lucide-react";
import React, { useEffect } from "react";
import AddRideModal from "../AddRideModal/AddRideModal";
import { useRideStore } from "../../store/userRideStore";
import { useNavigate } from "react-router-dom";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { getFormattedDate } from "../../../utils/date";
import useChatStore from "../../store/useChatStore";
import DeleteRideConfirmation from "../DeleteRideConfirmation/DeleteRideConfirmation";
import { useAuthStore } from "../../store/useAuthStore";
import PassengersModal from "../PassengersModal/PassengersModal";
import RideSkeleton from "../RideSkeleton/RideSkeleton";

export default function YourRides() {
  const { getDriverRides, driverRides, setEdit, gettingRides } = useRideStore();
  const { setRideDetails } = useSuggestionStore();
  const { user } = useAuthStore();
  useEffect(() => {
    getDriverRides();
  }, []);
  const navigate = useNavigate();
  const { getSelectedGroup } = useChatStore();
  return (
    <div className="w-[78%] h-full m-auto">
      <div className="flex flex-col justify-center gap-5 py-10">
        <div className="flex items-center px-3 gap-5">
          <span className="flex items-center transition-all cursor-pointer hover:bg-base-300 p-2 rounded-full" onClick={()=>{navigate(-1)}}>
            <ArrowLeft className='size-5'/>
          </span>
          <h1 className='font-bold text-xl'>Your Rides</h1>
        </div>
        <hr className="opacity-30" />
        <div className="flex flex-col justify-center gap-8">
          {/* <div className="flex items-center justify-between gap-7">
            <input
              type="text"
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Search Your Rides"
            />
          </div> */}
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">Published Rides ({driverRides.length})</h1>
            <AddRideModal index={"number"}/>
            <button
              className="bg-indigo-900 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-2 font-bold"
              onMouseOver={()=>{
                setEdit(false);
                setRideDetails({ pickup: { coordinates: [], address: '', place_id: '', addressLine1: "" }, destination: { coordinates: [], address: '', place_id: '', addressLine1: "" }, departureDate: '', carName: '', carColor: '', fare: 0, availableSeats: 1 })
              }}
              onClick={() =>
                document.getElementById("my_add_ride_modal_number").showModal()
              }
            >
              <Plus /> New Ride
            </button>
          </div>
          <div className={`flex flex-col justify-center gap-5`}>
            {gettingRides ? (
              [...Array(4)].map((_, index)=>{
                return (
                  <RideSkeleton key={index}/>
                )
              })
            ) : (driverRides.map((ride, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center bg-base-200 shadow-xl gap-3 rounded-2xl py-1 px-2 relative"
                >
                  <AddRideModal index={index} id={ride._id} />
                  <DeleteRideConfirmation index={index} rideId={ride._id} pickup={ride.pickup.address} destination={ride.destination.address} departureDate={new Date(ride.departureDate).toDateString()}/>
                  <PassengersModal rideId={ride._id} index={index} passengers={ride.passengers}/>
                  <div className="flex items-center justify-center font-semibold text-sm py-1 bg-base-300 absolute top-0 w-full left-0 rounded-t-xl"><span className="font-bold mx-2">Published At:</span> { new Date(ride.createdAt).toDateString() }, { `${new Date(ride.createdAt).getHours()}`.padStart(2, "0") }:{ `${new Date(ride.createdAt).getMinutes()}`.padStart(2, "0") }</div>
                  <div className="grid grid-cols-4 w-full pt-5">
                    <div className="flex items-center p-5 py-8 gap-10 pl-15 cursor-pointer" onClick={()=>{navigate(`/info/rides/${ride._id}`)}}>
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
                      <div className="grid grid-cols-1 gap-8 relative " onClick={()=>{navigate(`/info/rides/${ride._id}`)}}>
                        <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full">{ride.pickup.address.split(",")[0]}</h1>
                        <h1 className="font-bold relative before:content-[''] before:border-2 before:border-white before:w-4 before:h-4 before:absolute before:top-[25%] before:-left-10 before:rounded-full before:bg-white">
                          {ride.destination.address.split(",")[0]}
                        </h1>
                      </div>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer" onClick={()=>{navigate(`/info/rides/${ride._id}`)}}>
                      <h1 className="font-bold text-lg">{ride.passengers.length}/{ride.availableSeats}</h1>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer" onClick={()=>{navigate(`/info/rides/${ride._id}`)}}>
                      <h1 className="font-bold text-lg">₹{ride.fare}</h1>
                    </div>
                    <div className="flex flex-col justify-center gap-3 p-3">
                      <button className="btn btn-primary font-bold"  onClick={()=>{
                        navigate(`/dashboard/chat/${ride._id}`);
                        getSelectedGroup(ride.group._id);
                      }}><MessageCircle className="size-5"/>Go To Chat</button>
                      {/* <button className="btn btn-primary font-bold"><User className="size-5"/> Show Passengers</button> */}
                      <button className="btn btn-primary font-bold" onMouseOver={()=>{setEdit(true); setRideDetails({ pickup: ride.pickup, destination: ride.destination, departureDate: getFormattedDate(ride.departureDate), carName: ride.carName, carColor: ride.carColor, fare: ride.fare, availableSeats: ride.availableSeats })}} onClick={()=>{document.getElementById(`my_add_ride_modal_${index}`).showModal()}}><PenBox className="size-5"/> Edit Ride</button>
                      <button className="btn btn-primary" onClick={()=>{ document.getElementById(`my_passenger_modal_${index}`).showModal() }}><User2/> Edit Passengers</button>
                      <button className="btn btn-error text-white font-bold" onClick={()=>{ document.getElementById(`my_ride_deletion_confirmation_modal_${index}`).showModal() }}><X/> Delete</button>
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
                            {ride.driver._id == user._id ? "You" : ride.driver.firstName}
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
                // <RideSkeleton/>
              );
            }))}
          </div>
        </div>
      </div>
    </div>
  );
}
