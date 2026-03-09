import React, { use } from 'react'
import { useSelector } from 'react-redux'

function SuperAdminDashboard() {
  const {superAdmin} = useSelector((state) => state.superAdminAuth)
  console.log(superAdmin);
  return (
    <div>SuperAdminDashboard</div>
  )
}

export default SuperAdminDashboard