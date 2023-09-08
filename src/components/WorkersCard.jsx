import React, { useState } from 'react'
import { deleteWorker, truncate } from '../services/blockchain'
import { globalActions } from '../store/globalSlices'
import { useDispatch } from 'react-redux'
import WorkerDetails from './WorkerDetails'
import UpdateWorker from './UpdateWorker'
import { toast } from 'react-toastify'

const WorkersCard = ({ workers, payroll }) => {
  const [worker, setworker] = useState(null)

  const { setUpdateWorkerModal, setWorkerDetailsModal } = globalActions
  const dispatch = useDispatch()

  const onView = (worker) => {
    setworker(worker)
    dispatch(setWorkerDetailsModal('visible'))
  }

  const onEdit = (worker) => {
    setworker(worker)
    dispatch(setUpdateWorkerModal('scale-100'))
  }

  const onDeleteWorker = async (worker) => {
    if (confirm('Are you sure, this is irriversible!')) {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await deleteWorker(payroll.id, worker.wid)
            .then((tx) => resolve(tx))
            .catch((error) => {
              alert(JSON.stringify(error))
              reject(error)
            })
        }),
        {
          pending: 'Removing worker...',
          success: 'Worker successfully removed 👌',
          error: 'Encountered error 🤯',
        }
      )
    }
  }

  return (
    <div>
      <h4 className="mb-3 text-2xl font-semibold">
        <span>({workers.length} workers)</span>
        <div className="text-sm">
          <span>Status: </span>
          {payroll?.status == 0 ? (
            <span className="text-gray-700">Open</span>
          ) : payroll?.status == 1 ? (
            <span className="text-yellow-700">Pending</span>
          ) : payroll?.status == 2 ? (
            <span className="text-red-700">Deleted</span>
          ) : payroll?.status == 3 ? (
            <span className="text-green-700">Approved</span>
          ) : payroll?.status == 4 ? (
            <span className="text-red-700">Rejected</span>
          ) : (
            <span className="text-green-700">Paid</span>
          )}
        </div>
      </h4>

      <div
        className="bg-white rounded-lg p-5 max-h-[calc(100vh_-_22rem)]
        overflow-y-auto"
      >
        <table className="table-auto w-full">
          <thead className="border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Worker
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Account
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Date Added
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 transition
                duration-300 ease-in-out"
              >
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className="capitalize font-semibold">
                    {worker.name}
                  </span>
                </td>
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">
                    {truncate(worker.account, 4, 4, 11)}
                  </span>
                </td>
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">
                    {new Date(worker.timestamp).toLocaleDateString()}
                  </span>
                </td>
                <td
                  className="flex justify-start items-center text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <button
                    className="inline-block px-6 py-2.5 bg-transparent
                  text-green-600 font-medium text-xs leading-tight uppercase"
                    onClick={() => onView(worker)}
                  >
                    View
                  </button>
                  <button
                    className="inline-block px-6 py-2.5 bg-transparent
                  text-purple-600 font-medium text-xs leading-tight uppercase"
                    onClick={() => onEdit(worker)}
                  >
                    Edit
                  </button>
                  <button
                    className="inline-block px-6 py-2.5 bg-transparent
                  text-red-600 font-medium text-xs leading-tight uppercase"
                    onClick={() => onDeleteWorker(worker)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {worker && (
        <>
          <WorkerDetails worker={worker} payroll={payroll} />
          <UpdateWorker worker={worker} payroll={payroll} />
        </>
      )}
    </div>
  )
}

export default WorkersCard
