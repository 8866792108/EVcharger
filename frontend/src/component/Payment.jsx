import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  CreditCard, Wallet, QrCode, Globe, Gift,
  Smartphone, Building, Shield, X
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import styled from "styled-components"
import { motion } from "framer-motion"
import Navbar from "./Navbar"
import paymentQR from '../assets/img/payment.jpeg'
import axios from "axios"

// QR Modal Component
// const QRModal = ({ amount, onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-sm w-full mx-4"
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold">Scan & Pay</h3>
//           <button onClick={onClose} className="text-gray-400 hover:text-white">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="bg-black p-6 rounded-xl mb-6 flex justify-center">
//           <img
//             src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=damodarchilgani-1@okhdfcbank%26am=${amount}`}
//             alt="Payment QR Code"
//             className="w-64 h-64 object-contain"
//           />
//         </div>

//         <div className="text-center space-y-4">
//           <div className="flex justify-between items-center px-4 py-3 bg-gray-800 rounded-lg">
//             <span className="text-gray-400">Amount:</span>
//             <span className="text-lg font-semibold">₹{amount}</span>
//           </div>
//           <div className="flex justify-between items-center px-4 py-3 bg-gray-800 rounded-lg">
//             <input type="text" onChange={(e) => settransaction(e.target.value)} value={transaction} className="w-full h-[50px] bg-gray-800 outline-none text-white text-[22px]" placeholder="Transaction ID" />
//           </div>
//           <div className="text-sm text-gray-400">
//             <p>Scan with any UPI app to pay</p>
//             <p className="mt-2 text-yellow-400">Amount will be shown in your UPI app</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-full mt-4 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
//           >
//             Done
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingDetails = location.state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [selectedSubMethod, setSelectedSubMethod] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const { slotId, date, time, duration, slotnumber } = useParams()
  const [transaction, settransaction] = useState("")

  const paymentMethods = [
    {
      id: 'quick-pay',
      title: 'Quick Pay',
      icon: <Wallet className="w-6 h-6 text-blue-400" />,
      description: 'Pay using UPI / QR',
      subMethods: [
        { id: 'gpay', name: 'Google Pay', icon: 'https://i.pinimg.com/474x/60/5a/bd/605abdb7af3405c6b20a426b1e128322.jpg' },
        { id: 'phonepe', name: 'PhonePe', icon: 'https://i.pinimg.com/474x/78/50/b1/7850b14f0e8dc424f5b7ea8c64b8d2e6.jpg' },
        { id: 'paytm', name: 'Paytm', icon: 'https://i.pinimg.com/474x/49/29/52/492952b850fc17b25a06e9d12837a2e8.jpg' },
        { id: 'bhim', name: 'BHIM UPI', icon: 'https://i.pinimg.com/736x/3d/20/9f/3d209f106e4bb6659e44a1e412547738.jpg' },
        { id: 'amazon', name: 'Amazon Pay', icon: 'https://i.pinimg.com/474x/3a/b5/92/3ab592044ca880f91e97773f739d8398.jpg' },
        { id: 'mobikwik', name: 'MobiKwik', icon: 'https://i.pinimg.com/474x/80/ca/9f/80ca9f1d3de39fdf43d12686cbe2f940.jpg' },
      ]
    },
    {
      id: 'cards',
      title: 'Credit / Debit Card',
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      description: 'Visa, Mastercard, RuPay & more'
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      icon: <Building className="w-6 h-6 text-blue-400" />,
      description: 'All Indian banks',
      subMethods: [
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'axis', name: 'Axis Bank' },
        { id: 'sbi', name: 'State Bank of India' },
      ]
    },
    {
      id: 'wallets',
      title: 'Mobile Wallets',
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      description: 'Paytm, PhonePe & more'
    },
    {
      id: 'points',
      title: 'Redeem Points',
      icon: <Gift className="w-6 h-6 text-blue-400" />,
      description: 'Use your reward points'
    }
  ]

  const handleSubMethodClick = (methodId) => {
    setSelectedSubMethod(methodId)
    if (['gpay', 'phonepe', 'paytm', 'bhim', 'amazon', 'mobikwik'].includes(methodId)) {
      setShowQR(true)
    }
  }

  const handlePayment = async (e) => {

    e.preventDefault()
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    console.log(selectedSubMethod)
    const formdate = new FormData()
    formdate.append("userId", localStorage.getItem('userId'))
    formdate.append("slotId", slotId)
    formdate.append("date", date)
    formdate.append("time", time)
    formdate.append("duration", duration)
    formdate.append("slotnumber", slotnumber)
    formdate.append("method", selectedSubMethod)
    formdate.append("transaction", transaction)
    try {
      const url = `http://localhost:8080/orders/api/book-slot`

      const response = await axios.post(url, formdate, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const { message, success, error } = await response.data

      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        })
        setTimeout(() => {
          navigate("/view-orders")
        }, 1000)
      } else if (error) {
        const details = error?.details[0].message
        toast.error(details, {
          position: "top-center",
          autoClose: 2000,
        })
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      })
    }

    setShowQR(false)
    // try {
    //   toast.success("Payment successful! Booking confirmed.")
    //   setTimeout(() => {
    //     navigate("/stations")
    //   }, 2000)
    // } catch (error) {
    //   toast.error("Payment failed. Please try again.")
    // }
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <nav className="py-4 md:py-6 px-4 md:px-10 border-b border-gray-800">
        <Navbar />
      </nav>

      <div className="flex-grow p-4 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-bold">Select Payment Method</h2>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id}>
                    <PaymentOption
                      selected={selectedPaymentMethod === method.id}
                      onClick={() => {

                        setSelectedPaymentMethod(method.id)
                        setSelectedSubMethod(null)
                      }}
                    >
                      {method.icon}
                      <div className="ml-4 flex-grow">
                        <h3 className="font-semibold">{method.title}</h3>
                        <p className="text-sm text-gray-400">{method.description}</p>
                      </div>
                    </PaymentOption>

                    {/* Sub-methods (for UPI and Net Banking) */}
                    {selectedPaymentMethod === method.id && method.subMethods && (
                      <div className="mt-4 ml-12 grid grid-cols-3 gap-4">
                        {method.subMethods.map((subMethod) => (
                          <button
                            key={subMethod.id}
                            onClick={() => handleSubMethodClick(subMethod.id)}
                            className={`p-4 rounded-xl border ${selectedSubMethod === subMethod.id
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                              } transition-all duration-300 flex flex-col items-center justify-center`}
                          >
                            <img
                              src={subMethod.icon}
                              alt={subMethod.name}
                              className="h-12 w-12 mb-2 object-contain rounded-lg"
                            />
                            <span className="text-sm text-center">{subMethod.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-2xl p-4 md:p-6 border border-gray-800 sticky top-6"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Sub Total</span>
                  <span>₹{bookingDetails?.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Convenience Fee</span>
                  <span>₹20.00</span>
                </div>
                <div className="border-t border-gray-700 my-3"></div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Amount Payable</span>
                  <span className="text-blue-400">₹{(bookingDetails?.price || 0) + 20}</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod || ["netbanking", "quick-pay"].includes(selectedPaymentMethod)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl
                    font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay ₹{(bookingDetails?.price || 0) + 20}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add QR Modal */}
      {showQR && (
        // <QRModal
        //   amount={(bookingDetails?.price || 0) + 20}
        //   onClose={handlePayment}
        // />
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-sm w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Scan & Pay</h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="bg-black p-6 rounded-xl mb-6 flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=damodarchilgani-1@okhdfcbank%26am=${(duration / 30) * 10}`}
                alt="Payment QR Code"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="text-center space-y-4">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Amount:</span>
                <span className="text-lg font-semibold">₹{(duration / 30) * 10}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-gray-800 rounded-lg">
                <input type="text" onChange={(e) => settransaction(e.target.value)} value={transaction} className="w-full h-[50px] bg-gray-800 outline-none text-white text-[22px]" placeholder="Transaction ID" />
              </div>
              <div className="text-sm text-gray-400">
                <p>Scan with any UPI app to pay</p>
                <p className="mt-2 text-yellow-400">Amount will be shown in your UPI app</p>
              </div>
              <button
                onClick={handlePayment}
                className="w-full mt-4 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: ${props => props.selected ? 'rgba(59, 130, 246, 0.1)' : '#1f2937'};
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#374151'};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
  }
`

export default Payment 