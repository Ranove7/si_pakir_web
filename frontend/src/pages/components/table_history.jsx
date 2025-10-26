import React from 'react';
import { History, Clock, Calendar, Timer, CheckCircle, AlertCircle } from 'lucide-react';

export default function HistoryWidget({ history = [] }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl">
              <History className="text-white" size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Riwayat Parkir
            </h2>
            <p className="text-slate-400 text-sm">Aktivitas terbaru</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <Calendar size={16} className="text-purple-400" />
          <span className="text-purple-300 text-sm font-semibold">{history.length} History</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  No
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Slot
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Plat Nomor
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-yellow-400" />
                  Waktu Masuk
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-orange-400" />
                  Waktu Keluar
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Timer size={14} className="text-pink-400" />
                  Durasi
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-cyan-400" />
                  Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr 
                key={record.id} 
                className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-sm">{record.slot}</span>
                    </div>
                    <span className="text-slate-300 font-semibold">Slot</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-mono font-bold">{record.vehicle}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <Clock size={16} className="text-yellow-400" />
                    </div>
                    <span className="font-medium">{record.entryTime}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <Clock size={16} className="text-orange-400" />
                    </div>
                    <span className="font-medium">{record.exitTime}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <Timer size={16} className="text-pink-400" />
                    <span className="text-pink-300 font-bold">{record.duration}</span>
                  </div>
                </td>
                <td className="py-5 px-6">
                  {record.status === 'Parkir' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 backdrop-blur-sm shadow-lg shadow-blue-500/20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm"></div>
                        <AlertCircle className="relative text-blue-400" size={16} />
                      </div>
                      <span className="text-blue-300 font-bold text-sm">{record.status}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-xl border border-gray-500/30 backdrop-blur-sm">
                      <CheckCircle className="text-gray-400" size={16} />
                      <span className="text-gray-300 font-bold text-sm">{record.status}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-4 border border-purple-500/30">
            <History className="text-purple-400" size={40} />
          </div>
          <p className="text-slate-400 text-lg font-semibold">Belum ada riwayat parkir</p>
          <p className="text-slate-500 text-sm mt-2">Data akan muncul setelah ada aktivitas parkir</p>
        </div>
      )}
    </div>
  );
}