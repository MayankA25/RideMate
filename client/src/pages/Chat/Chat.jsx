import React from 'react'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import ChatBox from '../../components/ChatBox/ChatBox'
import Messages from '../../components/Messages/Messages'
import { useEffect } from 'react'
import useChatStore from '../../store/useChatStore'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function Chat() {

    const { joinRoom, leaveRoom, selectedGroup, gettingGroup } = useChatStore();
    const { user } = useAuthStore();

    const params = useParams();;
    const navigate = useNavigate();

    useEffect(()=>{
        joinRoom(params.id);
        if(!gettingGroup && Object.keys(selectedGroup).length == 0){
          navigate("/dashboard/bookings");
        }
        return ()=>{
            leaveRoom(params.id);
        }
    }, [])

    const checkIfUserIsMember = ()=>{
      const members = selectedGroup?.members || [];

      const foundIndex = members.findIndex((member)=>{
        return member._id == user._id
      })

      return foundIndex != -1
    }

  return (
    <div className='w-[78%] m-auto h-full relative'>
      <div className="flex flex-col h-full relative">
        <ChatHeader/>
        <Messages/>
        {checkIfUserIsMember() && <ChatBox/>}
      </div>
    </div>
  )
}
