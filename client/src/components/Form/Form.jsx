import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./Form.css";
import { Country, State } from "country-state-city";
import { useFormStore } from "../../store/useFormStore";
import { Pen } from "lucide-react";
import toast from "react-hot-toast";
import { uploadFile } from "../../../utils/upload";
import { useAuthStore } from "../../store/useAuthStore";

export default function Form() {
  const { setFormDetails, formDetails, submitForm } = useFormStore();
  const { user } = useAuthStore();
  const [phone, setPhone] = useState("");
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState(countries[0].isoCode);
  const [countryStates, setCountryStates] = useState([]);
  const [selectedState, setSelectedState] = useState(
    State.getStatesOfCountry(countries[0].isoCode)[0].name
  );
  const ref = useRef(null);
  useEffect(() => {
    console.log("Countries: ", countries);
  }, []);
  useEffect(() => {
    const foundIndex = countries.findIndex(
      (country, index) => country.isoCode == selectedCountry
    );
    const states = State.getStatesOfCountry(selectedCountry);
    console.log("States: ", states);
    setCountryStates(states);
    setFormDetails({ country: countries[foundIndex].name });
    setSelectedState(states[0].name);
  }, [selectedCountry]);
  useEffect(() => {
    console.log("State: ", selectedState);
    setFormDetails({ state: selectedState });
  }, [selectedState]);

  useEffect(() => {
    setFormDetails({ phone: phone || "" });
  }, [phone]);

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("files", file);

    toast.promise(
      async () => {
        const urls = await uploadFile(formData);
        console.log("URLs: ", urls);
        setFormDetails({ profilePic: urls[0] });
      },
      {
        success: "Profile Picture Updated",
        loading: "Uploading...",
        error: "Error While Updating",
      }
    );
  };
  return (
    <div className="flex items-center justify-center h-full w-[65%] m-auto">
      <div className="flex flex-col justify-center py-8 w-[78%] m-auto gap-5">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold ">Basic Information</h1>
        </div>
        <div className="flex items-center justify-center h-45 w-45 relative">
          <img
            src={formDetails.profilePic || user?.profilePic}
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
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicUpload}
          />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center w-full gap-5">
            <div className="flex flex-col justify-center gap-3 w-full">
              <h1 className="text-xl font-bold">
                First Name<span className="mx-1 text-red-400">*</span>
              </h1>
              <input
                type="text"
                placeholder="First Name"
                className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300"
                readOnly
                value={user?.firstName || ""}
              />
            </div>
            <div className="flex flex-col justify-center gap-3 w-full">
              <h1 className="text-xl font-bold">
                Last Name<span className="mx-1 text-red-400">*</span>
              </h1>
              <input
                type="text"
                placeholder="Last Name"
                className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300"
                readOnly
                value={user?.lastName || ""}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="phone" className="text-lg font-bold">
              Phone Number
              <span className="mx-1 text-red-400">*</span>
            </label>
            <PhoneInput
              defaultCountry="IN"
              className="custom-input"
              placeholder="1234567890"
              value={phone || ""}
              onChange={setPhone}
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="flex flex-col justify-center w-full gap-2">
              <label htmlFor="country" className="text-lg font-bold">
                Country
                <span className="mx-1 text-red-400">*</span>
              </label>
              <select
                name="country"
                id="country"
                className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300"
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                }}
              >
                {countries.map((country, index) => {
                  return (
                    <option key={index} value={country.isoCode}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col justify-center w-full gap-2">
              <label htmlFor="country" className="text-lg font-bold">
                States
                <span className="mx-1 text-red-400">*</span>
              </label>
              <select
                name="country"
                id="country"
                className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300"
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {countryStates.map((state, index) => {
                  return (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* <div className="flex flex-col justify-center w-full gap-2">
            <label htmlFor="role" className="font-bold text-lg">
              Role <span className="text-red-400">*</span>
            </label>
            <select
              name="role"
              id="role"
              className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300"
              onChange={(e)=>setSelectedRole(e.target.value.toLowerCase())}
            >
              {roles.map((role, index) => {
                return (
                  <option key={index} value={role}>
                    {role}
                  </option>
                );
              })}
            </select>
          </div> */}
          {/* <div className="flex items-center w-full">
            <div className="flex flex-col justify-center w-full gap-3">
              <label htmlFor="aadhar" className="font-bold text-lg">Aadhar Card</label>
              <input type="file" name="aadhar" id="aadhar" className="file-input file-input-primary" />
            </div>
            {selectedRole == "driver" && <div className="flex flex-col justify-center w-full gap-3">
              <label htmlFor="license" className="font-bold text-lg">Driver Licenser (Only For Drivers)</label>
              <input type="file" name="license" accept="image/*" id="license" className="file-input file-input-primary" />
            </div>}
          </div> */}
        </div>
        <div className="flex items-center my-3">
          <button
            className="btn bg-indigo-500/5 hover:bg-indigo-500 border border-indigo-500 px-7 rounded-lg font-bold"
            onClick={() => {submitForm()}}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
