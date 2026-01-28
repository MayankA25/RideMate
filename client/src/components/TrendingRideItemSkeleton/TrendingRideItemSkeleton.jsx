import React from 'react'

export default function TrendingRideItemSkeleton() {
  return (
    <div className='flex flex-col justify-center border border-white/10 px-4 py-5 w-full rounded-lg gap-2 skeleton'>
        <div className="flex items-center justify-between">
            <span className='text-xs font-bold skeleton text-transparent'>Date Here</span>
            <span className='text-xs font-bold skeleton text-transparent'>0</span>
        </div>
        <div className="flex flex-col">
            <span className='text-sm font-bold text-transparent skeleton'>
                Pickup Address -- to -- Destination Addresss
            </span>
        </div>
    </div>
  )
}
