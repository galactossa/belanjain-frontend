/* ================= IMPORT ================= */
import { Search, Bell, Star, X } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import { products as productsData } from "../../data/products";
import { notifications as defaultNotifications } from "../../data/notifications";

function Products() {
  /* ================= PRODUCT ================= */
  const [products, setProducts] = useState(productsData);

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((item) => ({
        ...item,
        read: false,
        time: "Baru saja",
      })),
  );

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= FILTER PRODUCT ================= */
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif,
      ),
    );
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllRead = () => {
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    );
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = (id) => {
    setProducts(
      products.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "AKTIF" ? "DITAHAN" : "AKTIF",
            }
          : item,
      ),
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Semua Produk
            </h1>

            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Monitoring semua produk yang diunggah oleh berbagai penjual di
              platform BelanjaIn.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>

            {/* ================= NOTIF ================= */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />

                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>

              {/* PANEL */}
              {showNotif && (
                <ModalNotfications
                  open={showNotif}
                  onClose={() => setShowNotif(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-10 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[2.8fr_1.1fr_1.1fr_0.8fr_0.7fr_0.9fr_0.9fr] px-6 py-4 bg-slate-50 text-[12px] font-black tracking-[1px] text-slate-500 uppercase">
            <p>Produk</p>
            <p>Kategori</p>
            <p>Harga</p>
            <p>Stok</p>
            <p>Rating</p>
            <p>Status</p>
            <p className="text-center">Aksi</p>
          </div>

          {/* EMPTY */}
          {filteredProducts.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-black text-xl">
              Produk tidak ditemukan
            </div>
          )}

          {/* BODY */}
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2.8fr_1.1fr_1.1fr_0.8fr_0.7fr_0.9fr_0.9fr] items-center px-6 py-4 border-b last:border-b-0 hover:bg-slate-50 duration-300"
            >
              {/* PRODUCT */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover border"
                />

                <div>
                  <h3 className="font-black text-slate-900 text-[15px] uppercase leading-none break-words max-w-[220px] whitespace-normal">
                    {item.name}
                  </h3>

                  <p className="text-slate-400 text-xs mt-2">ID: {item.id}</p>
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <p className="font-black tracking-[2px] text-slate-600 text-sm uppercase break-words max-w-[140px] whitespace-normal">
                  {item.category}
                </p>
              </div>

              {/* PRICE */}
              <div>
                <p className="font-black text-slate-900">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>

              {/* STOCK */}
              <div>
                <p className="font-semibold text-slate-500">
                  {item.stock} unit
                </p>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-2">
                <Star size={14} className="fill-orange-400 text-orange-400" />

                <p className="font-black text-orange-500">{item.rating}</p>
              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-[1px] ${
                    item.status === "AKTIF"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* ACTION */}
              <div className="flex justify-center">
                {item.status === "AKTIF" ? (
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="bg-red-50 text-red-500 px-4 h-10 rounded-2xl font-black tracking-[1px] hover:bg-red-100 duration-300 text-xs"
                  >
                    TAHAN PRODUK
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="bg-emerald-100 text-emerald-600 px-4 h-10 rounded-2xl font-black tracking-[1px] hover:bg-emerald-200 duration-300 text-xs"
                  >
                    AKTIFKAN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Products;
