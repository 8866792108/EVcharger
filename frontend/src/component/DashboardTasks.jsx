import React from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'

const DashboardTasks = () => {
  return (
    <div className='home'>
      <ResponsiveSidebar />
      <main className="md:pl-16 md:transition-all md:duration-300 md:data-[expanded=true]:pl-64">
        Dashboard
      </main>
    </div>
  )
}

export default DashboardTasks