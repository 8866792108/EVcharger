import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Star,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  Menu,
  X as Close,
  StarHalf,
  Star as StarFull,
  Star as StarEmpty,
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const Feedback = ({ url }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    averageRating: 0
  });

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${url}/feedback/getfeedback`);
      // Update to handle the response data structure
      setFeedbacks(response.data.data || []);
      calculateStats(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch feedback data');
      setLoading(false);
      console.error("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const calculateStats = (data) => {
    const total = data.length;
    const positive = data.filter(f => f.rating >= 4).length;
    const negative = data.filter(f => f.rating <= 2).length;
    const averageRating = data.reduce((acc, curr) => acc + curr.rating, 0) / total;

    setStats({
      total,
      positive,
      negative,
      averageRating: averageRating.toFixed(1)
    });
  };

  const getRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      if (starValue <= rating) {
        return <StarFull key={index} className="w-4 h-4 text-yellow-400 fill-current" />;
      } else if (starValue - 0.5 <= rating) {
        return <StarHalf key={index} className="w-4 h-4 text-yellow-400" />;
      } else {
        return <StarEmpty key={index} className="w-4 h-4 text-yellow-400" />;
      }
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Positive': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4 text-green-600" />
      },
      'Negative': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4 text-red-600" />
      },
      'Neutral': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle className="w-4 h-4 text-yellow-600" />
      }
    };

    const badge = badges[status] || badges.Neutral;

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

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch =
      feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === 'all' ||
      (filterRating === 'high' && feedback.rating >= 4) ||
      (filterRating === 'medium' && feedback.rating >= 2 && feedback.rating < 4) ||
      (filterRating === 'low' && feedback.rating < 2);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'Positive' && feedback.rating >= 4) ||
      (filterStatus === 'Negative' && feedback.rating <= 2) ||
      (filterStatus === 'Neutral' && feedback.rating > 2 && feedback.rating < 4);

    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
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

  const FeedbackCard = ({ feedback }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{feedback.name || 'Anonymous User'}</h3>
            <p className="text-sm text-gray-500">{feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'No date'}</p>
          </div>
        </div>
        {getStatusBadge(feedback.rating >= 4 ? 'Positive' : feedback.rating <= 2 ? 'Negative' : 'Neutral')}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
          {getRatingStars(feedback.rating || 0)}
        </div>
        <p className="text-gray-700">{feedback.message || feedback.comment || 'No message provided'}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{feedback.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{feedback.replies || 0}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{feedback.createdAt ? new Date(feedback.createdAt).toLocaleTimeString() : 'No time'}</span>
        </div>
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
        <h1 className="text-xl font-bold text-gray-900">Feedback Management</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <Close size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Feedback Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Feedback</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.averageRating}</h3>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
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
              <p className="text-sm text-gray-500">Positive Feedback</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.positive}</h3>
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
              <p className="text-sm text-gray-500">Negative Feedback</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.negative}</h3>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
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
              placeholder="Search by name or feedback message..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 min-w-[150px] appearance-none cursor-pointer transition-all duration-200"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="high">High (4-5)</option>
                <option value="medium">Medium (2-3)</option>
                <option value="low">Low (1-2)</option>
              </select>
            </motion.div>
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
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Neutral">Neutral</option>
              </select>
            </motion.div>
          </div>
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      User
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('rating')}
                  >
                    <div className="flex items-center gap-1">
                      Rating
                      {sortConfig.key === 'rating' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {sortedFeedbacks.map((feedback) => (
                    <motion.tr
                      key={feedback._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{feedback.name || 'Anonymous User'}</div>
                            <div className="text-sm text-gray-500">{feedback.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {getRatingStars(feedback.rating || 0)}
                          <span className="ml-2 text-sm text-gray-600">({feedback.rating || 0}/5)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">
                          {feedback.message || feedback.comment || 'No message provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(feedback.rating >= 4 ? 'Positive' : feedback.rating <= 2 ? 'Negative' : 'Neutral')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'No date'}
                        </div>
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
          {sortedFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback._id} feedback={feedback} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedFeedbacks.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Feedback; 