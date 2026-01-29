import React from 'react'

export default function ReportItemSkeleton() {
  return (
    <div className='collapse py-3 skeleton'>
      <div className="collapse-title font-semibold">
        <div className="flex items-center justify-between">
        <span className="text-xl skeleton text-transparent">Reported Reported User Email </span>
        <button className="skeleton text-transparent py-1 px-3">Delete</button>
        </div>
      </div>
    </div>
  )
}
