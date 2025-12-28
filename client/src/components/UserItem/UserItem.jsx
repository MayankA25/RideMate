import { BadgeCheck, ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserDocumentOpenModal from "../UserDocumentOpenModal/UserDocumentOpenModal";

export default function UserItem({ specificUser, index }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center bg-base-300 py-5 px-4 gap-4 rounded-xl">
      <div className="flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all py-5 px-4 rounded-lg" onClick={()=>{
        navigate(`/account/${specificUser._id}`)
      }}>
        <div className="flex items-center gap-3">
          <img
            src={specificUser.profilePic}
            alt=""
            className="rounded-full w-10"
          />
          <UserDocumentOpenModal id={`${index}_1`} documentObject={{ aadharCard: "" }} />
          <UserDocumentOpenModal id={`${index}_2`} documentObject={{ drivingLicense: "" }} />
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-lg">{specificUser.firstName}</h1>
            {specificUser.aadharCardStatus == "verified" ||
              (specificUser.drivingLicenseStatus == "verified" && (
                <BadgeCheck
                  className={`${
                    ((specificUser.aadharCardStatus == "verified" &&
                      specificUser.drivingLicenseStatus != "verified") ||
                      (specificUser.aadharCardStatus != "verified" &&
                        specificUser.drivingLicenseStatus == "verified")) &&
                    "text-yellow-300"
                  } ${
                    specificUser.aadharCardStatus == "verified" &&
                    specificUser.drivingLicenseStatus == "verified" &&
                    "text-green-300"
                  }`}
                />
              ))}
          </div>
        </div>
        <ChevronRight />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button className="btn btn-primary font-bold" onClick={()=>{ document.getElementById(`my_user_open_doc_modal_${index}_1`).showModal() }}>Aadhar Card</button>
        <button className="btn btn-primary font-bold">Driving License</button>
        <button className="btn btn-primary font-bold">Show Rides</button>
        <button className="btn btn-error text-white font-bold">Remove</button>
      </div>
    </div>
  );
}
