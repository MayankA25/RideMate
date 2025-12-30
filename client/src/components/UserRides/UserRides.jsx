import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import RideCard from '../RideCard/RideCard';
import { useUserStore } from '../../store/useUserStore';

export default function UserRides() {
    const navigate = useNavigate();

    const { getUserRides, userRides } = useUserStore();

    const params = useParams();

    useEffect(()=>{
        getUserRides(params.id);
    }, [])
  return (
    <div className="w-[78%] h-full m-auto">
      <div className="flex flex-col py-10 gap-5">
        <div className="flex items-center px-3 gap-5">
          <span
            className="flex items-center transition-all cursor-pointer hover:bg-base-300 p-2 rounded-full"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft className="size-5" />
          </span>
          <h1 className="font-bold text-xl">User Rides</h1>
        </div>
        <hr className="text-white/15" />
        <div className="flex flex-col justify-center gap-10">
          {/* <div className="flex items-center">
            <input type="text" className='input input-primary w-full' placeholder='Search Rides' />
          </div> */}
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-xl">
              Available Rides({userRides.length})
            </h1>
          </div>
          <div className="flex flex-col gap-5">
            {userRides.map((ride, index) => {
              return (
                <RideCard key={index} ride={ride} index={index} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
