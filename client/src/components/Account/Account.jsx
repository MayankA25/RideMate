import { ArrowLeft, BadgeCheck, Edit2, Pen, ShieldCheck, TriangleAlert } from "lucide-react";
import React, { useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import EditAccountModal from "../EditAccountModal/EditAccountModal";
import UploadDocModal from "../UploadDocModal/UploadDocModal";
import { uploadFile } from "../../../utils/upload";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import SubmitReportModal from "../SubmitReportModal/SubmitReportModal";
import useReportStore from "../../store/useReportStore";

export default function Account() {

  const params = useParams();

  const ref = useRef(null);
  const { user, updateProfilePicture, getUserById, specificUser, isUserAuthenticatedAccount, loading } = useAuthStore();
  const navigate = useNavigate();

  const [ userProfile, setUserProfile ] = useState(user?.profilePic);

  const { setReportDetails } = useReportStore();

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


  useEffect(()=>{
    console.log("Params: ", params);
    getUserById(params.id)
  }, []);

  useEffect(()=>{
    if(!isUserAuthenticatedAccount){
      navigate("/")
    }
  }, [isUserAuthenticatedAccount])

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
            <h1 className="font-bold text-lg">{user && params.id == user?._id ? "Your Account" : specificUser?.firstName}</h1>
          </div>
          {user && params.id == user._id && <button
            className="btn bg-base-300 gap-3 rounded-lg"
            onClick={() =>
              document.getElementById("my_edit_account_modal").showModal()
            }
          >
            <Edit2 className="size-5" /> Edit
          </button>}
        </div>
        <hr className={`text-white/30 ${loading && "opacity-0"}`} />
        <div className="flex items-center">
          <div className={`flex items-center gap-5 w-full ${user && params.id == user._id && "border-r border-white/30"}`}>
            <div className="flex items-center justify-center h-55 w-55 relative">
              <img
                src={user && params.id == user?._id ? (userProfile || user?.profilePic) : specificUser?.profilePic}
                className={`w-full h-full rounded-full object-contain bg-base-300 ${loading && "skeleton"}`}
              />
              {user && params.id == user._id && <div
                className="flex items-center justify-center w-full h-full absolute top-0 bg-white/10 rounded-full backdrop-blur-lg opacity-0 hover:opacity-100 transition-all duration-200 cursor-pointer"
                onClick={() => ref.current.click()}
              >
                <Pen />
              </div>}
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
                  {user && params.id == user._id ? user?.firstName : specificUser?.firstName} {user && params.id == user._id ? user?.lastName : specificUser?.lastName}
                </h1>
                <div className="relative" >
                  {(user && params.id == user._id ? (user?.aadharCardStatus == 'verified' || user?.drivingLicenseStatus == 'verified'):(specificUser?.aadharCardStatus == 'verified' || specificUser?.drivingLicenseStatus == 'verified')) && <BadgeCheck className={`size-7 ${(user && params.id == user._id ? user?.aadharCardStatus == 'verified': specificUser?.aadharCardStatus == 'verified') && (user && params.id == user._id ? user?.drivingLicenseStatus == 'verified' : specificUser?.drivingLicenseStatus == 'verified') ? "text-green-300" : "text-yellow-300"}`} onMouseOver={()=>{setHover(true)}} onMouseOut={()=>{setHover(false)}} />}
                  <div className={`chat chat-start absolute -top-10 left-8 w-50 transition-all duration-200 ${hover ? "opacity-100" : "opacity-0"}`}>
                    <div className="chat-bubble bg-primary font-bold text-center text-sm">
                      {(user && params.id == user._id ? (user?.aadharCardStatus == 'verified' && user?.drivingLicenseStatus == 'verified'): (specificUser?.aadharCardStatus == 'verified' && specificUser?.drivingLicenseStatus == 'verified')) && "Verified User"}
                      {(user && params.id == user._id ?(user?.aadharCardStatus == 'verified' && user?.drivingLicenseStatus != 'verified') : (specificUser?.aadharCardStatus == 'verified' && specificUser?.drivingLicenseStatus != 'verified')) && "Aadhar Card Verified"}
                      {(user && params.id == user._id ? (!user?.aadharCardStatus == 'verified' && user?.drivingLicenseStatus == 'verified') : (!specificUser?.aadharCardStatus == 'verified' && specificUser?.drivingLicenseStatus == 'verified')) && "Driving License Verified"}
                    </div>
                  </div>
                </div>
              </div>
              {/* <h1 className="text-lg font-semibold">{user && params.id == user._id ? user?.role[0] : specificUser?.role[0]}</h1> */}
            </div>
          </div>
          {user && params.id == user._id && <div className="flex flex-col justify-center w-full gap-8 pl-10">
            <div className="grid grid-cols-2 gap-10">
              <UploadDocModal index={1} document={"Aadhar Card"} />
              <h1 className="font-bold text-lg">Aadhar Card</h1>
              <button
                disabled={user?.aadharCardStatus == "under review" || user?.aadharCardStatus == 'verified'}
                className={`btn border ${user?.aadharCardStatus == "verified" ? "bg-green-500 border-green-700 cursor-default" : "bg-indigo-500/5  border-indigo-500 hover:bg-indigo-500"}  rounded-lg font-bold `}
                onClick={() => {
                  document
                    .getElementById(`my_upload_doc_modal_${1}`)
                    .showModal();
                }}
              >
                {user?.aadharCardStatus == "not verified"
                  ? "Verify"
                  : `${user?.aadharCardStatus.split(" ")[0].slice(0,1).toUpperCase()}${user?.aadharCardStatus.split(" ")[0].slice(1)} ${user?.aadharCardStatus.split(" ")[1]? user?.aadharCardStatus.split(" ")[1].slice(0,1)?.toUpperCase() : ""}${user?.aadharCardStatus.split(" ")[1]? user?.aadharCardStatus.split(" ")[1].slice(1) : ""}`}
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
                disabled={user?.drivingLicenseStatus == "under review" || user?.drivingLicenseStatus == 'verified'}
                className={`btn border ${user?.drivingLicenseStatus == "verified" ? "bg-green-500 border-green-700 cursor-default" : "bg-indigo-500/5  border-indigo-500 hover:bg-indigo-500"}  rounded-lg font-bold `}
                onClick={() => {
                  document
                    .getElementById(`my_upload_doc_modal_${2}`)
                    .showModal();
                }}
              >
                {user?.drivingLicenseStatus == "not verified"
                  ? "Verify"
                  : `${user?.drivingLicenseStatus.split(" ")[0].slice(0,1).toUpperCase()}${user?.drivingLicenseStatus.split(" ")[0].slice(1)} ${user?.drivingLicenseStatus.split(" ")[1]? user?.drivingLicenseStatus.split(" ")[1].slice(0,1)?.toUpperCase() : ""}${user?.drivingLicenseStatus.split(" ")[1]? user?.drivingLicenseStatus.split(" ")[1].slice(1) : ""}`}
              </button>
            </div>
          </div>}
        </div>
        <hr className={`text-white/30 ${loading && "opacity-0"}`}/>
        <div className="flex flex-col justify-center gap-8">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-4xl ${loading && "skeleton text-transparent"}`}>{user && params.id == user._id ? "Personal Information" : "User Information"}</h1>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>Name</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>
              {user && params.id == user._id ? user?.firstName : specificUser?.firstName} {user && params.id == user._id ? user?.lastName : specificUser?.lastName}
            </h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>Email</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>{user && params.id == user._id ? user?.email : specificUser?.email}</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>Phone</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>{user && params.id == user._id ? user?.phone : specificUser?.phone}</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>Location</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>
              {user && params.id == user._id ? user?.state : specificUser?.state}, {user && params.id == user._id ? user?.country : specificUser?.country}
            </h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>Gender</h1>
            <h1 className={`font-bold text-lg ${loading && "skeleton text-transparent"}`}>{ user && params.id == user._id ? user?.gender : specificUser?.gender }</h1>
          </div>
        </div>
        {<hr className={`text-white/30 ${loading && "opacity-0"}`} />}
        {user && <div className="flex items-center">
          <SubmitReportModal />
          <div className={`flex items-center gap-2 text-indigo-300 ${loading && "skeleton text-transparent"}`}>
            <TriangleAlert className="cursor-pointer" onClick={()=>{
              document.getElementById('my_report_submission_modal').showModal()
            }}/>
            <span className="font-bold cursor-pointer" onClick={()=>{
              document.getElementById('my_report_submission_modal').showModal()
            }}>Report User</span>
          </div>
        </div>}
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
