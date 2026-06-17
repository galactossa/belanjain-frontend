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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import { useLanguage } from "../../context/LanguageContext";
import { notifications } from "../../data/notifications";
import { chats } from "../../data/chat";
import { users } from "../../data/users";
import logo from "../../assets/Logo.png";
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
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { currentText } = useLanguage();

  const profileUser =
    users.find((u) => u.id === currentUser?.id) || currentUser;

  console.log("CUSTOMER NAVBAR", currentUser);
  const [showProfile, setShowProfile] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // ================= FILTER NOTIFICATIONS =================
  const userNotifications = notifications.filter(
    (notif) => notif.userId === currentUser?.id && notif.role === "customer",
  );

  const recentNotifications = userNotifications.slice(0, 3);

  // ================= CHAT =================
  const userChats = chats.filter((chat) => chat.customerId === currentUser?.id);

  const chatCount = userChats.length;
  // ================= NOTIFICATION =================
  const [notificationCount] = useState(() => {
    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    return notifications.length;
  });

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {
    if (window.location.pathname !== "/customer") {
      navigate("/customer");
    }

    setTimeout(() => {
      onSearch?.();
    }, 200);
  };

  // ================= ENTER =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

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
        {/* ================= LEFT ================= */}
        <div className="flex items-center">
          {/* LOGO */}
          <button
            onClick={() => navigate("/customer")}
            className="
              flex
              items-center
              gap-4
              shrink-0
            "
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

        {/* ================= SEARCH ================= */}
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
            className="
              bg-transparent
              outline-none
              px-3
              w-full
              text-[14px]
            "
          />

          <button
            onClick={handleSearch}
            className="
  bg-blue-600
  hover:bg-blue-700
  text-white
  w-20
  h-10
  rounded-lg
  text-sm
  font-bold
"
          >
            {currentText.searchButton}
          </button>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-5">
          {/* WISHLIST */}
          <button
            onClick={() => setShowWishlist?.(true)}
            className="
              relative
              w-10
              h-10
              rounded-[16px]
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-red-50
              hover:text-red-500
              duration-300
            "
          >
            <Heart size={26} strokeWidth={1.8} />

            {wishlistCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[16px]
                  h-[16px]
                  px-1
                  rounded-full
                  bg-red-500
shadow-md
ring-2
ring-white
                  text-white
                  text-[8px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART */}
          <button
            onClick={() => setShowCart?.(true)}
            className="
              relative
              w-10
              h-10
              rounded-[16px]
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-blue-50
              hover:text-blue-600
              duration-300
            "
          >
            <ShoppingCart size={26} strokeWidth={1.8} />
            {/* BADGE */}
            {cartCount > 0 && (
              <span
                className="
        absolute
        -top-1
        -right-1
        min-w-[16px]
        h-[16px]
        px-1
        rounded-full
        bg-blue-600
        text-white
        text-[8px]
        font-black
        flex
        items-center
        justify-center
      "
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* CHAT */}
          <button
            onClick={() => navigate("/customer/chat")}
            className="
    relative
    w-10
    h-10
    rounded-[16px]
    flex
    items-center
    justify-center
    text-slate-600
    hover:bg-slate-100
    hover:text-blue-600
    duration-300
  "
          >
            <MessageCircle size={26} strokeWidth={1.8} />

            {chatCount > 0 && (
              <span
                className="
        absolute
        -top-1
        -right-1
        min-w-[16px]
        h-[16px]
        px-1
        rounded-full
        bg-green-500
        text-white
        text-[8px]
        font-bold
        flex
        items-center
        justify-center
        ring-2
        ring-white
      "
              >
                {chatCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION */}
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="
              relative
              w-10
              h-10
              rounded-[16px]
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-slate-100
              hover:text-blue-600
              duration-300
            "
          >
            <Bell size={26} strokeWidth={1.8} />

            {userNotifications.length > 0 && (
              <span
                className="
                  absolute
                  top-1
                  right-1
                 min-w-[18px]
h-[18px]
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[8px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {userNotifications.length}
              </span>
            )}
          </button>

          {/* PROFILE */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="
                flex
                items-center
                gap-3
                pl-4
                border-l
                border-slate-200
              "
            >
              {/* AVATAR */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                {profileUser?.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt={profileUser?.name || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {currentUser?.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* NAME */}
              <div className="text-left hidden xl:block">
                <h3
                  className="
    text-[15px]
    font-bold
    text-slate-900
    leading-none
  "
                >
                  {currentUser?.name}
                </h3>

                <p
                  className="
    text-[12px]
    font-bold
    text-blue-600
    mt-1
  "
                >
                  GOLD MEMBER
                </p>
              </div>

              <ChevronDown size={18} className="text-slate-400" />
            </button>

            {/* DROPDOWN */}
            {showProfile && (
              <div
                className="
                absolute
                top-[68px]
                right-0
                w-[275px]
                bg-white
                rounded-2xl
                shadow-xl
                border
                overflow-hidden
              "
              >
                {/* TOP */}
                <div className="p-5 bg-slate-50">
                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-900
                    "
                  >
                    {currentUser?.name}
                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {currentUser?.email}
                  </p>
                </div>

                {/* MENU */}
                <div
                  className="
                    border-t
                    border-slate-100
                    py-2
                  "
                >
                  <div className="py-2">
                    {/* PROFIL */}
                    <button
                      onClick={() => navigate("/customer/profile")}
                      className="
                        w-full
                        h-14
                        px-6
                        flex
                        items-center
                        gap-4
                        text-slate-700
                        hover:bg-blue-50
                        transition
                      "
                    >
                      <User size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuProfile}
                      </span>
                    </button>

                    {/* PESANAN */}
                    <button
                      onClick={() => navigate("/customer/orders")}
                      className="
                        w-full
                        h-14
                        px-6
                        flex
                        items-center
                        gap-4
                        text-slate-700
                        hover:bg-blue-50
                        transition
                      "
                    >
                      <Package size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuOrders}
                      </span>
                    </button>

                    {/* PENGATURAN */}
                    <button
                      onClick={() =>
                        navigate("/customer/profile", {
                          state: { tab: "setting" },
                        })
                      }
                      className="
                        w-full
                        h-14
                        px-6
                        flex
                        items-center
                        gap-4
                        text-slate-700
                        hover:bg-blue-50
                        transition
                      "
                    >
                      <Settings size={20} className="text-blue-600 shrink-0" />
                      <span className="font-semibold">
                        {currentText.profileMenuSettings}
                      </span>
                    </button>
                  </div>

                  {/* LOGOUT */}
                  <div className="border-t border-slate-200 p-3">
                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        h-14
                        flex
                        items-center
                        gap-4
                        px-3
                        rounded-xl
                        text-red-500
                        hover:bg-red-50
                        transition
                      "
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

      {/* ================= NOTIFICATION MODAL ================= */}
      {showNotification && (
        <div className="absolute top-24 right-6 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
          {/* HEADER */}
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

          {/* NOTIFICATIONS LIST */}
          <div className="max-h-[400px] overflow-y-auto">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="border-b border-slate-100 p-4 hover:bg-slate-50"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {notif.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                Tidak ada notifikasi
              </div>
            )}
          </div>

          {/* FOOTER */}
          {userNotifications.length > 0 && (
            <button
              onClick={() => {
                setShowNotification(false);
                setShowNotificationDrawer(true);
              }}
              className="w-full h-12 border-t border-slate-100 text-blue-600 font-bold hover:bg-blue-50 rounded-b-2xl"
            >
              Lihat Semua Dibaca
            </button>
          )}
        </div>
      )}

      {/* ================= NOTIFICATION DRAWER ================= */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* OVERLAY */}
          <div
            className="
    flex-1
    bg-black/20
    backdrop-blur-[3px]
  "
            onClick={() => setShowNotificationDrawer(false)}
          />

          {/* DRAWER */}
          <div
            className="
    w-[420px]
    h-screen
    bg-[#FAFAFA]
    flex
    flex-col
    shadow-2xl
    animate-in
    slide-in-from-right
    duration-300
  "
          >
            {/* HEADER */}
            <div className="px-6 py-7 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="
          w-10
          h-10
          rounded-xl
          bg-blue-50
          flex
          items-center
          justify-center
        "
                  >
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
                  className="
        text-slate-400
        hover:text-slate-700
      "
                >
                  <X size={22} />
                </button>
              </div>

              <button
                className="
      mt-4
      text-blue-600
      text-sm
      font-bold
    "
              >
                Tandai Semua Dibaca
              </button>
            </div>

            {/* CONTENT */}
            <div
              className="
    flex-1
    overflow-y-auto
    py-5
    bg-[#FAFAFA]
  "
            >
              {userNotifications.length > 0 ? (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      p-5
      mx-4
      mb-4
      hover:shadow-md
      transition
    "
                  >
                    <div className="flex gap-4">
                      <div
                        className="
          w-12
          h-12
          rounded-2xl
          bg-orange-50
          flex
          items-center
          justify-center
          shrink-0
        "
                      >
                        <Package size={20} className="text-orange-500" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-slate-900">Diproses</h4>

                          <span
                            className="
              text-[11px]
              font-bold
              text-slate-400
            "
                          >
                            2 MENIT YANG LALU
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {notif.message}
                        </p>

                        <span
                          className="
            inline-flex
            mt-3
            px-2
            py-1
            rounded-md
            bg-blue-50
            text-blue-600
            text-[11px]
            font-bold
          "
                        >
                          Baru
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  Tidak ada notifikasi
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div
              className="
    p-5
    border-t
    border-slate-200
    bg-white
  "
            >
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="
      w-full
      h-14
      rounded-2xl
      border
      border-slate-200
      font-bold
      text-slate-700
      hover:bg-slate-50
    "
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
