import React from 'react';
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
} from 'lucide-react';

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
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              location.pathname === "/dashboard"
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
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              location.pathname === "/additems" || location.pathname === "/ManageItems"
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
            className={`p-2 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              location.pathname === "/addmap" || location.pathname === "/ManageMaps"
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
                showNotification("New Message", "You have 3 unread messages", "info");
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
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/dashboard" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
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
                  to="/additems"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/additems" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                  }`}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Item</span>
                </NavLink>
                <NavLink
                  to="/ManageItems"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/ManageItems" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                  }`}
                >
                  <Menu className="w-6 h-6" />
                  <span>Order Management</span>
                </NavLink>
                <NavLink
                  to="/payments"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/payments" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Payment Management</span>
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
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/addmap" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                  }`}
                >
                  <Plus className="w-6 h-6" />
                  <span>Add New Map</span>
                </NavLink>
                <NavLink
                  to="/ManageMaps"
                  className={`flex items-center w-full space-x-2 p-2 rounded-lg transition-colors hover:bg-indigo-50 ${
                    location.pathname === "/ManageMaps" ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
                  }`}
                >
                  <MapPinCheck className="w-6 h-6" />
                  <span>Map Management</span>
                </NavLink>
              </div>
            </nav>
          )}

          {currentSidebarTab === "messagesTab" && (
            <section className="px-4 py-6">
              <h2 className="text-xl font-semibold">Messages</h2>
              {/* Add message content here */}
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