import React from 'react'
import { SlOrganization } from 'react-icons/sl'
import { AiFillThunderbolt } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa'
import { globalActions } from '../store/globalSlices'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const ActionCards = ({ organization, payroll, worker, noPayrollCreation }) => {
  const { setCreateOrgModal, setCreatePayrollModal, setCreateWorkerModal } =
    globalActions
  const dispatch = useDispatch()

  const onCreatePayroll = () => {
    if (noPayrollCreation) return toast.warning('Must be create within an organization')
    dispatch(setCreatePayrollModal('scale-100'))
  }

  return (
    <div
      className="flex flex-col lg:flex-row justify-start
      flex-wrap space-x-2 my-10"
    >
      {payroll ? (
        <div
          className="flex flex-1 flex-col sm:flex-row my-2 p-5
      justify-center sm:justify-between bg-white rounded-lg"
        >
          <div
            className="flex flex-col sm:flex-row flex-1
        justify-start items-center space-x-4"
          >
            <AiFillThunderbolt size={20} className="text-orange-500" />
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-xl font-semibold">Create Payroll</h4>
              <small className="text-gray-500 text-sm font-medium">
                Fill in a new payroll for your employees.
              </small>
            </div>
          </div>

          <button
            className="inline-block px-6 py-2.5 bg-transparent
            text-purple-600 font-medium text-xs leading-tight
            uppercase rounded hover:bg-gray-100
            focus:outline-none focus:ring-0
            transition duration-150 ease-in-out"
            onClick={onCreatePayroll}
          >
            Create
          </button>
        </div>
      ) : null}

      {worker ? (
        <div
          className="flex flex-1 flex-col sm:flex-row my-2 p-5
      justify-center sm:justify-between bg-white rounded-lg"
        >
          <div
            className="flex flex-col sm:flex-row flex-1
        justify-start items-center space-x-4"
          >
            <FaUsers size={20} className="text-green-500" />
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-xl font-semibold">Add Worker</h4>
              <small className="text-gray-500 text-sm font-medium">
                Bring in workers to your existing payrolls.
              </small>
            </div>
          </div>

          <button
            className="inline-block px-6 py-2.5 bg-transparent
            text-purple-600 font-medium text-xs leading-tight
            uppercase rounded hover:bg-gray-100
            focus:outline-none focus:ring-0
            transition duration-150 ease-in-out"
            onClick={() => dispatch(setCreateWorkerModal('scale-100'))}
          >
            Add
          </button>
        </div>
      ) : null}

      {organization ? (
        <div
          className="flex flex-1 flex-col sm:flex-row my-2 p-5
      justify-center sm:justify-between bg-white rounded-lg"
        >
          <div
            className="flex flex-col sm:flex-row flex-1
        justify-start items-center space-x-4"
          >
            <SlOrganization size={20} className="text-green-500" />
            <div className="text-center sm:text-left mt-2 sm:mt-0">
              <h4 className="text-xl font-semibold">Add Organization</h4>
              <small className="text-gray-500 text-sm font-medium">
                Create a new organization on the blockchain.
              </small>
            </div>
          </div>

          <button
            className="inline-block px-6 py-2.5 bg-transparent
            text-purple-600 font-medium text-xs leading-tight
            uppercase rounded hover:bg-gray-100
            focus:outline-none focus:ring-0
            transition duration-150 ease-in-out"
            onClick={() => dispatch(setCreateOrgModal('scale-100'))}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ActionCards
