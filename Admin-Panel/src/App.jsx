import React, { useState, useEffect, useRef } from "react"
import {
  Menu,
  MessageSquare,
  Bell,
  Settings,
  Home,
  FileText,
  Github,
  Twitter,
  Plus,
  Map,
  MapPinCheck,
  X,
  AlertCircle,
  CreditCard
} from "lucide-react"
import { Navigate, NavLink, Route, Router, Routes, useLocation } from 'react-router-dom'
import MapAdd from "./components/maps/MapAdd"
import Displaymap from "./components/maps/Displaymap"
import Updatemap from "./components/maps/Updatemap"
import PaymentManagement from "./components/payments/PaymentManagement"
import axios from "axios"

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSidebarTab, setCurrentSidebarTab] = useState("orderTab")
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageContent, setMessageContent] = useState({ title: "", message: "", type: "info" })
  const [pendingOrders, setPendingOrders] = useState([])

  const location = useLocation()

  // Watch screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [location])

  // Click outside handlers
  const userMenuRef = useRef(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [ismapOpen, setIsmapOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = event => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/orders/api/find/67bf33c91efcee6b632c86a7")
      const orders = response.data.orders
      const pending = orders.filter(order => order.status === "Pending")
      setPendingOrders(pending)
      
      if (pending.length > 0) {
        const pendingDetails = pending.map(order => `
          • Slot ${order.slotnumber} - ${order.date} at ${order.time}
          Amount: $${order.price} (${order.method})
        `).join('\n')
        
        showNotification(
          `${pending.length} Pending Payment${pending.length > 1 ? 's' : ''}`,
          pendingDetails,
          "warning"
        )
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      showNotification(
        "Error",
        "Failed to fetch order status",
        "error"
      )
    }
  }

  // Load pending orders on component mount
  useEffect(() => {
    fetchPendingOrders()
  }, [])

  // Message popup function
  const showNotification = (title, message, type = "info") => {
    setMessageContent({ title, message, type })
    setShowMessage(true)
    if (type !== "warning") { // Keep warning messages visible until user dismisses
      setTimeout(() => setShowMessage(false), 5000)
    }
  }

  return (
    <>
      <div className="flex h-screen antialiased text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-dark dark:text-light">
        {/* Enhanced Message Popup */}
        {showMessage && (
          <div className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-[400px] transform transition-all duration-300 ease-in-out ${showMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className={`relative p-4 rounded-lg shadow-lg ${
              messageContent.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
              messageContent.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
              messageContent.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-blue-50 border-l-4 border-blue-500'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {messageContent.type === 'success' && (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {messageContent.type === 'error' && (
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {messageContent.type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                  {messageContent.type === 'info' && (
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 w-full">
                  <h3 className={`text-sm font-medium ${
                    messageContent.type === 'success' ? 'text-green-800' :
                    messageContent.type === 'error' ? 'text-red-800' :
                    messageContent.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {messageContent.title}
                  </h3>
                  <div className={`mt-2 text-sm whitespace-pre-line ${
                    messageContent.type === 'success' ? 'text-green-700' :
                    messageContent.type === 'error' ? 'text-red-700' :
                    messageContent.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {messageContent.message}
                  </div>
                </div>
                <button
                  onClick={() => setShowMessage(false)}
                  className={`absolute top-4 right-4 text-sm ${
                    messageContent.type === 'success' ? 'text-green-400 hover:text-green-500' :
                    messageContent.type === 'error' ? 'text-red-400 hover:text-red-500' :
                    messageContent.type === 'warning' ? 'text-yellow-400 hover:text-yellow-500' :
                    'text-blue-400 hover:text-blue-500'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-shrink-0 transition-all">
          {/* Sidebar backdrop with blur effect */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm lg:hidden sidebar-backdrop"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left mini bar with enhanced styling */}
          <nav className="z-20 flex-col items-center flex-shrink-0 hidden w-16 py-4 bg-white border-r border-gray-200 shadow-lg sm:flex rounded-tr-2xl rounded-br-2xl animate-slide-in-left">
            {/* Logo with animation */}
            <div className="flex-shrink-0 py-4 animate-scale-in">
              <a href="#" className="block transition-transform duration-200 hover:scale-110">
                <img
                  className="w-20 h-auto"
                  src="./src/assets/logo.png"
                  alt="VoltHub"
                />
              </a>
            </div>

            <div className="flex flex-col items-center flex-1 p-2 space-y-4">
              {/* Menu button with enhanced animations */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "orderTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("orderTab")
                  }
                }}
                className={`sidebar-item p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  location.pathname === "/additems" || location.pathname === "/ManageItems"
                    ? "text-white bg-indigo-600 shadow-indigo-100 sidebar-item-active"
                    : "text-gray-600 bg-white hover:text-white"
                }`}
              >
                <Menu className="w-6 h-6 transform transition-transform group-hover:scale-110" />
              </button>

              {/* Map button with enhanced animations */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "mapTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("mapTab")
                  }
                }}
                className={`sidebar-item p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  location.pathname === "/addmap" || location.pathname === "/ManageMaps"
                    ? "text-white bg-indigo-600 shadow-indigo-100 sidebar-item-active"
                    : "text-gray-600 bg-white hover:text-white"
                }`}
              >
                <Map className="w-6 h-6 transform transition-transform group-hover:scale-110" />
              </button>

              {/* Messages button with enhanced animations */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "messagesTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("messagesTab")
                    showNotification("New Message", "You have 3 unread messages", "info")
                  }
                }}
                className="sidebar-item relative p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 bg-white"
              >
                <MessageSquare className="w-6 h-6 transform transition-transform group-hover:scale-110" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notifications button with enhanced animations */}
              <button
                onClick={() => {
                  if (pendingOrders.length > 0) {
                    fetchPendingOrders()
                  }
                }}
                className="sidebar-item relative p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-600 bg-white"
              >
                <Bell className="w-6 h-6 transform transition-transform group-hover:scale-110" />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    {pendingOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Enhanced user avatar section with animations */}
            <div className="relative flex items-center flex-shrink-0 p-2" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1 transition-all duration-200 rounded-xl hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
              >
                <img
                  className="w-10 h-10 rounded-xl shadow-sm object-cover"
                  src="./src/assets/logo.png"
                  alt="User"
                />
              </button>
              {isUserMenuOpen && (
                <div className="absolute w-56 p-2 mt-2 space-y-2 bg-white rounded-lg shadow-lg left-12 bottom-12 focus:outline-none animate-scale-in">
                  <a href="#" className="nav-item block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                    Profile Settings
                  </a>
                  <a href="#" className="nav-item block px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Enhanced main sidebar with animations */}
          {isSidebarOpen && (
            <div className="sidebar-container sm:left-16 rounded-tr-2xl rounded-br-2xl sm:w-72 lg:static lg:w-64">
              {currentSidebarTab === "orderTab" && (
                <nav className="flex flex-col h-full animate-slide-in-left">
                  <div className="flex items-center justify-center flex-shrink-0 py-10 animate-scale-in">
                    <NavLink to="/">
                      <img
                        className="w-24 h-auto transform transition-transform hover:scale-110"
                        src="./src/assets/logo.png"
                        alt="K-UI"
                      />
                    </NavLink>
                  </div>

                  <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                    <NavLink
                      to="/additems"
                      className={`sidebar-nav-item group ${location.pathname === "/additems" ? "active" : ""}`}
                    >
                      <span className="p-2 rounded-lg transition-colors group-hover:bg-indigo-100">
                        <Plus className="sidebar-icon" />
                      </span>
                      <span className="sidebar-text">Add New Item</span>
                    </NavLink>
                    <NavLink
                      to="/ManageItems"
                      className={`sidebar-nav-item group ${location.pathname === "/ManageItems" ? "active" : ""}`}
                    >
                      <span className="p-2 rounded-lg transition-colors group-hover:bg-indigo-100">
                        <img src="https://static.thenounproject.com/png/1326930-512.png" alt="done" className="sidebar-icon" />
                      </span>
                      <span className="sidebar-text">Order Management</span>
                    </NavLink>
                    <NavLink
                      to="/payments"
                      className={`sidebar-nav-item group ${location.pathname === "/payments" ? "active" : ""}`}
                    >
                      <span className="p-2 rounded-lg transition-colors group-hover:bg-indigo-100">
                        <CreditCard className="sidebar-icon" />
                      </span>
                      <span className="sidebar-text">Payment Management</span>
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
                        alt="K-UI"
                      />
                    </NavLink>
                  </div>

                  <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                    <NavLink
                      to="/addmap"
                      className={`flex items-center w-full space-x-2 text-indigo-600 rounded-lg transition-colors group hover:bg-indigo-600 hover:text-white${location.pathname === "/addmap" ? "text-white bg-[rgb(134,156,227)]" : " "}`}
                    >
                      <span className="p-2 rounded-lg group-hover:bg-indigo-700 group-hover:text-white">
                        <Plus className="w-6 h-6" />
                      </span>
                      <span>Add New Map</span>
                    </NavLink>
                    <NavLink
                      to="/ManageMaps"
                      className={`flex items-center space-x-2 text-indigo-600 rounded-lg transition-colors  group hover:bg-indigo-600 hover:text-white ${location.pathname === "/ManageMaps" ? "text-white bg-[rgb(134,156,227)]" : " "}`}
                    >
                      <span className="p-2 transition-colors rounded-lg group-hover:bg-indigo-700 group-hover:text-white">
                        <MapPinCheck className="w-6 h-6" />
                      </span>
                      <span>Map Management</span>
                    </NavLink>
                  </div>
                </nav>
              )}

              {currentSidebarTab === "messagesTab" && (
                <section className="px-4 py-6">
                  <h2 className="text-xl">Messages</h2>
                </section>
              )}

              {currentSidebarTab === "notificationsTab" && (
                <section className="px-4 py-6">
                  <h2 className="text-xl">Notifications</h2>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Navigate to={'/addmap'} />} />
              <Route path='/addmap' element={<MapAdd />} />
              <Route path='/Managemaps' element={<Displaymap />} />
              <Route path='/payments' element={<PaymentManagement />} />
              <Route path='/edit-map/:id' element={<Updatemap />}
                loader={async ({ params }) => {
                  console.log(params)
                  const resposne = await axios.get(`http://localhost:8080/slots/find/${params.id}`)
                  return resposne.json()
                }}
              />
            </Routes>
          </main>
        </div>

        {/* Settings Panel */}
        {isSettingsPanelOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSettingsPanelOpen(false)}
            />
            <section className="fixed inset-y-0 right-0 w-64 bg-white border-l border-indigo-100 rounded-l-3xl">
              <div className="px-4 py-8">
                <h2 className="text-lg font-semibold">Settings</h2>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}

export default App
