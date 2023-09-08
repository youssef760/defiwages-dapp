import React, { useState } from 'react'
import { FaTimes, FaEthereum } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { fundOrg } from '../services/blockchain'
import { toast } from 'react-toastify'

const FundTresuary = () => {
  const { fundTresuaryModal } = useSelector((states) => states.globalStates)
  const { allOrgs } = useSelector((states) => states.globalStates)
  const { setFundTresuaryModal } = globalActions
  const dispatch = useDispatch()

  const [oid, setOid] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await fundOrg(oid, amount)
          .then((tx) => {
            closeModal()
            resolve(tx)
          })
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Funding organization...',
        success: 'Organization successfully funded 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setFundTresuaryModal('scale-0'))
    setAmount('')
    setOid('')
  }

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${fundTresuaryModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Fund Tresuary</p>
            <button
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
              type="button"
            >
              <FaTimes className="text-black" />
            </button>
          </div>

          <div
            className="flex flex-col justify-center items-center
          rounded-xl space-y-2 my-5"
          >
            <div
              className="flex justify-center items-center
              space-x-1 shadow-md py-2 px-4 rounded-full"
            >
              <FaEthereum className="text-purple-700" size={20} />
              <span>Payroll</span>
            </div>
            <small>Make sure all records are correctly entered.</small>
          </div>

          <div
            className="flex justify-between items-center bg-gray-300
            rounded-xl mt-5"
          >
            <input
              className="block w-full text-sm p-2
            text-slate-500 bg-transparent border-0
            focus:outline-none focus:ring-0"
              type="text"
              placeholder="Search for organization"
              list="organizations"
              onChange={(e) => setOid(e.target.value)}
              required
            />
            <datalist id="organizations">
              {allOrgs.map((org, i) => (
                <option key={i} value={org.id}>
                  {org.name}
                </option>
              ))}
            </datalist>
          </div>

          <div
            className="flex justify-between items-center bg-gray-300
            rounded-xl mt-5"
          >
            <input
              className="block w-full text-sm p-2
            text-slate-500 bg-transparent border-0
            focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="amount"
              placeholder="Amount (ETH)"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              required
            />
          </div>

          <button
            className="w-full bg-purple-500 text-white text-md
            py-2 px-5 rounded-full drop-shadow-xl border-transparent border
            hover:bg-transparent hover:text-purple-500
            hover:border-purple-500 mt-5"
            type="submit"
          >
            Fund Tresuary
          </button>
        </form>
      </div>
    </div>
  )
}

export default FundTresuary
