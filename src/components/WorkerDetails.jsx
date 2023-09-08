import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { globalActions } from '../store/globalSlices'
import { FaEthereum, FaTimes } from 'react-icons/fa'
import Identicon from 'react-identicons'

const WorkerDetails = ({ worker, payroll }) => {
  const { workerDetailsModal } = useSelector((states) => states.globalStates)
  const { setWorkerDetailsModal } = globalActions
  const dispatch = useDispatch()

  return (
    <div
      className={`fixed top-0 left-0 bg-black w-screen h-screen
      bg-opacity-50 transform flex justify-center items-center
      transition-transform z-50 duration-300 ${workerDetailsModal}`}
    >
      <div
        className="offcanvas offcanvas-end flex flex-col
        max-w-full bg-white bg-clip-padding shadow-sm
        outline-none text-gray-700 fixed bottom-0
        top-0 right-0 border-none w-96"
        tabIndex="-1"
        id="offcanvasRight"
      >
        <div
          className="offcanvas-heade flex items-center
        justify-between p-4"
        >
          <h5
            className="offcanvas-title mb-0
          leading-normal font-semibold"
          >
            Worker Details
          </h5>
          <button
            className="border-0 bg-transparent focus:outline-none"
            type="button"
            onClick={() => dispatch(setWorkerDetailsModal('invisible'))}
          >
            <FaTimes className="text-black" />
          </button>
        </div>

        <div
          className="offcanvas-body flex-grow p-4
        overflow-y-auto"
        >
          <hr />

          <div
            className="flex flex-col items-center text-center
          py-4 space-y-4"
          >
            <Identicon
              className="rounded-full shadow-md"
              string={worker.account}
              size={60}
            />

            <h4 className=" capitalize">{worker.name}</h4>

            <p className="text-xs text-gray-700">
              Account
              <br />
              <span className="font-bold">{worker.account}</span>
            </p>

            <p className="text-xs text-gray-700">
              Salary
              <br />
              <span
                className="flex justify-center items-center
                text-green-700"
              >
                <FaEthereum />
                <span className="font-bold">{payroll.salary}</span>
              </span>
            </p>

            <p className="text-xs text-gray-700">
              Taxable Cut <br />
              <span className="font-bold">{payroll.cut}%</span>
            </p>

            <p className="text-xs text-gray-700">
              Joined <br />
              <span className="font-bold">
                {new Date(worker.timestamp).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDetails
