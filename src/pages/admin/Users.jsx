/* ================= IMPORT ================= */
import { Search, Bell, Trash2, X, ShieldBan } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import { notifications as defaultNotifications } from "../../data/notifications";
import { users as usersData } from "../../data/users";

function UsersAdmin() {
  /* ================= USER ================= */
  const [users, setUsers] = useState(
    usersData.map((user) => ({
      ...user,
      status: user.status || "Aktif",
      date: user.date || user.joined || "-",
    })),
  );

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  const [filteredUsers, setFilteredUsers] = useState(users);

  /* ================= DELETE MODAL ================= */
  const [showDelete, setShowDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((item) => ({
        ...item,
        time: "Baru saja",
        read: false,
      })),
  );

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= UPDATE FILTER ================= */
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  /* ================= SEARCH USER ================= */
  const handleSearch = () => {
    const result = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredUsers(result);
  };

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif,
      ),
    );
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllRead = () => {
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    );
  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== selectedUser.id));

    setShowDelete(false);
  };

  /* ================= BLOCK USER ================= */
  const toggleBlockUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Aktif" ? "Diblokir" : "Aktif",
            }
          : user,
      ),
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {/* ================= DELETE MODAL ================= */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[6px]" />

            <div className="w-[480px] bg-white rounded-[38px] p-10 shadow-2xl relative z-10">
              {/* ICON */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Trash2 size={34} />
                </div>
              </div>

              {/* TITLE */}
              <div className="text-center mt-6">
                <h2 className="text-[38px] leading-none font-black text-slate-900">
                  Hapus Pengguna
                </h2>

                <p className="text-slate-500 font-bold mt-4 text-[17px]">
                  Apakah Anda yakin ingin menghapus pengguna ini?
                </p>
              </div>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => setShowDelete(false)}
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
        <div className="flex items-center justify-between gap-6">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Akun Pengguna
            </h1>

            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Manajemen akun pembeli dan penjual di platform BelanjaIn.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[260px] rounded-2xl px-3 flex items-center gap-2">
              {/* ICON */}
              <button onClick={handleSearch}>
                <Search
                  size={16}
                  className="text-slate-400 hover:text-blue-500 duration-300"
                />
              </button>

              {/* INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Cari nama pengguna..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>

            {/* ================= NOTIF ================= */}
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

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-12 overflow-hidden">
          {/* TOP */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-[3px] text-slate-400 uppercase">
              Daftar Pengguna ({filteredUsers.length})
            </p>
          </div>

          {/* HEADER */}
          <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_0.9fr_0.7fr] px-5 py-4 border-b border-slate-100 text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
            <p>Pengguna</p>
            <p>Email</p>
            <p>Peran</p>
            <p>Tanggal </p>
            <p>Status</p>
            <p className="text-center">Aksi</p>
          </div>

          {/* USER NOT FOUND */}
          {filteredUsers.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-semibold text-base">
              Pengguna tidak ditemukan
            </div>
          )}

          {/* BODY */}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1.5fr_2fr_1fr_1fr_0.9fr_0.7fr] items-center px-5 py-4 border-b border-slate-100 hover:bg-slate-50 duration-300"
            >
              {/* USER */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-blue-600 text-sm">
                  {user.name.charAt(0)}
                </div>

                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-[0.02em] truncate">
                  {user.name}
                </h3>
              </div>

              {/* EMAIL */}
              <p className="text-slate-500 font-medium text-sm truncate">
                {user.email}
              </p>

              {/* ROLE */}
              <div>
                <span
                  className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-widest ${
                    user.role === "PENJUAL"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* DATE */}
              <p className="text-slate-500 font-medium text-sm">{user.date}</p>

              {/* STATUS */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />

                <p className="font-semibold uppercase tracking-[0.1em] text-slate-700">
                  {user.status}
                </p>
              </div>

              {/* ACTION */}
              <div className="flex items-center justify-center gap-3">
                {/* BLOCK */}
                <button
                  onClick={() => toggleBlockUser(user.id)}
                  className={`px-4 h-10 rounded-2xl text-[13px] font-semibold tracking-wide duration-300 flex items-center gap-2 ${
                    user.status === "Aktif"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  <ShieldBan size={14} />

                  {user.status === "Aktif" ? "Blokir" : "Buka"}
                </button>

                {/* DELETE */}
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowDelete(true);
                  }}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default UsersAdmin;
