import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../api/config'; = () => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ensure only customers can access
  useEffect(() => {
    if (userType !== 'customer') {
      navigate('/dashboard');
      return;
    }
    fetchRequests();
  }, [userType, navigate]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [requests, activeFilter, searchQuery, sortOrder]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const baseURL = API_URL;
      
      const response = await fetch(`${baseURL}/service-requests/my-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.serviceRequests || data.requests || data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setError('Error loading requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...requests];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(request => request.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.title?.toLowerCase().includes(query) ||
        request.description?.toLowerCase().includes(query) ||
        request.service?.title?.toLowerCase().includes(query) ||
        request.artisan?.businessName?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'budget_high':
          return (b.budget?.max || 0) - (a.budget?.max || 0);
        case 'budget_low':
          return (a.budget?.min || 0) - (b.budget?.min || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredRequests(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    if (!budget) return 'Budget not specified';
    
    const currency = budget.currency || '₦';
    if (budget.min && budget.max) {
      return `${currency}${budget.min.toLocaleString()} - ${currency}${budget.max.toLocaleString()}`;
    } else if (budget.min) {
      return `From ${currency}${budget.min.toLocaleString()}`;
    } else if (budget.max) {
      return `Up to ${currency}${budget.max.toLocaleString()}`;
    }
    return 'Budget not specified';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quoted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'No expiry';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const handleAcceptQuote = async (requestId) => {
    try {
      const baseURL = API_URL;
        
      const response = await fetch(`${baseURL}/service-requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchRequests();
        alert('Quote accepted! You can now convert this to a booking.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to accept quote');
      }
    } catch (err) {
      alert('Error accepting quote');
      console.error('Error accepting quote:', err);
    }
  };

  const handleConvertToBooking = async (requestId) => {
    // This would typically open a modal or navigate to a booking creation page
    // For now, we'll show an alert
    alert('This will open the booking creation form. Feature coming soon!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate filter counts
  const filterCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    quoted: requests.filter(r => r.status === 'quoted').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    declined: requests.filter(r => r.status === 'declined').length,
    expired: requests.filter(r => r.status === 'expired').length
  };

  const filters = [
    { key: 'all', label: 'All Requests', count: filterCounts.all },
    { key: 'pending', label: 'Pending', count: filterCounts.pending },
    { key: 'quoted', label: 'Quoted', count: filterCounts.quoted },
    { key: 'accepted', label: 'Accepted', count: filterCounts.accepted },
    { key: 'declined', label: 'Declined', count: filterCounts.declined },
    { key: 'expired', label: 'Expired', count: filterCounts.expired }
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-black text-white w-full top-0 z-10 fixed">
          <div className="py-2">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
                <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
                <span className="text-white text-4xl select-none font-bold">B</span>
                <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="bg-gray-50 flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin w-8 h-8 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Consistent with app pattern */}
      <header className="bg-black text-white w-full top-0 z-10 fixed">
        <div className="py-2">
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center cursor-pointer py-3" onClick={() => navigate('/')}>
              <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
              <span className="text-white text-4xl select-none font-bold">B</span>
              <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/dashboard')}>
                <div>Your</div>
                <div className="font-bold">Dashboard</div>
              </div>
              <div className="text-xs cursor-pointer hover:text-red-400" onClick={() => navigate('/bookings/my-bookings')}>
                <div>Your</div>
                <div className="font-bold">Bookings</div>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 pt-20 py-8 mt-5">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Service Requests</h1>
                <p className="text-gray-600">Track your service requests and their status updates</p>
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
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Filter and Search Section */}
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Filter Tabs */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
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
            </div>

            {/* Search and Sort */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
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
              </select>
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
                        <h3 className="text-lg font-semibold text-gray-800">
                          {request.title || request.service?.title || 'Service Request'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(request.status)}`}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {request.artisan?.businessName || request.artisan?.contactName || 'Artisan'}
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
                        {formatBudget(request.budget)}
                      </div>
                      <div className="text-sm text-gray-500">Your Budget</div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</span>
                      <p className="text-sm text-gray-800">
                        {request.service?.title || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</span>
                      <p className="text-sm text-gray-800">
                        {request.selectedCategory || request.service?.category || 'General'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</span>
                      <p className="text-sm text-gray-800">
                        {request.location?.lga || 'Not specified'}
                        {request.location?.state && `, ${request.location.state}`}
                      </p>
                    </div>
                  </div>

                  {/* Quote Information */}
                  {request.status === 'quoted' && request.quote && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Quote Received:</strong> ₦{request.quote.amount?.toLocaleString()} 
                        {request.quote.estimatedDuration && ` - Duration: ${request.quote.estimatedDuration}`}
                      </p>
                      {request.quote.notes && (
                        <p className="text-sm text-blue-600 mt-1">
                          <strong>Notes:</strong> {request.quote.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Status-specific Messages */}
                  {request.status === 'accepted' && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Quote Accepted!</strong> You can now convert this to a booking to proceed with the service.
                      </p>
                    </div>
                  )}

                  {request.status === 'declined' && request.declineReason && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Request Declined:</strong> {request.declineReason}
                      </p>
                    </div>
                  )}

                  {request.status === 'expired' && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Request Expired:</strong> This request has expired. You can create a new request for this service.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {/* Message Artisan */}
                    <button
                      onClick={() => navigate(`/messages/${request._id}`)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message Artisan
                    </button>

                    {/* View Artisan Profile */}
                    {request.artisan && (
                      <button
                        onClick={() => navigate(`/profile/${request.artisan._id}`)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Artisan
                      </button>
                    )}

                    {/* View Service */}
                    {request.service && (
                      <button
                        onClick={() => navigate(`/services/${request.service._id}`)}
                        className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Service
                      </button>
                    )}

                    {/* Accept Quote */}
                    {request.status === 'quoted' && (
                      <button
                        onClick={() => handleAcceptQuote(request._id)}
                        className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accept Quote
                      </button>
                    )}

                    {/* Convert to Booking */}
                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleConvertToBooking(request._id)}
                        className="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Create Booking
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeFilter !== 'all' ? activeFilter : ''} requests
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeFilter === 'pending'
                    ? 'No pending requests. Your active requests will appear here.'
                    : activeFilter === 'quoted'
                    ? 'No quoted requests yet. When artisans respond with quotes, they\'ll appear here.'
                    : 'You haven\'t made any service requests yet. Start browsing services to make your first request!'}
                </p>
                <button
                  onClick={() => navigate('/services')}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Browse Services
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerRequestHistory;