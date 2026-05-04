import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  CreditCard,
  User,
  Phone,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Mock API (ganti dengan import dari api_service.jsx) ─────────────────────
const mockUsers = [
  {
    id: 1,
    nama: "Budi Santoso",
    email: "budi@example.com",
    no_telp: "08123456789",
    role: "user",
    rfid_id: "A1B2C3D4",
    created_at: "2024-01-10",
  },
  {
    id: 2,
    nama: "Siti Rahayu",
    email: "siti@example.com",
    no_telp: "08234567890",
    role: "admin",
    rfid_id: "E5F6G7H8",
    created_at: "2024-01-15",
  },
  {
    id: 3,
    nama: "Ahmad Fauzi",
    email: "ahmad@example.com",
    no_telp: "08345678901",
    role: "user",
    rfid_id: "I9J0K1L2",
    created_at: "2024-02-01",
  },
  {
    id: 4,
    nama: "Dewi Lestari",
    email: "dewi@example.com",
    no_telp: "08456789012",
    role: "user",
    rfid_id: "",
    created_at: "2024-02-14",
  },
  {
    id: 5,
    nama: "Rizky Pratama",
    email: "rizky@example.com",
    no_telp: "08567890123",
    role: "user",
    rfid_id: "M3N4O5P6",
    created_at: "2024-03-05",
  },
];

// ─── Modal Tambah / Edit Pengguna ────────────────────────────────────────────
function UserModal({ isOpen, onClose, onSave, editData }) {
  const isEdit = !!editData;
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_telp: "",
    role: "user",
    rfid_id: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ ...editData, password: "" });
    } else {
      setForm({ nama: "", email: "", no_telp: "", role: "user", rfid_id: "", password: "" });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.no_telp.trim()) e.no_telp = "No. telepon wajib diisi";
    if (!isEdit && !form.password.trim()) e.password = "Password wajib diisi";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulasi API call
    onSave(form);
    setSaving(false);
    onClose();
  };

  const Field = ({ label, icon: Icon, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type={type}
          value={form[name]}
          onChange={(e) => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: "" }); }}
          placeholder={placeholder}
          className={`w-full bg-slate-800/70 border ${
            errors[name] ? "border-red-500/70" : "border-slate-700/60"
          } rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600
          focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all`}
        />
      </div>
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={11} /> {errors[name]}
        </p>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <User size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">
                {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                {isEdit ? "Perbarui data pengguna" : "Isi data pengguna baru"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto scrollbar-thin">
          {/* Nama */}
          <Field label="Nama Lengkap" icon={User} name="nama" placeholder="Masukkan nama lengkap" />

          {/* Email */}
          <Field label="Email" icon={Mail} name="email" type="email" placeholder="contoh@email.com" />

          {/* No Telp */}
          <Field label="No. Telepon" icon={Phone} name="no_telp" placeholder="08xxxxxxxxxx" />

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              {isEdit ? "Password Baru (opsional)" : "Password"}
            </label>
            <div className="relative">
              <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                placeholder={isEdit ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                className={`w-full bg-slate-800/70 border ${
                  errors.password ? "border-red-500/70" : "border-slate-700/60"
                } rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600
                focus:outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={11} /> {errors.password}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              Role
            </label>
            <div className="flex gap-3">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    form.role === r
                      ? r === "admin"
                        ? "bg-amber-500/20 border-amber-500/60 text-amber-400"
                        : "bg-blue-500/20 border-blue-500/60 text-blue-400"
                      : "bg-slate-800/70 border-slate-700/60 text-slate-500 hover:border-slate-600"
                  }`}
                >
                  {r === "admin" ? "👑 Admin" : "👤 User"}
                </button>
              ))}
            </div>
          </div>

          {/* RFID Card */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
              ID Kartu RFID
            </label>
            <div className="relative">
              <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={form.rfid_id}
                onChange={(e) => setForm({ ...form, rfid_id: e.target.value.toUpperCase() })}
                placeholder="Tempelkan kartu RFID atau isi manual"
                className="w-full bg-slate-800/70 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600
                focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono tracking-wider"
              />
            </div>
            <p className="text-slate-600 text-xs mt-1">
              💡 ID kartu akan terisi otomatis jika RFID reader terhubung
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-700/60 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/40 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>
            ) : (
              <><Check size={15} /> {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama Manajemen Pengguna ────────────────────────────────────────
export default function UserManagementPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  // Filter & search
  const filtered = users.filter((u) => {
    const matchSearch =
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.rfid_id.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSave = (data) => {
    if (data.id) {
      setUsers(users.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
    } else {
      setUsers([...users, { ...data, id: Date.now(), created_at: new Date().toISOString().split("T")[0] }]);
    }
    setPage(1);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  const openEdit = (user) => { setEditData(user); setModalOpen(true); };
  const openAdd = () => { setEditData(null); setModalOpen(true); };

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    withRfid: users.filter((u) => u.rfid_id).length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-modal { animation: modalIn 0.2s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-row { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users size={26} className="text-blue-400" />
            Manajemen Pengguna
          </h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data pengguna dan kartu RFID Si-Parkir</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 active:scale-95"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Pengguna", value: stats.total, icon: Users, color: "blue" },
          { label: "Admin", value: stats.admin, icon: Shield, color: "amber" },
          { label: "Punya Kartu RFID", value: stats.withRfid, icon: CreditCard, color: "emerald" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4`}
          >
            <div className={`w-11 h-11 rounded-xl bg-${color}-500/15 flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={`text-${color}-400`} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">{value}</p>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama, email, atau ID kartu..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["all", "user", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => { setFilterRole(r); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                filterRole === r
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {r === "all" ? "Semua" : r === "admin" ? "Admin" : "User"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-slate-800 bg-slate-900/80">
          {["Nama", "Email", "No. Telepon", "Role", "ID Kartu RFID", "Aksi"].map((h) => (
            <div key={h} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</div>
          ))}
        </div>

        {/* Table Rows */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="font-semibold">Tidak ada pengguna ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          paginated.map((user, i) => (
            <div
              key={user.id}
              className={`grid grid-cols-[2fr_2fr_1.5fr_1fr_1.5fr_auto] gap-4 items-center px-5 py-4 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors animate-row ${
                i % 2 === 0 ? "" : "bg-slate-800/10"
              }`}
            >
              {/* Nama */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/10 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                  {user.nama.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-white truncate">{user.nama}</span>
              </div>

              {/* Email */}
              <span className="text-sm text-slate-400 truncate">{user.email}</span>

              {/* No Telp */}
              <span className="text-sm text-slate-400">{user.no_telp}</span>

              {/* Role */}
              <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                user.role === "admin"
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                  : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
              }`}>
                {user.role === "admin" ? "👑" : "👤"} {user.role}
              </span>

              {/* RFID */}
              <div>
                {user.rfid_id ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wider">
                    <CreditCard size={11} /> {user.rfid_id}
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs italic">Belum terdaftar</span>
                )}
              </div>

              {/* Aksi */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(user)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-500/20 hover:border-blue-500/40 border border-slate-700 flex items-center justify-center transition-all group"
                  title="Edit"
                >
                  <Edit2 size={14} className="text-slate-400 group-hover:text-blue-400" />
                </button>
                <button
                  onClick={() => setDeleteId(user.id)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:border-red-500/40 border border-slate-700 flex items-center justify-center transition-all group"
                  title="Hapus"
                >
                  <Trash2 size={14} className="text-slate-400 group-hover:text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Menampilkan {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft size={14} className="text-slate-400" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg border text-xs font-bold transition-colors ${
                    page === p
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-slate-700 transition-colors"
              >
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Tambah/Edit ── */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editData={editData}
      />

      {/* ── Konfirmasi Hapus ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-modal text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Hapus Pengguna?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Data pengguna dan kartu RFID akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}