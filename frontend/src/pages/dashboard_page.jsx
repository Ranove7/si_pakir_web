import React, { useState, useEffect } from 'react';
import { LogOut, Wifi, Activity, Zap } from 'lucide-react';
import ParkingSlotsWidget from './components/parking_slot';
import TableHistory from './components/table_history';

export default function DashboardPage({ onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [parkingSlots] = useState([
    { id: 1, status: 'kosong', vehicle: null, entryTime: null },
    { id: 2, status: 'terisi', vehicle: 'B 1234 XYZ', entryTime: '2025-10-23T08:30:00' },
    { id: 3, status: 'kosong', vehicle: null, entryTime: null },
    { id: 4, status: 'terisi', vehicle: 'B 5678 ABC', entryTime: '2025-10-23T09:15:00' },
    { id: 5, status: 'kosong', vehicle: null, entryTime: null },
    { id: 6, status: 'terisi', vehicle: 'B 9012 DEF', entryTime: '2025-10-23T10:00:00' }
  ]);

  const historyData = [
    { id: 1, slot: "A1", vehicle: "N 1234 AB", entryTime: "08:00", exitTime: "09:30", duration: "1j 30m", status: "Parkir" },
    { id: 2, slot: "B2", vehicle: "P 9876 XY", entryTime: "07:45", exitTime: "08:10", duration: "25m", status: "Selesai" },
    { id: 3, slot: "C3", vehicle: "E 4421 OP", entryTime: "09:10", exitTime: "10:00", duration: "50m", status: "Selesai" },
    { id: 4, slot: "A2", vehicle: "L 9911 QR", entryTime: "10:05", exitTime: "-", duration: "-", status: "Parkir" },
    { id: 5, slot: "B1", vehicle: "P 7777 ZZ", entryTime: "07:30", exitTime: "09:00", duration: "1j 30m", status: "Selesai" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/5 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 mb-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl shadow-xl">
                    <Activity className="text-white" size={32} />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-1">
                    Smart Parking System
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Zap size={14} className="text-yellow-400" />
                      <span>YOLO & ESP32-CAM</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                      <Wifi size={14} className="text-green-400 animate-pulse" />
                      <span className="text-green-300 text-xs font-semibold">Connected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Live Clock */}
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
                  <div className="text-center">
                    <p className="text-white font-mono text-2xl font-bold">
                      {currentTime.toLocaleTimeString('id-ID')}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-red-500/50 font-bold group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <LogOut size={20} className="relative group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Parking Slots Widget */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <ParkingSlotsWidget parkingSlots={parkingSlots} />
          </div>

          {/*TableHistory */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <TableHistory history={historyData} />
          </div>

          {/* Footer */}
          <div className="text-center backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-slate-400 text-sm">
                System Running • Last Update: {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </div>
            <p className="text-slate-500 text-xs">
              © 2025 Smart Parking System. Powered by AI Technology
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}