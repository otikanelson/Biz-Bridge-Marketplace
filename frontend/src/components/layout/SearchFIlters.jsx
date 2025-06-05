import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import your job categories and locations
import { JOB_CATEGORIES, LAGOS_LGAS, LAGOS_LOCALITIES } from '../../utils/LocationData';

const SearchFilters = ({ onSearch, compact = false, initialValues = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const filtersRef = useRef(null);
  
  // State for search inputs
  const [jobQuery, setJobQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(initialValues.jobCategory || '');
  const [selectedLocation, setSelectedLocation] = useState(initialValues.location || '');
  
  // State for dropdowns
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  // State for filtered options
  const [filteredJobs, setFilteredJobs] = useState(JOB_CATEGORIES);
  const [filteredLocations, setFilteredLocations] = useState(LAGOS_LGAS);
  
  // Get search params from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobParam = params.get('job');
    const locationParam = params.get('location');
    
    if (jobParam) setSelectedJob(jobParam);
    if (locationParam) setSelectedLocation(locationParam);
  }, [location.search]);

  // Filter jobs based on search query
  useEffect(() => {
    if (jobQuery.trim() === '') {
      setFilteredJobs(JOB_CATEGORIES);
    } else {
      const query = jobQuery.toLowerCase().trim();
      setFilteredJobs(
        JOB_CATEGORIES.filter(
          job => job.name.toLowerCase().includes(query) || 
                job.description.toLowerCase().includes(query)
        )
      );
    }
  }, [jobQuery]);

  // Filter locations based on search query
  useEffect(() => {
    if (locationQuery.trim() === '') {
      // Reset to all LGAs when query is empty
      setFilteredLocations(LAGOS_LGAS);
    } else {
      const query = locationQuery.toLowerCase().trim();
      
      // First search LGAs
      const matchingLGAs = LAGOS_LGAS.filter(
        lga => lga.name.toLowerCase().includes(query) || 
              lga.region.toLowerCase().includes(query)
      );
      
      // Then search localities
      const matchingLocalities = [];
      Object.entries(LAGOS_LOCALITIES).forEach(([lgaName, localities]) => {
        localities.forEach(locality => {
          if (locality.toLowerCase().includes(query)) {
            matchingLocalities.push({
              id: `${lgaName}-${locality}`,
              name: locality,
              parentLga: lgaName,
              isLocality: true
            });
          }
        });
      });
      
      // Combine matches
      setFilteredLocations([...matchingLGAs, ...matchingLocalities]);
    }
  }, [locationQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowJobDropdown(false);
        setShowLocationDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    // Close dropdowns
    setShowJobDropdown(false);
    setShowLocationDropdown(false);
    
    // Use provided onSearch callback or navigate directly
    if (onSearch) {
      onSearch({
        jobCategory: selectedJob,
        location: selectedLocation
      });
    } else {
      navigate(`/search?job=${encodeURIComponent(selectedJob || '')}&location=${encodeURIComponent(selectedLocation || '')}`);
    }
  };

  // Handle job selection
  const handleJobSelection = (job) => {
    setSelectedJob(job.name);
    setShowJobDropdown(false);
  };

  // Handle location selection
  const handleLocationSelection = (location) => {
    if (location.isLocality) {
      setSelectedLocation(`${location.name} (${location.parentLga})`);
    } else {
      setSelectedLocation(location.name);
    }
    setShowLocationDropdown(false);
  };

  // Handle clear selections
  const handleClearJob = () => {
    setSelectedJob('');
  };

  const handleClearLocation = () => {
    setSelectedLocation('');
  };

  return (
    <div 
      className={`w-full ${compact ? 'max-w-lg' : 'max-w-3xl'} mx-auto`}
      ref={filtersRef}
    >
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        {/* Job Category Dropdown */}
        <div className="flex-1 relative">
          <div 
            className={`flex items-center justify-between w-full border-4 border-red-400 rounded-t md:rounded-t-none md:rounded-l p-3 cursor-pointer bg-white ${compact ? 'text-sm py-2' : ''}`}
            onClick={() => {
              setShowJobDropdown(!showJobDropdown);
              setShowLocationDropdown(false);
            }}
          >
            <div className="flex-1 truncate">
              {selectedJob || "What service do you need?"}
            </div>
            {selectedJob && (
              <button 
                type="button" 
                className="mr-2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearJob();
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showJobDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 bg-white p-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Search for services..."
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {filteredJobs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No services found</div>
              ) : (
                <ul>
                  {filteredJobs.map((job) => (
                    <li 
                      key={job.id}
                      className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedJob === job.name ? 'bg-red-50' : ''}`}
                      onClick={() => handleJobSelection(job)}
                    >
                      <div className="font-medium">{job.name}</div>
                      <div className="text-xs text-gray-500">{job.description}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Location Dropdown */}
        <div className="flex-1 relative">
          <div 
            className={`flex items-center justify-between w-full border-t border-b border-l border-r md:border-l-0 border-red-400 p-3 cursor-pointer bg-white ${compact ? 'text-sm py-2' : ''}`}
            onClick={() => {
              setShowLocationDropdown(!showLocationDropdown);
              setShowJobDropdown(false);
            }}
          >
            <div className="flex-1 truncate">
              {selectedLocation || "Where?"}
            </div>
            {selectedLocation && (
              <button 
                type="button" 
                className="mr-2 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearLocation();
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showLocationDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 bg-white p-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Search locations..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {filteredLocations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No locations found</div>
              ) : (
                <ul>
                  {filteredLocations.map((location) => (
                    <li 
                      key={location.id}
                      className={`p-3 hover:bg-gray-100 cursor-pointer ${
                        (location.isLocality 
                          ? selectedLocation === `${location.name} (${location.parentLga})` 
                          : selectedLocation === location.name) 
                          ? 'bg-red-50' : ''
                      }`}
                      onClick={() => handleLocationSelection(location)}
                    >
                      <div className="font-medium">{location.name}</div>
                      {location.isLocality ? (
                        <div className="text-xs text-gray-500">{location.parentLga} LGA</div>
                      ) : (
                        <div className="text-xs text-gray-500">{location.region || 'Lagos'}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {/* Search Button */}
        <button 
          type="submit" 
          className={`bg-red-500 text-white p-3 rounded-b md:rounded-b-none md:rounded-r flex justify-center items-center ${compact ? 'py-2' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchFilters;