import React, { useState, useEffect } from "react";
import {
  Wifi,
  Activity,
  X,
} from "lucide-react";

import Sidebar from "./components/sidebar";
import ParkingSlotsWidget from "./components/parking_slot";
import TableHistory from "./components/table_history";
import StatisticsWidget from "./components/chart";
import WebcamViewer from "./components/webcam_viewer";
import SettingsPage from "./components/settings";
import UserManagement from "./components/user_management"; // ✅ import baru

import { getSlots } from "../services/slot_service";
import { getHistory } from "../services/history_service";
import { logoutUser, getCurrentUser } from "../services/auth_service";

export default function DashboardPage({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const getDefaultMenu = (role) => {
    if (role === "admin") return "Dashboard";
    if (role === "petugas") return "Dashboard";
    if (role === "user") return "Slots";
    return "Dashboard";
  };

  const [activeMenu, setActiveMenu] = useState(() => {
    const saved = localStorage.getItem("activeMenu");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (saved) return saved;
    return getDefaultMenu(user.role);
  });

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
  }, [activeMenu]);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user" && activeMenu === "Dashboard") {
      setActiveMenu("Slots");
    }
  }, [user, activeMenu]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [parkingSlots, setParkingSlots] = useState([]);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await getSlots();
        setParkingSlots(data);
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };
    fetchSlots();
    const interval = setInterval(fetchSlots, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("activeMenu");
    if (onLogout) onLogout();
  };

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
      case "Settings":
        return <SettingsPage />;

      // ✅ Tambahan baru
      case "Users":
        return <UserManagement />;

      default:
        return <div className="text-white">Menu tidak ditemukan</div>;
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading user...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={() => setShowLogoutModal(true)}
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Activity className="text-purple-400" size={30} />
            <h1 className="text-2xl font-bold text-white">{activeMenu}</h1>
            <div
              className={`px-3 py-1 rounded-lg border flex items-center gap-2 ${
                isConnected
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >
              <Wifi
                size={14}
                className={isConnected ? "text-green-400" : "text-red-400"}
              />
              <span className="text-xs text-white">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white font-semibold text-lg">👋 {user?.nama}</p>
            <p className="text-purple-300 text-xs uppercase">{user?.role}</p>
            <p className="text-white font-mono text-lg mt-1">
              {currentTime.toLocaleTimeString("id-ID")}
            </p>
            <p className="text-slate-400 text-xs">
              {currentTime.toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        <div className="space-y-6">{renderContent()}</div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Konfirmasi Logout</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-300 mb-6">Apakah Anda yakin ingin logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-lg bg-slate-700 text-white"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white"
              >
                Ya Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}