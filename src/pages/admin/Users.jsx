// src/pages/admin/Users.jsx

import { Search, Bell, Trash2, X, ShieldBan } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifikasi");
        const data = (response.data.data || []).map((n) => ({
          ...n,
          read: n.sudah_dibaca || false,
          time: n.created_at
            ? new Date(n.created_at).toLocaleString()
            : "Baru saja",
          message: n.pesan || n.judul,
        }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/pengguna");
        const usersData = response.data.data.data || [];
        setUsers(
          usersData.map((user) => ({
            ...user,
            status: user.aktif ? "Aktif" : "Diblokir",
            date: user.created_at?.split("T")[0] || "-",
            role:
              user.role === "customer"
                ? "PEMBELI"
                : user.role?.toUpperCase() || "USER",
          })),
        );
        setFilteredUsers(
          usersData.map((user) => ({
            ...user,
            status: user.aktif ? "Aktif" : "Diblokir",
            date: user.created_at?.split("T")[0] || "-",
            role:
              user.role === "customer"
                ? "PEMBELI"
                : user.role?.toUpperCase() || "USER",
          })),
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const result = users.filter((user) =>
      user.nama.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(result);
  };

  // ================= 🔥 BLOKIR / BUKA USER =================
  const toggleBlockUser = async (id) => {
    const user = users.find((u) => u.id_pengguna === id);
    if (!user) return;

    const action = user.status === "Aktif" ? "memblokir" : "membuka blokir";
    if (!window.confirm(`Yakin ingin ${action} user "${user.nama}"?`)) return;

    try {
      await api.put(`/pengguna/${id}`, { aktif: !user.aktif });

      const response = await api.get("/pengguna");
      const usersData = response.data.data.data || [];
      const updatedUsers = usersData.map((u) => ({
        ...u,
        status: u.aktif ? "Aktif" : "Diblokir",
        date: u.created_at?.split("T")[0] || "-",
        role:
          u.role === "customer" ? "PEMBELI" : u.role?.toUpperCase() || "USER",
      }));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert(error.response?.data?.message || "Gagal mengubah status user");
    }
  };

  // ================= 🔥 HAPUS USER (VERSI BARU) =================
  const handleDeleteUser = async () => {
    console.log("🔥 handleDeleteUser dipanggil!");

    if (!selectedUser) {
      console.log("❌ selectedUser null/undefined");
      alert("Tidak ada user yang dipilih");
      return;
    }

    console.log("📦 User yang akan dihapus:", selectedUser);

    const konfirmasi = window.confirm(
      `Yakin ingin MENGHAPUS PERMANEN user "${selectedUser.nama}"?\n\n⚠️ Tindakan ini tidak bisa dibatalkan!`,
    );

    if (!konfirmasi) {
      console.log("❌ Dibatalkan user");
      return;
    }

    try {
      console.log(
        "📡 Mengirim DELETE ke:",
        `/pengguna/${selectedUser.id_pengguna}`,
      );

      const response = await api.delete(
        `/pengguna/${selectedUser.id_pengguna}`,
      );
      console.log("✅ Response DELETE:", response);

      // Refresh list
      console.log("📡 Refresh daftar user...");
      const getResponse = await api.get("/pengguna");
      console.log("✅ Response GET users:", getResponse);

      const usersData = getResponse.data.data.data || [];
      console.log("📦 Data users baru:", usersData);

      const updatedUsers = usersData.map((u) => ({
        ...u,
        status: u.aktif ? "Aktif" : "Diblokir",
        date: u.created_at?.split("T")[0] || "-",
        role:
          u.role === "customer" ? "PEMBELI" : u.role?.toUpperCase() || "USER",
      }));

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setShowDelete(false);
      setSelectedUser(null);

      alert(`✅ User "${selectedUser.nama}" berhasil dihapus!`);
    } catch (error) {
      console.error("❌❌❌ ERROR:", error);
      console.error("❌ Error response:", error.response?.data);
      alert(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  // ================= 🔥 FUNGSI UNTUK MEMBUKA MODAL HAPUS =================
  const openDeleteModal = (user) => {
    console.log("🔥 Opening delete modal for:", user.nama); // Debug
    setSelectedUser(user);
    setShowDelete(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {/* ================= MODAL HAPUS ================= */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
            <div className="w-[480px] bg-white rounded-[38px] p-10 shadow-2xl relative z-10">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Trash2 size={34} />
                </div>
              </div>
              <div className="text-center mt-6">
                <h2 className="text-[38px] leading-none font-black text-slate-900">
                  Hapus Pengguna
                </h2>
                <p className="text-slate-500 font-bold mt-4 text-[17px]">
                  Apakah Anda yakin ingin menghapus pengguna ini?
                </p>
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ Tindakan ini bersifat permanen dan tidak dapat dibatalkan!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => {
                    setShowDelete(false);
                    setSelectedUser(null);
                  }}
                  className="h-[60px] rounded-2xl bg-slate-100 text-slate-500 font-black text-lg hover:bg-slate-200 duration-300"
                >
                  BATAL
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="h-[60px] rounded-2xl bg-[#ff004f] text-white font-black text-lg shadow-[0_10px_25px_rgba(255,0,79,0.35)] hover:scale-[1.03] duration-300"
                >
                  HAPUS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Akun Pengguna
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Manajemen akun pembeli dan penjual di platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[260px] rounded-2xl px-3 flex items-center gap-2">
              <button onClick={handleSearch}>
                <Search
                  size={16}
                  className="text-slate-400 hover:text-blue-500 duration-300"
                />
              </button>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Cari nama pengguna..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>
              {showNotif && (
                <ModalNotfications
                  open={showNotif}
                  onClose={() => setShowNotif(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================= TABEL ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-12 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-[3px] text-slate-400 uppercase">
              Daftar Pengguna ({filteredUsers.length})
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-left text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase border-b border-slate-100">
                  <th className="px-5 py-4 whitespace-nowrap">Pengguna</th>
                  <th className="px-5 py-4 whitespace-nowrap">Email</th>
                  <th className="px-5 py-4 whitespace-nowrap">Peran</th>
                  <th className="px-5 py-4 whitespace-nowrap">Tanggal</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 whitespace-nowrap text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id_pengguna}
                    className="border-b border-slate-100 hover:bg-slate-50 duration-300"
                  >
                    {/* NAMA */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-blue-600 text-sm shrink-0">
                          {user.nama?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span
                          className="font-semibold text-slate-900 text-sm truncate max-w-[150px] block"
                          title={user.nama}
                        >
                          {user.nama || "-"}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="px-5 py-4">
                      <span
                        className="text-slate-500 font-medium text-sm truncate max-w-[180px] block"
                        title={user.email}
                      >
                        {user.email || "-"}
                      </span>
                    </td>

                    {/* PERAN */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-widest whitespace-nowrap ${
                          user.role === "PENJUAL"
                            ? "bg-yellow-100 text-yellow-700"
                            : user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {user.role || "USER"}
                      </span>
                    </td>

                    {/* TANGGAL */}
                    <td className="px-5 py-4">
                      <span className="text-slate-500 font-medium text-sm whitespace-nowrap">
                        {user.date || "-"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            user.status === "Aktif"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span
                          className={`font-semibold uppercase tracking-[0.1em] text-sm ${
                            user.status === "Aktif"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>

                    {/* ================= 🔥 AKSI ================= */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* 🔥 TOMBOL BLOKIR / BUKA */}
                        <button
                          onClick={() => toggleBlockUser(user.id_pengguna)}
                          className={`px-4 h-9 rounded-xl text-xs font-semibold tracking-wide duration-300 flex items-center gap-1.5 whitespace-nowrap ${
                            user.status === "Aktif"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          <ShieldBan size={14} />
                          {user.status === "Aktif" ? "Blokir" : "Buka Blokir"}
                        </button>

                        {/* 🔥 TOMBOL HAPUS (TEMPAT SAMPAH) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 Mencegah event bubbling
                            e.preventDefault();
                            console.log(
                              "🗑️ Delete button clicked for:",
                              user.nama,
                            ); // Debug
                            openDeleteModal(user);
                          }}
                          className="text-slate-400 hover:text-red-500 duration-300 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Hapus pengguna"
                          type="button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <p className="font-semibold">Tidak ada pengguna ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default UsersAdmin;
