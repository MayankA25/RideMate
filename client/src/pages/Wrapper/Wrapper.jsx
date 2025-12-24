import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import RideInfo from '../../components/RideInfo/RideInfo'
import { useAuthStore } from '../../store/useAuthStore'
import { Route, Routes } from 'react-router-dom';

export default function Wrapper() {
  const { user } = useAuthStore();
  return (
    <div className='w-full h-[100vh] flex relative '>
        {user && <Sidebar/>}
        <Routes>
          <Route path='rides/:id' element={<RideInfo/>}/>
        </Routes>  
    </div>
  )
}
