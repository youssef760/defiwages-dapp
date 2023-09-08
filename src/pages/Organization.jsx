import React, { useEffect } from 'react'
import PayrollsCard from '../components/PayrollsCard'
import ActionCards from '../components/ActionCards'
import CreatePayroll from '../components/CreatePayroll'
import { useParams } from 'react-router-dom'
import { loadPayrollByOrg } from '../services/blockchain'
import { useSelector } from 'react-redux'

const Organization = () => {
  const { id } = useParams()
  const { payrolls, connectedAccount } = useSelector((states) => states.globalStates)

  useEffect(() => {
    const loadBlockData = async () => {
      await loadPayrollByOrg(id)
    }

    loadBlockData()
  }, [id, connectedAccount])
  return (
    <>
      <PayrollsCard payrolls={payrolls} />
      <ActionCards payroll />
      <CreatePayroll oid={id} />
    </>
  )
}

export default Organization
