import React, { useState, useEffect } from "react";
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
import { Filter, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { getWeeklyStats, getMonthlyStats } from "../../services/chart_service";

export default function StatisticsWidget() {
  const [filter, setFilter] = useState("mingguan");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data ketika filter berubah
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (filter === "mingguan") {
          data = await getWeeklyStats();
        } else {
          data = await getMonthlyStats();
        }
        setChartData(data);
      } catch (err) {
        setError("Gagal mengambil data statistik");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  // Hitung total
  const totalParkir = chartData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalMasuk = chartData.reduce((sum, item) => sum + (item.masuk || 0), 0);
  const totalKeluar = chartData.reduce((sum, item) => sum + (item.keluar || 0), 0);

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <BarChart3 className="text-white" size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Statistik Parkir
            </h2>
            <p className="text-slate-400 text-sm">Analisis data parkir</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Filter className="text-indigo-400" size={18} />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 text-white border border-white/20 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
          >
            <option value="mingguan" className="bg-slate-900">Mingguan</option>
            <option value="bulanan" className="bg-slate-900">Bulanan</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">Total Parkir</span>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-black text-indigo-300">
            {loading ? "..." : totalParkir}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">Parkir Masuk</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-black text-green-300">
            {loading ? "..." : totalMasuk}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-semibold">Parkir Keluar</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-3xl font-black text-red-300">
            {loading ? "..." : totalKeluar}
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <span className="ml-3 text-slate-400">Memuat data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[350px]">
            <span className="text-red-400">{error}</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <span className="text-slate-400">Tidak ada data untuk ditampilkan</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "white",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                }}
                itemStyle={{ color: "white", fontWeight: "600" }}
                labelStyle={{ color: "#e2e8f0", fontWeight: "bold", marginBottom: "8px" }}
              />
              <Legend 
                wrapperStyle={{ 
                  color: "#cbd5e1",
                  fontWeight: "600",
                  paddingTop: "20px",
                }} 
              />
              <Bar dataKey="total" fill="url(#totalColor)" radius={[8, 8, 0, 0]} name="Total Parkir" />
              <Bar dataKey="masuk" fill="url(#masukColor)" radius={[8, 8, 0, 0]} name="Parkir Masuk" />
              <Bar dataKey="keluar" fill="url(#keluarColor)" radius={[8, 8, 0, 0]} name="Parkir Keluar" />

              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="masukColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="keluarColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
        <TrendingUp size={16} className="text-indigo-400" />
        <p>Menampilkan data parkir berdasarkan filter <span className="text-indigo-400 font-bold">{filter}</span></p>
      </div>
    </div>
  );
}