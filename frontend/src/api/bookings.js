const API_URL = "http://localhost:5000/api/bookings";

// Book a service
export const bookService = async (serviceId, token) => {
  const response = await fetch(`${API_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ serviceId, date: new Date().toISOString() })
  });
  return response.json();
};
