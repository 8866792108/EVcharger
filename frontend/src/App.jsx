import { useState } from 'react'
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import Login from './component/Login'
import SignUp from './component/SignUp';
import Home from './component/Home';
import Profile from './component/Profile';
import ResponsiveSidebar from './component/ResponsiveSidebar';
import DashboardTasks from './component/DashboardTasks'
import Maps from './component/Maps'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path='/' element={<ResponsiveSidebar/>} /> */}
          <Route path='/profile' element={<Profile/>} />
          <Route path='/currentuser' element={<Maps/>} />
          <Route path='/ordermanage' element={<Maps/>} />
      </Routes>
    </>
  )
}

export default App
