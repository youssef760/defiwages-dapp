import React, { useState } from 'react'
import { deletePayroll, truncate } from '../services/blockchain'
import { useNavigate } from 'react-router-dom'
import { globalActions } from '../store/globalSlices'
import { useDispatch } from 'react-redux'
import UpdatePayroll from './UpdatePayroll'
import { toast } from 'react-toastify'
import { FaEthereum } from 'react-icons/fa'

const PayrollsCard = ({ payrolls, remActions }) => {
  const navigate = useNavigate()
  const [payroll, setPayroll] = useState(null)

  const { setUpdatePayrollModal } = globalActions
  const dispatch = useDispatch()

  const onEdit = (payroll) => {
    setPayroll(payroll)
    dispatch(setUpdatePayrollModal('scale-100'))
  }

  const onDeletePayroll = async (payroll) => {
    if (confirm('Are you sure, this is irriversible!')) {
      await toast.promise(
        new Promise(async (resolve, reject) => {
          await deletePayroll(payroll)
            .then((tx) => resolve(tx))
            .catch((error) => {
              alert(JSON.stringify(error))
              reject(error)
            })
        }),
        {
          pending: 'Deleting payroll...',
          success: 'Payroll successfully deleted 👌',
          error: 'Encountered error 🤯',
        }
      )
    }
  }

  return (
    <div>
      <h4 className="mb-3 text-2xl font-semibold">
        List: ({payrolls.length} Payrolls)
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
                Payroll
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Officer
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Payment Date
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Salary
              </th>
              <th
                scope="col"
                className="text-sm font-medium px-6 py-4 text-left"
              >
                Cut (%)
              </th>
              {!remActions && (
                <th
                  scope="col"
                  className="text-sm font-medium px-6 py-4 text-left"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 transition
                duration-300 ease-in-out"
              >
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">{payroll.name}</span>
                </td>
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">
                    {truncate(payroll.officer, 4, 4, 11)}
                  </span>
                </td>
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">
                    {new Date(payroll.timestamp).toLocaleDateString()}
                  </span>
                </td>

                <td
                  className="flex justify-start items-center space-x-1
                  text-sm font-light px-6 py-4 whitespace-nowrap"
                >
                  <FaEthereum />
                  <span className=" font-semibold">{payroll.salary}</span>
                </td>
                <td
                  className="text-sm font-light px-6 py-4
                 whitespace-nowrap"
                >
                  <span className=" font-semibold">{payroll.cut}</span>
                </td>
                {!remActions && (
                  <td
                    className="flex justify-start items-center text-sm font-light px-6 py-4
                 whitespace-nowrap"
                  >
                    <button
                      className="inline-block px-6 py-2.5 bg-transparent
                  text-green-600 font-medium text-xs leading-tight uppercase"
                      onClick={() => navigate('/payroll/' + payroll.id)}
                    >
                      View
                    </button>
                    <button
                      className="inline-block px-6 py-2.5 bg-transparent
                  text-purple-600 font-medium text-xs leading-tight uppercase"
                      onClick={() => onEdit(payroll)}
                    >
                      Edit
                    </button>
                    <button
                      className="inline-block px-6 py-2.5 bg-transparent
                  text-red-600 font-medium text-xs leading-tight uppercase"
                      onClick={() => onDeletePayroll(payroll)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payroll ? <UpdatePayroll payroll={payroll} /> : null}
    </div>
  )
}

export default PayrollsCard
