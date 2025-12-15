import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { useRideStore } from '../../store/userRideStore';

export default function RideBookingConfirmation({ index, pickup, destination, rideId }) {
    const { user } = useAuthStore();
    const { joinRide } = useRideStore();
  return (
    <dialog id={`my_ride_confirm_modal_${index}`} className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Confirm Booking</h3>
    <p className="py-4 font-semibold">Are your sure you want to book ride from <span className='font-bold text-indigo-300'>{pickup}</span> to <span className='font-bold text-indigo-300'>{ destination }</span> ?</p>
    <div className="modal-action">
      <form method="dialog" className='flex gap-2'>
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
        <button className='btn btn-primary' onClick={()=>{
            joinRide(rideId, user._id)
        }}>Yes</button>
      </form>
    </div>
  </div>
</dialog>
  )
}
