import { useState } from 'react'
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import Login from './component/Login'
import SignUp from './component/SignUp';
import Home from './component/Home';
import Profile from './component/Profile';
import DashboardTasks from './component/DashboardTasks'
import Maps from './component/Maps'
import Updateuser from './component/updateuser';
import Slider from './component/Slider';
import Evmap from './components/Evmap';
import Navbar from './components/Navbar';
function App() {

  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Navigate to='/home' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path='/dashboard' element={<DashboardTasks/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/updateuser' element={<Updateuser/>} />
          <Route path='/currentuser' element={<Maps/>} />
          <Route path='/ordermanage' element={<Maps/>} />
      </Routes> */}
      {/* <div className='w-screen h-screen flex items-center justify-center overflow-hidden'>
      </div> */}
        <Navbar />
        <div className="bg-gray-300 h-[200vh]"></div>
        <Evmap />
    </>
  )
}

export default App
