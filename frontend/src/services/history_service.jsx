import axios from "axios";

// URL backend untuk history parkir
const API_URL = "http://103.157.27.239:8000/history/";

export const getHistory = async () => {
  try {
    const response = await axios.get(API_URL);
    // mapping data supaya lebih mudah dipakai di frontend
    return response.data.map(item => ({
      id: item.id,
      slot: item.kode_parkir,
      activity: item.aktivitas,         // 'parkir_masuk' atau 'parkir_keluar'
      timestamp: item.timestamp         // waktu aktivitas
    }));
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};
