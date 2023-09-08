import React from 'react'
import OrgsCard from '../components/OrgsCard'
import ActionCards from '../components/ActionCards'
import { useSelector } from 'react-redux'

const Organizations = () => {
  const { orgs } = useSelector((states) => states.globalStates)
  return (
    <>
      <OrgsCard organizations={orgs} />
      <ActionCards organization />
    </>
  )
}

export default Organizations
