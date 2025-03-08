import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, AlertCircle, Clock } from 'lucide-react';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:8080/orders/api/find/67bf33c91efcee6b632c86a7");
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
      await axios.put(`http://localhost:8080/orders/update/${paymentId}`, {
        status: newStatus
      });
      
      // Show success message
      const statusMessage = {
        Accepted: 'Payment has been accepted',
        Rejected: 'Payment has been rejected',
        Pending: 'Payment status set to pending'
      };
      
      // Refresh payment data
      fetchPayments();
    } catch (err) {
      setError('Failed to update payment status');
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
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
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
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
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
                    <select
                      value={payment.status}
                      onChange={(e) => updatePaymentStatus(payment._id, e.target.value)}
                      className="block w-full px-3 py-2 text-sm rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accept</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement; 