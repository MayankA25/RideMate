import { BadgeCheck, ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserDocumentOpenModal from "../UserDocumentOpenModal/UserDocumentOpenModal";

export default function UserItem({ specificUser, index }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center bg-base-300 py-5 px-4 gap-4 rounded-xl">
      <UserDocumentOpenModal
        id={`${index}_1`}
        documentObject={{ aadharCard: specificUser.aadharCard }}
        documentStatus={specificUser.aadharCardStatus}
        userId={specificUser._id}
      />
      <UserDocumentOpenModal
        id={`${index}_2`}
        documentObject={{ drivingLicense: specificUser.driverLicense }}
        documentStatus={specificUser.drivingLicenseStatus}
        userId={specificUser._id}
      />
      <div
        className="flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all py-5 px-4 rounded-lg"
        onClick={() => {
          navigate(`/account/${specificUser._id}`);
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={specificUser.profilePic}
            alt=""
            className="rounded-full w-10"
          />
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
      <div
        className={`grid ${
          (specificUser.aadharCardStatus == "under review" ||
            specificUser.aadharCardStatus == "verified" ||
            specificUser.drivingLicense == "under review" ||
            specificUser.drivingLicenseStatus == "verified") &&
          "grid-cols-3"
        } ${
          (specificUser.aadharCardStatus == "under review" ||
            specificUser.aadharCardStatus == "verified") &&
          (specificUser.drivingLicenseStatus == "under review" ||
            specificUser.drivingLicenseStatus == "verified") &&
          "grid-cols-4"
        } ${
          !(
            specificUser.aadharCardStatus == "under review" ||
            specificUser.aadharCardStatus == "verified"
          ) &&
          !(
            specificUser.drivingLicenseStatus == "under review" ||
            specificUser.drivingLicenseStatus == "verified"
          ) &&
          "grid-cols-2"
        } gap-3`}
      >
        {(specificUser.aadharCardStatus == "under review" ||
          specificUser.aadharCardStatus == "verified") && (
          <button
            className="btn btn-primary font-bold"
            onClick={() => {
              document
                .getElementById(`my_user_open_doc_modal_${index}_1`)
                .showModal();
            }}
          >
            Aadhar Card
          </button>
        )}
        {(specificUser.drivingLicenseStatus == "under review" ||
          specificUser.drivingLicenseStatus == "verified") && (
          <button className="btn btn-primary font-bold" onClick={()=>{
            document.getElementById(`my_user_open_doc_modal_${index}_2`).showModal()
          }}>Driving License</button>
        )}
        <button className="btn btn-primary font-bold">Show Rides</button>
        <button className="btn btn-error text-white font-bold">Remove</button>
      </div>
    </div>
  );
}
