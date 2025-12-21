import React, { useState } from "react";
import useChatStore from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function EditMessageModal({ messageText, messageId, rideId }) {
    const [updatedMessage, setUpdatedMessage] = useState(messageText);
    const { updateMessage } = useChatStore();
    const { user } = useAuthStore();
  return (
    <dialog id={`my_edit_message_modal_${messageId}`} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Update Message</h3>
        <div className="flex flex-col justify-center py-4 gap-2">
            <label htmlFor="text" className="font-bold">Message</label>
            <input type="text" className="input input-primary w-full focus:outline-0" value={updatedMessage} placeholder="Enter updated message" onChange={(e)=>{
                setUpdatedMessage(e.target.value)
            }}/>
        </div>
        <form method="dialog" className="mt-4">
            <div className="flex items-center justify-end">
                <button disabled={updatedMessage.length == 0} className="btn btn-primary" onClick={()=>{
                    updateMessage(messageId, updatedMessage, rideId);
                }}>Update</button>
            </div>
        </form>
      </div>
    </dialog>
  );
}
