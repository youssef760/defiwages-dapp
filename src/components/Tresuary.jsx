import React from 'react'
import { globalActions } from '../store/globalSlices'
import { useDispatch } from 'react-redux'

const Tresuary = ({ stats }) => {
  const { setFundTresuaryModal, setWithdrawModal } = globalActions
  const dispatch = useDispatch()

  return (
    <div className="my-10">
      <h4 className="text-2xl font-semibold">Tresuary</h4>
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
            {stats.cuts} ETH
          </span>
          <span>Cuts</span>
        </div>
        <div
          className="flex flex-col justify-center items-center
          border border-gray-200 h-20 shadow-md w-full"
        >
          <span
            className="text-lg font-bold text-purple-500
            leading-1"
          >
            {stats.balance} ETH
          </span>
          <span>Balance</span>
        </div>
        <div
          className="flex justify-center items-center space-x-2
          border border-gray-200 h-20 shadow-md w-full"
        >
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-purple-600
            text-white font-medium text-xs leading-tight
            uppercase rounded-full shadow-md hover:bg-purple-700
            hover:shadow-lg focus:bg-purple-700 focus:shadow-lg
            focus:outline-none focus:ring-0 active:bg-purple-800
            transition duration-150 ease-in-out"
            onClick={() => dispatch(setFundTresuaryModal('scale-100'))}
          >
            Fund Account
          </button>
        </div>
        <div
          className="flex justify-center items-center space-x-2
          border border-gray-200 h-20 shadow-md w-full"
        >
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-purple-600
            text-white font-medium text-xs leading-tight
            uppercase rounded-full shadow-md hover:bg-purple-700
            hover:shadow-lg focus:bg-purple-700 focus:shadow-lg
            focus:outline-none focus:ring-0 active:bg-purple-800
            transition duration-150 ease-in-out"
            onClick={() => dispatch(setWithdrawModal('scale-100'))}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tresuary
