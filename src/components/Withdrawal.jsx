import React, { useState } from 'react'
import { FaTimes, FaEthereum } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { withdrawTo } from '../services/blockchain'
import { toast } from 'react-toastify'

const Withdrawal = () => {
  const { withdrawModal } = useSelector((states) => states.globalStates)
  const { orgs } = useSelector((states) => states.globalStates)
  const { setWithdrawModal } = globalActions
  const dispatch = useDispatch()

  const [oid, setOid] = useState('')
  const [account, setAccount] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!oid || !account || !amount) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await withdrawTo(oid, account, amount)
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
        pending: 'Withrawing from organization...',
        success: 'Withdrawal successfully executed 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setWithdrawModal('scale-0'))
    setAmount('')
    setAccount('')
    setOid('')
  }

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${withdrawModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Withdraw Fund</p>
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
              list="orgs"
              onChange={(e) => setOid(e.target.value)}
              required
            />
            <datalist id="orgs">
              {orgs.map((org, i) => (
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
              type="text"
              name="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              minLength={42}
              maxLength={42}
              pattern="[A-Za-z0-9]+"
              placeholder="ETH Account"
            />
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
            Withdraw
          </button>
        </form>
      </div>
    </div>
  )
}

export default Withdrawal
