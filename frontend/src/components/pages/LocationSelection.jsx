import React, { useState } from 'react';

// List of all 20 Local Government Areas in Lagos State
const LAGOS_LGAS = [
  { id: 1, name: 'Agege', region: 'Mainland' },
  { id: 2, name: 'Ajeromi-Ifelodun', region: 'Mainland' },
  { id: 3, name: 'Alimosho', region: 'Mainland' },
  { id: 4, name: 'Amuwo-Odofin', region: 'Mainland' },
  { id: 5, name: 'Apapa', region: 'Mainland' },
  { id: 6, name: 'Badagry', region: 'Mainland' },
  { id: 7, name: 'Epe', region: 'Mainland' },
  { id: 8, name: 'Eti-Osa', region: 'Island' },
  { id: 9, name: 'Ibeju-Lekki', region: 'Island' },
  { id: 10, name: 'Ifako-Ijaiye', region: 'Mainland' },
  { id: 11, name: 'Ikeja', region: 'Mainland' },
  { id: 12, name: 'Ikorodu', region: 'Mainland' },
  { id: 13, name: 'Kosofe', region: 'Mainland' },
  { id: 14, name: 'Lagos Island', region: 'Island' },
  { id: 15, name: 'Lagos Mainland', region: 'Mainland' },
  { id: 16, name: 'Mushin', region: 'Mainland' },
  { id: 17, name: 'Ojo', region: 'Mainland' },
  { id: 18, name: 'Oshodi-Isolo', region: 'Mainland' },
  { id: 19, name: 'Shomolu', region: 'Mainland' },
  { id: 20, name: 'Surulere', region: 'Mainland' }
];

// Localities within each LGA
const LAGOS_LOCALITIES = {
  'Agege': ['Agege', 'Ogba', 'Ifako', 'Oko-Oba', 'Orile Agege'],
  'Ajeromi-Ifelodun': ['Ajegunle', 'Layeni', 'Amukoko', 'Alakara', 'Alaba-Oro'],
  'Alimosho': ['Ikotun', 'Egbeda', 'Idimu', 'Ipaja', 'Ayobo', 'Gowon Estate', 'Akowonjo'],
  'Amuwo-Odofin': ['Festac Town', 'Satellite Town', 'Maza-Maza', 'Mile 2', 'Kirikiri'],
  'Apapa': ['Apapa', 'Ajegunle', 'Ijora', 'Tincan Island', 'Wharf'],
  'Badagry': ['Badagry', 'Ajara', 'Topo', 'Aradagun', 'Ibereko'],
  'Epe': ['Epe', 'Ejirin', 'Ketu', 'Itoikin', 'Agbowa'],
  'Eti-Osa': ['Victoria Island', 'Lekki', 'Ikoyi', 'Ajah', 'Ikate', 'Osapa', 'Chevron'],
  'Ibeju-Lekki': ['Ibeju', 'Awoyaya', 'Akodo', 'Lakowe', 'Abijo'],
  'Ifako-Ijaiye': ['Ifako', 'Ijaiye', 'Ojokoro', 'Agbado', 'Iju'],
  'Ikeja': ['Ikeja GRA', 'Oregun', 'Maryland', 'Opebi', 'Allen Avenue', 'Alausa', 'Magodo'],
  'Ikorodu': ['Ikorodu', 'Ijede', 'Igbogbo', 'Imota', 'Bayeku', 'Gberigbe'],
  'Kosofe': ['Ogudu', 'Ojota', 'Ketu', 'Mile 12', 'Isheri', 'Magodo', 'Alapere'],
  'Lagos Island': ['Lagos Island', 'Isale Eko', 'Idumota', 'Marina', 'Onikan', 'Obalende'],
  'Lagos Mainland': ['Yaba', 'Ebute-Metta', 'Surulere', 'Alagomeji', 'Makoko'],
  'Mushin': ['Mushin', 'Idi-Oro', 'Odi-Olowo', 'Ladipo', 'Papa Ajao'],
  'Ojo': ['Ojo', 'Okokomaiko', 'Igbo-Elerin', 'Alaba International', 'Trade Fair'],
  'Oshodi-Isolo': ['Oshodi', 'Isolo', 'Mafoluku', 'Shogunle', 'Ejigbo', 'Airport Road'],
  'Shomolu': ['Shomolu', 'Bariga', 'Pedro', 'Gbagada', 'Obanikoro'],
  'Surulere': ['Surulere', 'Aguda', 'Ijesha', 'Itire', 'Ikate', 'Lawanson', 'Ojuelegba']
};

const LocationSelection = ({ onLocationSelect, selectedLocations = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('lga'); // 'lga' or 'locality'
  const [selectedLGA, setSelectedLGA] = useState(null);
  
  const handleLGASelect = (lga) => {
    if (viewMode === 'lga') {
      if (onLocationSelect) {
        onLocationSelect({
          id: lga.id,
          name: lga.name,
          type: 'lga',
          region: lga.region
        });
      }
    } else {
      setSelectedLGA(lga);
    }
  };
  
  const handleLocalitySelect = (lgaName, locality) => {
    if (onLocationSelect) {
      const lga = LAGOS_LGAS.find(l => l.name === lgaName);
      onLocationSelect({
        id: `${lga.id}-${LAGOS_LOCALITIES[lgaName].indexOf(locality)}`,
        name: locality,
        lga: lgaName,
        type: 'locality',
        region: lga.region
      });
    }
  };
  
  // Filter LGAs based on search term
  const filteredLGAs = searchTerm 
    ? LAGOS_LGAS.filter(lga => 
        lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lga.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : LAGOS_LGAS;
    
  // Filter localities if an LGA is selected and in locality view mode
  const filteredLocalities = selectedLGA && viewMode === 'locality'
    ? LAGOS_LOCALITIES[selectedLGA.name].filter(loc => 
        loc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const isLocationSelected = (location) => {
    if (viewMode === 'lga') {
      return selectedLocations.some(loc => loc.name === location.name && loc.type === 'lga');
    } else {
      return selectedLocations.some(loc => loc.name === location && loc.type === 'locality');
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Select Your Location</h2>
      
      {/* View mode toggle */}
      <div className="flex border border-gray-200 rounded-lg mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setViewMode('lga')}
          className={`flex-1 py-2 px-4 text-center ${
            viewMode === 'lga' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Local Government Areas
        </button>
        <button
          type="button"
          onClick={() => setViewMode('locality')}
          className={`flex-1 py-2 px-4 text-center ${
            viewMode === 'locality' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Specific Localities
        </button>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={viewMode === 'lga' ? "Search LGAs..." : "Search localities..."}
            className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {viewMode === 'locality' && !selectedLGA && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please select a Local Government Area first to view its localities.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Display LGAs */}
      {viewMode === 'lga' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLGAs.map((lga) => (
            <div 
              key={lga.id} 
              onClick={() => handleLGASelect(lga)}
              className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                isLocationSelected(lga) 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
              }`}
            >
              <h3 className="font-semibold">{lga.name}</h3>
              <p className="text-sm text-gray-600">{lga.region}</p>
              
              {isLocationSelected(lga) && (
                <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Selected
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Display LGAs in locality view mode */}
      {viewMode === 'locality' && !selectedLGA && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLGAs.map((lga) => (
            <div 
              key={lga.id} 
              onClick={() => setSelectedLGA(lga)}
              className="p-4 border rounded-lg cursor-pointer hover:border-red-300 hover:bg-gray-50 transition duration-200"
            >
              <h3 className="font-semibold">{lga.name}</h3>
              <p className="text-sm text-gray-600">{lga.region}</p>
              <div className="mt-2 text-xs text-gray-500">
                {LAGOS_LOCALITIES[lga.name].length} localities
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Display localities for selected LGA */}
      {viewMode === 'locality' && selectedLGA && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{selectedLGA.name} Localities</h3>
            <button 
              type="button"
              onClick={() => setSelectedLGA(null)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Back to LGAs
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocalities.map((locality, index) => (
              <div 
                key={index} 
                onClick={() => handleLocalitySelect(selectedLGA.name, locality)}
                className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                  isLocationSelected(locality) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-semibold">{locality}</h3>
                <p className="text-sm text-gray-600">{selectedLGA.name} LGA</p>
                
                {isLocationSelected(locality) && (
                  <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {(viewMode === 'lga' && filteredLGAs.length === 0) || 
       (viewMode === 'locality' && selectedLGA && filteredLocalities.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No locations match your search. Try a different term.</p>
        </div>
      ) : null}
    </div>
  );
};

export default LocationSelection;