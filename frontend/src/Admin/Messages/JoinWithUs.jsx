import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Check,
  X,
  Eye,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  Battery,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  Filter,
  ChevronDown,
  ChevronUp,
  Menu,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Building2,
  Briefcase,
  GraduationCap,
  BriefcaseIcon,
  Building2 as Building2Icon
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoinWithUs = ({ url }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/JoinWithUs/getJoinUs`);
      const requestsWithStatus = response.data.data.map(request => ({
        ...request,
        status: request.status || 'pending'
      }));
      setRequests(requestsWithStatus);
      calculateStats(requestsWithStatus);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(r => r.status === 'Pending').length;
    const accepted = data.filter(r => r.status === 'Accepted').length;
    const rejected = data.filter(r => r.status === 'Rejected').length;

    setStats({
      total,
      pending,
      accepted,
      rejected
    });
  };

  const handleAcceptRequest = async (id) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      const response = await axios.post(`${url}/JoinWithUs/accept/${id}`, {
        status: 'Accepted'
      });

      if (response.data.success) {
        toast.success("Request Accepted successfully!");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Failed to accept request");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      const response = await axios.post(`${url}/JoinWithUs/reject/${id}`, {
        status: 'Rejected'
      });

      if (response.data.success) {
        toast.success("Request Rejected");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Accepted': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />
      },
      'Rejected': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4 text-red-600" />
      },
      'Pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle className="w-4 h-4 text-yellow-600" />
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

  const getTypeIcon = (type) => {
    const icons = {
      'Job': <BriefcaseIcon className="w-5 h-5 text-blue-500" />,
      'Internship': <GraduationCapIcon className="w-5 h-5 text-purple-500" />,
      'Partnership': <Building2Icon className="w-5 h-5 text-green-500" />
    };
    return icons[type] || <Building className="w-5 h-5 text-gray-500" />;
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      (request?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request?.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (request?.status || 'pending') === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = [...filteredRequests].sort((a, b) => {
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

  const filterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    initial: { scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm bg-opacity-90"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Station Join Requests</h1>
              <p className="text-gray-600">Manage and respond to station partnership requests</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Total Requests: {requests.length}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRequests}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Refresh List
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Requests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Accepted Requests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.accepted}</h3>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected Requests</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.rejected}</h3>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="md:hidden flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
              {isMobileMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
          </div>

          {/* Enhanced Search and Filter Section */}
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
                  placeholder="Search by business or owner name..."
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
                  <option value="all">All Requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading State with Enhanced Animation */}
        {loading ? (
          <motion.div
            className="flex justify-center items-center min-h-[400px]"
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
        ) : (
          /* Enhanced Request Cards Grid */
          <AnimatePresence mode="wait">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {sortedRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    className={`p-6 border-l-4 ${request?.status === 'Accepted' ? 'border-green-500 bg-green-50' :
                      request?.status === 'Rejected' ? 'border-red-500 bg-red-50' :
                        'border-blue-500 bg-blue-50'
                      }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Status Badge with Enhanced Animation */}
                    <motion.div
                      className="flex justify-between items-start mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {getStatusBadge(request?.status || 'pending')}
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-gray-500"
                      >
                        {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'No date'}
                      </motion.span>
                    </motion.div>

                    {/* Business Info with Staggered Animation */}
                    <motion.div
                      className="mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.h3
                        className="text-xl font-semibold text-gray-800 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {request?.businessName || 'Unnamed Business'}
                      </motion.h3>
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-sm flex items-center gap-2 text-gray-600">
                          <User size={16} />
                          {request?.ownerName || 'No owner name'}
                        </p>
                        <p className="text-sm flex items-center gap-2 text-gray-600">
                          <MapPin size={16} />
                          {request?.stationLocation || 'No location'}
                        </p>
                        <p className="text-sm flex items-center gap-2 text-gray-600">
                          <Battery size={16} />
                          {request?.numberOfPorts || 0} Charging Ports
                        </p>
                      </motion.div>
                    </motion.div>

                    {/* Action Buttons with Enhanced Animations */}
                    <motion.div
                      className="flex justify-between items-center mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </motion.button>

                      {request.status === 'Pending' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={loadingStates[request._id]}
                            className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform flex items-center gap-2 ${loadingStates[request._id] ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                          >
                            {loadingStates[request._id] ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={loadingStates[request._id]}
                            className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform flex items-center gap-2 ${loadingStates[request._id] ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                          >
                            {loadingStates[request._id] ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            Reject
                          </motion.button>
                        </div>
                      )}

                      {request.status === 'Accepted' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={loadingStates[request._id]}
                            className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform flex items-center gap-2 ${loadingStates[request._id] ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                          >
                            {loadingStates[request._id] ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                            Reject
                          </motion.button>
                        </div>
                      )}

                      {request.status === 'Rejected' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAcceptRequest(request._id)}
                            disabled={loadingStates[request._id]}
                            className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform flex items-center gap-2 ${loadingStates[request._id] ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                          >
                            {loadingStates[request._id] ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Accept
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Modal Animations */}
        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Request Details</h2>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Business Information</h3>
                      <div className="space-y-3">
                        <p className="flex items-center gap-2">
                          <Building className="text-gray-500" />
                          <span className="font-medium">{selectedRequest.businessName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="text-gray-500" />
                          <span>{selectedRequest.ownerName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="text-gray-500" />
                          <span>{selectedRequest.stationLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <p className="flex items-center gap-2">
                          <Phone className="text-gray-500" />
                          <span>{selectedRequest.contactNumber}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="text-gray-500" />
                          <span>{selectedRequest.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Station Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Station Type</p>
                        <p className="font-medium">{selectedRequest.stationType}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Number of Ports</p>
                        <p className="font-medium">{selectedRequest.numberOfPorts}</p>
                      </div>
                    </div>
                  </div>

                  {selectedRequest.additionalInfo && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-700 mb-2">Additional Information</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                        {selectedRequest.additionalInfo}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    {selectedRequest.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(selectedRequest._id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(selectedRequest._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </div>
                    )}

                    {selectedRequest.status === 'Accepted' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleAcceptRequest(selectedRequest._id);
                            setSelectedRequest(null);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Reject Request
                        </button>
                      </div>
                    )}

                    {selectedRequest.status === 'Rejected' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleAcceptRequest(selectedRequest._id);
                            setSelectedRequest(null);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          Accept Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </motion.div>
    </div>
  );
};

export default JoinWithUs;