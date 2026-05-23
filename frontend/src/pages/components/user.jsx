import { useEffect, useState } from "react";
import {
  CreditCard,
  ScanLine,
  User,
  Mail,
  Lock,
} from "lucide-react";

export default function UserForm() {

  const [form, setForm] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    id_card: "",
    role: "user",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // AUTO SCAN RFID (asli tanpa popup)
  useEffect(() => {

    const fetchRFID = async () => {
      try {
        const response = await fetch(
          "https://api.siparkir.online/rfid/latest"
        );

        const data = await response.json();

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

    const interval = setInterval(fetchRFID, 1000);

    return () => clearInterval(interval);

  }, []);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://api.siparkir.online/users",
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
          <label className="text-slate-300 text-sm font-semibold">Nama</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
            />
          </div>
        </div>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">Username</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
            />
          </div>
        </div>

        {/* ROLE */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-semibold">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* RFID */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-slate-300 text-sm font-semibold">
            RFID / ID Card
          </label>

          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />

            <input
              type="text"
              name="id_card"
              value={form.id_card}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 p-4 rounded-2xl text-white font-bold"
          >
            Simpan User
          </button>
        </div>

      </form>
    </div>
  );
}
