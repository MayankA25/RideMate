import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Rides from '../../components/Rides/Rides'
import Partners from '../../components/Partners/Partners'
import Bookings from '../../components/Bookings/Bookings'
import Documents from '../../components/Requests/Requests'
import YourRides from '../../components/YourRides/YourRides'
import RideInfo from '../../components/RideInfo/RideInfo'
import { useState } from 'react'
import SearchRide from '../../components/SearchRide/SearchRide'
import { useSuggestionStore } from '../../store/useSuggestionStore'
import Chat from '../Chat/Chat'
import Map from '../../components/Map/Map'
import UserWrapper from '../UserWrapper/UserWrapper'
import RideAlert from '../../components/RideAlert/RideAlert'

export default function Dashboard() {
  // const [ infoFilled, setInfoFilled ] = useState(false);
  const { infoFilled, setInfoFilled } = useSuggestionStore();
  const navigate = useNavigate();



  return (
    <div className='w-full h-[100vh] flex items-center'> 
      <Sidebar/>
    <Routes>
        <Route path='rides' element={<Rides/>} />
        <Route path='search' element={<SearchRide/>}/>
        {/* <Route path='rides/:id' element={<RideInfo/>} /> */}
        <Route path='partners' element={<Partners/>}/>
        <Route path='your-rides' element={<YourRides/>} />
        <Route path='bookings' element={<Bookings/>}/>
        <Route path='ride-alerts' element={<RideAlert/>} />
        <Route path='users/*' element={<UserWrapper/>} />
        <Route path='requests' element={<Documents/>} />
        <Route path='chat/:id' element={<Chat/>}/>
        {/* <Route path='map' element={<Map/>} /> */}
    </Routes>
    </div>
  )
}
