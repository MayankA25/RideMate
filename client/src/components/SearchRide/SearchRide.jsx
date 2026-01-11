import React, { useEffect } from "react";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRideStore } from "../../store/userRideStore";
import { useNavigate } from "react-router-dom";
import RideForm from "../RideForm/RideForm";

export default function SearchRide() {
  const {
    setSearchDetails,
    infoFilled,
  } = useSuggestionStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (infoFilled) {
      navigate("/dashboard/rides");
    }
    setSearchDetails({
      pickup: {
        coordinates: [],
        address: "",
        place_id: "",
      },
      destination: {
        coordinates: [],
        address: "",
        place_id: "",
      },
      departureDate: "",
      numberOfPassengers: 1,
    });
  }, []);

  

  return (
    <div className="flex items-center w-[78%] m-auto">
      <RideForm type="search"/>
    </div>
  );
}
