import React from 'react'
import { useUserStore } from '../../store/useUserStore';

export default function BanUserConfirmation({ user, index }) {
    const { removeUser } = useUserStore();
  return (
    <dialog id={`my_ban_user_modal_${index}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{user.email}</h3>
        <p className="py-4 font-semibold text-center text-lg">Are you sure you want to <span className="text-red-300 font-bold">permanently ban { user.firstName } ({user.email})</span> from the app ? </p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button className="btn btn-error text-white" onClick={()=>{
                removeUser(user._id, true);
            }} >Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
