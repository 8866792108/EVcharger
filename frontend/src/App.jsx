import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Profile from './component/Profile';
import DashboardTasks from './component/DashboardTasks';
import Maps from './component/Maps';
import CarSlider from './component/Slider'; // Import CarSlider component
import Evmap from './component/Evmap';
import LoginPage from './component/LoginPage';
import SignUp from './component/SignUp';
import ForgotPassword from './component/ForgotPassword';
import AboutUs from './component/About';
import Payment from './component/Payment';
import Orders from './component/Orders';
import Contact from './component/Contact';
import Starter from './component/Starter';
import BookingPage from './component/BookingPage';
import { GoogleOAuthProvider } from "@react-oauth/google"
import AdminLayout from './Admin/components/Layout/AdminLayout';
import AdminDashboard from "./Admin/Dashboard/Dashboard"
import ProtectedRoute from "./Admin/ProtectedRoute"
import MapAdd from "./Admin/maps/MapAdd"
import Displaymap from "./Admin/maps/Displaymap"
import Updatemap from "./Admin/maps/Updatemap"
import PaymentManagement from "./Admin/payments/PaymentManagement"
import JoinWithUs from "./Admin/Messages/JoinWithUs"
import Feedback from "./Admin/Messages/Feedback"
import { backendurls } from './assets/utility';

const App = () => {

  // useEffect(() => {
  //   // Page load hone par ek flag set karein
  //   sessionStorage.setItem("isPageActive", "true");

  //   const handleTabClose = () => {
  //     // Check karein ki browser close ho raha hai ya tab
  //     if (!navigator.userActivation.isActive) {
  //       localStorage.clear(); // Sirf tab close hone par localStorage clear hoga
  //     }
  //   };

  //   // Jab user page close kare to function chale
  //   window.addEventListener("unload", handleTabClose);

  //   return () => {
  //     window.removeEventListener("unload", handleTabClose);
  //   };
  // }, []);

  const backendurl = backendurls

  const GoogleAuthWrapper = ({ url }) => {
    return (
      <GoogleOAuthProvider clientId='811730725449-o0icrsqm2p4usbv981nb0q5eq19ei5e0.apps.googleusercontent.com'>
        <SignUp url={url} ></SignUp>
      </GoogleOAuthProvider>
    )
  }
  const GoogleAuthWrapperlogin = ({ url }) => {
    return (
      <GoogleOAuthProvider clientId='811730725449-o0icrsqm2p4usbv981nb0q5eq19ei5e0.apps.googleusercontent.com'>
        <LoginPage url={url} ></LoginPage>
      </GoogleOAuthProvider>
    )
  }
  return (
    <div>
      {/* The routes will render the corresponding component based on the URL */}
      <Routes>

        <Route path="/" element={<Starter />} />

        {/* Route for the Home page */}
        <Route path="/home" element={<Home url={backendurl} />} />

        <Route path='/About' element={<AboutUs url={backendurl} />} />

        {/* Route for Dashboard */}
        <Route path="/dashboard" element={<DashboardTasks url={backendurl} />} />

        {/* Route for Profile */}
        <Route path="/profile" element={<Profile url={backendurl} />} />

        {/* Route for Current User */}
        <Route path="/map" element={<Maps url={backendurl} />} />

        {/* Route for Order Management */}
        <Route path="/stations" element={<Evmap url={backendurl} />} />
        <Route path="/stations/:category" element={<Evmap url={backendurl} />} />

        {/* Route for the CarSlider component */}
        <Route path="/car-slider" element={<CarSlider url={backendurl} />} />

        <Route path="/login" element={<GoogleAuthWrapperlogin url={backendurl} />} />
        <Route path="/signup" element={<GoogleAuthWrapper url={backendurl} />} />
        <Route path="/forgot-password" element={<ForgotPassword url={backendurl} />} />
        <Route path="/booking/:slotId" element={<BookingPage url={backendurl} />} />
        <Route path="/:slotId/:date/:branchId/:slots/payment" element={<Payment url={backendurl} />} />
        <Route path="/orders" element={<Orders url={backendurl} />} />
        <Route path="/contact" element={<Contact url={backendurl} />} />

        {/* Admin Routes */}
        <Route path="/Admin" element={<AdminLayout url={backendurl} />}>
          <Route index element={<Navigate to="/Admin/Dashboard" replace />} />
          <Route path="Dashboard" element={
            <ProtectedRoute>
              <AdminDashboard url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="maps/add" element={
            <ProtectedRoute>
              <MapAdd url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="maps/display" element={
            <ProtectedRoute>
              <Displaymap url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="maps/update" element={
            <ProtectedRoute>
              <Updatemap url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute>
              <PaymentManagement url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="Join-requests" element={
            <ProtectedRoute>
              <JoinWithUs url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="feedback" element={
            <ProtectedRoute>
              <Feedback url={backendurl} />
            </ProtectedRoute>
          } />
          <Route path="edit-map/:id" element={
            <ProtectedRoute>
              <Updatemap url={backendurl} />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </div>
  );
};

export default App;