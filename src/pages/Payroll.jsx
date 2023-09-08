import React, { useEffect } from 'react'
import WorkersCard from '../components/WorkersCard'
import ActionCards from '../components/ActionCards'
import CreateWorker from '../components/CreateWorker'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loadPayroll, loadWorkersOf } from '../services/blockchain'
import PayrollActions from '../components/PayrollActions'

const Payroll = () => {
  const { payroll, workers } = useSelector((states) => states.globalStates)
  const { id } = useParams()

  useEffect(() => {
    const loadBlockData = async () => {
      await loadPayroll(id)
      await loadWorkersOf(id)
    }

    loadBlockData()
  }, [id])

  return (
    <>
      <WorkersCard workers={workers} payroll={payroll} />
      {workers.length > 0 && <PayrollActions payroll={payroll} />}
      <ActionCards worker />
      <CreateWorker payroll={payroll} />
    </>
  )
}

export default Payroll
