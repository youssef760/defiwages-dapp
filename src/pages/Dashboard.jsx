import React from 'react'
import Stats from '../components/Stats'
import Tresuary from '../components/Tresuary'
import ActionCards from '../components/ActionCards'
import FundTresuary from '../components/FundTresuary'
import { useSelector } from 'react-redux'
import Withdrawal from '../components/Withdrawal'

const Dashboard = () => {
  const { stats } = useSelector((states) => states.globalStates)

  return (
    <>
      <Stats stats={stats} />
      <Tresuary stats={stats} />
      <ActionCards organization />
      <FundTresuary />
      <Withdrawal />
    </>
  )
}

export default Dashboard
