import React from 'react'
import { Route, Routes } from 'react-router-dom'
import User from '../../components/Users/User'
import UserRides from '../../components/UserRides/UserRides'
import Reports from '../../components/Reports/Reports'

export default function UserWrapper() {
  return (
    <div className='w-full h-[100vh] flex items-center'>
      <Routes>
        <Route path="/" element={<User/>}></Route>
        <Route path='rides/:id' element={<UserRides/>} ></Route>
        <Route path='reports/:id' element={<Reports/>} />
      </Routes>
    </div>
  )
}
