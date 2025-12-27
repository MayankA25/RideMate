import { BadgeCheck, ChevronRight } from "lucide-react";
import React from "react";

export default function UserItem({ specificUser }) {
  return (
    <div className="flex flex-col justify-center bg-base-300 py-5 px-4 gap-4 rounded-xl">
      <div className="flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all py-6 px-4 rounded-lg">
        <div className="flex items-center gap-3">
          <img src="" alt="" />
          <div className="flex items-center gap-1.5">
            <h1>UserName</h1>
            <BadgeCheck />
          </div>
        </div>
        <ChevronRight/>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button className="btn btn-primary font-bold">Aadhar Card</button>
        <button className="btn btn-primary font-bold">Driving License</button>
        <button className="btn btn-primary font-bold">Show Rides</button>
        <button className="btn btn-error text-white font-bold">Remove</button>
      </div>
    </div>
  );
}
