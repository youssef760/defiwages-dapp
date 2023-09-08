import React from 'react'
import { useSelector } from 'react-redux'
import {
  approvePayroll,
  payWorkers,
  rejectPayroll,
  revertPayroll,
  submitPayroll,
} from '../services/blockchain'
import { toast } from 'react-toastify'

const PayrollActions = ({ payroll }) => {
  const { connectedAccount } = useSelector((states) => states.globalStates)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await submitPayroll(payroll)
          .then((tx) => resolve(tx))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Submitting payroll...',
        success: 'Payroll successfully submitted 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleApprove = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await approvePayroll(payroll)
          .then((tx) => resolve(tx))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Approving payroll...',
        success: 'Payroll successfully approved 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await payWorkers(payroll)
          .then((tx) => resolve(tx))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Performing payment...',
        success: 'Payment successfully disbursed 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleRevert = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await revertPayroll(payroll)
          .then((tx) => resolve(tx))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Reverting submition...',
        success: 'Payroll reverted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  
  const handleReject = async (e) => {
    e.preventDefault()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await rejectPayroll(payroll)
          .then((tx) => resolve(tx))
          .catch((error) => {
            alert(JSON.stringify(error))
            reject(error)
          })
      }),
      {
        pending: 'Rejecting payroll...',
        success: 'Payroll rejected successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return payroll &&
    connectedAccount == payroll.officer &&
    payroll.status == 0 ? (
    <div className="my-4">
      <button
        className="text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none
        font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  ) : payroll && connectedAccount == payroll.officer && payroll.status == 4 ? (
    <div className="my-4">
      <button
        className="text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none
        font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleRevert}
      >
        Revert
      </button>
    </div>
  ) : payroll &&
    connectedAccount == payroll.organization &&
    payroll.status == 1 ? (
    <div className="my-4">
      <button
        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none
        font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleApprove}
      >
        Approve
      </button>
      <button
        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none
        font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleReject}
      >
        Reject
      </button>
    </div>
  ) : payroll && connectedAccount == payroll.officer && payroll.status == 1 ? (
    <div className="my-4">
      <button
        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none
      font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleRevert}
      >
        Revert
      </button>
    </div>
  ) : payroll && connectedAccount == payroll.officer && payroll.status == 3 ? (
    <div className="my-4">
      <button
        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none
        font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handlePayment}
      >
        Pay Worker
      </button>
    </div>
  ) : null
}

export default PayrollActions
