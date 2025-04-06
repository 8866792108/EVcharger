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
import { Template_Bill } from "./Bill"
import html2pdf from "html2pdf.js"
const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selectedBill, setSelectedBill] = useState(null)
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

      const response = await axios.get(`${url}/orders/api/find/${userId}`)
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
    if (filter === 'cancelled') {
      return order.status.toLowerCase() === 'cancelled' || order.status.toLowerCase() === 'rejected'
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

  const handleViewBill = (order) => {
    setSelectedBill(order)
  }

  const handleDownloadBill = (order) => {
    const data = Template_Bill(order._id, order.date, localStorage.getItem("name"), localStorage.getItem("email"), order.branchId, order.price, order.slots,false)
    var opt = {
      margin: 0.3,
      filename: `${localStorage.getItem("name")}_${order.branchId}_${order.date}.pdf`,
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        imageTimeout: 0,
        onclone: function (clonedDoc) {
          // Ensure images are loaded in the cloned document
          const images = clonedDoc.getElementsByTagName('img');
          for (let i = 0; i < images.length; i++) {
            images[i].style.display = 'block';
            images[i].style.visibility = 'visible';
            images[i].style.opacity = '1';
            images[i].style.zIndex = '1000';
          }

          // Generate barcode in the cloned document
          const barcodeId = `barcode-${order._id.replace(/[^a-zA-Z0-9]/g, '')}`;
          const barcodeCanvas = clonedDoc.getElementById(barcodeId);
          if (barcodeCanvas) {
            try {
              // @ts-ignore
              window.JsBarcode(barcodeCanvas, order._id, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10,
                background: "#ffffff",
                lineColor: "#000000",
                font: "monospace"
              });
            } catch (e) {
              console.error("Barcode generation error in clone:", e);
              // If JsBarcode fails, show the fallback image
              const barcodeImage = clonedDoc.querySelector('.barcode-image');
              if (barcodeImage) {
                barcodeImage.style.display = 'block';
                // barcodeCanvas.style.display = 'none';
              }
            }
          } else {
            // If canvas not found, ensure the fallback image is visible
            const barcodeImage = clonedDoc.querySelector('.barcode-image');
            if (barcodeImage) {
              barcodeImage.style.display = 'block';
            }
          }
        }
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
  
    html2pdf(data, opt)
  }

  const getBillPreview = (order) => {
    if (!order) return null;
    const billHtml = Template_Bill(order._id, order.date, localStorage.getItem("name"), localStorage.getItem("email"), order.branchId, order.price, order.slots);

    // Add a style override to ensure text is visible in preview
    return billHtml.replace('<style>', `<style>
      body { 
        color: #333 !important; 
        background-color: #f9f9f9 !important; 
      }
      .bill-container { 
        background: white !important; 
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important; 
        border-radius: 8px !important; 
      }
      .bill-header h1 { 
        color: #2c3e50 !important; 
        font-size: 32px !important; 
        text-transform: uppercase !important; 
        letter-spacing: 1px !important; 
      }
      .bill-header p {
        color: #7f8c8d !important;
      }
      .total-amount { 
        color: #27ae60 !important; 
        font-size: 22px !important; 
      }
      .bill-details .row span { 
        color: #333 !important; 
      }
      .bill-details .row span:first-child {
        font-weight: 600 !important;
        color: #34495e !important;
      }
      .booked-slots { 
        background: #f8f9fa !important; 
        color: #333 !important; 
        border-left: 4px solid #3498db !important; 
      }
      .booked-slots h2 { 
        color: #2c3e50 !important; 
        font-size: 18px !important; 
      }
      .booked-slots li { 
        color: #333 !important; 
      }
      .bill-footer { 
        color: #7f8c8d !important; 
      }
      .bill-footer p { 
        color: #7f8c8d !important; 
      }
      .barcode-text { 
        color: #7f8c8d !important; 
        font-style: italic !important; 
      }
      .barcode-container {
        border: 1px dashed #3498db !important;
        background-color: #f8f9fa !important;
      }
      .barcode-canvas, .barcode-image {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: 100% !important;
        height: auto !important;
        margin-left: auto !important;
        margin-right: auto !important;
        border: 1px solid #ddd !important;
        padding: 10px !important;
        background-color: white !important;
      }
      .barcode-image {
        display: block !important;
      }
    `);
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
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${filter === status
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
                        onClick={() => handleViewBill(order)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-colors text-xs sm:text-sm flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Bill
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

      {/* Bill View Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Bill Preview</h3>
              <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Bill Preview */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div
                  id="bill-preview"
                  className="p-4 max-h-[500px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: getBillPreview(selectedBill) }}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadBill(selectedBill)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Bill
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
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

