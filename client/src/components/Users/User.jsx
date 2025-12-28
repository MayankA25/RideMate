import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import UserItem from '../UserItem/UserItem';
import { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';

export default function User() {
  const navigate = useNavigate();
  const { getAllUsers, allUsers } = useUserStore();
  useEffect(()=>{
    getAllUsers();
  }, [])
  return (
    <div className='w-[78%] h-full mx-auto py-8'>
      <div className="flex flex-col justify-center gap-8">
        <div className="flex items-center gap-5">
          <span className='cursor-pointer hover:bg-base-300 transition-all duration-300 p-2 rounded-full' onClick={()=>{
            navigate(-1);
          }}>
            <ArrowLeft className='size-5'/>
          </span>
          <h1 className='font-bold text-xl'>Users</h1>
        </div>
        <hr className='opacity-25' />
        <div className="flex flex-col justify-center gap-3">
          { allUsers.map((user, index)=>{
            return (
              <UserItem key={index} specificUser={user} index={index} />
            )
          }) }
        </div>
      </div>
    </div>
  )
}
