import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const { slots, branchId, date, slotId } = location.state || {};

  useEffect(() => {
    if (!slots || !branchId || !date || !slotId) {
      navigate('/stations');
    }
  }, [slots, branchId, date, slotId, navigate]);

  const calculateTotalPrice = () => {
    return slots.length * 10; // ₹10 per slot
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedMethod === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
      toast.error('Please fill in all card details');
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const orderData = {
        userId,
        slotId,
        branchId,
        date,
        slots,
        method: selectedMethod,
        price: calculateTotalPrice(),
        transaction: Math.random().toString(36).substring(2, 15),
        status: 'Pending'
      };

      const response = await axios.post('http://localhost:8080/orders/api/create', orderData);

      if (response.status === 201) {
        toast.success('Booking successful!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (!slots || !branchId || !date || !slotId) {
    return null;
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">Payment Details</h1>
          <p className="text-gray-400 text-sm sm:text-base">Complete your booking by selecting a payment method</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Left Side - Payment Methods */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
            >
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">Select Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod('gpay')}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                    selectedMethod === 'gpay'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 border-transparent'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Google Pay</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 border-transparent'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Credit Card</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {selectedMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
              >
                <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">Card Details</h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm md:text-base text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800 sticky top-8">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Branch</p>
                  <p className="font-medium text-xs sm:text-sm md:text-base">Branch {branchId}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Date</p>
                  <p className="font-medium text-xs sm:text-sm md:text-base">{date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Time Slots</p>
                  <div className="space-y-1.5 sm:space-y-2">
                    {slots.map((slot) => (
                      <div key={`${slot.start}-${slot.end}`} className="flex items-center gap-2 text-xs sm:text-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span>{slot.start} - {slot.end}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Amount</p>
                    <p className="font-medium text-xs sm:text-sm md:text-base">₹{calculateTotalPrice()}</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Pay Now'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 