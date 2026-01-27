import React from 'react'

export default function TrendingRidesItem() {
  return (
    <div className="flex flex-col justify-center bg-white/7 px-4 py-2 w-full rounded-lg cursor-pointer gap-2">
        <span className='text-xs font-bold'>Date Here</span>
        <div className="flex flex-col justify-center">
            <span className='text-sm font-bold'>Pickup Address to Destination Address</span>
        </div>
    </div>
  )
}
