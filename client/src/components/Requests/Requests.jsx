import React from "react";
import { useRequestStore } from "../../store/useRequestStore";
import { useEffect } from "react";

export default function Documents() {
  const { getRequests, requests, approveRequest, rejectRequest } = useRequestStore();
  useEffect(() => {
    getRequests();
  }, []);
  return (
    <div className="w-[78%] m-auto h-full">
      <div className="flex w-full">
        <div className="flex flex-col w-full gap-8 py-5">
          <div className="flex flex-col justify-center w-full px-3 gap-15">
            <div className="flex items-center-w-full">
              <input
                type="text"
                className="w-[85%] m-auto input input-primary focus:outline-0"
                placeholder="Search Requests By Name/Email"
              />
            </div>
            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl">Requests</h1>
                <select
                  defaultValue="All Requests"
                  className="select select-primary focus:outline-0"
                >
                  <option>All Requests</option>
                  <option>Pending Requests</option>
                  <option>Approved Requests</option>
                </select>
              </div>
              <div className="flex flex-col justify-center gap-1">
                {requests.length != 0 && requests.map((request, index) => {
                  return (
                    <div key={index} className="collapse bg-base-200 p-2">
                      <input type="radio" name="my-accordion-2" />
                      <div className="collapse-title font-semibold text-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={request.userId.profilePic}
                              className="rounded-full size-10"
                              alt=""
                            />
                            <div className="flex flex-col justify-center">
                              <h1 className="font-bold">
                                {request.userId.firstName}{" "}
                                {request.userId.lastName}
                              </h1>
                              <h1 className="text-sm">
                                {request.userId.email}
                              </h1>
                            </div>
                          </div>
                          <h1 className="text-sm">Request For { request.documents.map((document, index)=> <span key={index}>{Object.keys(document)}{index != request.documents.length-1 && ", "}</span>) } </h1>
                        </div>
                      </div>
                      <div className="collapse-content text-sm">
                        <div className="flex flex-col justify-center gap-3">
                          {request.documents.findIndex((doc, index)=>Object.keys(doc)[0] == "aadharCard") != -1 && <div className="grid grid-cols-2 items-center gap-4">
                            <h1 className="font-bold text-lg">Aadhar Card</h1>
                            <div className="grid grid-cols-3 gap-1">
                              <a href={request.userId.aadharCard} target="_blank" className="btn btn-primary font-semibold">View</a>
                              <button disabled={request.userId.aadharCardStatus == 'verified'} className="btn btn-primary font-semibold" onClick={()=>approveRequest(request.userId._id, "aadharCard")}>{request.userId.aadharCardStatus == 'verified' ? "Approved" : "Approve"}</button>
                              <button className="btn btn-error text-white font-semibold" onClick={()=>rejectRequest(request.userId._id, "aadharCard")}>{request.userId.aadharCardStatus == 'verified' ? "Revoke" : "Reject"}</button>
                            </div>
                          </div>}
                          {request.documents.findIndex((doc, index)=>Object.keys(doc)[0] == "drivingLicense") != -1 &&<div className="grid grid-cols-2 items-center gap-4">
                            <h1 className="font-bold text-lg">Driving License</h1>
                            <div className="grid grid-cols-3 gap-1">
                              <a href={request.userId.driverLicense} target="_blank" className="btn btn-primary font-semibold">View</a>
                              <button disabled={request.userId.drivingLicenseStatus == "verified"} className="btn btn-primary font-semibold" onClick={()=>approveRequest(request.userId._id,"drivingLicense")}>{request.userId.drivingLicenseStatus == 'verified' ? "Approved" : "Approve"}</button>
                              <button className="btn btn-error text-white font-semibold" onClick={()=>rejectRequest(request.userId._id, "drivingLicense")}>{request.userId.drivingLicenseStatus == 'verified' ? "Revoke" : "Reject"}</button>
                            </div>
                          </div>}
                          <span className="font-semibold">Issue Date: { new Date(request.createdAt).toLocaleString() }</span>
                          <span className="font-semibold">Updated At: { new Date(request.updatedAt).toLocaleString() } </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* <div className="collapse bg-base-200 p-2">
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title font-semibold text-xl">
                    How do I create an account?
                  </div>
                  <div className="collapse-content text-sm">
                    Click the "Sign Up" button in the top right corner and
                    follow the registration process.
                  </div>
                </div>
                <div className="collapse bg-base-200 p-2">
                  <input type="radio" name="my-accordion-2" />
                  <div className="collapse-title font-semibold text-xl">
                    How do I create an account?
                  </div>
                  <div className="collapse-content text-sm">
                    Click the "Sign Up" button in the top right corner and
                    follow the registration process.
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
