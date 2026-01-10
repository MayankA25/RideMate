import React from 'react'

export default function UserSkeleton() {
  return (
    <div className='flex flex-col justify-center px-4 py-5 gap-3 skeleton'>
        <div className="flex items-center justify-between py-5 px-4 skeleton">
            <div className="flex items-center gap-2">
                <div className="rounded-full size-10 skeleton">
                </div>
                <h1 className='skeleton text-transparent'>UserName First Name</h1>
            </div>
            <div className="flex items-center justify-center p-4 skeleton"></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
            <button className='skeleton py-5'></button>
            <button className='skeleton py-5'></button>
            <button className='skeleton py-5'></button>
        </div>
    </div>
  )
}
