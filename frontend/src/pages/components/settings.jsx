import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Save, Shield, Camera, Database } from "lucide-react";

export default function SettingsPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Baca langsung dari localStorage, tidak perlu import apapun
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!currentUser) {
      alert("Sesi tidak ditemukan, silakan login ulang.");
      setLoading(false);
      return;
    }

    // Langsung pakai data dari localStorage, tidak perlu fetch ke backend
    setNama(currentUser.nama || "");
    setEmail(currentUser.email || "");
    setLoading(false);
  }, []);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);

    try {
      await axios.put(
        "http://127.0.0.1:8000/auth/update-profile",  // ← ganti URL
        { id: currentUser.id, nama, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (password !== "") {
        await axios.put(
          "http://127.0.0.1:8000/auth/update-password",  // ← ganti URL
          { id: currentUser.id, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const updatedUser = { ...currentUser, nama, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Pengaturan berhasil disimpan!");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* PROFILE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <User className="text-indigo-400" />
          <h2 className="text-white text-xl font-bold">Profile Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
            />
          </div>
        </div>
      </div>

      {/* PASSWORD */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-purple-400" />
          <h2 className="text-white text-xl font-bold">Reset Password</h2>
        </div>

        <div>
          <label className="text-slate-300 text-sm block mb-2">Password Baru</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kosongkan jika tidak diubah"
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white"
          />
        </div>
      </div>

      {/* SYSTEM */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-green-400" />
          <h2 className="text-white text-xl font-bold">System Configuration</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <Camera className="text-pink-400 mb-3" />
            <p className="text-white font-semibold">Camera Status</p>
            <p className="text-slate-400 text-sm">Connected</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <Database className="text-blue-400 mb-3" />
            <p className="text-white font-semibold">Database</p>
            <p className="text-slate-400 text-sm">Online</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
            <Shield className="text-green-400 mb-3" />
            <p className="text-white font-semibold">Security</p>
            <p className="text-slate-400 text-sm">Protected</p>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold flex items-center gap-2"
        >
          <Save size={18} />
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

    </div>
  );
}