import React, { useState } from 'react'
import { FaTimes, FaEthereum } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { createWorker, truncate } from '../services/blockchain'
import { toast } from 'react-toastify'

const CreateWorker = ({ payroll }) => {
  const [name, setName] = useState('')
  const [account, setAccount] = useState('')

  const [names, setNames] = useState([])
  const [accounts, setAccounts] = useState([])

  const { createWorkerModal } = useSelector((states) => states.globalStates)
  const { setCreateWorkerModal } = globalActions
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (names.length < 1 || accounts.length < 1) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createWorker({ ...payroll, names, accounts })
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
        pending: 'Adding workers...',
        success: 'Workers successfully added 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const addToList = () => {
    if (!name || !account) return
    if (accounts.includes(account.toLowerCase())) return

    setNames((prevState) => [name.toLowerCase(), ...prevState])
    setAccounts((prevState) => [account.toLowerCase(), ...prevState])

    setName('')
    setAccount('')
  }

  const remFromList = (index) => {
    accounts.splice(index, 1)
    names.splice(index, 1)

    setNames((prevState) => [...prevState])
    setAccounts((prevState) => [...prevState])
  }

  const closeModal = () => {
    dispatch(setCreateWorkerModal('scale-0'))
    setNames([])
    setAccounts([])
    setName('')
    setAccount('')
  }

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${createWorkerModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Create Worker</p>
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

          <div
            className="flex justify-start items-center
            rounded-xl space-x-1 mt-5"
          >
            {accounts.slice(0, 2).map((account, i) => (
              <div
                className="p-2 rounded-full text-gray-500
              bg-gray-200 font-semibold flex items-center w-max
              cursor-pointer active:bg-gray-300 transition
              duration-300 ease-in-out space-x-1 text-xs"
                key={i}
              >
                <span>{truncate(account, 4, 4, 11)} - </span>
                <span className=" capitalize">{names[i]}</span>

                <button
                  onClick={() => remFromList(i)}
                  className="border-0 bg-transparent focus:outline-none"
                  type="button"
                >
                  <FaTimes className="text-black" />
                </button>
              </div>
            ))}

            {accounts.length - accounts.slice(0, 2).length > 0 ? (
              <div
                className="p-2 rounded-full text-gray-500
                bg-gray-200 font-semibold flex items-center w-max
                cursor-pointer active:bg-gray-300 transition
                duration-300 ease-in-out space-x-1 text-xs"
              >
                <span>+ {accounts.length - accounts.slice(0, 2).length}</span>
              </div>
            ) : null}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={accounts.length < 1}
              className="flex justify-center items-center
              text-white text-md bg-purple-500
              py-2 px-5 rounded-full drop-shadow-xl
              border-transparent border
              hover:bg-transparent hover:text-purple-500
              hover:border hover:border-purple-500
              focus:outline-none focus:ring mt-5"
            >
              Create Workers
            </button>

            <button
              onClick={addToList}
              type="button"
              className="flex justify-center items-center
              text-white text-md bg-slate-700
              py-2 px-5 rounded-full drop-shadow-xl
              border-transparent border
              hover:bg-transparent hover:text-slate-700
              hover:border hover:border-slate-700
              focus:outline-none focus:ring mt-5"
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateWorker
