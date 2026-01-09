import React from "react";

export default function RideSkeleton() {
  return (
    <div className="skeleton py-1 px-2 rounded-xl cursor-default">
      <div className="grid grid-cols-4 w-full">
        <div
          className="flex items-center p-5 py-8 gap-10 pl-15"
        >
          <div
            className="grid grid-cols-1 gap-8 relative "
          >
            <h1 className="font-bold relative before:content-[''] before:border-2 text-transparent skeleton">
                PickupAddress
            </h1>
            <h1 className="font-bold relative before:content-[''] before:border-2 text-transparent skeleton">
              Destination Address
            </h1>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
        >
          <h1 className="font-bold text-lg skeleton p-2 text-transparent">
            0/0
          </h1>
        </div>
        <div
          className="flex items-center justify-center"
        >
          <h1 className="font-bold text-lg skeleton text-transparent px-4 py-1">Fare</h1>
        </div>
        <div className="flex flex-col justify-center gap-3 p-3">
          <button
            className="py-2 font-bold skeleton text-transparent"
          >
            {/* <MessageCircle className="size-5" /> */}
            Go To Chat
          </button>
          {/* <button className="btn btn-primary font-bold"><User className="size-5"/> Show Passengers</button> */}
          <button
            className="skeleton py-2 text-transparent font-bold"
          >
            {/* <PenBox className="size-5" /> */}
             Edit Ride
          </button>
          <button
            className="skeleton py-2 text-transparent"
          >
            {/* <User2 />  */}
            Edit Passengers
          </button>
          <button
            className="skeleton py-2 text-transparent font-bold"
          >
            {/* <X /> */}
            Delete
          </button>
        </div>
      </div>
      {/* <hr className="opacity-30 w-[95%] m-auto" /> */}
      <div
        className="flex items-center p-5 gap-4 w-full transition-all duration-200 rounded-2xl"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div
              className="rounded-full size-12 skeleton"
              alt=""
            ></div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-bold text-lg text-transparent skeleton">
                Driver Name
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center skeleton p-4">
            {/* <ChevronRight /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
