import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Filter } from "lucide-react";

export default function StatisticsWidget() {
  // Data contoh: total parkir, masuk, keluar (bisa kamu ganti pakai data real dari backend)
  const weeklyData = [
    { day: "Senin", total: 40, masuk: 25, keluar: 15 },
    { day: "Selasa", total: 55, masuk: 30, keluar: 25 },
    { day: "Rabu", total: 35, masuk: 20, keluar: 15 },
    { day: "Kamis", total: 50, masuk: 28, keluar: 22 },
    { day: "Jumat", total: 65, masuk: 40, keluar: 25 },
    { day: "Sabtu", total: 30, masuk: 15, keluar: 15 },
    { day: "Minggu", total: 20, masuk: 10, keluar: 10 },
  ];

  const monthlyData = [
    { day: "Minggu 1", total: 230, masuk: 130, keluar: 100 },
    { day: "Minggu 2", total: 270, masuk: 150, keluar: 120 },
    { day: "Minggu 3", total: 250, masuk: 140, keluar: 110 },
    { day: "Minggu 4", total: 280, masuk: 160, keluar: 120 },
  ];

  // State filter
  const [filter, setFilter] = useState("mingguan");

  // Tentukan data berdasarkan filter
  const chartData = filter === "mingguan" ? weeklyData : monthlyData;

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Statistik Parkir</h2>

        <div className="flex items-center gap-3">
          <Filter className="text-slate-400" size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-white border border-white/20 rounded-xl px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="mingguan">Mingguan</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>
      </div>

      {/* Grafik */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e1e2f",
              border: "none",
              borderRadius: "10px",
              color: "white",
            }}
          />
          <Legend wrapperStyle={{ color: "#ddd" }} />
          <Bar
            dataKey="total"
            fill="url(#totalColor)"
            radius={[8, 8, 0, 0]}
            name="Total Parkir"
          />
          <Bar
            dataKey="masuk"
            fill="url(#masukColor)"
            radius={[8, 8, 0, 0]}
            name="Parkir Masuk"
          />
          <Bar
            dataKey="keluar"
            fill="url(#keluarColor)"
            radius={[8, 8, 0, 0]}
            name="Parkir Keluar"
          />

          {/* Gradient Warna */}
          <defs>
            <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.2} />
            </linearGradient>

            <linearGradient id="masukColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.2} />
            </linearGradient>

            <linearGradient id="keluarColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>

      {/* Keterangan */}
      <div className="mt-4 text-center text-slate-400 text-sm">
        <p>Menampilkan data parkir berdasarkan filter {filter}</p>
      </div>
    </div>
  );
}
