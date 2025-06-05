import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// List of 26 job categories
const JOB_CATEGORIES = [
  { id: 1, name: 'Woodworking', description: 'Furniture making, carving, and wood-based crafts' },
  { id: 2, name: 'Pottery & Ceramics', description: 'Creating items from clay and ceramic materials' },
  { id: 3, name: 'Leathercraft', description: 'Working with leather to create bags, shoes, and accessories' },
  { id: 4, name: 'Textile Art', description: 'Fabric design, weaving, dyeing, and related crafts' },
  { id: 5, name: 'Jewelry Making', description: 'Creating accessories from metals, beads, and gemstones' },
  { id: 6, name: 'Metalwork', description: 'Forging, welding, and crafting items from metal' },
  { id: 7, name: 'Glass Art', description: 'Working with glass, including blowing, fusing, and stained glass' },
  { id: 8, name: 'Traditional Clothing', description: 'Creating traditional Nigerian attire and cultural wear' },
  { id: 9, name: 'Painting & Drawing', description: 'Fine arts including traditional and contemporary styles' },
  { id: 10, name: 'Sculpture', description: 'Creating three-dimensional art from various materials' },
  { id: 11, name: 'Basket Weaving', description: 'Creating baskets and related items from plant fibers' },
  { id: 12, name: 'Beadwork', description: 'Crafting with beads, including traditional and modern designs' },
  { id: 13, name: 'Paper Crafts', description: 'Creating items from paper, including cards and decorations' },
  { id: 14, name: 'Soap & Candle Making', description: 'Crafting handmade soaps, candles, and related products' },
  { id: 15, name: 'Calabash Carving', description: 'Creating decorated items from dried calabash gourds' },
  { id: 16, name: 'Musical Instruments', description: 'Making and repairing traditional and modern instruments' },
  { id: 17, name: 'Hair Braiding & Styling', description: 'Traditional and modern hair styling techniques' },
  { id: 18, name: 'Furniture Restoration', description: 'Repairing and restoring furniture items' },
  { id: 19, name: 'Shoemaking', description: 'Creating handcrafted footwear and repairs' },
  { id: 20, name: 'Sign Writing', description: 'Creating hand-painted signs and lettering' },
  { id: 21, name: 'Tie & Dye', description: 'Creating patterns on fabric using traditional dyeing techniques' },
  { id: 22, name: 'Adire Textile', description: 'Traditional Yoruba textile dyeing technique' },
  { id: 23, name: 'Food Preservation', description: 'Traditional methods of preserving food items' },
  { id: 24, name: 'Batik', description: 'Creating designs on fabric using wax and dye' },
  { id: 25, name: 'Embroidery', description: 'Decorative needlework on fabric' },
  { id: 26, name: 'Photography', description: 'Professional photography services' }
];

const JobSelection = ({ onJobSelect, selectedJobs = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  const filteredCategories = searchTerm 
    ? JOB_CATEGORIES.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : JOB_CATEGORIES;
    
  const toggleCategory = (id) => {
    if (expandedCategory === id) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(id);
    }
  };
  
  const handleJobSelect = (job) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };
  
  const isJobSelected = (jobId) => {
    return selectedJobs.some(job => job.id === jobId);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Select Your Services</h2>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search job categories..."
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
      
      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div 
            key={category.id} 
            className={`border rounded-lg overflow-hidden transition duration-200 ${
              isJobSelected(category.id) 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div 
              className={`p-4 cursor-pointer flex justify-between items-center ${
                expandedCategory === category.id ? 'bg-gray-50' : ''
              }`}
              onClick={() => toggleCategory(category.id)}
            >
              <h3 className="font-semibold">{category.name}</h3>
              <svg 
                className={`h-5 w-5 text-gray-500 transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedCategory === category.id && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                <button
                  onClick={() => handleJobSelect(category)}
                  className={`w-full py-2 px-4 rounded text-sm ${
                    isJobSelected(category.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {isJobSelected(category.id) ? 'Selected' : 'Select This Category'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No job categories match your search. Try a different term.</p>
        </div>
      )}
    </div>
  );
};

export default JobSelection;