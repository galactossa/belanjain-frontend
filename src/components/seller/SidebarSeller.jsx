import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  Store,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import logo from "../../assets/Logo.png";

function SidebarSeller() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : {};
  });
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    // Avatar error state management only
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  const renderIcon = useCallback((iconType) => {
    const iconProps = { size: 22 };
    switch (iconType) {
      case "dashboard":
        return <LayoutDashboard {...iconProps} />;
      case "boxes":
        return <Boxes {...iconProps} />;
      case "plus":
        return <PlusCircle {...iconProps} />;
      case "cart":
        return <ShoppingCart {...iconProps} />;
      case "store":
        return <Store {...iconProps} />;
      case "chart":
        return <BarChart3 {...iconProps} />;
      case "message":
        return <MessageSquare {...iconProps} />;
      case "settings":
        return <Settings {...iconProps} />;
      default:
        return null;
    }
  }, []);

  const menus = useMemo(
    () => [
      { title: "Dashboard", iconType: "dashboard", path: "/seller" },
      { title: "My Products", iconType: "boxes", path: "/seller/products" },
      { title: "Add Product", iconType: "plus", path: "/seller/add-product" },
      { title: "Orders", iconType: "cart", path: "/seller/orders" },
      {
        title: "Store Profile",
        iconType: "store",
        path: "/seller/store-profile",
      },
      {
        title: "Sales Analytics",
        iconType: "chart",
        path: "/seller/analystics",
      },
      { title: "Obrolan", iconType: "message", path: "/seller/chat" },
      { title: "Pengaturan", iconType: "settings", path: "/seller/settings" },
    ],
    [],
  );

  const handleAvatarError = useCallback(() => {
    setAvatarError(true);
  }, []);

  const isValidAvatarUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  return (
    <>
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
      <aside className="w-[280px] h-screen bg-[#F5F7FB] border-r border-[#E7ECF3] flex flex-col">
        {/* ================= LOGO ================= */}
        <div className="px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Belanjain Logo"
              className="w-[40px] h-[40px] rounded-[12px] object-cover shadow-md flex-shrink-0"
            />

            <div>
              <h1 className="text-[18px] font-black leading-tight tracking-tight">
                <span className="text-[#1F4AAC]">Belanja</span>
                <span className="text-[#60A5FA]">in</span>
              </h1>

              <p className="text-[#2563FF] text-[9px] font-black uppercase tracking-[0.25em] mt-0.5">
                Seller
              </p>
            </div>
          </div>
        </div>

        {/* ================= STORE PROFILE ================= */}
        <div className="px-4 pb-6 shrink-0">
          <div className="bg-[#EEF3FF] rounded-[20px] p-4 flex items-center gap-3">
            {/* AVATAR */}
            <div className="w-[48px] h-[48px] rounded-full bg-[#2563FF] flex items-center justify-center overflow-hidden flex-shrink-0 text-white font-black text-[18px]">
              {isValidAvatarUrl(currentUser?.avatar) && !avatarError ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.storeName || currentUser.name || "Seller"}
                  className="w-full h-full object-cover"
                  onError={handleAvatarError}
                />
              ) : (
                <span>
                  {currentUser?.storeName
                    ? currentUser.storeName.slice(0, 1).toUpperCase()
                    : currentUser?.name?.slice(0, 1).toUpperCase() || "S"}
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[#071437] text-[13px] font-bold leading-tight truncate">
                {currentUser?.storeName || currentUser?.name || "Seller Store"}
              </h3>

              <p className="text-[#2563FF] text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">
                Premium Seller
              </p>
            </div>
          </div>
        </div>

        {/* ================= MENU ================= */}
        <div
          className="sidebar-menu overflow-y-auto overflow-x-hidden px-4"
          style={{
            height: "calc(100vh - 330px)",
          }}
        >
          <div className="space-y-2 pr-2 pb-6">
            {menus.map((menu) => {
              const active = location.pathname === menu.path;

              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`
                    h-[56px]
                    rounded-[20px]
                    flex
                    items-center
                    gap-4
                    px-5
                    transition-all
                    duration-300
                    font-black
                    text-[15px]
                    ${
                      active
                        ? "bg-[#EEF3FF] text-[#2563FF] shadow-sm"
                        : "text-[#7C8CA5] hover:bg-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <div className={active ? "text-[#2563FF]" : "text-[#94A3B8]"}>
                    {renderIcon(menu.iconType)}
                  </div>

                  {/* TITLE */}
                  <span>{menu.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= LOGOUT ================= */}
        <div className="border-t border-[#E7ECF3] px-6 py-6 bg-white shrink-0">
          <button
            onClick={handleLogout}
            className="
              w-full
              h-[48px]
              rounded-[20px]
              bg-[#EEF3FF]
              text-[#2563FF]
              flex
              items-center
              justify-center
              gap-2
              font-black
              text-[13px]
              tracking-wider
              hover:scale-[1.01]
              hover:bg-[#E3ECFF]
              transition-all
              duration-300
            "
          >
            <LogOut size={18} />
            KELUAR
          </button>
        </div>
      </aside>
    </>
  );
}

export default SidebarSeller;
