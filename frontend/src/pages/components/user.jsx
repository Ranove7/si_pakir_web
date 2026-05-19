import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Plus,
  RefreshCw,
  ScanLine,
  User,
  Mail,
  Shield,
  CreditCard,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    id_card: "",
    role: "user",
  });

  const [loadingRFID, setLoadingRFID] = useState(false);

  // =========================
  // GET USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/users"
      );

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE USER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/users",
        form
      );

      alert("User berhasil ditambahkan");

      setForm({
        nama: "",
        username: "",
        email: "",
        password: "",
        id_card: "",
        role: "user",
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal tambah user");
    }
  };

  // =========================
  // SCAN RFID
  // =========================
  useEffect(() => {

  const interval = setInterval(async () => {

    try {

      const res = await axios.get(
        "http://192.168.1.5:8000/rfid/latest"
      );

      // kalau ada RFID baru
      if (
        res.data.id_card &&
        res.data.id_card !== form.id_card
      ) {

        setForm((prev) => ({
          ...prev,
          id_card: res.data.id_card,
        }));

        console.log(
          "RFID Detected:",
          res.data.id_card
        );
      }

    } catch (err) {

      console.log("RFID Error:", err);

    }

  }, 1000); // cek tiap 1 detik

  return () => clearInterval(interval);

}, [form.id_card]);

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";

      case "petugas":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";

      default:
        return "bg-green-500/20 text-green-300 border border-green-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50"></div>

          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
            <Users className="text-white" size={30} />
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            User Management
          </h1>

          <p className="text-slate-400">
            Kelola data user & RFID access
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-50"></div>

            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
              <Plus className="text-white" size={24} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Tambah User
            </h2>

            <p className="text-slate-400 text-sm">
              Tambahkan akun baru dan RFID card
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* NAMA */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">
              Nama Lengkap
            </label>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                name="nama"
                placeholder="Masukkan nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
                required
              />
            </div>
          </div>

          {/* USERNAME */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">
              Username
            </label>

            <div className="relative">
              <Users
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                name="username"
                placeholder="Masukkan username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">
              Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 rounded-2xl outline-none text-white"
              required
            />
          </div>

          {/* RFID */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-slate-300 text-sm font-semibold">
              RFID / ID Card
            </label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <CreditCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />

                <input
                  type="text"
                  name="id_card"
                  placeholder="Tap kartu RFID atau input manual"
                  value={form.id_card}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
                />
              </div>

              <div className="px-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-300 font-semibold">
  <ScanLine size={18} />
  Auto Scan Active
</div>
            </div>
          </div>

          {/* ROLE */}
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-semibold">
              Role
            </label>

            <div className="relative">
              <Shield
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full appearance-none bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
              >
                <option className="bg-slate-900" value="admin">
                  Admin
                </option>

                <option className="bg-slate-900" value="petugas">
                  Petugas
                </option>

                <option className="bg-slate-900" value="user">
                  User
                </option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3"
            >
              <Plus size={20} />
              Tambah User
            </button>
          </div>
        </form>
      </div>

      {/* TABLE CARD */}
      <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Data User
            </h2>

            <p className="text-slate-400 text-sm">
              List seluruh user terdaftar
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all hover:scale-105"
          >
            <RefreshCw className="text-cyan-400" size={20} />
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-slate-300">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">RFID</th>
                <th className="p-4 text-left">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-t border-white/5 hover:bg-white/5 transition-all ${
                    index % 2 === 0
                      ? "bg-white/[0.02]"
                      : ""
                  }`}
                >
                  <td className="p-4 text-slate-300 font-semibold">
                    #{user.id}
                  </td>

                  <td className="p-4 text-white font-semibold">
                    {user.nama}
                  </td>

                  <td className="p-4 text-slate-300">
                    {user.username}
                  </td>

                  <td className="p-4 text-slate-300">
                    {user.email}
                  </td>

                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
                      <CreditCard size={14} />
                      {user.id_card || "-"}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="py-20 text-center">
              <Users
                className="mx-auto text-slate-600 mb-4"
                size={50}
              />

              <p className="text-slate-400">
                Belum ada data user
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  