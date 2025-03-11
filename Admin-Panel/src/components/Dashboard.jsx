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
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import '../styles/dashboard.css';

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
  feedback: [
    {
      id: 1,
      user: 'John Doe',
      message: 'Great service! Very convenient charging locations.',
      rating: 5,
      date: '2024-03-15',
      isOnline: true,
    },
    {
      id: 2,
      user: 'Jane Smith',
      message: 'Good service but waiting time could be improved.',
      rating: 4,
      date: '2024-03-09',
      isOnline: false
    },
  ],
};

const Dashboard = () => {
  const [data, setData] = useState(DEMO_DATA);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [peakHours, setPeakHours] = useState('14:00 - 18:00');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const handleDeleteFeedback = (id) => {
    // In a real application, you would make an API call here
    setData(prevData => ({
      ...prevData,
      feedback: prevData.feedback.filter(item => item.id !== id)
    }));
    setShowDeleteConfirm(null);
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
              value={data.users.total}
              change={8}
              color="gradient-blue"
            />
            <StatCard
              icon={CreditCard}
              title="Total Revenue"
              value={data.orders.revenue}
              change={12}
              color="gradient-green"
            />
            <StatCard
              icon={MapPin}
              title="Active Stations"
              value={data.stations.active}
              change={5}
              color="gradient-purple"
            />
            <StatCard
              icon={MessageSquare}
              title="New Feedback"
              value={data.feedback.length}
              change={3}
              color="gradient-orange"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Feedback</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {data.feedback.length} Total Feedback
                </span>
                <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                  View All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.feedback.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg card-hover animate-fade-in-up delay-300 relative group">
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === item.id && (
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
                          onClick={() => handleDeleteFeedback(item.id)}
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
                        {item.user ? item.user.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{item.user || 'Anonymous User'}</span>
                        <div className="flex items-center mt-0.5">
                          <div className="flex">
                            {[...Array(item.rating || 0)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
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
        </div>

        <div className="lg:col-span-1">
          <QuickStats
            activeStations={data.stations.active}
            vehiclesCharging={Math.floor(data.stations.active * 0.8)}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Station Status</h3>
            {[
              {
                name: 'Station A1',
                status: 'active',
                utilization: 85,
              },
              {
                name: 'Station B2',
                status: 'active',
                utilization: 72,
              },
              {
                name: 'Station C3',
                status: 'inactive',
                utilization: 0,
              },
            ].map((station, index) => (
              <StationCard key={index} station={station} />
            ))}
          </div>
        </div>
      </div>
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
      <h4 className="font-semibold">{station.name}</h4>
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
    </div>
  </div>
);

export default Dashboard; 