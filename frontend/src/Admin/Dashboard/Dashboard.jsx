import React, { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Battery,
  MapPin,
  Star,
  ChevronRight,
  Calendar,
  Activity,
  Clock,
  Zap,
  BatteryCharging,
  Car,
  CreditCard,
  Trash2,
  AlertCircle,
  Eye,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import '../styles/dashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import TravelMap3D from './TravelMap3D';
import { Link, NavLink } from 'react-router-dom';
import Feedback from '../Messages/Feedback';
import { motion } from 'framer-motion';

// Custom/Demo data for testing and fallback
const DEMO_DATA = {
  users: {
    total: 1250,
    active: 850,
    new: 125,
  },
  orders: {
    total: 3200,
    completed: 2800,
    pending: 400,
    revenue: 158000,
  },
  stations: {
    total: 48,
    active: 35,
    maintenance: 5,
    utilization: 72,
  },
  feedback: [],
};

const Dashboard = ({ url }) => {
  const [data, setData] = useState(DEMO_DATA);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [peakHours, setPeakHours] = useState('14:00 - 18:00');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showDeleteJoinUs, setshowDeleteJoinUs] = useState(null);
  const [feedback, setfeedback] = useState([])
  const [stations, setstations] = useState(0)
  const [orders, setorders] = useState(0)
  const [Revenue, setRevenue] = useState(0)
  const [users, setusers] = useState(0)
  const [activeorders, setactiveorders] = useState(0)
  const [joinwithus, setjoinwithus] = useState([])
  const [selectedStation, setSelectedStation] = useState(null);
  const [mostBookedStations, setMostBookedStations] = useState([]);

  //admin setup
  useEffect(() => {
    localStorage.setItem("name", "Volthub Vehicle");
    localStorage.setItem("email", "volthub237@gmail.com");
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZvbHRodWIyMzdAZ21haWwuY29tIiwibmFtZSI6IlZvbHRIdWIgU2FuamF5IiwiaWF0IjoxNzQzMzQ4ODA2LCJleHAiOjE3NDMzNTI0MDZ9.CPkFxa7uI_uLUhFz7u-q-TouGQsSGHUQ1Vz7ZraChRM");
  }, []);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Update time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');

    // Update current time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    getfeedback()
    getjoinwithus()
    fetchMostBookedStations()
    fetchallTotal()
  }, [])

  const fetchallTotal = async () => {
    try {
      const response = await axios.get(`${url}/TotalAll`)
      setorders(response.data.totalOrders)
      setusers(response.data.totalusers)
      setstations(response.data.totalslots)
      setRevenue(response.data.totalRevenue)
      setactiveorders(response.data.activeorders)
    } catch (error) {
      console.error('Error fetching most booked stations:', error);
    }
  };
  const fetchMostBookedStations = async () => {
    try {
      const response = await axios.get(`${url}/orders/most-booked-stations`)
      setMostBookedStations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching most booked stations:', error);
    }
  };

  const getjoinwithus = async () => {
    try {
      const response = await axios.get(`${url}/JoinWithUs/getJoinUs`)
      console.log(response.data)
      setjoinwithus(response.data.data)
    } catch (error) {
      console.log("error Handling for Getting a Messages :: ", error)
    }
  }
  const getfeedback = async () => {
    try {
      const response = await axios.get(`${url}/feedback/getfeedback`)
      console.log(response.data)
      setfeedback(response.data.data)
    } catch (error) {
      console.log("error Handling for Getting a Messages :: ", error)
    }
  }

  const handleDeleteFeedback = async (id) => {
    // In a real application, you would make an API call here
    try {
      const response = await axios.get(`${url}/feedback/deletebyid/${id}`)

      if (response.data.success) {
        setTimeout(() => {
          toast.success(response.data.message || "Deleted SuccessFully", {
            position: "top-center",
            autoClose: 2000,
          })
        }, 2000);
      }
    } catch (error) {
      console.log("error Handling for Deleting a Messages :: ", error)
    }
    setShowDeleteConfirm(null);
    getfeedback()
  };
  const handleDeleteJoinUs = async (id) => {
    // In a real application, you would make an API call here
    try {
      const response = await axios.get(`${url}/JoinWithUs/deletebyid/${id}`)

      if (response.data.success) {
        setTimeout(() => {
          toast.success(response.data.message || "Deleted SuccessFully", {
            position: "top-center",
            autoClose: 2000,
          })
        }, 500);
      }
    } catch (error) {
      console.log("error Handling for Deleting a Messages :: ", error)
    }
    setshowDeleteJoinUs(null);
    getjoinwithus()
  };

  const handleViewDetails = (station) => {
    setSelectedStation(station);
  };

  const handleCloseDetails = () => {
    setSelectedStation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner text-blue-500">
          <Activity className="h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 animate-fade-in-up">
          Good {timeOfDay}, Admin! 👋
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover-scale smooth-transition"
        >
          Refresh Dashboard
        </button>
      </div>

      <LiveStatusBar
        systemStatus="Operational"
        peakHours={peakHours}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              title="Total Users"
              value={users}
              change={users}
              color="gradient-blue"
            />
            <StatCard
              icon={CreditCard}
              title="Total Revenue"
              value={Revenue}
              change={orders}
              color="gradient-green"
            />
            <StatCard
              icon={MapPin}
              title="Active Stations"
              value={stations}
              change={stations - 10}
              color="gradient-purple"
            />
            <StatCard
              icon={MessageSquare}
              title="New Feedback"
              value={feedback.length}
              change={feedback.length}
              color="gradient-orange"
            />
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Feedback</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {feedback.length} Total Feedback
                    </span>
                    <NavLink to="/Admin/feedback" className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                      View All
                    </NavLink>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:h-[590px] overflow-y-scroll">
                  {feedback.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-lg card-hover animate-fade-in-up delay-300 relative group">
                      {/* Delete Button */}
                      <button
                        onClick={() => setShowDeleteConfirm(item._id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Delete Confirmation Modal */}
                      {showDeleteConfirm === item._id && (
                        <div className="absolute inset-0 bg-white rounded-lg shadow-lg z-10 flex flex-col items-center justify-center p-4 animate-fade-in">
                          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                          <h4 className="text-lg font-semibold mb-2">Delete Feedback?</h4>
                          <p className="text-gray-500 text-sm text-center mb-4">
                            Are you sure you want to delete this feedback? This action cannot be undone.
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(item._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                            {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{item.email || 'Anonymous User'}</span>
                            <div className="flex items-center mt-0.5">
                              {/* <div className="flex">
                                {[...Array(item.rating || 0)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div> */}
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < (item.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`flex h-3 w-3 relative ${item.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
                        </span>
                      </div>
                      <div className="pl-13">
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {item.message || item.comment || 'No message provided'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Request JoinWithUs</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {joinwithus.length} Total JoinWithUs Requestes
                    </span>
                    <NavLink to="/Admin/Join-requests" className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                      View All
                    </NavLink>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:h-[590px] overflow-y-scroll">
                  {joinwithus.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-lg card-hover animate-fade-in-up delay-300 relative group">
                      {/* Delete Button */}
                      <button
                        onClick={() => setshowDeleteJoinUs(item._id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Delete Confirmation Modal */}
                      {showDeleteJoinUs === item._id && (
                        <div className="absolute inset-0 bg-white rounded-lg shadow-lg z-10 flex flex-col items-center justify-center p-4 animate-fade-in">
                          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                          <h4 className="text-lg font-semibold mb-2">Delete Station?</h4>
                          <p className="text-gray-500 text-sm text-center mb-4">
                            Are you sure you want to delete this station? This action cannot be undone.
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setshowDeleteJoinUs(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteJoinUs(item._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.businessName}</h3>
                          <p className="text-sm text-gray-600">{item.stationLocation}</p>
                          <p className="text-sm text-gray-600">Owner: {item.ownerName}</p>
                        </div>
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-2 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>


              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <QuickStats
            activeStations={activeorders}
            vehiclesCharging={Math.floor(activeorders * 0.8)}
          />

          <div className="space-y-4 h-[300px] overflow-y-scroll">
            <h3 className="text-lg font-semibold">Most Booked Stations</h3>
            {mostBookedStations.map((station, index) => (
              <StationCard
                key={index}
                station={{
                  name: station._id,
                  status: 'active',
                  utilization: Math.round((station.totalBookings / station.totalSlots) * 100),
                  totalBookings: station.totalBookings,
                  totalSlots: station.totalSlots
                }}
              />
            ))}
          </div>

          {/* Updated TravelMap3D container */}
          <div className="mt-6">
            {/* <h3 className="text-lg font-semibold mb-4">Global Station Network</h3> */}
            <div className="relative">
              <TravelMap3D />
            </div>
          </div>
        </div>
      </div>

      {/* Add the details modal */}
      {selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Station Details</h2>
              <button
                onClick={handleCloseDetails}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Business Name</p>
                  <p className="font-semibold">{selectedStation.businessName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Owner Name</p>
                  <p className="font-semibold">{selectedStation.ownerName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-semibold">{selectedStation.stationLocation}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contact Number</p>
                  <p className="font-semibold">{selectedStation.contactNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{selectedStation.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Station Type</p>
                  <p className="font-semibold">{selectedStation.stationType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Number Of Ports</p>
                  <p className="font-semibold">{selectedStation.numberOfPorts}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Additional Details</p>
                <p className="font-semibold">{selectedStation.additionalInfo}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LiveStatusBar = ({ systemStatus, peakHours }) => (
  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-lg mb-6 animate-fade-in-up">
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center space-x-4">
        <Clock className="h-6 w-6" />
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Activity className="h-6 w-6" />
        <span>System Status: {systemStatus}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Zap className="h-6 w-6" />
        <span>Peak Hours: {peakHours}</span>
      </div>
    </div>
  </div>
);

const QuickStats = ({ activeStations, vehiclesCharging }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg mb-6 animate-fade-in-up delay-100">
    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-3">
        <BatteryCharging className="h-8 w-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-600">Active Sessions</p>
          <p className="text-xl font-bold">{activeStations}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Car className="h-8 w-8 text-blue-500" />
        <div>
          <p className="text-sm text-gray-600">Vehicles Charging</p>
          <p className="text-xl font-bold">{vehiclesCharging}</p>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg card-hover animate-fade-in-up delay-200`}>
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
  </div>
);

const StationCard = ({ station }) => (
  <div className="bg-white p-4 rounded-lg shadow-lg card-hover animate-fade-in-up delay-300">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-semibold">Station {station.name}</h4>
      <span className={`status-indicator ${station.status === 'active' ? 'active' : 'inactive'}`}>
        {station.status}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Utilization</span>
        <span>{station.utilization}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 rounded-full h-2 progress-bar"
          style={{ '--progress-width': `${station.utilization}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Bookings: {station.totalBookings}</span>
        <span>Total Slots: {station.totalSlots}</span>
      </div>
    </div>
    <ToastContainer />
  </div>
);

export default Dashboard; 