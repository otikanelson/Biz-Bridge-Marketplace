// Shared location data - Lagos LGAs and their localities
// This is the single source of truth for both backend and frontend

export const LAGOS_LGAS = [
  {
    id: 1,
    name: 'Agege',
    localities: ['Agege Motor Road', 'Dopemu', 'Oke-Koto', 'Orile Agege', 'Tabon Tabon']
  },
  {
    id: 2,
    name: 'Ajeromi-Ifelodun',
    localities: ['Ajegunle', 'Alaba', 'Boundary', 'Ifelodun', 'Kirikiri', 'Layeni', 'Olodi', 'Sari Iganmu', 'Temidire']
  },
  {
    id: 3,
    name: 'Alimosho',
    localities: ['Abesan', 'Abule Egba', 'Ayobo', 'Egbeda', 'Egbe', 'Idimu', 'Ikotun', 'Ipaja', 'Isheri Olofin', 'Pleasure']
  },
  {
    id: 4,
    name: 'Amuwo-Odofin',
    localities: ['Abule Ado', 'Amuwo Odofin', 'Festac Town', 'Kirikiri Town', 'Mile 2', 'Trade Fair']
  },
  {
    id: 5,
    name: 'Apapa',
    localities: ['Ajegunle', 'Apapa', 'Apapa Wharf', 'Boundary', 'Iganmu', 'Liverpool', 'Marine Beach', 'Suru Alaba']
  },
  {
    id: 6,
    name: 'Badagry',
    localities: ['Aradagun', 'Badagry Town', 'Ibereko', 'Ikoga', 'Mowo', 'Seme Border', 'Topo']
  },
  {
    id: 7,
    name: 'Epe',
    localities: ['Agbowa', 'Epe Town', 'Ibonwon', 'Ikosi', 'Odoragunsen', 'Poka']
  },
  {
    id: 8,
    name: 'Eti-Osa',
    localities: ['Ajah', 'Ikate', 'Ikoyi', 'Lekki', 'Maroko', 'Oniru', 'Victoria Island', 'VGC']
  },
  {
    id: 9,
    name: 'Ibeju-Lekki',
    localities: ['Abijo', 'Awoyaya', 'Bogije', 'Eleko', 'Ibeju', 'Lakowe', 'Shapati']
  },
  {
    id: 10,
    name: 'Ifako-Ijaiye',
    localities: ['Agbado', 'Fagba', 'Ifako', 'Ijaiye', 'Ile Epo', 'Iju', 'Ojokoro', 'Sango']
  },
  {
    id: 11,
    name: 'Ikeja',
    localities: ['Alausa', 'Allen', 'Computer Village', 'Ikeja GRA', 'Maryland', 'Obafemi Awolowo Way', 'Opebi', 'Oregun']
  },
  {
    id: 12,
    name: 'Ikorodu',
    localities: ['Agura', 'Ebute', 'Erikorodo', 'Gberigbe', 'Igbogbo', 'Ikorodu Town', 'Imota', 'Isiu', 'Liadi']
  },
  {
    id: 13,
    name: 'Kosofe',
    localities: ['Agboyi', 'Ikosi Ketu', 'Ketu', 'Ojota', 'Ogudu', 'Oworonsoki', 'Mile 12']
  },
  {
    id: 14,
    name: 'Lagos Island',
    localities: ['Adeniji Adele', 'Epetedo', 'Idumota', 'Isale Eko', 'Lagos Island', 'Marina', 'Nnamdi Azikiwe', 'Sandgrouse', 'Tinubu']
  },
  {
    id: 15,
    name: 'Lagos Mainland',
    localities: ['Ebute Metta', 'Iddo', 'Jibowu', 'Obanikoro', 'Onipanu', 'Oyingbo', 'Sabo', 'Yaba']
  },
  {
    id: 16,
    name: 'Mushin',
    localities: ['Alakara', 'Ilasamaja', 'Isolo', 'Ladipo', 'Mushin', 'Odi Olowo', 'Ojuwoye', 'Papa Ajao']
  },
  {
    id: 17,
    name: 'Ojo',
    localities: ['Ajangbadi', 'Alaba Oro', 'Etegbin', 'Irewe', 'Ojo Town', 'Okokomaiko', 'Satellite Town', 'Tafi']
  },
  {
    id: 18,
    name: 'Oshodi-Isolo',
    localities: ['Ajao Estate', 'Bolade', 'Isolo', 'Mafoluku', 'Oke Afa', 'Oshodi', 'Shogunle']
  },
  {
    id: 19,
    name: 'Shomolu',
    localities: ['Bajulaiye', 'Bariga', 'Ilaje', 'Onipanu', 'Pedro', 'Shomolu']
  },
  {
    id: 20,
    name: 'Surulere',
    localities: ['Adeniran Ogunsanya', 'Aguda', 'Bode Thomas', 'Ijeshatedo', 'Iponri', 'Itire', 'Lawanson', 'Ojuelegba', 'Shitta']
  }
];

// Get LGA names only
export const getLGANames = () => LAGOS_LGAS.map(lga => lga.name);

// Get localities for a specific LGA
export const getLocalitiesForLGA = (lgaName) => {
  const lga = LAGOS_LGAS.find(l => l.name === lgaName);
  return lga ? lga.localities : [];
};

// Validate LGA
export const isValidLGA = (lgaName) => {
  return LAGOS_LGAS.some(lga => lga.name === lgaName);
};

// Validate locality for a given LGA
export const isValidLocality = (lgaName, localityName) => {
  const lga = LAGOS_LGAS.find(l => l.name === lgaName);
  if (!lga) return false;
  return lga.localities.includes(localityName);
};

// Coordinate validation ranges for Lagos
export const LAGOS_BOUNDS = {
  latitude: { min: 6.3876, max: 6.7027 },
  longitude: { min: 3.0982, max: 3.6469 }
};

export const isValidCoordinates = (lat, lng) => {
  return (
    lat >= LAGOS_BOUNDS.latitude.min &&
    lat <= LAGOS_BOUNDS.latitude.max &&
    lng >= LAGOS_BOUNDS.longitude.min &&
    lng <= LAGOS_BOUNDS.longitude.max
  );
};
