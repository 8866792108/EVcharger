"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "./Navbar"
import axios from "axios"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
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

      const response = await axios.get(`http://localhost:8080/orders/find/${userId}`)
      setOrders(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch orders")
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">My Bookings</h1>
          <button 
            onClick={() => navigate('/stations')}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book New Slot
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No bookings found</div>
            <button 
              onClick={() => navigate('/stations')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book a Charging Slot
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Slot #{order.slotNumber}
                    </h3>
                    <p className="text-gray-400">
                      User: {localStorage.getItem('name')}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${getStatusColor(order.status)} text-white text-sm`}>
                    {order.status || 'pending'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Start Time</p>
                    <p className="font-medium">
                      {formatDate(order.start)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">End Time</p>
                    <p className="font-medium">
                      {formatDate(order.end)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price</p>
                    <p className="font-medium">
                      ₹{order.price || '---'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Booking ID</p>
                      <p className="font-mono">{order._id}</p>
                    </div>
                    {order.status === 'pending' && (
                      <div className="text-sm text-yellow-400">
                        Waiting for admin approval
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

