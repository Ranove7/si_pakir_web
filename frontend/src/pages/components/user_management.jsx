import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  Shield,
  Search,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/user_service";

// ==========================
// BADGE ROLE
// ==========================
const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    petugas: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    user: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${styles[role] || styles.user}`}>
      {role}
    </span>
  );
};

// ==========================
// MODAL FORM (CREATE / EDIT)
// ==========================
function UserFormModal({ mode, userData, onClose, onSave }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    nama: userData?.nama || "",
    username: userData?.username || "",
    email: userData?.email || "",
    id_card: userData?.id_card || "",
    role: userData?.role || "user",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.username.trim()) e.username = "Username wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    if (!isEdit && !form.password.trim()) e.password = "Password wajib diisi untuk user baru";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;

      await onSave(payload);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Gagal menyimpan";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="text-slate-300 text-sm block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50
          ${errors[name] ? "border-red-500/60" : "border-white/10"}`}
      />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20">
              {isEdit ? <Pencil size={18} className="text-indigo-400" /> : <UserPlus size={18} className="text-indigo-400" />}
            </div>
            <h2 className="text-white font-bold text-lg">
              {isEdit ? "Edit User" : "Tambah User Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <Field label="Nama Lengkap" name="nama" placeholder="Masukkan nama lengkap" />
          <Field label="Username" name="username" placeholder="Masukkan username" />
          <Field label="Email" name="email" type="email" placeholder="Masukkan email" />
          <Field label="ID Card" name="id_card" placeholder="Opsional" />

          {/* Password */}
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">
              Password {isEdit && <span className="text-slate-500">(kosongkan jika tidak diubah)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? "••••••••" : "Masukkan password"}
                className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 pr-10
                  ${errors.password ? "border-red-500/60" : "border-white/10"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Role</label>
            <div className="relative">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
              >
                <option value="user">User</option>
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
// MODAL KONFIRMASI DELETE
// ==========================
function DeleteModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      alert(err?.response?.data?.detail || "Gagal menghapus user");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Hapus User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-slate-300 text-sm">
            Yakin ingin menghapus user <span className="text-white font-semibold">"{user?.nama}"</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 p-5 border-t border-white/10">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors">
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-60"
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================
// MAIN COMPONENT
// ==========================
export default function UserManagement() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Gagal fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (formData) => {
    await createUser(formData);
    await fetchUsers();
  };

  const handleUpdate = async (formData) => {
    await updateUser(editUser.id, formData);
    await fetchUsers();
  };

  const handleDelete = async () => {
    await deleteUser(deleteTarget.id);
    await fetchUsers();
  };

  const filtered = users.filter((u) => {
  const matchSearch =
    u.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(debouncedSearch.toLowerCase());

  const matchRole = filterRole === "all" || u.role === filterRole;

  return matchSearch && matchRole;
});

  // summary counts
  const counts = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    petugas: users.filter((u) => u.role === "petugas").length,
    user: users.filter((u) => u.role === "user").length,
  };

  return (
    <div className="space-y-6">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: counts.total, color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/30", text: "text-indigo-300" },
          { label: "Admin", value: counts.admin, color: "from-purple-500/20 to-pink-500/20 border-purple-500/30", text: "text-purple-300" },
          { label: "Petugas", value: counts.petugas, color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30", text: "text-blue-300" },
          { label: "User", value: counts.user, color: "from-slate-500/20 to-slate-600/20 border-slate-500/30", text: "text-slate-300" },
        ].map((card) => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-4 backdrop-blur-xl`}>
            <p className="text-slate-400 text-xs mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-400" size={20} />
            <h2 className="text-white font-bold text-lg">Data Users</h2>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <UserPlus size={16} />
              Tambah User
            </button>
          )}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none pr-8 cursor-pointer"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="petugas">Petugas</option>
              <option value="user">User</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center text-slate-400 py-10">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada user ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 font-medium py-3 px-3">#</th>
                  <th className="text-left text-slate-400 font-medium py-3 px-3">Nama</th>
                  <th className="text-left text-slate-400 font-medium py-3 px-3">Username</th>
                  <th className="text-left text-slate-400 font-medium py-3 px-3 hidden md:table-cell">Email</th>
                  <th className="text-left text-slate-400 font-medium py-3 px-3 hidden md:table-cell">ID Card</th>
                  <th className="text-left text-slate-400 font-medium py-3 px-3">Role</th>
                  {isAdmin && (
                    <th className="text-center text-slate-400 font-medium py-3 px-3">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-3 text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3 text-white font-medium">{u.nama}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono text-xs">{u.username}</td>
                    <td className="py-3 px-3 text-slate-400 hidden md:table-cell">{u.email}</td>
                    <td className="py-3 px-3 text-slate-400 hidden md:table-cell">
                      {u.id_card || <span className="text-slate-600 italic">—</span>}
                    </td>
                    <td className="py-3 px-3">
                      <RoleBadge role={u.role} />
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditUser(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {/* Tidak bisa hapus diri sendiri */}
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && (
          <p className="text-slate-500 text-xs mt-4">
            Menampilkan {filtered.length} dari {users.length} user
          </p>
        )}
      </div>

      {/* MODALS */}
      {showCreate && (
        <UserFormModal
          mode="create"
          userData={null}
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {editUser && (
        <UserFormModal
          mode="edit"
          userData={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}