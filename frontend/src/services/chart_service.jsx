import axios from "axios";

const API_URL = "http://103.157.27.239:8000/chart";

// Ambil statistik mingguan (7 hari terakhir)
export const getWeeklyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/weekly`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    return [];
  }
};

// Ambil statistik bulanan (4 minggu terakhir)
export const getMonthlyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/monthly`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return [];
  }
};

// Ambil statistik harian (hari ini)
export const getDailyStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/daily`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    return { day: "Hari Ini", masuk: 0, keluar: 0, total: 0 };
  }
};