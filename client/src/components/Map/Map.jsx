import React from "react";

// for map
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useEffect } from "react";

// for getting the location coords of the user
import { useGeolocated } from "react-geolocated";
import toast from "react-hot-toast";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMapStore } from "../../store/useMapStore";
import "./Map.css";

import pickupPin from "/pickup_marker.png";
import { useParams } from "react-router-dom";
import { useRideStore } from "../../store/userRideStore";
import { useAuthStore } from "../../store/useAuthStore";


function RecenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
}

function Route({ waypoints, color = "red" }) {
  const { isLiveTrackingEnabled } = useMapStore();
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Custom Markers

    // const pickupIcon = L.divIcon({
    //   className: "pickup-marker",
    //   html: `<div  style="background-image:url(${pickupPin})"></div>`,
    //   iconSize: [30, 30],
    //   iconAnchor: [15, 30],
    // });

    // const destinationIcon = L.divIcon({
    //   className: "destination-marker",
    //   html: `<div class="pin destination"></div>`,
    //   iconSize: [30, 30],
    //   iconAnchor: [15, 30],
    // });

    // Custom markers are yet to be added 


    const control = L.Routing.control({
      waypoints: waypoints.map(([lat, lng]) => L.latLng(lat, lng)),
      createMarker: function(i, wp, nwps){
        let icon;
        if(i == nwps-1){
          icon = L.icon({
            iconUrl: "/destination_marker.png",
            iconSize: [100, 100],
            iconAnchor: [50, 80]
          })
        }
        else if(i == 1){
          if(!isLiveTrackingEnabled) return;
          icon = L.icon({
            iconUrl: "/car_marker.png",
            iconSize: [60, 50],
            iconAnchor: [0, 20]
          })
        }
        else{
          icon = L.icon({
            iconUrl: '/pickup_marker.png',
            iconSize: [100, 100],
            iconAnchor: [50, 50]
          }) 
        }

        return L.marker(wp.latLng, { icon })
      },
      lineOptions: { styles: [{ color: color, weight: 3 }] },
      routeWhileDragging: false,
      show: false,
      useHints: false
    }).addTo(map);

    return () => {
      try {
        if (map && control) {
          map.removeControl(control);
        }
      } catch (err) {
        console.log("Error: ", err.message);
      }
    };
  }, [map, waypoints, color]);

  return null;
}

export default function Map() {
  const { coords, isGeolocationEnabled, isGeolocationAvailable } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      watchPosition: true,
      userDecisionTimeout: 5000,
    });

  const [userCoords, setUserCoords] = useState({
    lat: 0,
    lng: 0,
  });

  // const start = [23.2599, 77.4126]; // Start
  // const [end, setEnd] = useState([28.6139, 77.209]);

  const { startCoords, endCoords, getRideCoordinates, loadingMap, driverCoords, shareLiveCoordinates, subscribeToLiveLocation, unsubscribeToLiveLocation, isUserPassenger, leaveLiveLocationRoom, joinLiveLocationRoom, isUserDriver } = useMapStore();
  const { authenticated, socket } = useAuthStore();


  //   const route = [
  //     [28.61394, 77.20902], // Delhi start
  //     [28.2, 77.1],
  //     [27.8, 76.9],
  //     [27.3, 76.7],
  //     [26.7, 76.6],
  //     [26.0, 76.5],
  //     [25.0, 76.45],
  //     [24.0, 76.4],
  //     [23.5, 76.35],
  //     [23.1, 76.3],
  //     [23.07551, 76.84978], // VIT Bhopal
  //   ];

  // useEffect(() => {
  //   if (!isGeolocationAvailable) {
  //     return toast.error("Your Browser Does Not Support ");
  //   }

  //   if (!isGeolocationEnabled) {
  //     return toast.error("Geolocation not enabled");
  //   }

  //   console.log("Coords: ", coords);

  //   if (coords) {
  //     setUserCoords({
  //       lat: coords.latitude,
  //       lng: coords.longitude,
  //     });
  //     setEnd([coords.latitude, coords.longitude]);
  //   }
  // }, [coords]);

  const params = useParams();
  console.log("Ride Id: ", params.id);
  useEffect(() => {
    setUserCoords({
      lat: endCoords[0],
      lng: endCoords[1],
    });
  }, [startCoords, endCoords]);

  useEffect(()=>{
    toast.promise(async()=>{
      await getRideCoordinates(params?.id);
    }, {
      loading: "Routing",
      success: "Done",
      error: "Failed To Find a Route"
    });

    // return ()=>{
    //   unsubscribeToLiveLocation();
    //   leaveLiveLocationRoom(params?.id)
    // }
  }, [authenticated])
  
  useEffect(()=>{
    // toast.promise(async()=>{
    //   await getRideCoordinates(params?.id);
    // }, {
    //   loading: "Routing",
    //   success: "Done",
    //   error: "Failed To Find a Route"
    // joinLiveLocationRoom(params?.id);
    // });

    return ()=>{
      unsubscribeToLiveLocation();
      leaveLiveLocationRoom(params?.id)
    }
  }, []);

  useEffect(()=>{
    subscribeToLiveLocation()
  }, [socket])

  useEffect(()=>{
    if(socket){
      joinLiveLocationRoom(params?.id)
    }
  }, [socket])
  
  useEffect(()=>{

    console.log("Is User Driver: ", isUserDriver)

    if(!isUserDriver){
      console.log("User is not a driver to share location")
      return;
    }

    console.log("Coords: ", coords);
    console.log("Is Geolocation Enabled", isGeolocationEnabled);
    console.log("Is Geolocation Available", isGeolocationAvailable);

    if(!isGeolocationEnabled){
      return toast.error("Location Not Enabled")
    }
    if(!isGeolocationAvailable){
      return toast.error("Live Location Not Available")
    }
    if(authenticated && coords && isUserDriver){
      shareLiveCoordinates(params.id, coords);
    }
  }, [coords, isUserDriver])

  return (
    <>
      {!loadingMap && (
          <MapContainer
            center={[userCoords.lat, userCoords.lng]}
            zoom={10}
            scrollWheelZoom={true}
            className="h-[100%] m-auto"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker position={[userCoords.lat, userCoords.lng]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
            {userCoords && <RecenterMap coords={userCoords} />}

            {/* <RoutingMachine start={start} end={end} /> */}
            <Route waypoints={[startCoords, driverCoords, endCoords]} />
          </MapContainer>
        )}
    </>
  );
}
