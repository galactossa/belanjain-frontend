// src/components/customer/CustomerNavbar.jsx
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  MessageCircle,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  X,
  AlertTriangle,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/Logo.png";
import api from "../../api/api";

function CustomerNavbar({
  setShowWishlist,
  setShowCart,
  search = "",
  setSearch = () => {},
  onSearch = () => {},
  wishlistCount,
  cartCount,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });
  const { currentText } = useLanguage();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [membershipLevel, setMembershipLevel] = useState("REGULAR");

  // ================= READ SEARCH FROM URL =================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search, setSearch]);

  // ================= RE-READ USER FROM LOCALSTORAGE =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // ================= FETCH MEMBERSHIP LEVEL =================
  useEffect(() => {
    const fetchMembership = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/loyalty/membership/${currentUser.id_pengguna}`,
        );
        const level = response.data.data?.membership_level || "Regular";
        setMembershipLevel(level.toUpperCase());
      } catch (error) {
        console.error("Error fetching membership:", error);
        setMembershipLevel("REGULAR");
      }
    };
    fetchMembership();
  }, [currentUser?.id_pengguna]);

  // ================= LISTEN PERUBAHAN USER =================
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      setCurrentUser(user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ================= NOTIFICATION =================
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/notifikasi/pengguna/${currentUser.id_pengguna}`,
        );
        console.log("🔍 Notifications response:", response.data);

        let data = [];
        if (response.data?.data) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        setNotifications(data);
        setNotificationCount(data.filter((n) => !n.sudah_dibaca).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [currentUser?.id_pengguna]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifikasi/${id}/read`);
      setNotifications(
        notifications.map((n) =>
          n.id_notifikasi === id ? { ...n, sudah_dibaca: true } : n,
        ),
      );
      setNotificationCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.id_pengguna) return;
    try {
      await api.put(`/notifikasi/pengguna/${currentUser.id_pengguna}/read-all`);
      setNotifications(
        notifications.map((n) => ({ ...n, sudah_dibaca: true })),
      );
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // ================= CHAT =================
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/chat/rooms/${currentUser.id_pengguna}`,
        );
        setChatCount(response.data.data?.length || 0);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };
    fetchChatRooms();
  }, [currentUser?.id_pengguna]);

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/customer?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/customer");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setCurrentUser(null);
    navigate("/");
  };

  const userNotifications = notifications;
  const recentNotifications = userNotifications.slice(0, 3);

  return (
    <div
      className="
        w-full
        bg-white/95
        backdrop-blur-md
        border-b
        border-slate-200
        sticky
        top-0
        z-50
      "
    >
      <div
        className="
          max-w-[1700px]
          mx-auto
          h-20
          px-6
          flex
          items-center
          justify-between
          gap-6
        "
      >
        {/* LEFT */}
        <div className="flex items-center">
          <button
            onClick={() => navigate("/customer")}
            className="flex items-center gap-4 shrink-0"
          >
            <img
              src={logo}
              alt="Belanjain Logo"
              className="w-auto h-11 object-contain"
            />
            <h1 className="text-4xl font-extrabold">
              <span className="text-blue-600">Belanja</span>
              <span className="text-blue-400">In</span>
            </h1>
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            hidden
            lg:flex
            items-center
            bg-slate-100
            rounded-2xl
            h-12
            px-5
            flex-1
            max-w-[700px]
            border
            border-slate-200
          "
        >
          <Search size={22} className="text-slate-400" />
          <input
            type="text"
            placeholder={currentText.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none px-3 w-full text-[14px]"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white w-20 h-10 rounded-lg text-sm font-bold"
          >
            {currentText.searchButton}
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* WISHLIST */}
          <button
            onClick={() => setShowWishlist?.(true)}
            className="relative w-10 h-10 rounded-[16px] flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-500 duration-300"
          >
            <Heart size={26} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 shadow-md ring-2 ring-white text-white text-[8px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART */}
          <button
            onClick={() => setShowCart?.(true)}
            className="relative w-10 h-10 rounded-[16px] flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 duration-300"
          >
            <ShoppingCart size={26} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-blue-600 text-white text-[8px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* CHAT */}
          <button
            onClick={() => navigate("/customer/chat")}
            className="relative w-10 h-10 rounded-[16px] flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-blue-600 duration-300"
          >
            <MessageCircle size={26} strokeWidth={1.8} />
            {chatCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-green-500 text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                {chatCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION */}
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative w-10 h-10 rounded-[16px] flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-blue-600 duration-300"
          >
            <Bell size={26} strokeWidth={1.8} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* PROFILE */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                {currentUser?.url_foto ? (
                  <img
                    src={currentUser.url_foto}
                    alt={currentUser?.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {currentUser?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <div className="text-left hidden xl:block">
                <h3 className="text-[15px] font-bold text-slate-900 leading-none">
                  {currentUser?.name || "User"}
                </h3>
                <p className="text-[12px] font-bold text-blue-600 mt-1 uppercase">
                  {membershipLevel || "REGULAR"} MEMBER
                </p>
              </div>

              <ChevronDown size={18} className="text-slate-400" />
            </button>

            {showProfile && (
              <div className="absolute top-[68px] right-0 w-[275px] bg-white rounded-2xl shadow-xl border overflow-hidden">
                <div className="p-5 bg-slate-50">
                  <h2 className="text-lg font-black text-slate-900">
                    {currentUser?.name || "User"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {currentUser?.email || ""}
                  </p>
                </div>

                <div className="border-t border-slate-100 py-2">
                  <div className="py-2">
                    <button
                      onClick={() => navigate("/customer/profile")}
                      className="w-full h-14 px-6 flex items-center gap-4 text-slate-700 hover:bg-blue-50 transition"
                    >
                      <User size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuProfile}
                      </span>
                    </button>

                    <button
                      onClick={() => navigate("/customer/orders")}
                      className="w-full h-14 px-6 flex items-center gap-4 text-slate-700 hover:bg-blue-50 transition"
                    >
                      <Package size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuOrders}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        navigate("/customer/profile", {
                          state: { tab: "setting" },
                        })
                      }
                      className="w-full h-14 px-6 flex items-center gap-4 text-slate-700 hover:bg-blue-50 transition"
                    >
                      <Settings size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuSettings}
                      </span>
                    </button>

                    {/* 🔥 MENU LAPORAN CUSTOMER */}
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/customer/reports");
                      }}
                      className="w-full h-14 px-6 flex items-center gap-4 text-slate-700 hover:bg-red-50 transition"
                    >
                      <AlertTriangle
                        size={20}
                        className="text-red-500 shrink-0"
                      />
                      <span className="font-semibold">Riwayat Laporan</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-200 p-3">
                    <button
                      onClick={handleLogout}
                      className="w-full h-14 flex items-center gap-4 px-3 rounded-xl text-red-500 hover:bg-red-50 transition"
                    >
                      <LogOut size={20} className="shrink-0" />
                      <span className="font-semibold">
                        {currentText.logoutButton}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NOTIFICATION MODAL */}
      {showNotification && (
        <div className="absolute top-24 right-6 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">Notifikasi</h2>
              <p className="text-xs text-slate-500 mt-1">
                RIWAYAT PEMBERITAHUAN
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id_notifikasi}
                  className="border-b border-slate-100 p-4 hover:bg-slate-50"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {notif.pesan || notif.judul}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {notif.created_at
                      ? new Date(notif.created_at).toLocaleString()
                      : "Baru saja"}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                Tidak ada notifikasi
              </div>
            )}
          </div>

          {userNotifications.length > 0 && (
            <button
              onClick={() => {
                setShowNotification(false);
                setShowNotificationDrawer(true);
              }}
              className="w-full h-12 border-t border-slate-100 text-blue-600 font-bold hover:bg-blue-50 rounded-b-2xl"
            >
              Lihat Semua ({userNotifications.length})
            </button>
          )}
        </div>
      )}

      {/* NOTIFICATION DRAWER */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/20 backdrop-blur-[3px]"
            onClick={() => setShowNotificationDrawer(false)}
          />

          <div className="w-[420px] h-screen bg-[#FAFAFA] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="px-6 py-7 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Bell size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[32px] font-black text-slate-900">
                      Notifikasi
                    </h2>
                    <p className="text-xs tracking-widest text-slate-400 font-bold">
                      RIWAYAT PEMBERITAHUAN
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotificationDrawer(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={22} />
                </button>
              </div>
              <button
                onClick={markAllAsRead}
                className="mt-4 text-blue-600 text-sm font-bold"
              >
                Tandai Semua Dibaca ({notificationCount})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 bg-[#FAFAFA]">
              {userNotifications.length > 0 ? (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id_notifikasi}
                    className={`bg-white border border-slate-200 rounded-3xl p-5 mx-4 mb-4 hover:shadow-md transition ${
                      !notif.sudah_dibaca ? "border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Bell size={20} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-slate-900">
                            {notif.judul || "Notifikasi"}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400">
                            {notif.created_at
                              ? new Date(notif.created_at).toLocaleString()
                              : "Baru saja"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {notif.pesan}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          {!notif.sudah_dibaca && (
                            <button
                              onClick={() => markAsRead(notif.id_notifikasi)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                              Tandai Dibaca
                            </button>
                          )}
                          {notif.tipe && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                notif.tipe === "pesanan"
                                  ? "bg-orange-100 text-orange-600"
                                  : notif.tipe === "promo"
                                    ? "bg-red-100 text-red-600"
                                    : notif.tipe === "toko"
                                      ? "bg-green-100 text-green-600"
                                      : notif.tipe === "komplain" ||
                                          notif.tipe === "komplain_respon"
                                        ? "bg-purple-100 text-purple-600"
                                        : notif.tipe === "admin_teguran"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {notif.tipe.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <div className="text-5xl mb-4">🔔</div>
                  <p className="font-semibold">Tidak ada notifikasi</p>
                  <p className="text-sm mt-1">
                    Semua notifikasi akan muncul di sini
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-white">
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="w-full h-14 rounded-2xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Kembali Belanja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerNavbar;
