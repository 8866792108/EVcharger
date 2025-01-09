import React from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
import Modal from './Modal'

const DashboardTasks = () => {
  return (
    <div className='dashboard md:grid grid-cols-header'>
      <ResponsiveSidebar />
      <main className="md:pl-16 md:transition-all md:duration-300 md:data-[expanded=true]:pl-64">
        Dashboard
      </main>
    </div>
  )
}

export default DashboardTasks