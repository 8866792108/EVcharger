import React from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
import Modal from './Modal'

const DashboardTasks = ({ url }) => {
  return (
    <div className='home flex flex-col items-center justify-center min-h-screen'>
      {/* Horizontal Sidebar */}
      <ResponsiveSidebar />
      <main className="flex-1 w-full max-w-4xl p-4 md:transition-all md:duration-300">
        Dashboard
      </main>
    </div>
  )
}

export default DashboardTasks