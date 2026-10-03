const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Có lỗi xảy ra");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  updateProfile: (body) => request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),

  // Hotels
  getHotels: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/hotels${q ? `?${q}` : ""}`);
  },
  getHotel: (id) => request(`/hotels/${id}`),
  createHotel: (body) => request("/hotels", { method: "POST", body: JSON.stringify(body) }),
  updateHotel: (id, body) => request(`/hotels/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteHotel: (id) => request(`/hotels/${id}`, { method: "DELETE" }),

  // Rooms
  searchRooms: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/rooms/search${q ? `?${q}` : ""}`);
  },
  getRoomType: (id) => request(`/rooms/types/${id}`),
  createRoomType: (body) => request("/rooms/types", { method: "POST", body: JSON.stringify(body) }),
  updateRoomType: (id, body) => request(`/rooms/types/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteRoomType: (id) => request(`/rooms/types/${id}`, { method: "DELETE" }),
  getRooms: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/rooms${q ? `?${q}` : ""}`);
  },
  createRoom: (body) => request("/rooms", { method: "POST", body: JSON.stringify(body) }),
  updateRoomStatus: (id, status) =>
    request(`/rooms/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  // Bookings
  createBooking: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  getMyBookings: () => request("/bookings/my"),
  getAllBookings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/bookings${q ? `?${q}` : ""}`);
  },
  getBooking: (id) => request(`/bookings/${id}`),
  updateBookingStatus: (id, status) =>
    request(`/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),

  // Payments
  pay: (bookingId, method) =>
    request(`/payments/${bookingId}/pay`, { method: "POST", body: JSON.stringify({ method }) }),
  payDeposit: (bookingId, method) =>
    request(`/payments/${bookingId}/pay-deposit`, { method: "POST", body: JSON.stringify({ method }) }),
  payRemaining: (bookingId, method) =>
    request(`/payments/${bookingId}/pay-remaining`, { method: "POST", body: JSON.stringify({ method }) }),
  getPayment: (bookingId) => request(`/payments/booking/${bookingId}`),
  getAllPayments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/payments${q ? `?${q}` : ""}`);
  },
  refund: (id) => request(`/payments/${id}/refund`, { method: "PUT" }),

  // Users
  getUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/users${q ? `?${q}` : ""}`);
  },
  createUser: (body) => request("/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id, body) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
};

export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0) + " VND";
