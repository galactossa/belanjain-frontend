import {
  Bell,
  Search,
  MessageSquare,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function SellerHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-10">

      {/* SEARCH */}
      <div className="bg-white h-16 w-[500px] rounded-2xl px-5 flex items-center border shadow-sm">

        <Search
          size={20}
          className="text-slate-400"
        />

        <input
          type="text"
          placeholder="Cari produk, pesanan, customer..."
          className="w-full h-full px-4 bg-transparent outline-none"
        />

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* CHAT */}
        <button
          onClick={() =>
            navigate("/seller/chat")
          }
          className="w-14 h-14 rounded-2xl bg-white border shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
        >

          <MessageSquare
            size={22}
            className="text-slate-600"
          />

        </button>

        {/* NOTIFICATION */}
        <button
          onClick={() =>
            navigate("/seller/notifications")
          }
          className="w-14 h-14 rounded-2xl bg-white border shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
        >

          <Bell
            size={22}
            className="text-slate-600"
          />

        </button>

        {/* PROFILE */}
        <div
          onClick={() =>
            navigate("/seller/profile")
          }
          className="flex items-center gap-4 cursor-pointer"
        >

          <div className="text-right">

            <h3 className="font-black text-slate-900">
              Denis Store
            </h3>

            <p className="text-sm text-slate-400">
              VERIFIED SELLER
            </p>

          </div>

          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg">

            D

          </div>

        </div>

      </div>

    </div>
  );
}

export default SellerHeader;