import React from "react";
import {
  Home,
  ParkingSquare,
  History,
  BarChart3,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen, activeMenu, setActiveMenu }) {
  const menus = [
    { name: "Dashboard", icon: Home },
    { name: "Slots", icon: ParkingSquare },
    { name: "History", icon: History },
    { name: "Statistics", icon: BarChart3 },
    { name: "Webcam", icon: Camera },
  ];

  return (
    <div
      className={`h-screen bg-slate-900/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 
      ${isOpen ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:bg-white/10 p-2 rounded-lg"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 space-y-2">
        {menus.map((menu, i) => {
          const Icon = menu.icon;
          const active = activeMenu === menu.name;

          return (
            <button
              key={i}
              onClick={() => setActiveMenu(menu.name)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all
                ${active ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "text-slate-400 hover:bg-white/10"}`}
            >
              <Icon size={20} />
              {isOpen && <span>{menu.name}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}