import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  PlusCircle,
  ChevronRight,
  X,
  Camera,
  ChevronDown,
  Store,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function SidebarSeller() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const menus = [
    {
      name: "Dashbord",
      icon: <LayoutDashboard size={22} />,
      path: "/seller",
    },
    {
      name: "MyProduk",
      icon: <Boxes size={22} />,
      path: "/seller/products",
    },
    {
    name: "Add Product",
    icon: <PlusCircle size={22} />,
    path: "/seller/add-product",
    },
    {
    name: "Store Profile",
    icon: <Store size={22} />,
    path: "/seller/store-profile",
    },
    {
      name: "Pesanan",
      icon: <ShoppingCart size={22} />,
      path: "/seller/orders",
    },
        {
      name: "Analisis",
      icon: <BarChart3 size={22} />,
      path: "/seller/analystics",
    },
    {
      name: "Obrolan",
      icon: <MessageSquare size={22} />,
      path: "/seller/chat",
      notification: true,
    },
    {
      name: "Pengaturan",
      icon: <Settings size={22} />,
      path: "/seller/settings",
    },
  ];

  return (
    <>
     <div className="w-[280px] h-screen bg-white border-r flex flex-col">

        {/* TOP */}
          <div className="flex-1 overflow-y-auto px-6 py-6">


          {/* LOGO */}
         <div className="flex items-center gap-3 mb-10">

            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border flex items-center justify-center overflow-hidden">

              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="Logo"
                className="w-7 h-7 object-contain"
              />

            </div>

            <h1 className="text-2xl font-black">

              <span className="text-blue-600">
                Belanja
              </span>

              <span className="text-slate-400">
                In
              </span>

            </h1>

          </div>

          {/* PROFILE */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm">

            <div className="w-14 h-14 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl">

              T

            </div>

            <div>

              <h2 className="text-lg font-black text-slate-900 leading-none">

                Toko Hamid Jaya

              </h2>

              <p className="text-blue-600 uppercase tracking-[3px] text-sm mt-2 font-semibold">

                Premium Seller

              </p>

            </div>

          </div>

          {/* MENU */}
          <div className="mt-10 flex flex-col gap-3">

            {menus.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.path}
                  end={menu.path === "/seller"}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-6 h-[54px] rounded-2xl duration-300 font-semibold  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-2xl"
                      : "text-slate-500 hover:bg-slate-100"
                  }`
                }
              >

                {/* LEFT */}
                <div className="flex items-center gap-5">

                  {menu.icon}

                  <span className="text-sm font-semibold">
                    {menu.name}
                  </span>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {menu.notification && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}

                  <ChevronRight size={20} />

                </div>

              </NavLink>
            ))}

          </div>

        </div>

        {/* BOTTOM */}
          <div className="border-t px-5 py-6 bg-white shrink-0">

          {/* BUTTON */}

          {/* LOGOUT */}
          <button
            onClick={() => navigate("/")}
            className="
w-full
mt-3
h-12
rounded-2xl
text-slate-500
font-bold
text-sm
flex
items-center
justify-center
gap-2
hover:bg-red-50
hover:text-red-500
duration-300
"
          >

            <LogOut size={24} />

            Keluar

          </button>

        </div>

      </div>

      {/* ================= MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="w-full max-w-[850px] bg-white rounded-[34px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

      {/* HEADER */}
      <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b">

        <div>

          <h1 className="text-[28px] font-black text-slate-900 uppercase leading-none">

            Produk

          </h1>

          <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-bold mt-2">

            Lengkapi informasi produk anda

          </p>

        </div>

        <button
          onClick={() => setShowModal(false)}
          className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 duration-300 flex items-center justify-center"
        >

          <X
            size={24}
            className="text-slate-400"
          />

        </button>

      </div>

      {/* BODY */}
      <div className="px-8 py-7 max-h-[80vh] overflow-y-auto">

        {/* ROW */}
        <div className="grid grid-cols-2 gap-5">

          {/* NAMA */}
          <div>

            <p className="text-[12px] font-black uppercase tracking-[2px] text-slate-700 mb-3">

              Nama Produk

            </p>

            <input
              type="text"
              placeholder="Contoh: iPhone 15 Pro Max"
              className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 text-[15px] font-semibold outline-none"
            />

          </div>

          {/* HARGA */}
          <div>

            <p className="text-[12px] font-black uppercase tracking-[2px] text-slate-700 mb-3">

              Harga

            </p>

            <div className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 flex items-center gap-3">

              <span className="text-slate-400 text-sm font-black">
                RP
              </span>

              <input
                type="number"
                placeholder="0"
                className="bg-transparent outline-none w-full text-[15px] font-semibold"
              />

            </div>

          </div>

        </div>

        {/* ROW */}
        <div className="grid grid-cols-2 gap-5 mt-6">

          {/* CATEGORY */}
          <div>

            <p className="text-[12px] font-black uppercase tracking-[2px] text-slate-700 mb-3">

              Kategori

            </p>

            <div className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 flex items-center justify-between">

              <select className="bg-transparent outline-none w-full text-[15px] font-bold appearance-none">

                <option>
                  Pilih Kategori
                </option>

                <option>
                  Elektronik
                </option>

                <option>
                  Fashion
                </option>

                <option>
                  Gaming
                </option>

              </select>

              <ChevronDown size={20} />

            </div>

          </div>

          {/* STOCK */}
          <div>

            <p className="text-[12px] font-black uppercase tracking-[2px] text-transparent mb-3">

              Stock

            </p>

            <input
              type="number"
              placeholder="0"
              className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 text-[15px] font-semibold outline-none"
            />

          </div>

        </div>

        {/* IMAGE */}
        <div className="mt-6">

          <div className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 flex items-center gap-3">

            <Camera
              size={20}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="bg-transparent outline-none w-full text-[15px] font-semibold"
            />

          </div>

        </div>

        {/* BRAND */}
        <div className="mt-5">

          <input
            type="text"
            placeholder="Contoh: Apple, Sony, basic Wear"
            className="w-full h-[56px] bg-slate-100 rounded-[18px] px-5 text-[15px] font-semibold outline-none"
          />

        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">

          <textarea
            rows={4}
            placeholder="Jelaskan detail produk Anda..."
            className="w-full bg-slate-100 rounded-[20px] p-5 text-[15px] font-semibold outline-none resize-none"
          ></textarea>

        </div>

        {/* BUTTON */}
        <div className="grid grid-cols-2 gap-4 mt-8">

          <button
            onClick={() => setShowModal(false)}
            className="h-[60px] rounded-[18px] bg-slate-100 text-slate-400 font-black text-lg shadow-sm hover:bg-slate-200 duration-300"
          >

            BATAL

          </button>

          <button className="h-[60px] rounded-[18px] bg-blue-600 text-white font-black text-lg shadow-xl hover:bg-blue-700 duration-300">

            SIMPAN

          </button>

        </div>

      </div>

    </div>

  </div>
)}
    </>
  );
}

export default SidebarSeller;