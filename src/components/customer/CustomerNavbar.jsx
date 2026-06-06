import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  MessageCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

function CustomerNavbar({
  setShowWishlist,
  setShowCart,
  search,
  setSearch,
  onSearch,
  wishlistCount,
  cartCount,

}) {

  const navigate = useNavigate();
  const currentUser = JSON.parse(
  localStorage.getItem("currentUser")
);

console.log(
  "CUSTOMER NAVBAR",
  currentUser
);
  const [showProfile, setShowProfile] =
    useState(false);

  // ================= NOTIFICATION =================
  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  // ================= LOAD STORAGE =================
  useEffect(() => {

    const notifications =
      JSON.parse(
        localStorage.getItem(
          "notifications"
        )
      ) || [];

    setNotificationCount(
      notifications.length
    );

  }, []);

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {

    navigate("/customer");

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
          max-w-[1450px]
          mx-auto
          h-24
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
            onClick={() =>
              navigate("/customer")
            }
            className="
              flex
              items-center
              gap-4
              shrink-0
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-600
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <span className="text-white font-black text-2xl">

                B

              </span>

            </div>

            <h1 className="text-4xl font-black">

              <span className="text-blue-600">

                Belanja

              </span>

              <span className="text-slate-400">

                In

              </span>

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
            h-14
            px-5
            flex-1
            max-w-[750px]
            border
            border-slate-200
            focus-within:border-blue-500
            transition
          "
        >

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari produk favoritmu..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onKeyDown={handleKeyDown}
            className="
              bg-transparent
              outline-none
              px-4
              w-full
              text-[15px]
            "
          />

          <button
            onClick={handleSearch}
            className="
              bg-blue-600
              hover:bg-blue-700
              duration-300
              text-white
              px-7
              h-11
              rounded-xl
              font-bold
              shrink-0
            "
          >

            Cari

          </button>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-2">

          {/* WISHLIST */}
          <button
            onClick={() =>
              setShowWishlist?.(
                true
              )
            }
            className="
              relative
              w-12
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-red-50
              hover:text-red-500
              duration-300
            "
          >

            <Heart size={25} />

            {wishlistCount > 0 && (

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[22px]
                  h-[22px]
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[11px]
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
            onClick={() =>
              setShowCart?.(true)
            }
            className="
              relative
              w-12
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-blue-50
              hover:text-blue-600
              duration-300
            "
          >

            <ShoppingCart
              size={25}
            />
             {/* BADGE */}
  {cartCount > 0 && (

    <span
      className="
        absolute
        -top-1
        -right-1
        min-w-[20px]
        h-[20px]
        px-1
        rounded-full
        bg-blue-600
        text-white
        text-[10px]
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
            onClick={() =>
              navigate("/customer/chat")
            }
            className="
              relative
              w-12
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-slate-100
              hover:text-blue-600
              duration-300
            "
          >

            <MessageCircle
              size={24}
            />

          </button>

          {/* NOTIFICATION */}
          <button
            onClick={() =>
              navigate("/customer/notifikasi")
            }
            className="
              relative
              w-12
              h-12
              rounded-2xl
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-slate-100
              hover:text-blue-600
              duration-300
            "
          >

            <Bell size={24} />

            {notificationCount > 0 && (

              <span
                className="
                  absolute
                  top-1
                  right-1
                  min-w-[22px]
                  h-[22px]
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[11px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >

                {notificationCount}

              </span>

            )}

          </button>

          {/* PROFILE */}
          <div className="relative ml-2">

            <button
              onClick={() =>
                setShowProfile(
                  !showProfile
                )
              }
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
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-black
                  shadow-lg
                "
              >

                H

              </div>

              {/* NAME */}
              <div className="text-left hidden xl:block">

                <h3
                  className="
                    text-[15px]
                    font-black
                    text-slate-900
                    leading-none
                  "
                >

                  Hamid Saputra

                </h3>

                <p
                  className="
                    text-[13px]
                    font-bold
                    text-yellow-500
                    mt-1
                  "
                >

                  GOLD MEMBER

                </p>

              </div>

              <ChevronDown
                size={18}
                className="text-slate-400"
              />

            </button>

            {/* DROPDOWN */}
            {showProfile && (

              <div
                className="
                  absolute
                  top-[70px]
                  right-0
                  w-[300px]
                  bg-white
                  rounded-3xl
                  shadow-2xl
                  border
                  border-slate-200
                  overflow-hidden
                "
              >

                {/* TOP */}
                <div className="p-5">

                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-900
                    "
                  >

                    Hamid Saputra

                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >

                    hamid@example.com

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

                  {/* PROFILE */}
                  <button
                    onClick={() =>
                      navigate(
                        "/customer/profile"
                      )
                    }
                    className="
                      w-full
                      h-14
                      px-5
                      flex
                      items-center
                      gap-4
                      hover:bg-slate-50
                      duration-300
                      text-slate-700
                      font-semibold
                    "
                  >

                    <User size={20} />

                    Profil Saya

                  </button>

                </div>

                {/* LOGOUT */}
                <div
                  className="
                    border-t
                    border-slate-100
                    p-3
                  "
                >

                  <button
                    onClick={handleLogout}
                    className="
                      w-full
                      h-12
                      rounded-2xl
                      bg-red-50
                      text-red-500
                      font-bold
                      hover:bg-red-100
                      duration-300
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    <LogOut size={18} />

                    Keluar

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default CustomerNavbar;