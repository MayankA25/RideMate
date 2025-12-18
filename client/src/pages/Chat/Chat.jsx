import React from 'react'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import ChatBox from '../../components/ChatBox/ChatBox'
import Messages from '../../components/Messages/Messages'
import { useEffect } from 'react'
import useChatStore from '../../store/useChatStore'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function Chat() {

    const { joinRoom, leaveRoom } = useChatStore();

    const params = useParams();

    useEffect(()=>{
        joinRoom(params.id);
        return ()=>{
            leaveRoom(params.id);
        }
    }, [])

  return (
    <div className='w-[78%] m-auto h-full relative'>
      <div className="flex flex-col h-full relative">
        <ChatHeader/>
        <Messages/>
        <ChatBox/>
      </div>
    </div>
  )
}
