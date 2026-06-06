/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  Trash2,
  X,
  ShieldBan,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function UsersAdmin() {

  /* ================= USER ================= */
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "TOKO HAMID JAYA",
      email: "hamidssaputra6@gmail.com",
      role: "PENJUAL",
      status: "Aktif",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "TOKO MAJU JAYA",
      email: "seller@example.com",
      role: "PENJUAL",
      status: "Aktif",
      date: "2024-02-10",
    },
    {
      id: 3,
      name: "SITI AMINAH",
      email: "siti@example.com",
      role: "PEMBELI",
      status: "Diblokir",
      date: "2024-03-05",
    },
  ]);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  const [filteredUsers, setFilteredUsers] =
    useState(users);

  /* ================= DELETE MODAL ================= */
  const [showDelete, setShowDelete] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'User baru "Hamid Saputra" berhasil terdaftar',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Laporan baru masuk untuk produk "iPhone 15 Pro Max"',
        time: "5 menit lalu",
        read: false,
      },
      {
        id: 3,
        title:
          'Voucher GLOBAL "HEMAT10" berhasil diaktifkan',
        time: "20 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(event) {

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotif(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* ================= UPDATE FILTER ================= */
  useEffect(() => {

    setFilteredUsers(users);

  }, [users]);

  /* ================= SEARCH USER ================= */
  const handleSearch = () => {

    const result = users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUsers(result);

  };

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount =
    notifications.filter(
      (notif) => !notif.read
    ).length;

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif
      )
    );

  };

  const deleteNotif = (id) => {

    setNotifications(
      notifications.filter(
        (notif) => notif.id !== id
      )
    );

  };

  const markAllRead = () => {

    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }))
    );

  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = () => {

    setUsers(
      users.filter(
        (user) =>
          user.id !== selectedUser.id
      )
    );

    setShowDelete(false);

  };

  /* ================= BLOCK USER ================= */
  const toggleBlockUser = (id) => {

    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Aktif"
                  ? "Diblokir"
                  : "Aktif",
            }
          : user
      )
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

                  Apakah Anda yakin ingin
                  menghapus pengguna ini?

                </p>

              </div>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-4 mt-10">

                <button
                  onClick={() =>
                    setShowDelete(false)
                  }
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
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-[52px] leading-none font-black text-slate-900">

              Akun Pengguna

            </h1>

            <p className="text-slate-500 mt-4 text-xl">

              Manajemen akun pembeli dan
              penjual di platform BelanjaIn.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <div className="bg-white border border-slate-200 shadow-sm h-16 w-[320px] rounded-2xl px-5 flex items-center">

              {/* ICON */}
              <button
                onClick={handleSearch}
              >

                <Search
                  size={20}
                  className="text-slate-400 hover:text-blue-500 duration-300"
                />

              </button>

              {/* INPUT */}
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    handleSearch();
                  }

                }}
                placeholder="Cari nama pengguna..."
                className="w-full h-full bg-transparent outline-none px-4 text-slate-700"
              />

            </div>

           {/* ================= NOTIF ================= */}
<div
  className="relative"
  ref={notifRef}
>

  <button
    onClick={() =>
      setShowNotif(!showNotif)
    }
    className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center"
  >

    <Bell
      size={22}
      className="text-slate-600"
    />

    {unreadCount > 0 && (
      <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center">

        {unreadCount}

      </div>
    )}

  </button>

  {/* ================= PANEL NOTIF ================= */}
  {showNotif && (

    <div className="absolute top-[75px] right-0 w-[380px] bg-white rounded-[30px] border border-slate-200 shadow-2xl p-5 z-50">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-[15px] font-black text-slate-800">
            NOTIFIKASI
          </h2>

          <p className="text-[12px] text-slate-400 font-bold mt-1">
            {notifications.length} Notifikasi
          </p>

        </div>

        <button
          onClick={markAllRead}
          className="text-blue-600 font-black text-[12px]"
        >
          Tandai semua
        </button>

      </div>

      <div className="max-h-[320px] overflow-y-auto flex flex-col gap-4">

        {notifications.map((notif) => (

          <div
            key={notif.id}
            className={`
              rounded-[24px]
              p-5
              border
              ${
                notif.read
                  ? "bg-white border-slate-200"
                  : "bg-blue-50 border-blue-100"
              }
            `}
          >

            <div className="flex justify-between gap-3">

              <div
                onClick={() =>
                  markAsRead(notif.id)
                }
                className="flex-1 cursor-pointer"
              >

                <h3 className="text-[14px] font-black text-slate-700 leading-relaxed">
                  {notif.title}
                </h3>

                <p className="text-[12px] text-slate-400 font-bold mt-3">
                  {notif.time}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteNotif(notif.id)
                }
                className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500"
              >

                <X size={16} />

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )}

</div>
            

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-12 overflow-hidden">

          {/* TOP */}
          <div className="px-8 py-7 border-b border-slate-100">

            <p className="text-sm font-black tracking-[3px] text-slate-400 uppercase">

              Daftar Pengguna ({filteredUsers.length})

            </p>

          </div>

          {/* HEADER */}
          <div className="grid grid-cols-6 px-8 py-6 border-b border-slate-100 text-sm font-black tracking-wider text-slate-400 uppercase">

            <p>Pengguna</p>
            <p>Email</p>
            <p>Peran</p>
            <p>Tanggal Gabung</p>
            <p>Status</p>
            <p className="text-center">
              Aksi
            </p>

          </div>

          {/* USER NOT FOUND */}
          {filteredUsers.length === 0 && (

            <div className="py-16 text-center text-slate-400 font-black text-xl">

              Pengguna tidak ditemukan

            </div>

          )}

          {/* BODY */}
          {filteredUsers.map((user) => (

            <div
              key={user.id}
              className="grid grid-cols-6 items-center px-8 py-7 border-b border-slate-100 hover:bg-slate-50 duration-300"
            >

              {/* USER */}
              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-blue-600">

                  {user.name.charAt(0)}

                </div>

                <h3 className="font-black uppercase text-slate-900 text-lg">

                  {user.name}

                </h3>

              </div>

              {/* EMAIL */}
              <p className="text-slate-500 font-semibold text-sm">

                {user.email}

              </p>

              {/* ROLE */}
              <div>

                <span
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest ${
                    user.role === "PENJUAL"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >

                  {user.role}

                </span>

              </div>

              {/* DATE */}
              <p className="font-bold text-slate-500">

                {user.date}

              </p>

              {/* STATUS */}
              <div className="flex items-center gap-3">

                <div
                  className={`w-3 h-3 rounded-full ${
                    user.status === "Aktif"
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                />

                <p className="font-black uppercase tracking-widest text-slate-700">

                  {user.status}

                </p>

              </div>

              {/* ACTION */}
              <div className="flex items-center justify-center gap-4">

                {/* BLOCK */}
                <button
                  onClick={() =>
                    toggleBlockUser(user.id)
                  }
                  className={`px-5 h-11 rounded-2xl text-sm font-black tracking-wider duration-300 flex items-center gap-2 ${
                    user.status === "Aktif"
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >

                  <ShieldBan size={16} />

                  {user.status === "Aktif"
                    ? "BLOKIR"
                    : "BUKA BLOKIR"}

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