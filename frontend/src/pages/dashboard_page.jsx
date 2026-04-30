import React, { useState, useEffect } from "react";
import { LogOut, Wifi, Activity } from "lucide-react";

import Sidebar from "./components/sidebar";
import ParkingSlotsWidget from "./components/parking_slot";
import TableHistory from "./components/table_history";
import StatisticsWidget from "./components/chart";
import WebcamViewer from "./components/webcam_viewer";

import { getSlots } from "../services/slot_service";
import { getHistory } from "../services/history_service";

export default function DashboardPage({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [currentTime, setCurrentTime] = useState(new Date());
  const [parkingSlots, setParkingSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await getSlots();
        setParkingSlots(slots);
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 2000);
    return () => clearInterval(interval);
  }, []);

  // History
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistoryData();
    const interval = setInterval(fetchHistoryData, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 RENDER CONTENT BERDASARKAN MENU
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <>
            <WebcamViewer />
            <ParkingSlotsWidget parkingSlots={parkingSlots} />
          </>
        );

      case "Slots":
        return <ParkingSlotsWidget parkingSlots={parkingSlots} />;

      case "History":
        return <TableHistory history={history} />;

      case "Statistics":
        return <StatisticsWidget />;

      case "Webcam":
        return <WebcamViewer />;

      default:
        return <div className="text-white">Menu tidak ditemukan</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">

      {/* ✅ SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Activity className="text-purple-400" size={30} />
            <h1 className="text-2xl text-white font-bold">{activeMenu}</h1>

            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border
              ${isConnected ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}
            >
              <Wifi size={14} className={isConnected ? "text-green-400" : "text-red-400"} />
              <span className="text-xs">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="text-white text-right">
              <p className="font-mono text-lg">
                {currentTime.toLocaleTimeString("id-ID")}
              </p>
              <p className="text-xs text-slate-400">
                {currentTime.toLocaleDateString("id-ID")}
              </p>
            </div>

            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <LogOut />
            </button>
          </div>
        </div>

        {/* 🔥 CONTENT */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}