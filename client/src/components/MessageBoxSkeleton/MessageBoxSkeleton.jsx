import React from 'react'

export default function MessageBoxSkeleton({ index }) {
  return (
    <div className={`chat ${index % 2 == 0 ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="skeleton w-10 rounded-full">

        </div>
      </div>
      <div className="chat-header skeleton h-4 w-10 mb-1">
      </div>
      <div className='chat-bubble w-50 skeleton'>
        <div className='py-4'>

        </div>
      </div>
      <div className="chat-footer h-4 w-20 skeleton mt-1"></div>
    </div>
  )
}
