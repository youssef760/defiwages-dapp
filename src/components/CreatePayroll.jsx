import React, { useState } from 'react'
import { FaTimes, FaEthereum } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { toast } from 'react-toastify'
import { createPayroll } from '../services/blockchain'

const CreatePayroll = ({ oid }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [salary, setSalary] = useState('')
  const [cut, setCut] = useState('')

  const { createPayrollModal } = useSelector((states) => states.globalStates)
  const { setCreatePayrollModal } = globalActions
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !description || !salary || !cut) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createPayroll({ oid, name, description, salary, cut })
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
        pending: 'Creating payroll...',
        success: 'Payroll successfully created 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const closeModal = () => {
    dispatch(setCreatePayrollModal('scale-0'))
    setName('')
    setDescription('')
    setSalary('')
    setCut('')
  }

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${createPayrollModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black rounded-xl
        w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-black">Create Payroll</p>
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
              required
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
              name="salary"
              min={0.001}
              step={0.001}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Salary"
              required
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
              name="cut"
              min={1}
              max={100}
              value={cut}
              onChange={(e) => setCut(e.target.value)}
              placeholder="Cut"
              required
            />
          </div>

          <div
            className="flex justify-between items-center bg-gray-300
            rounded-xl mt-5"
          >
            <textarea
              className="block w-full text-sm p-2
            text-slate-500 bg-transparent border-0
            focus:outline-none focus:ring-0"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            ></textarea>
          </div>

          <button
            className="w-full bg-purple-500 text-white text-md
            py-2 px-5 rounded-full drop-shadow-xl border-transparent border
            hover:bg-transparent hover:text-purple-500
            hover:border-purple-500 mt-5"
            type="submit"
          >
            Create Payroll
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePayroll
