const API_URL = "http://localhost:5000/api/favourites";

// Add to favourites
export const saveToFavourites = async (artisanId, token) => {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ artisanId })
  });
  return response.json();
};
