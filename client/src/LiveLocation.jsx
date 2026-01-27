import React, { useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import { useMapStore } from "./store/useMapStore";
import { useAuthStore } from "./store/useAuthStore";

export default function LiveLocation() {

    const { shareLiveCoordinates } = useMapStore();
    const { authenticated } = useAuthStore();


    
  const { coords, isGeolocationEnabled, isGeolocationAvailable } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    console.log("Coords: ", coords);
    console.log("Is Geolocation Enabled: ", isGeolocationEnabled);
    console.log("Is Geolocation Available: ", isGeolocationAvailable);

    if (!isGeolocationEnabled) {
      return toast.error("Location not enabled");
    }
    if (!isGeolocationAvailable) {
      return toast.error("Location not available");
    }
    if (coords && authenticated) {
      shareLiveCoordinates(coords);
    }
  }, [coords]);

  return null;
}
