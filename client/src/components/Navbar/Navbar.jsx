import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { login, authenticated, logout } = useAuthStore();
  return (
    <div className='flex items-center w-full justify-center sticky top-0 bg-base-200 py-5 z-50'>
      <div className="flex items-center justify-between w-[80%] ">
        <h1 className='text-2xl font-bold'>RideMate</h1>
        {/* {!authenticated && <button className="flex items-center btn bg-pink-500 font-bold text-lg rounded-md hover:bg-indigo-500 transition-all duration-200" onClick={()=>login()}>Login</button>} */}
        {!authenticated && <div></div>}
        {authenticated && <button className="flex items-center btn bg-indigo-500/20 border border-indigo-500 hover:bg-indigo-500 rounded-lg transition-all duration-200" onClick={()=>logout()}><LogOut/> LogOut</button>}
      </div>
    </div>
  )
}
