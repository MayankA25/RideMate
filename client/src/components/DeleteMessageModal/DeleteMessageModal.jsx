import React from 'react'
import useChatStore from '../../store/useChatStore'

export default function DeleteMessageModal({ messageId, messageText, rideId }) {
    const { deleteMessage } = useChatStore();
  return (
    <dialog id={`my_delete_message_modal_${messageId}`} className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Delete Message ?</h3>
    <p className="py-4 px-2 font-bold">{messageText}</p>
    <div className="modal-action">
      <form method="dialog" className='flex gap-3'>
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">No</button>
        <button className="btn btn-primary" onClick={()=>{
            deleteMessage(messageId, rideId)
        }}>Yes</button>
      </form>
    </div>
  </div>
</dialog>
  )
}
