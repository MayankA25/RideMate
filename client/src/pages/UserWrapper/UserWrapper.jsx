import React from 'react'
import { Route, Routes } from 'react-router-dom'
import User from '../../components/Users/User'

export default function UserWrapper() {
  return (
    <div className='w-full h-[100vh] flex items-center'>
      <Routes>
        <Route path="/" element={<User/>}></Route>
      </Routes>
    </div>
  )
}
