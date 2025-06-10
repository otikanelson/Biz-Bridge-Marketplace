// src/components/pages/ServiceRequestInbox.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ServiceRequestInbox = () => {
  const { userType, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination state
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest');

  // Ensure only artisans can access
  useEffect(() => {
    if (userType !== 'artisan') {
      navigate('/unauthorized');
      return;
    }
    fetchRequests();
  }, [userType, navigate, activeFilter, currentPage, sortOrder]);

  // Fetch service requests from API
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: activeFilter === 'all' ? '' : activeFilter,
        page: currentPage.toString(),
        limit: '10'
      });

      const response = await fetch(`http://localhost:5000/api/service-requests/inbox?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setTotalPages(data.pagination?.pages || 1);
      
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load service requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    let filtered = [...requests];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.title?.toLowerCase().includes(query) ||
        request.description?.toLowerCase().includes(query) ||
        request.customer?.fullName?.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, searchQuery]);

  // Handle quick response actions
  const handleQuickDecline = async (requestId) => {
    if (!confirm('Are you sure you want to decline this request?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/service-requests/${requestId}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Not available for this project at the moment'
        })
      });

      if (response.ok) {
        fetchRequests(); // Refresh the list
      } else {
        alert('Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline request');
    }
  };

  // Helper functions
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'viewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiating': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'quoted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (min, max, currency = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : '$';
    if (max) {
      return `${symbol}${min?.toLocaleString()} - ${symbol}${max?.toLocaleString()}`;
    }
    return `${symbol}${min?.toLocaleString()}+`;
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const remaining = expiry - now;
    
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading service requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50">
        <div className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span onClick={() => navigate('/')} className="text-red-500 text-5xl select-none font-bold cursor-pointer">𐐒</span>
                <span onClick={() => navigate('/')} className="text-white text-4xl select-none font-bold cursor-pointer">B</span>
                <span onClick={() => navigate('/')} className="text-red-500 text-2xl select-none cursor-pointer font-semibold ml-5">BizBridge</span>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                  <div>Your</div>
                  <div className="font-bold">Dashboard</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/ServicesManagement')}>
                  <div>Your</div>
                  <div className="font-bold">Services</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/profile')}>
                  <div>Your</div>
                  <div className="font-bold">Profile</div>
                </div>
                <div className="text-xs cursor-pointer hover:text-red-400" onClick={handleLogout}>
                  <div>Sign</div>
                  <div className="font-bold">Out</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Request Inbox</h1>
                <p className="text-gray-600">Manage incoming service requests from customers</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Status Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Requests', count: requests.length },
                  { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
                  { key: 'viewed', label: 'Viewed', count: requests.filter(r => r.status === 'viewed').length },
                  { key: 'negotiating', label: 'Negotiating', count: requests.filter(r => r.status === 'negotiating').length },
                  { key: 'quoted', label: 'Quoted', count: requests.filter(r => r.status === 'quoted').length },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => {
                      setActiveFilter(filter.key);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeFilter === filter.key
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Search and Sort */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget_high">Highest Budget</option>
                  <option value="budget_low">Lowest Budget</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(request.status)}`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority?.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {request.customer?.fullName}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(request.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {getTimeRemaining(request.expiresAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-1">
                        {formatPrice(request.budget?.min, request.budget?.max, request.budget?.currency)}
                      </div>
                      <div className="text-sm text-gray-500">Budget Range</div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</span>
                      <p className="text-sm text-gray-800">
                        {new Date(request.timeline?.preferredStartDate).toLocaleDateString()} 
                        {request.timeline?.preferredEndDate && ` - ${new Date(request.timeline.preferredEndDate).toLocaleDateString()}`}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{request.timeline?.flexibility} flexibility</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</span>
                      <p className="text-sm text-gray-800 capitalize">{request.location?.type?.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">{request.location?.lga}, Lagos</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</span>
                      <p className="text-sm text-gray-800">{request.service?.title || 'Custom Request'}</p>
                      <p className="text-xs text-gray-500">{request.category}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/service-requests/${request._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      View Full Details
                    </button>

                    <div className="flex gap-2">
                      {['pending', 'viewed', 'negotiating'].includes(request.status) && (
                        <>
                          <button
                            onClick={() => navigate(`/service-requests/${request._id}/quote`)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium"
                          >
                            Send Quote
                          </button>
                          <button
                            onClick={() => handleQuickDecline(request._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      
                      {request.status === 'quoted' && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                          Waiting for customer response
                        </span>
                      )}
                      
                      {request.status === 'accepted' && (
                        <button
                          onClick={() => navigate(`/service-requests/${request._id}/convert`)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-medium"
                        >
                          Convert to Booking
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages indicator */}
                  {request.messages && request.messages.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          💬 {request.messages.length} message{request.messages.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-500">
                          Last message: {formatDate(request.messages[request.messages.length - 1]?.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📨</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeFilter === 'all' ? 'No service requests yet' : `No ${activeFilter} requests`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'all' 
                    ? 'When customers request quotes for your services, they\'ll appear here.'
                    : `No requests with status "${activeFilter}" found.`}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/ServicesAdd')}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Add Your Services
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === index + 1
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BizBridge. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center">
              <span onClick={() => navigate('/terms')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Terms of Service</span>
              <span onClick={() => navigate('/privacy')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Privacy Policy</span>
              <span onClick={() => navigate('/contact')} className="text-red-400 hover:text-red-500 mx-2 cursor-pointer">Contact Us</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceRequestInbox;