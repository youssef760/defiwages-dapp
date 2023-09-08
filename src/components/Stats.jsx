import React from 'react'

const Stats = ({ stats }) => {
  return (
    <div className="">
      <h4 className="text-2xl font-semibold">Dashboard</h4>
      <div
        className="flex flex-col sm:flex-row justify-center
        items-center bg-white mt-5"
      >
        <div
          className="flex flex-col justify-center items-center
          border border-gray-200 h-20 shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-purple-500
            leading-1"
          >
            {stats.id}
          </span>
          <span>Organizations</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          border border-gray-200 h-20 shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-purple-500
            leading-1"
          >
            {stats.payrolls}
          </span>
          <span>Payrolls</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          border border-gray-200 h-20 shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-purple-500
            leading-1"
          >
            {stats.workers}
          </span>
          <span>Workers</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          border border-gray-200 h-20 shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-purple-500
            leading-1"
          >
            {stats.payments}
          </span>
          <span>Payments</span>
        </div>
      </div>
    </div>
  )
}

export default Stats
