import React, { useEffect } from "react";
import { useRideAlertStore } from "../../store/useRideAlertStore";
import { useRideStore } from "../../store/userRideStore";
import { useNavigate } from "react-router-dom";
import { useSuggestionStore } from "../../store/useSuggestionStore";

export default function FoundMatchModal({ closeBtnRef }) {
  useEffect(()=>{
    return ()=>{
      setMatchFound(false);
    }
  }, [])

  const { rideAlert, setMatchFound, addRideAlert } = useRideAlertStore();
  const { getAllRides } = useRideStore();
  const { setInfoFilled } = useSuggestionStore();
  const navigate = useNavigate();
  return (
    <dialog id={`my_found_match_modal`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Rides Found!</h3>
        <div className="py-4">
          <p className="font-semibold text-center">
            Rides from{" "}
            <span className="text-indigo-400 font-bold">
              {rideAlert.pickup.address}
            </span>{" "}
            to{" "}
            <span className="text-indigo-400 font-bold">
              {rideAlert.destination.address}
            </span>{" "}
            already exists.{" "}
          </p>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={()=>{
              closeBtnRef.current.click();
            }}>Close</button>
            <button className="btn btn-primary" onClick={()=>{
              getAllRides();
              navigate("/dashboard/rides");
              setInfoFilled(true);
            }}>View Rides</button>
            <button className="btn btn-primary" onClick={()=>{
              addRideAlert(true);
              closeBtnRef.current.click();
            }}>Add Alert</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
