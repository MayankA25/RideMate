import React, { useState } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import toast from "react-hot-toast";
import { useRideStore } from "../../store/userRideStore";
import { getFormattedDate } from "../../../utils/date";
import { Loader2 } from "lucide-react";

export default function AddRideModal({ index, id }) {
  const {
    suggestPlace,
    places,
    setRideDetails,
    setPlaces,
    rideDetails,
    suggesting,
  } = useSuggestionStore();
  const { addRide, edit, updateRide } = useRideStore();
  const [destinationChanging, setDestinationChanging] = useState(false);
  const [arrivalChanging, setArrivalChanging] = useState(false);
  const validateRide = ()=>{
      let val = true;
      const pickup = rideDetails.pickup;
      const destination = rideDetails.destination;

      console.log("Pickup: ", pickup);

      if(pickup.address.trim().length == 0 ){
        val = false;
        toast.error("Pickup is required");
        return val;
      }
      if(pickup.place_id.trim().length == 0){
        val = false;
        toast.error("Select Pickup From Suggestions")
        return val;
      }
      if(destination.address.trim().length == 0 ){
        val = false;
        toast.error("Destination is required");
        return val;
      }
      if(destination.place_id.trim().length == 0){
        val = false;
        toast.error("Select Destination From Suggestions")
        return val;
      }

      if(rideDetails.departureDate.trim().length == 0){
        val = false;
        toast.error("Departure Date is required");
        return val;
      }
      if(rideDetails.carName.trim().length == 0){
        val = false;
        toast.error("Car Name is required");
        return val;
      }
      if(rideDetails.carColor.trim().length == 0){
        val = false;
        toast.error("Car Color is required");
        return val;
      }
      if(rideDetails.fare == 0){
        val = false;
        toast.error("Fare is required");
        return val;
      }
      if(rideDetails.numberOfPassengers == 0){
        val = false;
        toast.error("Number of passengers is required");
        return val;
      }

      return val;
  }
  return (
    <dialog id={`my_add_ride_modal_${index}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{edit ? "Edit Ride" : "Add Ride"}</h3>
        <div className="flex flex-col justify-center py-4 gap-3">
          <div className="flex flex-col justify-center gap-1 relative">
            <label htmlFor="pickup" className="font-semibold">
              Pickup Location<span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="pickup"
                disabled={suggesting}
                className="input input-primary focus:outline-0 focus:bg-base-200 w-full"
                placeholder="Enter Pickup Location"
                value={rideDetails.pickup.address}
                onChange={(e) => {
                  setArrivalChanging(true);
                  setDestinationChanging(false);
                  setRideDetails({
                    pickup: { ...rideDetails.pickup, address: e.target.value },
                  });
                  suggestPlace(e.target.value);
                }}
              />
              {suggesting && arrivalChanging && (
                <Loader2 className="animate-spin text-indigo-300" />
              )}
            </div>
            {places.length !== 0 && arrivalChanging && (
              <div className="flex flex-col gap-2 bg-base-300 w-full px-3 py-4 rounded-lg max-h-40 overflow-y-scroll">
                {places.map((place, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col justify-center hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
                      onClick={() => {
                        console.log(
                          "Destination Place ID: ",
                          rideDetails.destination.place_id.trim().length
                        );
                        if (
                          rideDetails.destination.place_id.trim().length != 0 &&
                          place.place_id == rideDetails.destination.place_id
                        ) {
                          setRideDetails({ pickup: {
                            ...rideDetails.pickup,
                            address: ""
                          } });
                          setPlaces([])
                          return toast.error(
                            "Pickup and Destination cannot be same"
                          );
                        }
                        setRideDetails({
                          pickup: {
                            ...rideDetails.pickup,
                            coordinates: place.coords,
                            address: `${place.name ? `${place.name}, ` : ""}${
                              place.info
                            }`,
                            place_id: place.place_id,
                          },
                        });
                        setPlaces([]);
                      }}
                    >
                      {place.name && (
                        <h1 className="font-semibold">{place.name}</h1>
                      )}
                      {place.name && (
                        <span className="font-semibold text-sm text-white/50">
                          {place.info}
                        </span>
                      )}
                      {!place.name && (
                        <h1 className="font-semibold">{place.info}</h1>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="pickup-address" className="font-semibold">Pickup Address Line 1</label>
            <input type="text" id="pickup-address" className="input input-primary focus:outline-0 w-full focus:bg-base-200" placeholder="Address Information" value={rideDetails.pickup.addressLine1 || ""} onChange={(e)=>{
              setRideDetails({
                pickup: {
                  ...rideDetails.pickup,
                  addressLine1: e.target.value
                }
              })
            }}/>
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="destination" className="font-semibold">
              Destination<span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="destination"
                className="input input-primary focus:outline-0 w-full focus:bg-base-200"
                placeholder="Enter Destination"
                value={rideDetails.destination.address}
                onChange={(e) => {
                  setDestinationChanging(true);
                  setArrivalChanging(false);
                  setRideDetails({
                    destination: {
                      ...rideDetails.destination,
                      address: e.target.value,
                    },
                  });
                  suggestPlace(e.target.value);
                }}
              />
              {suggesting && destinationChanging && <Loader2 className="text-indigo-300 animate-spin" />}
            </div>
            {places.length !== 0 && destinationChanging && (
              <div className="flex flex-col gap-2 bg-base-300 w-full px-3 py-4 rounded-lg max-h-40 overflow-y-scroll">
                {places.map((place, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col justify-center hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
                      onClick={() => {
                        console.log(
                          "Pickup Place ID: ",
                          rideDetails.pickup.place_id.trim().length
                        );
                        console.log(rideDetails.pickup.place_id);
                        console.log(place.place_id);
                        if (
                          rideDetails.pickup.place_id.trim().length != 0 &&
                          rideDetails.pickup.place_id == place.place_id
                        ) {
                          setRideDetails({ destination: {
                            ...rideDetails.destination,
                            address: ""
                          } });
                          setPlaces([]);
                          return toast.error(
                            "Pickup and Destination cannot be same"
                          );
                        }
                        setRideDetails({
                          destination: {
                            coordinates: place.coords,
                            address: `${place.name ? `${place.name}, ` : ""}${
                              place.info
                            }`,
                            place_id: place.place_id,
                          },
                        }),
                          setPlaces([]);
                      }}
                    >
                      {place.name && (
                        <h1 className="font-semibold">{place.name}</h1>
                      )}
                      {place.name && (
                        <span className="font-semibold text-sm text-white/50">
                          {place.info}
                        </span>
                      )}
                      {!place.name && (
                        <h1 className="font-semibold">{place.info}</h1>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="destination-address" className="font-semibold">Destination Address Line 1</label>
            <input type="text" id="destination-address" className="input input-primary focus:outline-0 w-full focus:bg-base-200" placeholder="Destination Information" value={rideDetails.destination.addressLine1 || ""} onChange={(e)=>{
              setRideDetails({ destination: {
                ...rideDetails.destination,
                addressLine1: e.target.value
              } })
            }} />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="departureDate" className="font-semibold">
              Departure Date<span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              id="departureDate"
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Enter Destination"
              value={rideDetails.departureDate}
              onChange={(e) => {
                setRideDetails({
                  departureDate: getFormattedDate(
                    new Date(e.target.value).toISOString()
                  ),
                });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="carName" className="font-semibold">Car Name<span className="text-red-400">*</span></label>
            <input
              type="text"
              id="carName"
              value={rideDetails.carName}
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Enter Car Name"
              onChange={(e) => {
                setRideDetails({ carName: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="carColor" className="font-semibold">Car Color</label>
            <input
              type="text"
              id="carColor"
              value={rideDetails.carColor}
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Enter Car Color"
              onChange={(e) => {
                setRideDetails({ carColor: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="fare" className="font-semibold">
              Fare
            </label>
            <input
              type="number"
              id="fare"
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Fare"
              value={rideDetails.fare}
              onChange={(e) => {
                setRideDetails({
                  fare: e.target.value.trim().length!= 0 && isNaN(Number.parseInt(e.target.value))
                    ? 0
                    : Number.parseInt(e.target.value),
                });
              }}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <label htmlFor="seats" className="font-semibold">
              Available Seats
            </label>
            <input
              type="number"
              required
              id="seats"
              className="input input-primary focus:outline-0 w-full focus:bg-base-200"
              placeholder="Number Of Seats"
              value={rideDetails.availableSeats}
              onChange={(e) => {
                setRideDetails({
                  availableSeats: e.target.value.trim().length!= 0 && isNaN(Number.parseInt(e.target.value))
                    ? 0
                    : Number.parseInt(e.target.value),
                });
              }}
            />
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex items-center gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button
              className="btn btn-primary"
              onClick={() => {
               if(!validateRide()) return; 
                edit
                  ?  toast.promise(updateRide(id), {
                      loading: "Publishing...",
                      success: "Published",
                      error: "Error While Publishing",
                    })
                  :  toast.promise(addRide(), {
                      loading: "Publishing...",
                      success: "Published",
                      error: "Error While Publishing",
                    })
              }}
            >
              {edit ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
