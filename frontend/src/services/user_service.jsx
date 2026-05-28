import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// GET semua users
export async function getAllUsers() {
  const res = await axios.get(`${API_BASE}/users/`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// GET user by ID
export async function getUserById(id) {
  const res = await axios.get(`${API_BASE}/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// CREATE user baru
export async function createUser(data) {
  const res = await axios.post(`${API_BASE}/users/`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// UPDATE user
export async function updateUser(id, data) {
  const res = await axios.put(`${API_BASE}/users/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// DELETE user
export async function deleteUser(id) {
  const res = await axios.delete(`${API_BASE}/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

// GET RFID terakhir
export async function getLatestRFID() {
  const res = await axios.get(`${API_BASE}/rfid/latest`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}
