import axios from "axios";

// Pastikan URL ini sesuai dengan backend kamu
const API_URL = "/api/slots/";

export const getSlots = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.map(slot => ({
      id: slot.kode_parkir,       // misalnya A1, A2, ...
      status: slot.status,        // "kosong" atau "terisi"
      entryTime: slot.timestamp   // waktu terakhir diperbarui
    }));
  } catch (error) {
    console.error("Error fetching slots:", error);
    return [];
  }
};
