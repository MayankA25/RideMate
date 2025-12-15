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
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      waypoints: waypoints.map(([lat, lng]) => L.latLng(lat, lng)),
      lineOptions: { styles: [{ color: color, weight: 3 }] },
      routeWhileDragging: false,
      show: false,
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
      userDecisionTimeout: 5000,
    });

  const [userCoords, setUserCoords] = useState({
    lat: 0,
    lng: 0,
  });

  const start = [28.6139, 77.209]; // Start
  const [end, setEnd] = useState([28.6139, 77.209]);

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

  useEffect(() => {
    if (!isGeolocationAvailable) {
      return toast.error("Your Browser Does Not Support ");
    }

    if (!isGeolocationEnabled) {
      return toast.error("Geolocation not enabled");
    }

    console.log("Coords: ", coords);

    if (coords) {
      setUserCoords({
        lat: coords.latitude,
        lng: coords.longitude,
      });
      setEnd([coords.latitude, coords.longitude]);
    }
  }, [coords]);

  return (
    <MapContainer
      center={[userCoords.lat, userCoords.lng]}
      zoom={20}
      scrollWheelZoom={true}
      className="h-[70%] m-auto"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[userCoords.lat, userCoords.lng]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {userCoords && <RecenterMap coords={userCoords} />}

      {/* <RoutingMachine start={start} end={end} /> */}
      {/* <Route waypoints={[start, end]} /> */}
    </MapContainer>
  );
}
