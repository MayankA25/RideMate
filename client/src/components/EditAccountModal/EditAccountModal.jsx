import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import PhoneInput from "react-phone-number-input";
import { Country, State } from "country-state-city";

export default function EditAccountModal() {
  const { user, editAccountDetails, setEditAccountDetails, submitEditAccountDetails } = useAuthStore();
  const [phone, setPhone] = useState(user.phone);


  const countries = Country.getAllCountries();

  const countryISOCode = countries[countries.findIndex((country, index)=>country.name == user.country)].isoCode;

  const allStates = State.getStatesOfCountry(countryISOCode);

  const [states, setStates] = useState(allStates);
  // console.log("States: ", states);
  
  
  

  const stateISOCode = allStates[allStates.findIndex((state, index)=>state.name == user.state)].isoCode;


  // console.log("State Index: ", userStateISOIndex);


  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(()=>{
      const userCountryISOIndex = countries.findIndex((country, index)=>country.name == user.country);
      setStates(State.getStatesOfCountry(countries[userCountryISOIndex].isoCode));
      const userStateISOIndex = states.findIndex((state, index) => state.name == user.state)
  const userCountry = countries[userCountryISOIndex].name;
  const userState = states[userStateISOIndex].name;

  setSelectedCountry(userCountry);
  setSelectedState(userState);
  }, [])

  // console.log("Countries: ", countries);
  // console.log("States: ", states);

  let changed = false;

  useEffect(()=>{
    // const foundCountryIndex = countries.findIndex((country, index)=> country.name == selectedCountry);
    // if(changed){
    //   const newStates = State.getStatesOfCountry(countries[foundCountryIndex].isoCode);
    //   setStates(newStates);
    //   setSelectedState(newStates[0].name);
    // };

    console.log("States: ", states);
    console.log("Selected State: ", selectedState);
    setEditAccountDetails({ country: selectedCountry, state: selectedState });
  }, [selectedCountry]);

  useEffect(()=>{
    setEditAccountDetails({ state: selectedState });
  }, [selectedState]);


  useEffect(()=>{
    setEditAccountDetails({ phone: phone });
  }, [phone]);

  const genders = ["Male", "Female", "Other"]


  return (
    <dialog id="my_edit_account_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Details!</h3>
        <div className="py-4 flex items-center ">
          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="firstName" className="font-semibold">First Name<span className="text-red-400 mx-1">*</span></label>
              <input type="text" id="firstName" name="firstName" value={user.firstName} readOnly className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="lastName" className="font-semibold">Last Name<span className="text-red-400 mx-1">*</span></label>
              <input type="text" id="lastName" name="lastName" value={user.lastName} readOnly className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" />
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="email" className="font-semibold">Email<span className="text-red-400 mx-1">*</span></label>
              <input type="text" id="email" name="email" className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" value={user.email} readOnly />
            </div>
            <div className="flex flex-col jusitify-center gap-2">
              <label htmlFor="phone" className="font-semibold">
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
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="gender" className="font-semibold">Gender<span className="text-red-400 mx-1">*</span></label>
              <select name="gender" id="gender" className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" defaultValue={user.gender}
              onChange={(e)=>{
                setEditAccountDetails({ gender: e.target.value })
              }}>
                {genders.map((gender, index)=>{
                  return <option>{gender}</option>
                })}
              </select>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="country" className="font-semibold">Country<span className="text-red-400 mx-1">*</span></label>
              <select name="country" id="country" className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" defaultValue={countryISOCode} onChange={(e)=>{
                const foundCountryIndex = countries.findIndex((countryElem, index)=>countryElem.isoCode == e.target.value);
                setSelectedCountry(countries[foundCountryIndex].name);
                const newStates = State.getStatesOfCountry(countries[foundCountryIndex].isoCode);
                setStates(newStates);
                setSelectedState(newStates[0].name);
              }}>
                {countries.map((country, index)=>{
                  return (
                    <option key={index} value={country.isoCode}>{country.name}</option>
                  )
                })}
              </select>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="country" className="font-semibold">States<span className="text-red-400 mx-1">*</span></label>
              <select name="country" id="country" className="border rounded-md py-2.5 px-3 border-indigo-500 focus:outline-0 focus:border-2 w-full bg-base-200 focus:bg-base-300" defaultValue={stateISOCode} onClick={(e)=>{
                const foundStateIndex = states.findIndex((stateElem, index)=>stateElem.isoCode == e.target.value);
                setSelectedState(states[foundStateIndex].name);
                }}>
                {states.map((state, index)=>{
                  return (
                    <option key={index} value={state.isoCode}>{state.name}</option>
                  )
                })}
              </select>
            </div>
            <div className="flex flex-col justify-center">
              <label htmlFor="state"></label>
              <select name="state" id="state">State</select>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
            <button className="btn btn-primary" onClick={()=>submitEditAccountDetails()}>Submit</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
