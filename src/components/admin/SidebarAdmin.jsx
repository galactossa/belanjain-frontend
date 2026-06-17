import {
  LayoutDashboard,
  Users,
  FileBarChart2,
  Package,
  Layers3,
  ReceiptText,
  Ticket,
  ShieldCheck,
  Settings,
  MessageSquare,
  LogOut,
  Bolt,
  Activity,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/Logo.png";

function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser") || "null") || {};

  // ================= LOGOUT =================
  const handleLogout = () => {
    // hapus data login/session
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // kembali ke homepage
    navigate("/");
  };

  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      path: "/admin",
    },

    {
      title: "Users",
      icon: <Users size={22} />,
      path: "/admin/users",
    },

    {
      title: "Reports",
      icon: <FileBarChart2 size={22} />,
      path: "/admin/reports",
    },

    {
      title: "Products",
      icon: <Package size={22} />,
      path: "/admin/products",
    },

    {
      title: "Categories",
      icon: <Layers3 size={22} />,
      path: "/admin/categories",
    },

    {
      title: "Transactions",
      icon: <ReceiptText size={22} />,
      path: "/admin/transactions",
    },

    {
      title: "Vouchers",
      icon: <Ticket size={22} />,
      path: "/admin/vouchers",
    },

    {
      title: "Admin Management",
      icon: <ShieldCheck size={22} />,
      path: "/admin/admins",
    },
    {
      title: "Chat Seller",
      icon: <MessageSquare size={22} />,
      path: "/admin/chat-seller",
    },
    {
      title: "Simulasi Antrian",
      icon: <Activity size={22} />,
      path: "/admin/simulasi-antrian",
    },

    {
      title: "System Settings",
      icon: <Settings size={22} />,
      path: "/admin/settings",
    },
  ];
  return (
    <>
      {/* ================= SCROLLBAR ================= */}
      <style>
        {`
          .sidebar-menu::-webkit-scrollbar {
            width: 8px;
          }

          .sidebar-menu::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar-menu::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 999px;
          }

          .sidebar-menu::-webkit-scrollbar-thumb:hover {
            background: #94A3B8;
          }
        `}
      </style>

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[320px] h-screen bg-[#F5F7FB] border-r border-[#E7ECF3] flex flex-col">
        {/* ================= LOGO ================= */}
        <div className="px-10 pt-10 pb-8 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Belanjain Logo"
              className="w-[48px] h-[48px] rounded-[14px] object-cover shadow-md flex-shrink-0"
            />

            <div>
              <h1 className="text-[20px] font-black leading-tight tracking-tight">
                <span className="text-[#1F4AAC]">Belanja</span>
                <span className="text-[#60A5FA]">in</span>
              </h1>

              <p className="text-[#2563FF] text-[10px] font-black uppercase tracking-[0.3em] mt-0">
                Admin
              </p>
            </div>
          </div>
        </div>

        {/* ================= MENU ================= */}
        <div
          className="
            sidebar-menu
            overflow-y-auto
            overflow-x-hidden
            px-5
          "
          style={{
            height: "calc(100vh - 280px)",
          }}
        >
          <div className="space-y-3 pr-2 pb-6">
            {menus.map((menu, index) => {
              const active = location.pathname === menu.path;

              return (
                <Link
                  key={index}
                  to={menu.path}
                  className={`
                    h-[62px]
                    rounded-[22px]
                    flex
                    items-center
                    gap-5
                    px-6
                    transition-all
                    duration-300
                    font-black
                    text-[17px]
                    ${
                      active
                        ? "bg-[#EEF3FF] text-[#2563FF] shadow-sm"
                        : "text-[#7C8CA5] hover:bg-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <div className={active ? "text-[#2563FF]" : "text-[#94A3B8]"}>
                    {menu.icon}
                  </div>

                  {/* TITLE */}
                  <span>{menu.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= PROFILE ================= */}
        <div className="mt-auto border-t border-[#E7ECF3] px-7 py-7 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="w-[46px] h-[46px] rounded-full bg-[#DCE3F1] flex items-center justify-center overflow-hidden">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name || "Admin avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#334155] text-[18px] font-black">
                  {currentUser?.name?.slice(0, 2) || "AB"}
                </span>
              )}
            </div>

            {/* INFO */}
            <div>
              <h3 className="text-[#071437] text-[14px] font-semibold leading-tight">
                {currentUser?.name || "Admin Belanjain"}
              </h3>

              <p className="text-[#7C8CA5] text-[10px] font-black uppercase tracking-[0.35em] mt-1">
                {currentUser?.role === "admin"
                  ? "System Admin"
                  : "Administrator"}
              </p>
            </div>
          </div>

          {/* ================= LOGOUT BUTTON ================= */}
          <button
            onClick={handleLogout}
            className="
              w-full
              h-[52px]
              rounded-[22px]
              bg-[#EEF3FF]
              text-[#2563FF]
              flex
              items-center
              justify-center
              gap-3
              font-black
              text-[15px]
              tracking-widest
              mt-8
              hover:scale-[1.01]
              hover:bg-[#E3ECFF]
              transition-all
              duration-300
            "
          >
            <LogOut size={20} />
            KELUAR
          </button>
        </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;
