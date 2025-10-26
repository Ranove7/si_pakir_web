import React from 'react';
import { Car, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ParkingSlotsWidget({ parkingSlots = [] }) {
  const getSlotGradient = (status) => {
    return status === 'terisi' 
      ? 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400/50' 
      : 'from-green-500/20 to-emerald-600/20 border-green-500/30 hover:border-green-400/50';
  };

  const getSlotGlow = (status) => {
    return status === 'terisi' ? 'shadow-red-500/20' : 'shadow-green-500/20';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}j ${minutes}m`;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Status Slot Parkir
          </h2>
          <p className="text-slate-400 text-sm">Real-time monitoring system</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-semibold">Kosong</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-300 text-sm font-semibold">Terisi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {parkingSlots.map((slot) => (
          <div
            key={slot.id}
            className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${getSlotGradient(slot.status)} rounded-2xl p-6 border transition-all duration-500 hover:scale-110 hover:shadow-2xl ${getSlotGlow(slot.status)} cursor-pointer transform hover:-translate-y-2`}
          >
            {/* Glow Effect */}
            <div className={`absolute inset-0 ${slot.status === 'terisi' ? 'bg-red-500/5' : 'bg-green-500/5'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              {slot.status === 'terisi' ? (
                <XCircle className="text-red-400" size={20} />
              ) : (
                <CheckCircle className="text-green-400" size={20} />
              )}
            </div>

            <div className="relative flex flex-col items-center">
              {/* Car Icon with Glow */}
              <div className="relative mb-4">
                <div className={`absolute inset-0 ${slot.status === 'terisi' ? 'bg-red-500' : 'bg-green-500'} rounded-full blur-xl opacity-50`}></div>
                <div className={`relative ${slot.status === 'terisi' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'} p-3 rounded-full`}>
                  <Car className="text-white" size={32} />
                </div>
              </div>

              {/* Slot Number */}
              <div className="text-center mb-3">
                <p className="text-white font-black text-2xl mb-1">#{slot.id}</p>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  slot.status === 'terisi' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${slot.status === 'terisi' ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
                  {slot.status.toUpperCase()}
                </div>
              </div>

              {/* Vehicle Info */}
              {slot.status === 'terisi' && (
                <div className="w-full space-y-2 animate-fade-in">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                    <p className="text-white/90 text-xs font-mono text-center">{slot.vehicle}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/70 text-xs bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                    <Clock size={14} className="text-red-400" />
                    <span className="font-semibold">{formatTime(slot.entryTime)}</span>
                  </div>
                </div>
              )}

              {slot.status === 'kosong' && (
                <div className="w-full mt-2">
                  <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-2 border border-green-500/20">
                    <p className="text-green-300 text-xs text-center font-semibold">Siap Digunakan</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${slot.status === 'terisi' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}