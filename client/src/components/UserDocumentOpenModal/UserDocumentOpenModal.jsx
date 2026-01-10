import React, { useEffect } from "react";
import { useRequestStore } from "../../store/useRequestStore";

export default function UserDocumentOpenModal({
  id,
  documentObject,
  documentStatus,
  userId,
}) {
  const { approveRequest, rejectRequest } = useRequestStore();
  // useEffect(() => {
  //     getRequests();
  //   }, []);
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
        <div className="flex items-center py-4">
          {(documentObject.aadharCard || documentObject.drivingLicense) && (
            <img
              src={
                id.split("_")[1] == "1"
                  ? documentObject.aadharCard
                  : documentObject.drivingLicense
              }
              alt=""
            />
          )}
        </div>
        <div className="modal-action">
          {/* <form method="dialog">
            <button className="btn">Close</button>
          </form> */}
          <form method="dialog" className="flex gap-3">
            <button
              className="btn btn-error text-white"
              onClick={() => {
                rejectRequest(userId, Object.keys(documentObject)[0]);
              }}
            >
              {documentStatus == "verified" ? "Revoke" : "Reject"}
            </button>
            <button
              disabled={documentStatus == "verified"}
              className="btn btn-primary"
              onClick={() => {
                approveRequest(userId, Object.keys(documentObject)[0]);
              }}
            >
              Approve
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
