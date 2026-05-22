import { useEffect, useState } from "react";
import {
  CreditCard,
  ScanLine,
  User,
  Mail,
  Lock,
} from "lucide-react";

export default function UserForm() {

  // =========================================
  // STATE FORM
  // =========================================
  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    id_card: "",
    role: "user",
  });

  // =========================================
  // HANDLE INPUT
  // =========================================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // =========================================
  // AUTO SCAN RFID
  // =========================================
  useEffect(() => {

    const fetchRFID = async () => {

      try {

        const response = await fetch(
          "http://192.168.1.64:8000/rfid/latest"
        );

        const data = await response.json();

        // kalau RFID ada
        if (data.id_card) {

          setForm((prev) => ({
            ...prev,
            id_card: data.id_card,
          }));

          console.log("RFID Terdeteksi:", data.id_card);
        }

      } catch (error) {

        console.log("RFID Error:", error);

      }
    };

    // polling tiap 1 detik
    const interval = setInterval(fetchRFID, 1000);

    return () => clearInterval(interval);

  }, []);

  // =========================================
  // SUBMIT FORM
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://192.168.1.64:8000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      console.log(data);

      alert("User berhasil ditambahkan");

      // reset form
      setForm({
        nama: "",
        username: "",
        email: "",
        password: "",
        id_card: "",
        role: "user",
      });

    } catch (error) {

      console.log(error);

      alert("Terjadi kesalahan");

    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* NAMA */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">
            Nama
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
            />
          </div>
        </div>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">
            Username
          </label>

          <div className="relative">
            <User
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
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">
            Password
          </label>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 pl-12 rounded-2xl outline-none text-white"
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">
            Role
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all p-4 rounded-2xl outline-none text-white"
          >
            <option value="user" className="bg-slate-900">
              User
            </option>

            <option value="admin" className="bg-slate-900">
              Admin
            </option>
          </select>
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

        {/* BUTTON */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all p-4 rounded-2xl text-white font-bold"
          >
            Simpan User
          </button>
        </div>

      </form>
    </div>
  );
}
