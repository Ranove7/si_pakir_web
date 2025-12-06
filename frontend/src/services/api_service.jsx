// API Configuration untuk Smart Parking System

const API_BASE_URL = "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Slots
  SLOTS: `${API_BASE_URL}/slots`,
  
  // History
  HISTORY: `${API_BASE_URL}/history`,
  
  // Camera
  CAMERA_FEED: `${API_BASE_URL}/camera/feed`,
  CAMERA_STATUS: `${API_BASE_URL}/camera/status`,
  
  // Chart/Statistics
  CHART: `${API_BASE_URL}/chart`,
  
  // ESP Routes
  ESP: `${API_BASE_URL}/esp`,
};

// Fetch helper dengan error handling
export async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Camera API
export const CameraAPI = {
  getStatus: () => fetchAPI(API_ENDPOINTS.CAMERA_STATUS),
  getFeedUrl: () => API_ENDPOINTS.CAMERA_FEED,
};

// Slots API
export const SlotsAPI = {
  getAll: () => fetchAPI(API_ENDPOINTS.SLOTS),
};

// History API
export const HistoryAPI = {
  getAll: () => fetchAPI(API_ENDPOINTS.HISTORY),
};

// Chart API
export const ChartAPI = {
  getData: () => fetchAPI(API_ENDPOINTS.CHART),
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  CameraAPI,
  SlotsAPI,
  HistoryAPI,
  ChartAPI,
};