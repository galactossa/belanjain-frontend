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
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = () => {
    // hapus data login/session
    localStorage.removeItem("token");
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
      title: "System Settings",
      icon: <Settings size={22} />,
      path: "/admin/settings",
    },
    {
      title: "Chat Seller",
      icon: <MessageSquare size={22} />,
      path: "/admin/chat-seller",
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

          <div className="flex items-center gap-5">

            <div className="w-[56px] h-[56px] rounded-[18px] bg-[#2563FF] flex items-center justify-center shadow-xl">
              <Bolt
                size={28}
                className="text-white"
                fill="white"
              />
            </div>

            <div>
              <h1 className="text-[24px] font-black text-[#071437] leading-none">
                BelanjaIn
              </h1>

              <p className="text-[#2563FF] text-[13px] font-black uppercase tracking-widest mt-2">
                Admin Panel
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
              const active =
                location.pathname === menu.path;

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
                  <div
                    className={
                      active
                        ? "text-[#2563FF]"
                        : "text-[#94A3B8]"
                    }
                  >
                    {menu.icon}
                  </div>

                  {/* TITLE */}
                  <span>
                    {menu.title}
                  </span>
                </Link>
              );
            })}

          </div>
        </div>

        {/* ================= PROFILE ================= */}
        <div className="mt-auto border-t border-[#E7ECF3] px-7 py-7 bg-white shrink-0">

          <div className="flex items-center gap-4">

            {/* AVATAR */}
            <div className="w-[52px] h-[52px] rounded-[18px] bg-[#DCE3F1] flex items-center justify-center text-[#334155] text-[22px] font-black">
              AB
            </div>

            {/* INFO */}
            <div>

              <h3 className="text-[#071437] text-[20px] font-black leading-none">
                Admin Belanjain
              </h3>

              <p className="text-[#7C8CA5] text-[13px] font-black uppercase tracking-wider mt-2">
                System Admin
              </p>

            </div>

          </div>

          {/* ================= LOGOUT BUTTON ================= */}
          <button
            onClick={handleLogout}
            className="
              w-full
              h-[62px]
              rounded-[22px]
              bg-[#EEF3FF]
              text-[#2563FF]
              flex
              items-center
              justify-center
              gap-4
              font-black
              text-[18px]
              tracking-widest
              mt-8
              hover:scale-[1.01]
              hover:bg-[#E3ECFF]
              transition-all
              duration-300
            "
          >
            <LogOut size={24} />
            KELUAR
          </button>

        </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;