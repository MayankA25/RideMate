import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import toast, { Toaster } from "react-hot-toast";
import Map from "./components/Map/Map";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
// import Account from "./components/Accounts12/Account";
import Account from "./components/Account/Account";
import Form from "./components/Form/Form";
import { useFormStore } from "./store/useFormStore";
import RideInfo from "./components/RideInfo/RideInfo";
import Wrapper from "./pages/Wrapper/Wrapper";
import { useRideStore } from "./store/userRideStore";
import { useGeolocated } from "react-geolocated";
import { useMapStore } from "./store/useMapStore";
import LiveLocation from "./LiveLocation";

function App() {
  const { getUser, authenticated, user } = useAuthStore();
  const { initialFormSubmitted } = useFormStore();
  const { gettingRides } = useRideStore();
  // const { shareLiveCoordinates } = useMapStore();

  useEffect(() => {
    getUser();
  }, []);

  // const { coords, isGeolocationEnabled, isGeolocationAvailable } = useGeolocated({
  //   positionOptions: {
  //     enableHighAccuracy: true
  //   },
  //   watchPosition: true,
  //   userDecisionTimeout: 5000
  // });

  // useEffect(()=>{

  //   console.log("Coords: ", coords);
  //   console.log("Is Geolocation Enabled: ", isGeolocationEnabled);
  //   console.log("Is Geolocation Available: ", isGeolocationAvailable);

  //   if(!isGeolocationEnabled){
  //     return toast.error("Location not enabled")
  //   }
  //   if(!isGeolocationAvailable){
  //     return toast.error("Location not available")
  //   }
  //   if(coords && authenticated){
  //     shareLiveCoordinates(coords)
  //   }

  // }, [coords])

  return (
    <div className={`relative w-[100vw] h-[100vh] overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-base-300 ${gettingRides && "overflow-y-hidden"}`}>
      <LiveLocation/>
      <Routes>
        <Route exact path="/" element={<LandingPage />}></Route>
        <Route exact path="/dashboard/*" element={authenticated && user?.initialFormSubmitted ? <Dashboard /> : <Navigate to={"/form"}/>}></Route>
        {/* <Route exact path="/account" element={authenticated ? <Account/> : <Navigate to={"/"}/>}></Route> */}
        <Route exact path="/form" element={authenticated ? (user?.initialFormSubmitted ? <Navigate to={"/dashboard"}/> : <Form/>) : <Navigate to={"/"}/>} ></Route>
        <Route exact path="/account/:id" element={<Account/>}></Route>
        <Route exact path="/info/*" element={<Wrapper/>}/>
        {/* <Map/> */}
        <Route exact path="/map/:id" element={<Map/>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
