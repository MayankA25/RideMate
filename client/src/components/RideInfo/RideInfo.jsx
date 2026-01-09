import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRideStore } from "../../store/userRideStore";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Circle,
  Map,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import RideBookingConfirmation from "../RideBookingConfirmation/RideBookingConfirmation";
import toast from "react-hot-toast";
import { useMapStore } from "../../store/useMapStore";
import useChatStore from "../../store/useChatStore";

export default function RideInfo() {
  const params = useParams();
  console.log("Ride Info Params: ", params.id);

  const { getRideInfo, selectedRide, checkIfUserIsPassenger, gettingRideInfo } = useRideStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    getRideInfo(params.id);
  }, []);

  const { authenticated } = useAuthStore();

  const { setStartCoords, setEndCoords } = useMapStore();
  const { getSelectedGroup } = useChatStore();

  const getDifferenceTime = () => {
    const departure = new Date(selectedRide?.departureDate).getTime();
    const eta = new Date(selectedRide?.estimatedTimeOfArrival).getTime();

    const diffTime = eta - departure;

    console.log("Difference Time: ", diffTime / 1000);

    const diffHours = Math.floor(diffTime / (3600 * 1000));

    console.log("Diff Hours: ", diffHours);

    const diffMinutes = (diffTime / 1000 - diffHours * 3600) / 60;

    console.log("Diff Minutes: ", diffMinutes);

    return `${`${diffHours}`.padStart(2, "0")}h ${`${diffMinutes}`.padStart(
      2,
      "0"
    )}min`;
  };

  return (
    <div className="w-[78%] mx-auto h-full pt-8">
      <div className="flex flex-col justify-between h-full gap-5">
        <div className="flex items-center">
          <span
            className="hover:bg-base-200 p-3 rounded-full transition-all duration-200 cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft className="size-5" />
          </span>
        </div>
        {!gettingRideInfo && <hr className="text-white/40" />}
        <RideBookingConfirmation
          index={2}
          pickup={selectedRide?.pickup.address}
          destination={selectedRide?.destination.address}
          rideId={selectedRide?._id}
          number={0}
        />
        <div className="grid grid-cols-2">
          <div className="flex flex-col justify-center gap-8 font-bold px-5">
            {gettingRideInfo ? <span className="skeleton text-transparent"> {new Date().toDateString()} </span> :<span className="text-md">
              {new Date(selectedRide?.departureDate).toDateString()}
            </span>}
            <div className="flex flex-col justify-center gap-7">
              <div className="flex items-center gap-3">
                {!gettingRideInfo && <Circle className="size-5" />}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    {gettingRideInfo ? <span className="skeleton text-transparent">Pickup Address</span> : <span>{selectedRide?.pickup.address.split(",")[0]}</span>}
                    {gettingRideInfo ? <div className="p-3 skeleton"></div> : <Map
                      className="size-5 cursor-pointer text-indigo-400"
                      onClick={() => {
                        setStartCoords(
                          selectedRide?.pickup.coordinates.reverse()
                        );
                        setEndCoords(
                          selectedRide?.destination.coordinates.reverse()
                        );
                        navigate(`/map/${selectedRide?._id}`);
                      }}
                    />}
                  </div>
                  {gettingRideInfo ? <span className="skeleton text-transparent mt-1">Pickup Address Line 1 Lorem ipsum dolor sit amet consectetur adipisicing elit.</span> : <span className="text-sm font-semibold text-white/50">
                     {!selectedRide?.pickup.addressLine1 ? "" : `${selectedRide?.pickup.addressLine1},`}{selectedRide?.pickup.address
                      .split(",")
                      .map((elem, index) => {
                        if (index > 0) {
                          return `${elem}${
                            index <
                            selectedRide?.pickup.address.split(",").length - 1
                              ? ","
                              : ""
                          }`;
                        }
                      })
                      .join("")}
                  </span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!gettingRideInfo && <Circle className="size-5 bg-white rounded-full" />}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    {gettingRideInfo ? <span className="skeleton text-transparent">Destination Address</span> : <span>
                      {selectedRide?.destination.address.split(",")[0]}
                    </span>}
                    {gettingRideInfo ? <div className="p-3 skeleton"></div> : <Map
                      className="size-5 cursor-pointer text-indigo-400"
                      onClick={() => {
                        setStartCoords(
                          selectedRide?.pickup.coordinates.reverse()
                        );
                        setEndCoords(
                          selectedRide?.destination.coordinates.reverse()
                        );
                        navigate(`/map/${selectedRide?._id}`);
                      }}
                    />}
                  </div>
                  {gettingRideInfo ? <span className="skeleton text-transparent mt-1">Pickup Address Line 1 Lorem ipsum dolor sit amet consectetur adipisicing elit.</span> : <span className="font-semibold text-white/50">
                    {!selectedRide?.destination.addressLine1 ? "" : `${selectedRide?.destination.addressLine1},`}{selectedRide?.destination.address
                      .split(",")
                      .map((elem, index) => {
                        if (index > 0) {
                          return `${elem}${
                            index <
                            selectedRide?.destination.address.split(",")
                              .length -
                              1
                              ? ","
                              : ""
                          }`;
                        }
                      })}
                  </span>}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 justify-center pt-14 text-center lg:text-left">
            {gettingRideInfo ? <h1 className="skeleton text-transparent">
              { `${new Date().getHours()}`.padStart(2, "0") } : { `${new Date().getMinutes()}`.padStart(2, "0") }
            </h1> : <h1 className="font-bold text-lg">
              {`${new Date(selectedRide?.departureDate).getHours()}`.padStart(
                2,
                "0"
              )}{" "}
              :{" "}
              {`${new Date(selectedRide?.departureDate).getMinutes()}`.padStart(
                2,
                "0"
              )}
            </h1>}
            {gettingRideInfo ? <h1 className="text-transparent skeleton my-1">
              0h 00min
            </h1> : <h1 className="font-bold text-sm text-white/50">
              {getDifferenceTime()}
            </h1>}
            {gettingRideInfo ? <h1 className="skeleton text-transparent">
              { `${new Date().getHours()}`.padStart(2, "0") } : { `${new Date().getMinutes()}`.padStart(2, "0") }
            </h1> :<h1 className="font-bold text-lg">
              {`${new Date(
                selectedRide?.estimatedTimeOfArrival
              ).getHours()}`.padStart(2, "0")}{" "}
              :{" "}
              {`${new Date(
                selectedRide?.estimatedTimeOfArrival
              ).getMinutes()}`.padStart(2, "0")}{" "}
              <span className="text-sm text-white/40">
                ({new Date(selectedRide?.estimatedTimeOfArrival).toDateString()}
                )
              </span>
            </h1>}
          </div>
        </div>
        {!gettingRideInfo && <hr className="text-white/40" />}
        <div className="flex items-center justify-between py-10 px-5">
          <div className="flex items-center gap-3">
            {gettingRideInfo ? <h1 className="text-transparent skeleton p-3">0</h1> : <h1 className="font-bold text-3xl">
              {selectedRide?.availableSeats}{" "}
            </h1>}
            <span className={`font-semibold text-2xl ${gettingRideInfo ? "skeleton text-transparent" : ""}`}>
              {selectedRide?.availableSeats > 1 ? "Passengers" : "Passenger"}
            </span>
          </div>
          <div className="flex items-center">
            {gettingRideInfo ? <h1 className="skeleton text-transparent text-3xl">Fare Here</h1> : <h1 className="text-3xl font-bold">₹{selectedRide?.fare}</h1>}
          </div>
        </div>
        {!gettingRideInfo && <hr className="text-white/40" />}
        <div className="flex flex-col justify-center w-full gap-5 px-3">
          <h1 className={`font-bold text-xl ${gettingRideInfo && "skeleton text-transparent py-2"}`}>Driver</h1>
          <div
            className={`flex items-center justify-between w-full px-5 py-4 ${!gettingRideInfo && "hover:bg-white/10 cursor-pointer"} rounded-xl  transition-all`}
            onClick={() => {
              if(gettingRideInfo) return;
              navigate(`/account/${selectedRide?.driver._id}`);
            }}
          >
            <div className="flex items-center gap-3">
              {gettingRideInfo ? <div className="size-12 skeleton rounded-full"></div> : <img
                src={selectedRide?.driver.profilePic}
                alt=""
                className="size-12 rounded-full"
              />}
              <div className="flex items-center gap-2">
                {gettingRideInfo ? <h1 className="skeleton text-transparent text-2xl">Driver Name</h1> : <h1 className="font-bold text-2xl">
                  {selectedRide?.driver._id == user?._id ? "You" : selectedRide?.driver.firstName}
                </h1>}
                {(!gettingRideInfo && (selectedRide?.driver.aadharCardStatus == "verified" ||
                  selectedRide?.driver.drivingLicenseStatus == "verified") && (
                  <BadgeCheck
                    className={`${
                      ((selectedRide?.driver.aadharCardStatus == "verified" &&
                        selectedRide?.driver.drivingLicenseStatus !=
                          "verified") ||
                        (selectedRide?.driver.aadharCardStatus != "verified" &&
                          selectedRide?.driver.drivingLicenseStatus ==
                            "verified")) &&
                      "text-yellow-300"
                    } ${
                      selectedRide?.driver.aadharCardStatus == "verified" &&
                      selectedRide?.driver.drivingLicenseStatus == "verified" &&
                      "text-green-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            {gettingRideInfo ? <div className="flex items-center p-4 skeleton">
            </div> : <div className="flex items-center">
              <ChevronRight />
            </div>}
          </div>
          <div className="flex items-center gap-4 ">
            <div className="flex items-center gap-8">
              <h1 className={`font-bold text-md ${gettingRideInfo ? "skeleton text-transparent" : ""}`}>Car: <span className="font-bold">{ selectedRide?.carName } - { selectedRide?.carColor }</span></h1>
            </div>
          </div>
          {checkIfUserIsPassenger(selectedRide) && (
            <div className={`flex items-center w-full`}>
              <button className={`py-3 font-bold text-sm text-center w-full hover:bg-base-200 transition-all duration-300 cursor-pointer rounded-full border ${gettingRideInfo ? "skeleton text-transparent" : "border-indigo-500"}`} onClick={()=>{
                navigate(`/dashboard/chat/${selectedRide._id}`);
                getSelectedGroup(selectedRide.group)
              }}>
                Go To Ride Group
              </button>
            </div>
          )}
          
        </div>
        {!(gettingRideInfo || selectedRide?.passengers.length == 0) && <hr className="text-white/40" />}
        {selectedRide?.passengers.length != 0 && <div className="flex flex-col justify-center px-3 py-3">
          <div className="flex flex-col justify-center gap-5">
            {<h1 className={`font-bold text-2xl ${gettingRideInfo && "skeleton text-transparent py-2"}`}>
              Passengers ({selectedRide?.passengers.length})
            </h1>}
            <div className="flex flex-col justify-center">
              {selectedRide?.passengers.map((passenger, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-center w-full ${!gettingRideInfo && "hover:bg-white/15 cursor-pointer"} transition-all p-2.5 py-5 rounded-xl `}
                    onClick={() => {
                      if(gettingRideInfo) return;
                      navigate(`/account/${passenger._id}`);
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex items-center">
                        {gettingRideInfo ? <div className="size-10 skeleton rounded-full"></div> : <img
                          src={passenger.profilePic}
                          className="size-10 rounded-full"
                          alt=""
                        />}
                      </div>
                      {gettingRideInfo ? <h1 className="skeleton text-transparent text-2xl">Driver Name</h1> : (passenger._id != user?._id && (
                        <h1 className="font-bold text-lg">
                          {passenger.firstName} {passenger.lastName}
                        </h1>
                      ))}
                      {passenger._id == user?._id && (
                        <h1 className="font-bold text-lg">You</h1>
                      )}
                    </div>
                    {gettingRideInfo ? <div className="flex items-center p-4 skeleton">
            </div> : <div className="flex items-center">
                      <ChevronRight />
                    </div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>}
        {!gettingRideInfo && <hr className="text-white/40" />}
        <div className="flex flex-col justify-center px-3 py-5 gap-8">
          <div className="flex items-center text-indigo-300 gap-3">
            {gettingRideInfo ? <div className="size-8 skeleton text-transparent"></div> : <Upload className="cursor-pointer" />}
            <h1
              className={`font-bold ${gettingRideInfo ? "skeleton text-transparent" : "cursor-pointer"}`}
              onClick={(e) => {
                if(gettingRideInfo) return;
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link Copied");
              }}
            >
              Share Ride
            </h1>
          </div>
          {/* <div className="flex items-center text-indigo-300 gap-3">
            <TriangleAlert className="cursor-pointer" />
            <h1 className="font-bold cursor-pointer">Report Ride</h1>
          </div> */}
        </div>
        {!gettingRideInfo && user && user?._id != selectedRide?.driver?._id && (
          <div className="flex items-center justify-center sticky bottom-0 w-[100vw] transform -translate-x-[11%]">
            <button
              disabled={selectedRide?.passengers.length >=selectedRide?.availableSeats || !authenticated || checkIfUserIsPassenger(selectedRide)}
              className="btn btn-primary w-full py-8 text-xl"
              onClick={() => {
                document
                  .getElementById(`my_ride_confirm_modal_${2}_${0}`)
                  .showModal();
              }}
            >
              {selectedRide?.passengers.length >= selectedRide?.availableSeats ? "Full" : (checkIfUserIsPassenger(selectedRide) ? "Track Ride" : "Book Now")}
            </button>
          </div>
        )}
        {!gettingRideInfo && user && user?._id == selectedRide?.driver?._id && (
          <div className="flex items-center justify-center sticky bottom-0 w-[100vw] transform -translate-x-[11%]">
            <button
              disabled={!authenticated}
              className="btn btn-primary w-full py-8 text-xl"
              onClick={() => {
                document
                  .getElementById(`my_ride_confirm_modal_${2}_${0}`)
                  .showModal();
              }}
            >
              {"Enable Live Tracking"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
