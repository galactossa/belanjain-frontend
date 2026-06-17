import { Search, Heart, ShoppingCart } from "lucide-react";

import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";

function Navbar({ search, setSearch, setAuthModal, onSearch }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1450px] mx-auto h-20 px-6 flex items-center justify-between">
        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-12">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="BelanjIn Logo" className="h-11 w-auto" />
            <h1 className="text-4xl font-black">
              <span className="text-blue-600">Belanja</span>
              <span className="text-slate-400">In</span>
            </h1>
          </Link>

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
              w-[650px]
              border
              border-slate-200
            "
          >
            <Search size={22} className="text-slate-400" />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="
                bg-transparent
                outline-none
                px-3
                w-full
                text-[15px]
              "
            />

            <button
              onClick={onSearch}
              className="
                bg-blue-600
                hover:bg-blue-700
                duration-300
                text-white
                px-6
                h-10
                rounded-lg
                text-sm
                font-semibold
              "
            >
              Cari
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-7">
          {/* FAVORITE */}
          <button
            onClick={() => setAuthModal("login")}
            className="
              relative
              text-slate-600
              hover:text-blue-600
              duration-300
            "
          >
            <Heart size={26} />
          </button>

          {/* CART */}
          <button
            onClick={() => setAuthModal("login")}
            className="
              relative
              text-slate-600
              hover:text-blue-600
              duration-300
            "
          >
            <ShoppingCart size={26} />
          </button>

          {/* LOGIN */}
          <button
            onClick={() => setAuthModal("login")}
            className="
              border-2
              border-blue-600
              text-blue-600
              h-11
              px-7
              rounded-lg
              text-sm
              font-bold
              flex
              items-center
              hover:bg-blue-50
              duration-300
            "
          >
            Masuk
          </button>

          {/* REGISTER */}
          <button
            onClick={() => setAuthModal("register")}
            className="
              bg-blue-600
              hover:bg-blue-700
              duration-300
              text-white
              h-11
              px-7
              rounded-lg
              text-sm
              font-bold
              flex
              items-center
              shadow-lg
            "
          >
            Daftar
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
