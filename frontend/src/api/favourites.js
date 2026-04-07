import { API_URL } from './config';

const FAVOURITES_URL = `${API_URL}/favourites`;

// Add to favourites
export const saveToFavourites = async (artisanId, token) => {
  const response = await fetch(`${FAVOURITES_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ artisanId })
  });
  return response.json();
};
