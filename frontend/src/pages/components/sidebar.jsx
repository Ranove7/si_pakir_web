import React from "react";
import {
  Home,
  ParkingSquare,
  History,
  BarChart3,
  Camera,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  setIsOpen,
  activeMenu,
  setActiveMenu,
  onLogout,
}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.role) {
    return (
      <div className="h-screen w-64 bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const menus = [
  // ❌ Dashboard hanya untuk admin & petugas
  ...(user.role !== "user"
    ? [{ name: "Dashboard", icon: Home }]
    : []),

  ...(user.role === "admin"
    ? [
        { name: "Slots", icon: ParkingSquare },
        { name: "History", icon: History },
        { name: "Statistics", icon: BarChart3 },
        { name: "Settings", icon: Settings },
      ]
    : []),

  ...(user.role === "petugas"
    ? [
        { name: "Slots", icon: ParkingSquare },
        { name: "History", icon: History },
      ]
    : []),

  ...(user.role === "user"
    ? [
        { name: "Slots", icon: ParkingSquare },
        { name: "Settings", icon: Settings },
      ]
    : []),
];
  return (
    <div
      className={`h-screen bg-slate-900/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* TOGGLE */}
      <div
        className={`p-3 flex ${isOpen ? "justify-end" : "justify-center"
          }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
        >
          {isOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 px-2 space-y-2">
        {menus.map((menu, i) => {
          const Icon = menu.icon;
          const active = activeMenu === menu.name;

          return (
            <button
              key={i}
              onClick={() => setActiveMenu(menu.name)}
              className={`w-full p-3 rounded-xl transition-all flex items-center
              ${isOpen
                  ? "justify-start gap-3"
                  : "justify-center"
                }
              ${active
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                  : "text-slate-400 hover:bg-white/10"
                }`}
            >
              <Icon size={20} />
              {isOpen && <span>{menu.name}</span>}
            </button>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className={`w-full p-3 rounded-xl transition-all flex items-center text-red-400 hover:bg-red-500/10
          ${isOpen
              ? "justify-start gap-3"
              : "justify-center"
            }`}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}