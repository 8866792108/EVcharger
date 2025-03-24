import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  ThumbsUp, 
  Trash2, 
  ChevronRight, 
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Dashboard = ({ showNotification }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    unreadMessages: 0,
    pendingRequests: 0,
    totalFeedbacks: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [feedbackRes, messageRes, joinReqRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8080/feedback?limit=5'),
        axios.get('http://localhost:8080/messages?limit=5'),
        axios.get('http://localhost:8080/joinrequests?limit=5'),
        axios.get('http://localhost:8080/dashboard/stats')
      ]);

      setFeedbacks(feedbackRes.data);
      setMessages(messageRes.data);
      setJoinRequests(joinReqRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showNotification('Error', 'Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
      showNotification('Success', 'Feedback deleted successfully', 'success');
    } catch (error) {
      showNotification('Error', 'Failed to delete feedback', 'error');
    }
  };

  const handleMessageSeen = async (id, currentSeen) => {
    try {
      await axios.patch(`http://localhost:8080/messages/${id}`, { seen: !currentSeen });
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, seen: !currentSeen } : msg
      ));
    } catch (error) {
      showNotification('Error', 'Failed to update message status', 'error');
    }
  };

  const handleJoinRequestStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:8080/joinrequests/${id}`, { status });
      setJoinRequests(joinRequests.map(req => 
        req._id === id ? { ...req, status } : req
      ));
      showNotification('Success', `Request ${status} successfully`, 'success');
    } catch (error) {
      showNotification('Error', 'Failed to update request status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Unread Messages"
          count={stats.unreadMessages}
          icon={<MessageSquare className="w-8 h-8 text-blue-500" />}
          link="/messages"
          color="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          title="Pending Requests"
          count={stats.pendingRequests}
          icon={<Users className="w-8 h-8 text-purple-500" />}
          link="/join-requests"
          color="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          title="Total Feedback"
          count={stats.totalFeedbacks}
          icon={<ThumbsUp className="w-8 h-8 text-green-500" />}
          link="/feedback"
          color="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Messages Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
              Recent Messages
            </h2>
            <Link to="/messages" className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <div key={message._id} className={`p-3 rounded-lg ${
                !message.seen ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/30'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{message.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                  </div>
                  <button
                    onClick={() => handleMessageSeen(message._id, message.seen)}
                    className={`p-1 rounded-full ${
                      message.seen ? 'text-gray-400 hover:text-gray-600' : 'text-blue-500 hover:text-blue-600'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{message.message}</p>
                <div className="mt-2 text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Join Requests Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Recent Join Requests
            </h2>
            <Link to="/join-requests" className="text-purple-500 hover:text-purple-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {joinRequests.map(request => (
              <div key={request._id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{request.businessName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{request.ownerName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleJoinRequestStatus(request._id, 'rejected')}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleJoinRequestStatus(request._id, 'approved')}
                      className="p-1 text-green-500 hover:text-green-600"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="ml-1 text-gray-700 dark:text-gray-300">{request.stationLocation}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="ml-1 text-gray-700 dark:text-gray-300">{request.stationType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
              Recent Feedback
            </h2>
            <Link to="/feedback" className="text-green-500 hover:text-green-600 text-sm font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {feedbacks.map(feedback => (
              <div key={feedback._id} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{feedback.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feedback.email}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="p-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{feedback.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, count, icon, link, color }) => (
  <Link to={link} className={`${color} rounded-xl p-6 transition-transform hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{count}</h3>
      </div>
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        {icon}
      </div>
    </div>
  </Link>
);

export default Dashboard; 