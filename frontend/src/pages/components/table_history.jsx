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

       <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10">
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
                  Kode Parkir
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-purple-400" />
                  Aktivitas
                </div>
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-bold text-sm uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-yellow-400" />
                  Waktu
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
                  {record.activity === 'parkir_masuk' ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-sm"></div>
                        <CheckCircle className="relative text-green-400" size={16} />
                      </div>
                      <span className="text-green-300 font-bold text-sm">Masuk</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-500/30 backdrop-blur-sm shadow-lg shadow-red-500/20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-sm"></div>
                        <AlertCircle className="relative text-red-400" size={16} />
                      </div>
                      <span className="text-red-300 font-bold text-sm">Keluar</span>
                    </div>
                  )}
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <Clock size={16} className="text-yellow-400" />
                    </div>
                    <span className="font-medium">{new Date(record.timestamp).toLocaleString('id-ID')}</span>
                  </div>
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