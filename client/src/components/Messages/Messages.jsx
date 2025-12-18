import React from 'react'
import MessageBox from '../MessageBox/MessageBox'
import useChatStore from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect } from 'react';

export default function Messages() {
  const { messages, getMessages } = useChatStore();
  const { user } = useAuthStore();

  return (
    <div className='flex flex-col gap-3 py-3 px-5 min-h-[83.5%]'>
        {messages.map((message, index)=>{
          return <MessageBox key={index} text={message.text} number={message.sender._id == user._id ? 1 : 0} />
        })}
    </div>
  )
}
