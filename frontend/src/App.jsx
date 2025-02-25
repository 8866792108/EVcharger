import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Profile from './component/Profile';
import DashboardTasks from './component/DashboardTasks';
import Maps from './component/Maps';
import CarSlider from './component/Slider'; // Import CarSlider component
import Evmap from './component/Evmap';
import LoginPage from './component/loginPage';
import SignUp from './component/SignUp';

const App = () => {
  return (
    <div>
      {/* The routes will render the corresponding component based on the URL */}
      <Routes>
        {/* Redirect root (/) to '/home' */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Route for the Home page */}
        <Route path="/home" element={<Home />} />

        {/* Route for Dashboard */}
        <Route path="/dashboard" element={<DashboardTasks />} />

        {/* Route for Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Route for Current User */}
        <Route path="/currentuser" element={<Maps />} />

        {/* Route for Order Management */}
        <Route path="/ordermanage" element={<Evmap />} />

        {/* Route for the CarSlider component */}
        <Route path="/car-slider" element={<CarSlider />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
