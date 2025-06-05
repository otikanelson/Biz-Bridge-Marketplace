// src/utils/locationData.js
// Centralized file for job categories and location data

// Comprehensive list of job categories
export const JOB_CATEGORIES = [
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

// List of all 20 Local Government Areas in Lagos State
export const LAGOS_LGAS = [
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
export const LAGOS_LOCALITIES = {
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

// Helper function to get a job by name
export const getJobByName = (name) => {
  return JOB_CATEGORIES.find(job => job.name === name);
};

// Helper function to get a job by ID
export const getJobById = (id) => {
  return JOB_CATEGORIES.find(job => job.id === id);
};

// Helper function to get all localities as a flat list
export const getAllLocalities = () => {
  const localities = [];
  
  Object.entries(LAGOS_LOCALITIES).forEach(([lgaName, lgaLocalities]) => {
    lgaLocalities.forEach(locality => {
      localities.push({
        id: `${lgaName}-${locality}`,
        name: locality,
        lga: lgaName,
        type: 'locality',
        region: LAGOS_LGAS.find(lga => lga.name === lgaName)?.region || 'Lagos'
      });
    });
  });
  
  return localities;
};

// Helper function to get all locations (LGAs + localities) as a flat list
export const getAllLocations = () => {
  return [...LAGOS_LGAS, ...getAllLocalities()];
};

// Helper function to get localities by LGA name
export const getLocalitiesByLGA = (lgaName) => {
  if (LAGOS_LOCALITIES[lgaName]) {
    return LAGOS_LOCALITIES[lgaName].map(locality => ({
      id: `${lgaName}-${locality}`,
      name: locality,
      lga: lgaName,
      type: 'locality',
      region: LAGOS_LGAS.find(lga => lga.name === lgaName)?.region || 'Lagos'
    }));
  }
  return [];
};

// Helper function to find location by name (works for both LGAs and localities)
export const findLocationByName = (name) => {
  // First check if it's an LGA
  const lga = LAGOS_LGAS.find(lga => lga.name === name);
  if (lga) return { ...lga, type: 'lga' };
  
  // If not, check localities
  const allLocalities = getAllLocalities();
  return allLocalities.find(locality => locality.name === name);
};