import { useState, useEffect } from 'react';
import { MapPin, Navigation, Save, X } from 'lucide-react';
import { LAGOS_LGAS, getLocalitiesForLGA } from '../../utils/locationData';
import './LocationCapture.css';

/**
 * Location capture component with geolocation, LGA/locality selection, and saved addresses
 * @param {Object} props
 * @param {Object} props.value - Current location value {lga, locality, address, landmark, coordinates, isRemote}
 * @param {Function} props.onChange - Callback when location changes
 * @param {Array} props.savedAddresses - User's saved addresses
 * @param {Function} props.onSaveAddress - Callback to save current address
 * @param {boolean} props.allowRemote - Whether to show "Service at my location" option
 * @param {string} props.error - Error message to display
 */
const LocationCapture = ({ 
  value = {}, 
  onChange, 
  savedAddresses = [],
  onSaveAddress,
  allowRemote = true,
  error 
}) => {
  const [selectedLGA, setSelectedLGA] = useState(value.lga || '');
  const [selectedLocality, setSelectedLocality] = useState(value.locality || '');
  const [address, setAddress] = useState(value.address || '');
  const [landmark, setLandmark] = useState(value.landmark || '');
  const [isRemote, setIsRemote] = useState(value.isRemote || false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');

  const localities = selectedLGA ? getLocalitiesForLGA(selectedLGA) : [];

  // Update parent when location changes
  useEffect(() => {
    if (onChange) {
      onChange({
        lga: selectedLGA,
        locality: selectedLocality,
        address,
        landmark,
        isRemote,
        coordinates: value.coordinates // Preserve coordinates
      });
    }
  }, [selectedLGA, selectedLocality, address, landmark, isRemote]);

  const handleLGAChange = (e) => {
    const newLGA = e.target.value;
    setSelectedLGA(newLGA);
    setSelectedLocality(''); // Reset locality when LGA changes
  };

  const handleLocalityChange = (e) => {
    setSelectedLocality(e.target.value);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update coordinates
        onChange({
          lga: selectedLGA,
          locality: selectedLocality,
          address,
          landmark,
          isRemote,
          coordinates: { lat: latitude, lng: longitude }
        });

        setIsGettingLocation(false);
        // TODO: Reverse geocode to get address (optional enhancement)
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An error occurred while getting your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectSavedAddress = (savedAddr) => {
    setSelectedLGA(savedAddr.lga || '');
    setSelectedLocality(savedAddr.locality || '');
    setAddress(savedAddr.address || '');
    setLandmark(savedAddr.landmark || '');
    // Don't override isRemote
  };

  const handleSaveAddress = () => {
    if (!selectedLGA || !address) {
      setLocationError('Please select LGA and enter address before saving');
      return;
    }
    
    if (onSaveAddress) {
      onSaveAddress({
        label: addressLabel || `${selectedLocality || selectedLGA} address`,
        lga: selectedLGA,
        locality: selectedLocality,
        address,
        landmark
      });
    }
    
    setShowSaveDialog(false);
    setAddressLabel('');
  };

  return (
    <div className="location-capture">
      {/* Remote option */}
      {allowRemote && (
        <div className="location-capture__remote">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">
              Service will be provided at my location
            </span>
          </label>
        </div>
      )}

      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div className="location-capture__saved">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or select saved address
          </label>
          <div className="grid grid-cols-1 gap-2">
            {savedAddresses.map((addr, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSavedAddress(addr)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">{addr.label}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {addr.locality && `${addr.locality}, `}{addr.lga}
                </div>
                <div className="text-xs text-gray-500 mt-1">{addr.address}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LGA Selection */}
      <div className="location-capture__field">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Local Government Area (LGA) *
        </label>
        <select
          value={selectedLGA}
          onChange={handleLGAChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        >
          <option value="">Select LGA</option>
          {LAGOS_LGAS.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
        </select>
      </div>

      {/* Locality Selection */}
      {selectedLGA && localities.length > 0 && (
        <div className="location-capture__field">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area/Locality
          </label>
          <select
            value={selectedLocality}
            onChange={handleLocalityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select locality (optional)</option>
            {localities.map((locality) => (
              <option key={locality} value={locality}>
                {locality}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Street Address */}
      <div className="location-capture__field">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 12 Allen Avenue"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>

      {/* Landmark */}
      <div className="location-capture__field">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Landmark (Optional)
        </label>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g., Near Shoprite, Opposite Police Station"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Actions */}
      <div className="location-capture__actions">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <Navigation size={16} />
          {isGettingLocation ? 'Getting location...' : 'Use my current location'}
        </button>

        {onSaveAddress && selectedLGA && address && (
          <button
            type="button"
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Save size={16} />
            Save this address
          </button>
        )}
      </div>

      {/* Error messages */}
      {(locationError || error) && (
        <div className="location-capture__error">
          {locationError || error}
        </div>
      )}

      {/* Save address dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Save Address</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label
              </label>
              <input
                type="text"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                placeholder="e.g., Home, Office, Workshop"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCapture;
