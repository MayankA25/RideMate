import React from "react";
import PassengerItem from "../PassengerItem/PassengerItem";

export default function PassengersModal({ rideId, index, passengers }) {
  return (
    <dialog id={`my_passenger_modal_${index}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Passengers ({passengers.length})</h3>
        <div className="flex flex-col p-3 gap-3 bg-base-300 my-4 rounded-xl py-5 max-h-75 overflow-y-scroll scrollbar-thin h-full">
          <div className="flex flex-col gap-3 h-full">
            {passengers.length != 0 ? (
              passengers.map((passenger, index) => {
                return (
                  <PassengerItem
                    key={index}
                    rideId={rideId}
                    index={index}
                    passenger={passenger}
                  />
                );
              })
            ) : (
              <h1 className="font-bold">No Passengers</h1>
            )}
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
