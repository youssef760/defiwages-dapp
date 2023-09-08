import React, { useEffect, useState } from 'react'
import { FaTimes, FaEthereum } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { toast } from 'react-toastify'
import { updateWorker } from '../services/blockchain'

const UpdateWorker = ({ worker, payroll }) => {
  const [name, setName] = useState(worker.name)
  const [account, setAccount] = useState(worker.account)

  const { updateWorkerModal } = useSelector((states) => states.globalStates)
  const { setUpdateWorkerModal } = globalActions
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !account) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await updateWorker({ ...worker, ...payroll, name, account })
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
        pending: 'Updating workers...',
        success: 'Workers successfully updated 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setUpdateWorkerModal('scale-0'))
    setName('')
    setAccount('')
  }

  useEffect(() => {
    setName(worker.name)
    setAccount(worker.account)
  }, [worker, payroll])

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${updateWorkerModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Edit Worker</p>
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
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
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

          <button
            type="submit"
            className="flex justify-center items-center
            text-white text-md bg-purple-500
            py-2 px-5 rounded-full drop-shadow-xl
            border-transparent border
            hover:bg-transparent hover:text-purple-500
            hover:border hover:border-purple-500
            focus:outline-none focus:ring mt-5"
          >
            Update Workers
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateWorker
