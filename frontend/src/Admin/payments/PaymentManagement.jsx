import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  X as Close,
  Download,
  RefreshCw,
  Calendar,
  BarChart2,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [cachedData, setCachedData] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // Add a ref for the modal overlay
  const modalOverlayRef = useRef(null);
  const statsRef = useRef(null);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalOverlayRef.current && !modalOverlayRef.current.contains(event.target)) {
        setSelectedPayment(null);
      }
    };

    if (selectedPayment) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedPayment]);

  // Handle click outside stats
  useEffect(() => {
    const handleClickOutsideStats = (event) => {
      if (statsRef.current && !statsRef.current.contains(event.target) && showStats) {
        setShowStats(false);
      }
    };

    if (showStats) {
      document.addEventListener('mousedown', handleClickOutsideStats);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideStats);
    };
  }, [showStats]);

  // Fetch payments with caching
  const fetchPayments = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Check if we have cached data and it's less than 5 minutes old
      const now = new Date();
      const cacheAge = lastFetchTime ? (now - new Date(lastFetchTime)) / 1000 / 60 : 0;
      
      if (!forceRefresh && cachedData && cacheAge < 5) {
        setPayments(cachedData);
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${url}/orders/api/find`);
      setPayments(response.data.orders);
      setCachedData(response.data.orders);
      setLastFetchTime(now.toISOString());
      setLoading(false);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to fetch payment data');
      setLoading(false);
      
      // Implement retry mechanism
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchPayments(true), 2000 * (retryCount + 1));
      }
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Update payment status with confirmation
  const updatePaymentStatus = async (paymentId, newStatus) => {
    // Validate the new status
    if (!['Pending', 'Accepted', 'Rejected'].includes(newStatus)) {
      toast.error(`Invalid status: ${newStatus}`, {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    
    setPendingStatusChange({ paymentId, newStatus });
    setShowConfirmDialog(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    const { paymentId, newStatus } = pendingStatusChange;
    try {
      setLoadingStates(prev => ({ ...prev, [paymentId]: true }));
      
      // Log the request for debugging
      console.log(`Updating payment ${paymentId} to status: ${newStatus}`);
      
      // Make sure the status value matches what the API expects
      const apiStatus = newStatus === 'Accepted' ? 'Accept' : 
                        newStatus === 'Rejected' ? 'Reject' : 
                        newStatus;
      
      const response = await axios.get(`${url}/orders/api/book-slot/${paymentId}/${apiStatus}`);

      if (response.data.status) {
        toast.success(response.data.message || "Status Updated Successfully", {
          position: "top-center",
          autoClose: 2000,
        });
        
        // Update local state without refetching
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            payment._id === paymentId 
              ? { ...payment, status: newStatus } 
              : payment
          )
        );
        
        // If the payment is in the modal, update it there too
        if (selectedPayment && selectedPayment._id === paymentId) {
          setSelectedPayment(prev => ({
            ...prev,
            status: newStatus
          }));
        }
      } else {
        toast.error(response.data.message || "Something Went Wrong", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Error updating payment status:', err);
      toast.error(`Failed to update payment status: ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [paymentId]: false }));
      setShowConfirmDialog(false);
      setPendingStatusChange(null);
      // Only refresh data if the API call was successful
      if (response?.data?.status) {
        fetchPayments();
      }
    }
  };

  // Export payment data to CSV
  const exportToCSV = () => {
    const headers = ['Transaction ID', 'User ID', 'Slot', 'Date', 'Time', 'Duration', 'Price', 'Method', 'Status'];
    const csvData = filteredPayments.map(payment => [
      payment.transaction,
      payment.userId,
      payment.slotnumber,
      payment.date,
      payment.time,
      payment.duration,
      payment.price,
      payment.method,
      payment.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter(p => p.status === 'Pending').length;
    const accepted = payments.filter(p => p.status === 'Accepted').length;
    const rejected = payments.filter(p => p.status === 'Rejected').length;
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
    
    return {
      total,
      pending,
      accepted,
      rejected,
      totalRevenue: totalRevenue.toFixed(2),
      acceptanceRate: total > 0 ? ((accepted / total) * 100).toFixed(1) : 0
    };
  }, [payments]);

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
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.icon}
        {status}
      </motion.span>
    );
  };

  // Filter payments by search term, status, and date range
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch =
        payment.transaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === 'all' ||
        payment.status === filterStatus;
      
      // Date range filtering
      let matchesDateRange = true;
      if (startDate && endDate) {
        // Parse the date string properly
        const [year, month, day] = payment.date.split('-').map(Number);
        const paymentDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        
        // Set time to midnight for proper comparison
        const startDateMidnight = new Date(startDate);
        startDateMidnight.setHours(0, 0, 0, 0);
        
        const endDateMidnight = new Date(endDate);
        endDateMidnight.setHours(23, 59, 59, 999);
        
        matchesDateRange = paymentDate >= startDateMidnight && paymentDate <= endDateMidnight;
      }

      return matchesSearch && matchesFilter && matchesDateRange;
    });
  }, [payments, searchTerm, filterStatus, startDate, endDate]);

  // Sort payments
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = useMemo(() => {
    const sorted = [...filteredPayments].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      // Handle nested properties
      const getValue = (obj, key) => {
        return key.split('.').reduce((o, i) => o?.[i], obj);
      };
      
      const aValue = getValue(a, sortConfig.key);
      const bValue = getValue(b, sortConfig.key);
      
      if (aValue === bValue) return 0;
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
    
    return sorted;
  }, [filteredPayments, sortConfig]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  // Payment Statistics Component
  const PaymentStats = () => (
    <motion.div 
      ref={statsRef}
      className="bg-white rounded-xl shadow-lg p-6 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Payment Statistics</h2>
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-500" />
          <button 
            onClick={() => setShowStats(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-blue-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-blue-600 font-medium">Total Payments</p>
          <p className="text-2xl font-bold text-blue-700">{paymentStats.total}</p>
        </motion.div>
        <motion.div 
          className="bg-yellow-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-yellow-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{paymentStats.pending}</p>
        </motion.div>
        <motion.div 
          className="bg-green-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-green-600 font-medium">Accepted</p>
          <p className="text-2xl font-bold text-green-700">{paymentStats.accepted}</p>
        </motion.div>
        <motion.div 
          className="bg-red-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-red-600 font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{paymentStats.rejected}</p>
        </motion.div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-indigo-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-indigo-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-indigo-700">${paymentStats.totalRevenue}</p>
        </motion.div>
        <motion.div 
          className="bg-purple-50 p-4 rounded-lg"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <p className="text-sm text-purple-600 font-medium">Acceptance Rate</p>
          <p className="text-2xl font-bold text-purple-700">{paymentStats.acceptanceRate}%</p>
        </motion.div>
      </div>
    </motion.div>
  );

  // Date Range Picker Component
  const DateRangePicker = () => {
    const datePickerRef = useRef(null);
    
    // Handle click outside date picker
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
          setShowDateFilter(false);
        }
      };

      if (showDateFilter) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showDateFilter]);
    
    return (
      <motion.div
        ref={datePickerRef}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="mt-4 p-4 bg-white rounded-lg shadow-md"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dateFormat="MM/dd/yyyy"
              placeholderText="Select start date"
              maxDate={endDate || new Date()}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dateFormat="MM/dd/yyyy"
              placeholderText="Select end date"
              minDate={startDate}
              maxDate={new Date()}
            />
          </div>
          <div className="flex items-end gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDateFilter(false)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
            >
              <Check size={16} />
              Apply
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Enhanced PaymentCard with animations
  const PaymentCard = ({ payment }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedPayment(payment)}
          className="px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
        >
          <Eye size={16} />
          View Details
        </motion.button>
        
        <StatusSelect payment={payment} />
      </div>
    </motion.div>
  );

  // Enhanced StatusSelect with animations
  const StatusSelect = ({ payment, isModal = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Handle click outside dropdown
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
    
    const statusOptions = [
      { value: 'Pending', label: 'Pending', icon: <Clock className="w-4 h-4 text-yellow-600" /> },
      { value: 'Accepted', label: 'Accept', icon: <Check className="w-4 h-4 text-green-600" /> },
      { value: 'Rejected', label: 'Reject', icon: <X className="w-4 h-4 text-red-600" /> }
    ];
    
    const currentStatus = statusOptions.find(opt => opt.value === payment.status) || statusOptions[0];
    
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          disabled={loadingStates[payment._id]}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 ${
            loadingStates[payment._id] ? 'opacity-75 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {loadingStates[payment._id] ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              {currentStatus.icon}
              <span>{currentStatus.label}</span>
              <ChevronDown size={14} className="ml-1" />
            </>
          )}
        </motion.button>
        
        {isOpen && !loadingStates[payment._id] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200"
          >
            <div className="py-1">
              {statusOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    updatePaymentStatus(payment._id, option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 ${
                    payment.status === option.value ? 'bg-gray-50 font-medium' : ''
                  }`}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Previous
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Next
          </button>
        </nav>
      </div>
    );
  };

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
        className="flex flex-col items-center justify-center h-full text-red-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-medium mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchPayments(true)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </motion.button>
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
      <div className="hidden md:flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-1"
          >
            <BarChart2 size={16} />
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="px-3 py-2 bg-green-50 text-green-600 rounded-lg flex items-center gap-1"
          >
            <Download size={16} />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchPayments(true)}
            className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg flex items-center gap-1"
          >
            <RefreshCw size={16} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Payment Statistics */}
      {showStats && <PaymentStats />}

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
              placeholder="Search by Order ID, Transaction ID, or User ID..."
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
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 min-w-[150px] text-left flex items-center justify-between ${
                startDate && endDate ? 'border-blue-300 bg-blue-50' : ''
              }`}
            >
              <span>
                {startDate && endDate 
                  ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                  : 'Date Range'}
              </span>
              {startDate && endDate && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X size={14} className="text-gray-500" />
                </motion.button>
              )}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Date Range Picker */}
        {showDateFilter && <DateRangePicker />}
      </motion.div>

      {/* Results Summary */}
      <motion.div 
        className="mb-4 text-sm text-gray-600 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedPayments.length)} of {sortedPayments.length} payments
        </div>
        {(startDate || endDate || filterStatus !== 'all' || searchTerm) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setStartDate(null);
              setEndDate(null);
              setCurrentPage(1);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Clear Filters
          </motion.button>
        )}
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('userId')}
                  >
                    <div className="flex items-center gap-1">
                      User ID
                      {sortConfig.key === 'userId' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot Info
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Payment Details
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`bg-white divide-y divide-gray-200 ${currentItems.length === 0 ? 'flex items-center justify-center h-full' : ''}`}>
                <AnimatePresence>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No payments found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((payment) => (
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
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedPayment(payment)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <StatusSelect payment={payment} />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <AnimatePresence>
          {currentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payments found matching your criteria
            </div>
          ) : (
            currentItems.map((payment) => (
              <PaymentCard key={payment._id} payment={payment} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination />}

      {/* Payment Details Modal */}
      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            ref={modalOverlayRef}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Close size={20} />
                </motion.button>
              </div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">Transaction ID</h3>
                  <p className="text-sm text-gray-900">{selectedPayment.transaction}</p>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="text-sm text-gray-900">{selectedPayment.userId}</p>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">Slot Information</h3>
                  <p className="text-sm text-gray-900">Slot: {selectedPayment.slotnumber}</p>
                  <p className="text-sm text-gray-900">{selectedPayment.date} at {selectedPayment.time}</p>
                  <p className="text-sm text-gray-900">{selectedPayment.duration} mins</p>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
                  <p className="text-sm text-gray-900">${selectedPayment.price}</p>
                  <p className="text-sm text-gray-900 capitalize">via {selectedPayment.method}</p>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  {getStatusBadge(selectedPayment.status)}
                </motion.div>
              </motion.div>

              <motion.div 
                className="mt-6 flex justify-end"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <StatusSelect payment={selectedPayment} isModal={true} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowConfirmDialog(false);
              setPendingStatusChange(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Confirm Status Change</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to change the status to <span className="font-medium">{pendingStatusChange?.newStatus}</span>?
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">This action will update the payment status in the system.</p>
                  <p className="text-sm text-gray-500 mt-1">Transaction ID: <span className="font-medium">{payments.find(p => p._id === pendingStatusChange?.paymentId)?.transaction}</span></p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowConfirmDialog(false);
                    setPendingStatusChange(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentManagement; 