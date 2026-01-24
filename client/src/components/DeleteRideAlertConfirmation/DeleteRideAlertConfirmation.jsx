import React from 'react'
import { useRideAlertStore } from '../../store/useRideAlertStore'

export default function DeleteRideAlertConfirmation({ rideAlertId, pickup, destination }) {

    const { deleteRideAlert } = useRideAlertStore();

  return (
    <dialog id="my_delete_ride_alert_confirmation_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Delete Ride Alert!</h3>
    <p className="py-4 font-semibold">Are you sure you want to delete ride alert from <span className='text-indigo-400 font-bold'>{ pickup.address }</span> to <span className='text-indigo-400 font-bold'>{ destination.address }</span> ?</p>
    <div className="modal-action">
      <form method="dialog" className='flex items-center gap-1'>
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
        <button className="btn btn-primary" onClick={()=>{
            deleteRideAlert(rideAlertId);
        }}>Yes</button>
      </form>
    </div>
  </div>
</dialog>
  )
}
