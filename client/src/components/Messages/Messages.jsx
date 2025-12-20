import React from 'react'
import MessageBox from '../MessageBox/MessageBox'
import useChatStore from '../../store/useChatStore'
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect } from 'react';

export default function Messages() {
  const { messages, subscribeToGroupMessages, unsubscribeToGroupMessages, getMessages, selectedGroup } = useChatStore();
  const { user } = useAuthStore();

  useEffect(()=>{
    subscribeToGroupMessages();
    return ()=>{
      unsubscribeToGroupMessages()
    }
  }, [])

  useEffect(()=>{
    getMessages(selectedGroup._id);
  }, [selectedGroup])

  return (
    <div className='flex flex-col gap-3 py-3 px-5 min-h-[83.5%]'>
        {messages.map((message, index)=>{
          return <MessageBox key={index} message={message} number={message.sender._id == user._id ? 1 : 0} sender={message.sender} />
        })}
    </div>
  )
}
