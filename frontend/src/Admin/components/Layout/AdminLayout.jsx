import React, { useState, useEffect, useRef } from "react"
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  MessageSquare,
  Bell,
  Settings,
  Home,
  FileText,
  Plus,
  Map,
  MapPinCheck,
  X,
  AlertCircle,
  CreditCard,
  MessageCircle
} from "lucide-react"
import Sidebar from "../../Sidebar"
import axios from "axios"

const AdminLayout = ({ url }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSidebarTab, setCurrentSidebarTab] = useState("orderTab")
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageContent, setMessageContent] = useState({ title: "", message: "", type: "info" })
  const [pendingOrders, setPendingOrders] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

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
      const response = await axios.get(`${url}/orders/api/find`)
      const orders = response.data.orders
      const pending = orders.filter(order => order.status === "Pending")
      setPendingOrders(pending)

      if (pending.length > 0) {
        // const pendingDetails = pending.map(order => `
        //   • Slot ${order.slotnumber} - ${order.date} at ${order.time}
        //   Amount: $${order.price} (${order.method})
        // `).join('\n')

        const pendingDetails = pending.map(order => {
          const date = order.date ?? 'N/A';
          const slotCount = order.slots?.length || 0;
          const branch = order.branchId ?? '—';
          const price = order.price ? `₹${Number(order.price).toFixed(2)}` : '₹0.00';
          const method = order.method?.toUpperCase() ?? 'N/A';
        
          return `🔔 [${date}] • ${slotCount} slot${slotCount > 1 ? 's' : ''} • Branch: ${branch} \n💰 ${price} via ( ${method} )`;
        }).join('\n\n');

        
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
    if (type !== "warning") {
      setTimeout(() => setShowMessage(false), 5000)
    }
  }

  return (
    <div className="flex h-screen antialiased text-gray-900 bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-dark dark:text-light">
      {/* Enhanced Message Popup */}
      {showMessage && (
        <div className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-[400px] transform transition-all duration-300 ease-in-out ${showMessage ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className={`relative p-4 rounded-lg shadow-lg ${messageContent.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
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
                <h3 className={`text-sm font-medium ${messageContent.type === 'success' ? 'text-green-800' :
                  messageContent.type === 'error' ? 'text-red-800' :
                    messageContent.type === 'warning' ? 'text-yellow-800' :
                      'text-blue-800'
                  }`}>
                  {messageContent.title}
                </h3>
                <div className={`mt-2 text-sm whitespace-pre-line ${messageContent.type === 'success' ? 'text-green-700' :
                  messageContent.type === 'error' ? 'text-red-700' :
                    messageContent.type === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                  }`}>
                  {messageContent.message}
                </div>
              </div>
              <button
                onClick={() => setShowMessage(false)}
                className={`absolute top-4 right-4 text-sm ${messageContent.type === 'success' ? 'text-green-400 hover:text-green-500' :
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

      {/* Sidebar Component */}
      <Sidebar
        url={url}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentSidebarTab={currentSidebarTab}
        setCurrentSidebarTab={setCurrentSidebarTab}
        pendingOrders={pendingOrders}
        fetchPendingOrders={fetchPendingOrders}
        showNotification={showNotification}
        location={location}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-[100vh] overflow-scroll">
        <main className="flex-1 p-4">
          <Outlet />
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
  )
}

export default AdminLayout 