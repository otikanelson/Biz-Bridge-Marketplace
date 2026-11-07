// Shared location data for Lagos State
// This should match backend/src/utils/locationData.js

export const LAGOS_LGAS = [
  'Agege',
  'Ajeromi-Ifelodun',
  'Alimosho',
  'Amuwo-Odofin',
  'Apapa',
  'Badagry',
  'Epe',
  'Eti-Osa',
  'Ibeju-Lekki',
  'Ifako-Ijaiye',
  'Ikeja',
  'Ikorodu',
  'Kosofe',
  'Lagos Island',
  'Lagos Mainland',
  'Mushin',
  'Ojo',
  'Oshodi-Isolo',
  'Shomolu',
  'Surulere'
];

export const LGA_LOCALITIES = {
  'Agege': ['Agege', 'Dopemu', 'Mangoro', 'Oke-Koto', 'Orile Agege'],
  'Ajeromi-Ifelodun': ['Ajegunle', 'Alakara', 'Layeni', 'Temidire', 'Tolu'],
  'Alimosho': ['Abule Egba', 'Akowonjo', 'Egbeda', 'Idimu', 'Ikotun', 'Ipaja', 'Isheri Olofin'],
  'Amuwo-Odofin': ['Amuwo Odofin', 'Festac Town', 'Kirikiri', 'Mile 2', 'Satellite Town'],
  'Apapa': ['Apapa', 'Ajegunle', 'Ijora', 'Suru Alaba'],
  'Badagry': ['Badagry', 'Ajara', 'Apa', 'Iya Afin', 'Topo'],
  'Epe': ['Epe', 'Ejirin', 'Etita', 'Ibonwon', 'Poka'],
  'Eti-Osa': ['Ajah', 'Ikoyi', 'Lekki Phase 1', 'Lekki Phase 2', 'Oniru', 'Victoria Island', 'VGC'],
  'Ibeju-Lekki': ['Akodo', 'Elerangbe', 'Ibeju', 'Lakowe', 'Orimedu'],
  'Ifako-Ijaiye': ['Abule Egba', 'Agbado', 'Fagba', 'Ifako', 'Iju', 'Ojokoro'],
  'Ikeja': ['Agidingbi', 'Alausa', 'Allen Avenue', 'GRA Ikeja', 'Ojodu', 'Omole', 'Oregun'],
  'Ikorodu': ['Ikorodu', 'Agbowa', 'Ijede', 'Imota', 'Isiu'],
  'Kosofe': ['Ikosi', 'Ketu', 'Mile 12', 'Ojota', 'Oworonshoki'],
  'Lagos Island': ['CMS', 'Ebute Metta', 'Idumota', 'Lagos Island', 'Marina', 'Onikan'],
  'Lagos Mainland': ['Ebute Metta', 'Oyingbo', 'Sabo', 'Yaba'],
  'Mushin': ['Ilupeju', 'Mushin', 'Odi Olowo', 'Oshodi'],
  'Ojo': ['Ajangbadi', 'Alaba', 'Ilogbo', 'Ojo', 'Okokomaiko', 'Shibiri'],
  'Oshodi-Isolo': ['Ejigbo', 'Ilasamaja', 'Isolo', 'Mafoluku', 'Okota', 'Oshodi'],
  'Shomolu': ['Bariga', 'Gbagada', 'Onipanu', 'Palmgrove', 'Shomolu'],
  'Surulere': ['Aguda', 'Ijeshatedo', 'Itire', 'Lawanson', 'Shitta', 'Surulere']
};

// Helper to get localities for an LGA
export const getLocalitiesForLGA = (lga) => {
  return LGA_LOCALITIES[lga] || [];
};

// Helper to validate LGA
export const isValidLGA = (lga) => {
  return LAGOS_LGAS.includes(lga);
};

// Helper to validate locality for a given LGA
export const isValidLocality = (lga, locality) => {
  const localities = getLocalitiesForLGA(lga);
  return localities.includes(locality);
};
