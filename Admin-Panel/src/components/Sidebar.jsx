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
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentSidebarTab,
  setCurrentSidebarTab,
  pendingOrders,
  fetchPendingOrders,
  showNotification,
  location
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentSidebarTab === "messagesTab") {
      fetchMessages();
    }
  }, [currentSidebarTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/message/AllMessage");
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:8080/message/delete/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
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
              src="./src/assets/logo.png"
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
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${location.pathname === "/payments" || location.pathname === "/joinus"
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
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${location.pathname === "/addmap" || location.pathname === "/ManageMaps" || location.pathname.startsWith("/edit-map/")
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
      </nav>

      {/* Main sidebar */}
      {isSidebarOpen && (
        <div className="fixed sm:left-16 top-0 h-screen bg-white border-r border-gray-200 shadow-lg rounded-tr-2xl rounded-br-2xl sm:w-72 lg:static lg:w-64 z-20">
          {currentSidebarTab === "dashboardTab" && (
            <nav className="flex flex-col h-full">
              <div className="flex items-center justify-center flex-shrink-0 py-10">
                <NavLink to="/">
                  <img
                    className="w-24 h-auto"
                    src="./src/assets/logo.png"
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                <NavLink
                  to="/dashboard"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/dashboard" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
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
                <NavLink to="/">
                  <img
                    className="w-24 h-auto"
                    src="./src/assets/logo.png"
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">

                <NavLink
                  to="/payments"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/payments" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Payment Management</span>
                </NavLink>
                <NavLink
                  to="/joinus"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/joinus" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
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
                <NavLink to="/">
                  <img
                    className="w-24 h-auto"
                    src="./src/assets/logo.png"
                    alt="VoltHub"
                  />
                </NavLink>
              </div>

              <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                <NavLink
                  to="/addmap"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/addmap" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                    }`}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Map</span>
                </NavLink>
                <NavLink
                  to="/ManageMaps"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${location.pathname === "/ManageMaps" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
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
            <section className="px-4 py-6">
              <h2 className="text-xl font-semibold">Notifications</h2>
              {/* Add notifications content here */}
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar; 