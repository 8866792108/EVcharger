import React, { useState } from "react"
import { MapPin, Settings, LogOut, ListOrdered, LayoutDashboard, LogIn, User } from "lucide-react"
import { BluetoothDevices } from "./BluetoothDevices"
import ResponsiveSidebar from "./ResponsiveSidebar"
import { NavLink } from "react-router-dom"
import { motion } from 'framer-motion'
import { FaUser, FaCar, FaCreditCard, FaHistory, FaBell, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa'
import Navbar from './Navbar'

const Profile = ({ url }) => {
  const [islogin, setislogin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: "John Doe",
    email: "john@example.com",
    savedLocations: [
      { id: 1, name: "Home Charger", address: "123 Main St" },
      { id: 2, name: "Office Station", address: "456 Work Ave" }
    ]
  })
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    vehicles: [
      { id: 1, model: 'Tesla Model 3', year: '2023', licensePlate: 'EV-123' },
      { id: 2, model: 'Chevrolet Bolt', year: '2022', licensePlate: 'EV-456' }
    ],
    chargingHistory: [
      { id: 1, date: '2024-03-01', location: 'Central Station', duration: '45 mins', cost: '$12.50' },
      { id: 2, date: '2024-02-28', location: 'West Side Hub', duration: '30 mins', cost: '$8.75' }
    ]
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'vehicles', label: 'My Vehicles', icon: <FaCar /> },
    { id: 'payments', label: 'Payment Methods', icon: <FaCreditCard /> },
    { id: 'history', label: 'Charging History', icon: <FaHistory /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'help', label: 'Help & Support', icon: <FaQuestionCircle /> }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <ProfileField label="Full Name" value={profileData.name} />
              <ProfileField label="Email" value={profileData.email} />
              <ProfileField label="Phone" value={profileData.phone} />
              <ProfileField label="Location" value="New York, USA" />
            </div>
            <motion.button
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg
                text-white font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          </div>
        )

      case 'vehicles':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">My Vehicles</h3>
              <motion.button
                className="px-3 sm:px-4 py-2 sm:py-3 bg-green-500 rounded-lg text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Vehicle
              </motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {profileData.vehicles.map(vehicle => (
                <motion.div
                  key={vehicle.id}
                  className="p-3 sm:p-4 bg-gray-800 rounded-xl border border-gray-700"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-semibold text-md sm:text-lg mb-2">{vehicle.model}</h4>
                  <p className="text-sm sm:text-md text-gray-400">Year: {vehicle.year}</p>
                  <p className="text-sm sm:text-md text-gray-400">License: {vehicle.licensePlate}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'history':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Charging History</h3>
            <div className="space-y-3 sm:space-y-4">
              {profileData.chargingHistory.map(session => (
                <motion.div
                  key={session.id}
                  className="p-3 sm:p-4 bg-gray-800 rounded-xl border border-gray-700"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-md sm:text-lg">{session.location}</h4>
                      <p className="text-sm sm:text-md text-gray-400">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400 text-sm sm:text-md">{session.cost}</p>
                      <p className="text-sm sm:text-md text-gray-400">{session.duration}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-gray-400 text-sm sm:text-md">
            Content for {activeTab} will be available soon.
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-xl p-3 sm:p-4">
              <div className="flex flex-col space-y-2">
                {tabs.map(tab => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-md
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white'
                        : 'text-gray-400 hover:bg-gray-800'}`}
                    whileHover={{ x: 4 }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileField = ({ label, value }) => (
  <div className="p-3 sm:p-4 bg-gray-800 rounded-lg">
    <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-sm sm:text-md">{value}</p>
  </div>
)

export default Profile