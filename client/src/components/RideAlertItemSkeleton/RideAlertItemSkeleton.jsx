import React from 'react'

export default function RideAlertItemSkeleton() {
  return (
    <div className="flex items-center bg-base-300 shadow-xl gap-3 rounded-2xl py-1 px-2 relative skeleton">
      {/* <div className="flex items-center justify-center font-semibold text-sm py-2 bg-base-300 absolute top-0 w-full left-0 rounded-t-xl">
        <span className="text-sm font-bold">Created At: </span>
      </div> */}
      <div className="grid grid-cols-2 w-full pt-5 relative">
        {/* <span className="absolute top-0 right-0 cursor-pointer text-white/70 py-1">
          <Trash2 className="text-red-300 size-4.5" />
        </span>
        <div className="flex items-center py-2 absolute top-0 gap-1.5">
          <div className="p-1.5 bg-red-400 rounded-full hover:scale-112 transition-all"></div>
          <div className="p-1.5 bg-yellow-400 rounded-full hover:scale-112 transition-all"></div>
          <div className="p-1.5 bg-green-400 rounded-full hover:scale-112 transition-all"></div>
        </div> */}
        <div className="flex items-center p-5 py-8 gap-10 pl-15">
          <div className="grid grid-cols-1 gap-8 relative ">
            <h1 className="font-bold relative before:content-[''] before:border-2 skeleton text-transparent">
              Pickup Address
            </h1>
            <h1 className="font-bold relative before:content-[''] before:border-2 skeleton text-transparent">
              Destination Address
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-end pr-[50%]">
          <h1 className="font-bold text-lg skeleton text-transparent">0 Seats</h1>
        </div>
      </div>
    </div>
  )
}
