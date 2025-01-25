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
  MapPinCheck
} from "lucide-react"
import { Navigate, NavLink, Route, Router, Routes } from 'react-router-dom'
import MapAdd from "./components/maps/MapAdd"
import Displaymap from "./components/maps/Displaymap"
import Updatemap from "./components/maps/Updatemap"

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSidebarTab, setCurrentSidebarTab] = useState("orderTab")
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)

  // Watch screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  return (
    <>
      <div className="flex h-screen antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        <div className="flex flex-shrink-0 transition-all">
          {/* Sidebar backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left mini bar */}
          <nav className="z-20 flex-col items-center flex-shrink-0 hidden w-16 py-4 bg-white border-r-2 border-indigo-100 shadow-md sm:flex rounded-tr-3xl rounded-br-3xl">
            {/* Logo */}
            <div className="flex-shrink-0 py-4">
              <a href="#">
                <img
                  className="w-20 h-auto"
                  src="./src/assets/logo.png"
                  alt="VoltHub"
                />
              </a>
            </div>

            <div className="flex flex-col items-center flex-1 p-2 space-y-4">
              {/* Menu button */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "orderTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("orderTab")
                  }
                }}
                className={`p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2 ${isSidebarOpen && currentSidebarTab === "orderTab"
                  ? "text-white bg-indigo-600"
                  : "text-gray-500 bg-white"
                  }`}
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "mapTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("mapTab")
                  }
                }}
                className={`p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2 ${isSidebarOpen && currentSidebarTab === "mapTab"
                  ? "text-white bg-indigo-600"
                  : "text-gray-500 bg-white"
                  }`}
              >
                <Map className="w-6 h-6" />
              </button>

              {/* Messages button */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "messagesTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("messagesTab")
                  }
                }}
                className={`p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2 ${isSidebarOpen && currentSidebarTab === "messagesTab"
                  ? "text-white bg-indigo-600"
                  : "text-gray-500 bg-white"
                  }`}
              >
                <MessageSquare className="w-6 h-6" />
              </button>

              {/* Notifications button */}
              <button
                onClick={() => {
                  if (isSidebarOpen && currentSidebarTab === "notificationsTab") {
                    setIsSidebarOpen(false)
                  } else {
                    setIsSidebarOpen(true)
                    setCurrentSidebarTab("notificationsTab")
                  }
                }}
                className={`p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2 ${isSidebarOpen && currentSidebarTab === "notificationsTab"
                  ? "text-white bg-indigo-600"
                  : "text-gray-500 bg-white"
                  }`}
              >
                <Bell className="w-6 h-6" />
              </button>
            </div>

            {/* User avatar */}
            <div
              className="relative flex items-center flex-shrink-0 p-2"
              ref={userMenuRef}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="transition-opacity rounded-lg opacity-80 hover:opacity-100 focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
              >
                <img
                  className="w-10 h-10 rounded-lg shadow-md"
                  src="./src/assets/logo.png"
                  alt="User"
                />
              </button>
              {isUserMenuOpen && (
                <div
                  className="absolute w-48 py-1 mt-2 origin-bottom-left bg-white rounded-md shadow-lg left-10 bottom-14 focus:outline-none"
                  role="menu"
                >

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Sidebar */}
          {isSidebarOpen && (
            <div className="fixed inset-y-0 left-0 z-10 flex-shrink-0 w-64 bg-white border-r-2 border-indigo-100 shadow-lg sm:left-16 rounded-tr-3xl rounded-br-3xl sm:w-72 lg:static lg:w-64">
              {currentSidebarTab === "orderTab" && (
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
                      to="/additems"
                      className="flex items-center w-full space-x-2 text-indigo-600 rounded-lg transition-colors group hover:bg-indigo-600 hover:text-white"
                    >
                      <span className="p-2 rounded-lg group-hover:bg-indigo-700 group-hover:text-white">
                        <Plus className="w-6 h-6" />
                      </span>
                      <span>Add New Item</span>
                    </NavLink>
                    <NavLink
                      to="/ManageItems"
                      className="flex items-center space-x-2 text-indigo-600 transition-colors rounded-lg group hover:bg-indigo-600 hover:text-white"
                    >
                      <span className="p-2 transition-colors rounded-lg group-hover:bg-indigo-700 group-hover:text-white">
                        <img src="https://static.thenounproject.com/png/1326930-512.png" alt="done" className='w-6 h-6' />
                      </span>
                      <span>Order Management</span>
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
                      className="flex items-center w-full space-x-2 text-indigo-600 rounded-lg transition-colors group hover:bg-indigo-600 hover:text-white"
                    >
                      <span className="p-2 rounded-lg group-hover:bg-indigo-700 group-hover:text-white">
                        <Plus className="w-6 h-6" />
                      </span>
                      <span>Add New Map</span>
                    </NavLink>
                    <NavLink
                      to="/ManageMaps"
                      className="flex items-center space-x-2 text-indigo-600 rounded-lg transition-colors  group hover:bg-indigo-600 hover:text-white"
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

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <Routes>
            <Route path="/" element={<Navigate to={'/addmap'} />} />
            <Route path='/addmap' element={<MapAdd />} />
            <Route path='/Managemaps' element={<Displaymap />} />
            <Route path='/updatemaps' element={<Updatemap />} />
          </Routes>
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
