import React from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useState } from "react";
import { useRideStore } from "../../store/userRideStore";
import { useNavigate } from "react-router-dom";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import toast from "react-hot-toast";

export default function RideForm({ type }) {
  const {
    places,
    suggestPlace,
    setSearchDetails,
    searchDetails,
    setPlaces,
    setInfoFilled,
  } = useSuggestionStore();

  const { rideAlert, setRideAlert } = useRideAlertStore();
  const { validateSearchDetails } = useRideStore();

  const [arrivalChanging, setArrivalChanging] = useState(false);
  const [destinationChanging, setDestinationChanging] = useState(false);
  // const [timezone, setTimezone] = useState('');

  const { getAllRides } = useRideStore();

  const navigate = useNavigate();

  // const validateSearchDetails = (searchDetails) => {
  //   const { pickup, destination, departureDate, numberOfPassengers } =
  //     searchDetails;

  //   if (
  //     pickup.coordinates.length == 0 ||
  //     pickup.address.trim().length == 0 ||
  //     pickup.place_id.trim().length == 0 ||
  //     destination.coordinates.length == 0 ||
  //     destination.address.trim().length == 0 ||
  //     destination.place_id.trim().length == 0 ||
  //     departureDate.trim().length == 0 ||
  //     numberOfPassengers <= 0
  //   )
  //     return false;

  //   return true;
  // };
  return (
    <div
      id={type}
      className={`flex flex-col justify-center ${
        type == "search" ? "w-[50%] m-auto py-5 px-3 gap-4" : "gap-3"
      } `}
    >
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="leaving-from" className="font-bold">
            Leaving From
          </label>
          <input
            type="text"
            className="input input-primary w-full focus:outline-0"
            id="leaving-from"
            placeholder="Departure Location"
            value={
              type == "search"
                ? searchDetails.pickup.address
                : rideAlert.pickup.address
            }
            onChange={(e) => {
              console.log("Type: ", type);
              setArrivalChanging(true);
              setDestinationChanging(false);
              suggestPlace(e.target.value);
              {
                type == "search"
                  ? setSearchDetails({
                      pickup: {
                        ...searchDetails.pickup,
                        address: e.target.value,
                      },
                    })
                  : setRideAlert({
                      pickup: { ...rideAlert.pickup, address: e.target.value },
                    });
              }
            }}
          />
        </div>
        {places.length !== 0 && arrivalChanging && (
          <div className="flex flex-col gap-2 bg-base-300 w-full px-3 py-4 rounded-lg max-h-40 overflow-y-scroll">
            {places.map((place, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
                  onClick={() => {
                    if (
                      type == "search"
                        ? searchDetails.pickup.place_id.trim().length != 0 &&
                          searchDetails.pickup.place_id ==
                            searchDetails.destination.place_id
                        : rideAlert.pickup.place_id.trim().length != 0 &&
                          rideAlert.pickup.place_id ==
                            rideAlert.destination.place_id
                    ) {
                      return toast.error(
                        "Pickup and Destination Cannot be same"
                      );
                    }
                    type == "search"
                      ? setSearchDetails({
                          pickup: {
                            coordinates: place.coords,
                            address: `${place.name ? `${place.name}, ` : ""}${
                              place.info
                            }`,
                            place_id: place.place_id,
                          },
                        })
                      : setRideAlert({
                          pickup: {
                            coordinates: place.coords,
                            address: `${place.name ? `${place.name}, ` : ""}${
                              place.info
                            }`,
                            place_id: place.place_id,
                          },
                        });
                    console.log("Place: ", place);

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
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-2">
          <label htmlFor="going-to" className="font-bold">
            Going To
          </label>
          <input
            type="text"
            className="input input-primary w-full focus:outline-0"
            id="going-to"
            placeholder="Arrival Location"
            value={
              type == "search"
                ? searchDetails.destination.address
                : rideAlert.destination.address
            }
            onChange={(e) => {
              setDestinationChanging(true);
              setArrivalChanging(false);
              suggestPlace(e.target.value);
              {
                type == "search"
                  ? setSearchDetails({
                      destination: {
                        ...searchDetails.destination,
                        address: e.target.value,
                      },
                    })
                  : setRideAlert({
                      destination: {
                        ...searchDetails.destination,
                        address: e.target.value,
                      },
                    });
              }
            }}
          />
        </div>
        {places.length !== 0 && destinationChanging && (
          <div className="flex flex-col gap-2 bg-base-300 w-full px-3 py-4 rounded-lg max-h-40 overflow-y-scroll">
            {places.map((place, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer"
                  onClick={() => {
                    if (
                      type == "search"
                        ? searchDetails.destination.place_id.trim().length !=
                            0 &&
                          searchDetails.pickup.place_id ==
                            searchDetails.destination.place_id
                        : rideAlert.destination.place_id.trim().length != 0 &&
                          rideAlert.pickup.place_id ==
                            rideAlert.destination.place_id
                    ) {
                      return toast.error(
                        "Pickup and Destination Cannot Be Same"
                      );
                    }

                    {
                      type == "search"
                        ? setSearchDetails({
                            destination: {
                              coordinates: place.coords,
                              address: `${place.name ? `${place.name}, ` : ""}${
                                place.info
                              }`,
                              place_id: place.place_id,
                            },
                          })
                        : setRideAlert({
                            destination: {
                              coordinates: place.coords,
                              address: `${place.name ? `${place.name}, ` : ""}${
                                place.info
                              }`,
                              place_id: place.place_id,
                            },
                          });
                    }

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
      <div className="flex flex-col justify-center gap-2">
        <label htmlFor="departure-date" className="font-bold">
          Departure Date
        </label>
        <input
          type="date"
          id="departure-date"
          className="input input-primary w-full focus:outline-0"
          value={
            type == "search"
              ? searchDetails.departureDate
              : rideAlert.departureDate
          }
          onChange={(e) => {
            if (
              new Date(e.target.value).getTime() <
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                0,
                0,
                0
              ).getTime()
            )
              return toast.error("Invalid Departure Date");
            {
              type == "search"
                ? setSearchDetails({ departureDate: e.target.value })
                : setRideAlert({ departureDate: e.target.value });
            }
          }}
        />
      </div>
      <div className="flex flex-col justify-center gap-2">
        <label htmlFor="passengers" className="font-bold">
          Number Of Passengers
        </label>
        <input
          type="number"
          className="input input-primary w-full focus:outline-0"
          placeholder="Number Of Passengers"
          min={0}
          max={10}
          value={
            type == "search"
              ? searchDetails.numberOfPassengers
              : rideAlert.numberOfPassengers
          }
          onChange={(e) => {
            {
              type == "search"
                ? setSearchDetails({ numberOfPassengers: e.target.value })
                : setRideAlert({ numberOfPassengers: e.target.value });
            }
          }}
        />
      </div>
      {type == "search" && (
        <div className="flex items-center py-2">
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              if (!validateSearchDetails(searchDetails))
                return toast.error("Provide Valid Details");
              getAllRides();
              navigate("/dashboard/rides");
              setInfoFilled(true);
            }}
          >
            Search
          </button>
        </div>
      )}
    </div>
  );
}
