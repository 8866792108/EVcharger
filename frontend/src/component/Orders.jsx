"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, CreditCard, MapPin, ChevronDown, ChevronUp, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import Navbar from "./Navbar"
import axios from "axios"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        navigate('/login')
        return
      }

      const response = await axios.get(`http://localhost:8080/orders/api/find/${userId}`)
      console.log(response.data)
      setOrders(response.data.orders || [])
    } catch (error) {
      toast.error("Failed to fetch orders")
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'Completed'
      default:
        return status
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'completed') {
      return order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'accepted'
    }
    return order.status.toLowerCase() === filter.toLowerCase()
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownloadBill = (order) => {
    // Create bill content
    const billContent = `
      EV Charging Station Bill
      ------------------------
      Order ID: ${order._id}
      Date: ${formatDate(order.date)}
      Branch: ${order.branchId}
      Status: ${getStatusText(order.status)}
      Amount: ₹${order.price}
      Payment Method: ${order.method}
      
      Time Slots:
      ${order.slots.map(slot => `${slot.start} - ${slot.end}`).join('\n')}
      
      Thank you for choosing our service!
    `

    // Create blob and download
    const blob = new Blob([billContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bill-${order._id.slice(-6)}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 lg:mb-8 border border-gray-800"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">My Orders</h1>
          <p className="text-gray-400 text-sm sm:text-base">Track and manage your charging station bookings</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          {['all', 'pending', 'completed', 'cancelled'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(status)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-400">Order #{order._id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-gray-400">₹{order.price}</span>
                    {(order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'accepted') && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadBill(order)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Bill
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      {expandedOrder === order._id ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            <span className="text-xs sm:text-sm">Branch {order.branchId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            <span className="text-xs sm:text-sm">{formatDate(order.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            <span className="text-xs sm:text-sm capitalize">{order.method}</span>
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <p className="text-xs sm:text-sm text-gray-400">Time Slots:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {order.slots.map((slot, index) => (
                              <div key={index} className="flex items-center gap-1.5 bg-gray-800 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                                <span className="text-xs sm:text-sm">{slot.start}-{slot.end}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" />
                <p className="text-gray-400 text-sm sm:text-base">No orders found</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

// Styled Components
const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`

const NavLink = styled.a`
  color: #f3f4f6;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: linear-gradient(90deg, #3b82f6, #22c55e);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #22c55e;
    
    &:after {
      width: 100%;
    }
  }
`

const NavButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }
`

const FuturisticInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  color: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  &::placeholder {
    color: #6b7280;
  }
`

export default Orders

