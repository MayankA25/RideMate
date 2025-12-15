import { ArrowLeft, BadgeCheck, Edit2, Pen, ShieldCheck } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import EditAccountModal from "../EditAccountModal/EditAccountModal";
import UploadDocModal from "../UploadDocModal/UploadDocModal";
import { uploadFile } from "../../../utils/upload";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Account() {
  const ref = useRef(null);
  const { user, updateProfilePicture } = useAuthStore();
  const navigate = useNavigate();

  const [ userProfile, setUserProfile ] = useState(user?.profilePic);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();

    formData.append("files", file);

    toast.promise(async ()=>{
      const urls = await uploadFile(formData);
      console.log("URLS: ", urls[0]);
      setUserProfile(urls[0])
    }, {
      loading: "Uploading",
      success: "Uploaded",
      error: "Error While Updating Profile Picture"
    })

  };

  const [hover, setHover] = useState(false);

  // useEffect(()=>{
  //   updateProfilePicture(userProfile)
  // }, [userProfile])

  return (
    <div className="w-[65%] m-auto h-full py-8">
      <div className="flex flex-col justify-center gap-10">
        {user && <EditAccountModal />}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="p-2 transition-all duration-200 hover:bg-neutral/40 rounded-full cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft className="size-5" />
            </span>
            <h1 className="font-bold text-lg">Your Account</h1>
          </div>
          <button
            className="btn bg-base-300 gap-3 rounded-lg"
            onClick={() =>
              document.getElementById("my_edit_account_modal").showModal()
            }
          >
            <Edit2 className="size-5" /> Edit
          </button>
        </div>
        <hr className="text-white/30" />
        <div className="flex items-center">
          <div className="flex items-center gap-5 w-full border-r border-white/30">
            <div className="flex items-center justify-center h-55 w-55 relative">
              <img
                src={userProfile}
                className="w-full h-full rounded-full object-contain bg-base-300"
              />
              <div
                className="flex items-center justify-center w-full h-full absolute top-0 bg-white/10 rounded-full backdrop-blur-lg opacity-0 hover:opacity-100 transition-all duration-200 cursor-pointer"
                onClick={() => ref.current.click()}
              >
                <Pen />
              </div>
              <input
                ref={ref}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileUpload}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="relative" >
                  {(user.aadharCardStatus == 'verified' || user.drivingLicenseStatus == 'verified') && <BadgeCheck className={`size-7 ${user.aadharCardStatus == 'verified' && user.drivingLicenseStatus == 'verfied' ? "text-green-300" : "text-yellow-300"}`} onMouseOver={()=>{setHover(true)}} onMouseOut={()=>{setHover(false)}} />}
                  <div className={`chat chat-start absolute -top-10 left-8 w-50 transition-all duration-200 ${hover ? "opacity-100" : "opacity-0"}`}>
                    <div className="chat-bubble bg-primary font-bold text-center text-sm">
                      {user.aadharCardStatus == 'verified' && user.drivingLicenseStatus == 'verified' && "Verified User"}
                      {(user.aadharCardStatus == 'verified' && user.drivingLicenseStatus != 'verified') && "Aadhar Card Verified"}
                      {!user.aadharCardStatus == 'verified' && user.drivingLicenseStatus == 'verified' && "Driving License Verified"}
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-lg font-semibold">{user.role[0]}</h1>
            </div>
          </div>
          <div className="flex flex-col justify-center w-full gap-8 pl-10">
            <div className="grid grid-cols-2 gap-10">
              <UploadDocModal index={1} document={"Aadhar Card"} />
              <h1 className="font-bold text-lg">Aadhar Card</h1>
              <button
                disabled={user.aadharCardStatus == "under review"}
                className={`btn border ${user.aadharCardStatus == "verified" ? "bg-green-500 border-green-700 cursor-default" : "bg-indigo-500/5  border-indigo-500 hover:bg-indigo-500"}  rounded-lg font-bold `}
                onClick={() => {
                  document
                    .getElementById(`my_upload_doc_modal_${1}`)
                    .showModal();
                }}
              >
                {user.aadharCardStatus == "not verified"
                  ? "Verify"
                  : `${user.aadharCardStatus.split(" ")[0].slice(0,1).toUpperCase()}${user.aadharCardStatus.split(" ")[0].slice(1)} ${user.aadharCardStatus.split(" ")[1]? user.aadharCardStatus.split(" ")[1].slice(0,1)?.toUpperCase() : ""}${user.aadharCardStatus.split(" ")[1]? user.aadharCardStatus.split(" ")[1].slice(1) : ""}`}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <UploadDocModal index={2} document={"Driving License"} />
              <div className="flex flex-col">
                <h1 className="font-bold text-lg">Driving License</h1>
                <span className="font-bold text-sm">
                  If want to become a driver
                </span>
              </div>
              <button
                disabled={user.drivingLicenseStatus == "under review"}
                className={`btn border ${user.drivingLicenseStatus == "verified" ? "bg-green-500 border-green-700 cursor-default" : "bg-indigo-500/5  border-indigo-500 hover:bg-indigo-500"}  rounded-lg font-bold `}
                onClick={() => {
                  document
                    .getElementById(`my_upload_doc_modal_${2}`)
                    .showModal();
                }}
              >
                {user.drivingLicenseStatus == "not verified"
                  ? "Verify"
                  : `${user.drivingLicenseStatus.split(" ")[0].slice(0,1).toUpperCase()}${user.drivingLicenseStatus.split(" ")[0].slice(1)} ${user.drivingLicenseStatus.split(" ")[1]? user.drivingLicenseStatus.split(" ")[1].slice(0,1)?.toUpperCase() : ""}${user.drivingLicenseStatus.split(" ")[1]? user.drivingLicenseStatus.split(" ")[1].slice(1) : ""}`}
              </button>
            </div>
          </div>
        </div>
        <hr className="text-white/30" />
        <div className="flex flex-col justify-center gap-8">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-4xl">Personal Information</h1>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <h1 className="font-bold text-lg">Name</h1>
            <h1 className="font-bold text-lg">
              {user?.firstName} {user?.lastName}
            </h1>
            <h1 className="font-bold text-lg">Email</h1>
            <h1 className="font-bold text-lg">{user?.email}</h1>
            <h1 className="font-bold text-lg">Phone</h1>
            <h1 className="font-bold text-lg">{user?.phone}</h1>
            <h1 className="font-bold text-lg">Location</h1>
            <h1 className="font-bold text-lg">
              {user?.state}, {user?.country}
            </h1>
          </div>
        </div>
        <hr className="text-white/30" />
        {/* <div className="flex flex-col justify-center gap-8 w-full">
          <h1 className="font-bold text-3xl">Verified Documents</h1>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col justify-center w-full gap-3">
                <label htmlFor="aadhar" className="font-bold text-lg">
                  Aadhar Card
                </label>
                <button className="btn btn-primary w-[50%]">Show Aadhar</button>
              </div>
              <div className="flex flex-col justify-center w-full gap-3">
                <label htmlFor="license" className="font-bold text-lg">
                  Driving License
                </label>
                <button className="btn btn-primary w-[50%]">
                  Show Driving License
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
    // <div>
    //   Heyyyy
    // </div>
  );
}
