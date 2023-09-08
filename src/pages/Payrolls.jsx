import React from 'react'
import PayrollsCard from '../components/PayrollsCard'
import ActionCards from '../components/ActionCards'
import CreatePayroll from '../components/CreatePayroll'
import { useSelector } from 'react-redux'

const Payrolls = () => {
  const { allPayrolls } = useSelector((states) => states.globalStates)
  return (
    <>
      <PayrollsCard payrolls={allPayrolls} remActions />
      <ActionCards payroll noPayrollCreation />
      <CreatePayroll />
    </>
  )
}

export default Payrolls
