import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Map,
  MapPinCheck,
  CreditCard,
  LayoutDashboard,
  Trash2,
  Eye,
  Check,
  Clock,
  Mail,
  JoystickIcon,
  MessageCircle,
  Calendar,
  AlertCircle,
  Info,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentSidebarTab,
  setCurrentSidebarTab,
  pendingOrders,
  fetchPendingOrders,
  showNotification,
  location,
  url
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "67d41097c48ec2d74778fa34",
      type: "booking",
      title: "Booking Rejected",
      message: "Your booking for branch A1 has been rejected",
      details: {
        date: "2025-03-14",
        slots: [
          { start: "08:00 AM", end: "08:30 AM" },
          { start: "08:30 AM", end: "09:00 AM" },
          { start: "11:30 AM", end: "12:00 PM" }
        ],
        price: "150",
        transaction: "123423453456"
      },
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (currentSidebarTab === "messagesTab") {
      fetchMessages();
    }
  }, [currentSidebarTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/message/AllMessage`);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${url}/message/delete/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-shrink-0 transition-all">
      {/* Sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mini sidebar */}
      <nav className="z-20 flex-col items-center flex-shrink-0 hidden w-16 py-4 bg-white border-r border-gray-200 shadow-lg sm:flex rounded-tr-2xl rounded-br-2xl">
        {/* Logo */}
        <div className="flex-shrink-0 py-4">
          <a href="#" className="block transition-transform duration-200 hover:scale-110">
            <img
              className="w-20 h-auto"
              src={`${url}/logo.png`}
              alt="VoltHub"
            />
          </a>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col items-center flex-1 p-2 space-y-4">
          {/* Dashboard button */}
          <button
            onClick={() => {
              if (isSidebarOpen && currentSidebarTab === "dashboardTab") {
                setIsSidebarOpen(false);
              } else {
                setIsSidebarOpen(true);
                setCurrentSidebarTab("dashboardTab");
              }
            }}
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${location.pathname === "/dashboard"
              ? "text-white bg-indigo-600 shadow-indigo-100"
              : "text-gray-600 bg-white hover:text-white"
              }`}
          >
            <LayoutDashboard className="w-6 h-6 transform transition-transform hover:scale-110" />
          </button>

          {/* Menu button */}
          <button
            onClick={() => {
              if (isSidebarOpen && currentSidebarTab === "orderTab") {
                setIsSidebarOpen(false);
              } else {
                setIsSidebarOpen(true);
                setCurrentSidebarTab("orderTab");
              }
            }}
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${location.pathname === "/Admin/payments" || location.pathname === "/Admin/Join-requests"
              ? "text-white bg-indigo-600 shadow-indigo-100"
              : "text-gray-600 bg-white hover:text-white"
              }`}
          >
            <Menu className="w-6 h-6 transform transition-transform hover:scale-110" />
          </button>

          {/* Map button */}
          <button
            onClick={() => {
              if (isSidebarOpen && currentSidebarTab === "mapTab") {
                setIsSidebarOpen(false);
              } else {
                setIsSidebarOpen(true);
                setCurrentSidebarTab("mapTab");
              }
            }}
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${location.pathname === "/Admin/maps/add" || location.pathname === "/Admin/maps/display" || location.pathname.startsWith("/Admin/edit-map/")
              ? "text-white bg-indigo-600 shadow-indigo-100"
              : "text-gray-600 bg-white hover:text-white"
              }`}
          >
            <Map className="w-6 h-6 transform transition-transform hover:scale-110" />
          </button>

          {/* Messages button */}
          <button
            onClick={() => {
              if (isSidebarOpen && currentSidebarTab === "messagesTab") {
                setIsSidebarOpen(false);
              } else {
                setIsSidebarOpen(true);
                setCurrentSidebarTab("messagesTab");
              }
            }}
            className="relative p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 bg-white"
          >
            <MessageSquare className="w-6 h-6 transform transition-transform hover:scale-110" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notifications button */}
          <button
            onClick={() => {
              if (pendingOrders.length > 0) {
                fetchPendingOrders();
              }
            }}
            className="relative p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 bg-white"
          >
            <Bell className="w-6 h-6 transform transition-transform hover:scale-110" />
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                {pendingOrders.length}
              </span>
            )}
          </button>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {localStorage.getItem("name") ? localStorage.getItem("name").charAt(0).toUpperCase() : '?'}
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
                  />

                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {localStorage.getItem("name") ? localStorage.getItem("name").charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {localStorage.getItem("name") || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {localStorage.getItem("email") || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Main sidebar */}
      {isSidebarOpen && (
        <div className="fixed sm:left-16 top-0 h-screen bg-white border-r border-gray-200 shadow-lg rounded-tr-2xl rounded-br-2xl sm:w-72 lg:static lg:w-64 z-20">
          {currentSidebarTab === "dashboardTab" && (
            <nav className="flex flex-col h-full">
              <div className="flex items-center justify-center flex-shrink-0 py-10">
                <NavLink to="/Admin">
                  <img
                    className="w-24 h-auto"
                    src={`${url}/logo.png`}
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                <NavLink
                  to="/Admin/dashboard"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/Admin/dashboard" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <LayoutDashboard className="w-6 h-6" />
                  <span>Dashboard</span>
                </NavLink>
              </div>
            </nav>
          )}

          {currentSidebarTab === "orderTab" && (
            <nav className="flex flex-col h-full">
              <div className="flex items-center justify-center flex-shrink-0 py-10">
                <NavLink to="/Admin">
                  <img
                    className="w-24 h-auto"
                    src={`${url}/logo.png`}
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">

                <NavLink
                  to="/Admin/payments"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/Admin/payments" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Payment Management</span>
                </NavLink>
                <NavLink
                  to="/Admin/Join-requests"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/Admin/Join-requests" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <JoystickIcon className="w-6 h-6" />
                  <span>Requests Management</span>
                </NavLink>
              </div>
            </nav>
          )}

          {currentSidebarTab === "mapTab" && (
            <nav className="flex flex-col h-full">
              <div className="flex items-center justify-center flex-shrink-0 py-10">
                <NavLink to="/Admin">
                  <img
                    className="w-24 h-auto"
                    src={`${url}/logo.png`}
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                <NavLink
                  to="/Admin/maps/add"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/Admin/maps/add" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Map</span>
                </NavLink>
                <NavLink
                  to="/Admin/maps/display"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/Admin/maps/display" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <MapPinCheck className="w-6 h-6" />
                  <span>Map Management</span>
                </NavLink>
              </div>
            </nav>
          )}

          {currentSidebarTab === "messagesTab" && (
            <section className="h-full flex flex-col w-full">
              <div className="px-4 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                    {messages.length} messages
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 transition-all duration-200 hover:shadow-md border-l-4 max-w-full break-words ${message.seen ? 'border-gray-200' : 'border-blue-500'
                          }`}
                      >
                        {/* Message Header - Responsive Layout */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {message.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-800 truncate">
                                {message.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{message.email}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end space-x-2 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center whitespace-nowrap">
                              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                              {format(new Date(message.createdAt), 'MMM dd, yyyy')}
                            </span>
                            {message.seen && (
                              <span className="text-green-500">
                                <Check className="w-4 h-4 flex-shrink-0" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Message Content - Responsive Padding */}
                        <div className="mt-3">
                          <p className="text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                            {message.message}
                          </p>
                        </div>

                        {/* Action Buttons - Responsive Spacing */}
                        <div className="mt-3 flex justify-end space-x-1 sm:space-x-2">
                          {message.seen === false && (
                            <button
                              className="p-1.5 sm:p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 0 && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
                  <MessageSquare className="w-12 h-12 mb-2" />
                  <p className="text-center">No messages found</p>
                </div>
              )}

              {/* Scroll to Top Button */}
              <button
                onClick={() => {
                  const container = document.querySelector('.overflow-y-auto');
                  container?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                title="Scroll to top"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </section>
          )}

          {currentSidebarTab === "notificationsTab" && (
            <section className="h-full flex flex-col w-full">
              <div className="px-4 py-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {notifications.filter(n => !n.read).length} unread
                    </span>
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
                <AnimatePresence>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 transition-all duration-200 hover:shadow-md border-l-4 ${notification.read ? 'border-gray-200' : 'border-blue-500'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div className={`p-2 rounded-full ${notification.type === 'booking' ? 'bg-purple-50 text-purple-600' :
                            notification.type === 'success' ? 'bg-green-50 text-green-600' :
                              notification.type === 'error' ? 'bg-red-50 text-red-600' :
                                'bg-blue-50 text-blue-600'
                            }`}>
                            {notification.type === 'booking' ? <Calendar className="w-5 h-5" /> :
                              notification.type === 'success' ? <Check className="w-5 h-5" /> :
                                notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                  <Info className="w-5 h-5" />}
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium text-gray-800">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                                />
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>

                            {/* Booking Details */}
                            {notification.type === 'booking' && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3 bg-gray-50 rounded-lg p-3"
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium">{format(new Date(notification.details.date), 'MMM dd, yyyy')}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Price:</span>
                                    <span className="font-medium">₹{notification.details.price}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Transaction ID:</span>
                                    <span className="font-medium">{notification.details.transaction}</span>
                                  </div>
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500">Time Slots:</span>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                      {notification.details.slots.map((slot, index) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-white rounded-md text-sm font-medium text-gray-700 border border-gray-200"
                                        >
                                          {slot.start} - {slot.end}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNotifications(prev =>
                                  prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                                )}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                title="Mark as read"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setNotifications(prev =>
                                prev.filter(n => n.id !== notification.id)
                              )}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>

              {notifications.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4"
                >
                  <Bell className="w-12 h-12 mb-2" />
                  <p className="text-center">No notifications found</p>
                </motion.div>
              )}

              {/* Scroll to Top Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const container = document.querySelector('.overflow-y-auto');
                  container?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                title="Scroll to top"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </motion.button>
            </section>
          )}

          <NavLink
            to="/Admin/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <MessageCircle className="w-5 h-5" />
            <span>Feedback</span>
          </NavLink>
        </div>
      )}

    </div>
  );
};

export default Sidebar; 