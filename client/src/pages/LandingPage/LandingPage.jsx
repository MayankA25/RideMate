import React from "react";
import KeyFeatures from "../../components/KeyFeatures/KeyFeatures";
import { useAuthStore } from "../../store/useAuthStore";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { authenticated, login, checking } = useAuthStore();
  const navigate = useNavigate();
  return (
    <>
          <Navbar />
    <div className="py-15 w-[80%] text-center m-auto">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-15">
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-5xl font-bold text-gray-300">
              RideMate -{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                Your Journey, Shared Smarter
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-bold">
              RideMate makes every journey easier, greener, and more fun by
              connecting you with the perfect ride companions.
            </p>
          </div>
          <div className="flex items-center justify-center text-2xl w-[85%] m-auto">
            <p className="font-semibold">
              RideMate is a smart carpooling and ride-sharing app designed to
              make commuting simple, social, and sustainable. Whether you’re
              heading to college, work, or any destination, RideMate connects
              you with fellow travelers going your way. Track rides in
              real-time, share routes, and enjoy a safe and convenient journey
              while saving time, money, and the environment. With RideMate,
              every ride becomes a shared adventure.
            </p>
          </div>
          <div className="flex items-center justify-center">
            {!authenticated && <button disabled={checking} className={`px-5 bg-gradient-to-br font-bold ${!checking ? "bg-indigo-500" : "bg-white/20 text-white/60"} rounded-lg py-2.5 cursor-pointer`} onClick={()=>login()}>{checking ? <Loader2 className="animate-spin"/> : "Sign in To Continue"}</button>}
            {authenticated && <button disabled={checking} className={`px-5 bg-gradient-to-br font-bold ${!checking ? "bg-indigo-500" : "bg-white/20 text-white/60"} rounded-lg py-2.5 cursor-pointer`} onClick={()=>navigate("/dashboard/rides")}>Go To Dashboard</button>}
          </div>
        </div>

        <KeyFeatures/>
      </div>
    </div>
    </>
  );
}
