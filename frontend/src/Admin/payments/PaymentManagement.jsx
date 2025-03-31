import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Check,
  X,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Loader2,
  ChevronDown,
  ChevronUp,
  Menu,
  X as Close
} from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentManagement = ({ url }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loadingStates, setLoadingStates] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${url}/orders/api/find/67bf33c91efcee6b632c86a7`);
      setPayments(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status
  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      setLoadingStates(prev => ({ ...prev, [paymentId]: true }));
      const response = await axios.get(`${url}/orders/api/book-slot/${paymentId}/${newStatus}`);

      if (response.data.status) {
        toast.success(response.data.message || "Status Updated Successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        toast.error("Something Went Wrong", {
          position: "top-center",
          autoClose: 2000,
        });
      }

      fetchPayments();
    } catch (err) {
      setError('Failed to update payment status');
    } finally {
      setLoadingStates(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Accepted: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <Check className="w-4 h-4 text-green-600" />
      },
      Rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <X className="w-4 h-4 text-red-600" />
      },
      Pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-4 h-4 text-yellow-600" />
      }
    };

    const badge = badges[status] || badges.Pending;

    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.icon}
        {status}
      </motion.span>
    );
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.transaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      payment.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const PaymentCard = ({ payment }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Transaction ID</h3>
          <p className="text-sm text-gray-600">{payment.transaction}</p>
        </div>
        {getStatusBadge(payment.status)}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">User ID</h4>
          <p className="text-sm text-gray-900">{payment.userId}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Price</h4>
          <p className="text-sm text-gray-900">${payment.price}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-2">Slot Info</h4>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Slot: {payment.slotnumber}</p>
          <p className="text-sm text-gray-600">{payment.date} at {payment.time}</p>
          <p className="text-sm text-gray-600">{payment.duration} mins</p>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.select
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          value={payment.status}
          onChange={(e) => updatePaymentStatus(payment._id, e.target.value)}
          disabled={loadingStates[payment._id]}
          className={`px-3 py-2 text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 ${loadingStates[payment._id] ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
          {loadingStates[payment._id] ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accept</option>
              <option value="Rejected">Reject</option>
            </>
          )}
        </motion.select>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-blue-500"
        >
          <Loader2 size={48} />
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center h-full text-red-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      variants={containerVariants}
    >
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">Payment Management</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <Close size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Management</h1>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block mb-6`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Search by Order ID or Transaction ID..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 min-w-[150px] appearance-none cursor-pointer transition-all duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('transaction')}
                  >
                    <div className="flex items-center gap-1">
                      Transaction ID
                      {sortConfig.key === 'transaction' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`bg-white divide-y divide-gray-200 ${sortedPayments.length === 0 ? 'flex items-center justify-center h-full' : ''}`}>
                <AnimatePresence>
                  {sortedPayments.map((payment, index) => (
                    <motion.tr
                      key={payment._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transaction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            ID: {payment.userId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span>Slot: {payment.slotnumber}</span>
                          <span>{payment.date} at {payment.time}</span>
                          <span>{payment.duration} mins</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            ${payment.price}
                          </span>
                          <span className="text-gray-500 capitalize">
                            via {payment.method}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.select
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          value={payment.status}
                          onChange={(e) => updatePaymentStatus(payment._id, e.target.value)}
                          disabled={loadingStates[payment._id]}
                          className={`block w-full px-3 py-2 text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 ${loadingStates[payment._id] ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                          {loadingStates[payment._id] ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <>
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accept</option>
                              <option value="Rejected">Reject</option>
                            </>
                          )}
                        </motion.select>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <AnimatePresence>
          {sortedPayments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))}
        </AnimatePresence>
      </div>

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Close size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                  <p className="text-sm text-gray-900">{selectedPayment.transaction}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="text-sm text-gray-900">{selectedPayment.userId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Slot Information</h3>
                  <p className="text-sm text-gray-900">Slot: {selectedPayment.slotnumber}</p>
                  <p className="text-sm text-gray-900">{selectedPayment.date} at {selectedPayment.time}</p>
                  <p className="text-sm text-gray-900">{selectedPayment.duration} mins</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
                  <p className="text-sm text-gray-900">${selectedPayment.price}</p>
                  <p className="text-sm text-gray-900 capitalize">via {selectedPayment.method}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.select
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  value={selectedPayment.status}
                  onChange={(e) => updatePaymentStatus(selectedPayment._id, e.target.value)}
                  disabled={loadingStates[selectedPayment._id]}
                  className={`px-3 py-2 text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 ${loadingStates[selectedPayment._id] ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {loadingStates[selectedPayment._id] ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accept</option>
                      <option value="Rejected">Reject</option>
                    </>
                  )}
                </motion.select>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentManagement; 