import React from "react";

export default function UserDocumentOpenModal({ id, documentObject }) {
  return (
    <dialog id={`my_user_open_doc_modal_${id}`} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          {id.split("_")[1] == "1" ? "Aadhar Card" : "Driving License"}
        </h3>
        <div className="flex items-center">
          {documentObject.aadharCard || documentObject.drivingLicense && <img
            src={
              id.split("_")[1] == "1"
                ? documentObject.aadharCard
                : documentObject.drivingLicense
            }
            alt=""
          />}
        </div>
        <div className="modal-action">
          {/* <form method="dialog">
            <button className="btn">Close</button>
          </form> */}
        </div>
      </div>
    </dialog>
  );
}
