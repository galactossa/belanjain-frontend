/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  Star,
  X,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function Products() {

  /* ================= PRODUCT ================= */
  const initialProducts = [
    {
      id: 1,
      name: "IPHONE 15 PRO MAX - 256GB TITANIUM",
      category: "ELEKTRONIK",
      price: "Rp 18.999.000",
      stock: "10 unit",
      rating: "4.9",
      status: "AKTIF",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600",
    },
    {
      id: 2,
      name: "MACBOOK AIR M2 - MIDNIGHT BLUE",
      category: "LAPTOP",
      price: "Rp 16.499.000",
      stock: "10 unit",
      rating: "4.8",
      status: "DITAHAN",
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=600",
    },
    {
      id: 3,
      name: "SONY WH-1000XM5 NOISE CANCELLING",
      category: "AUDIO",
      price: "Rp 4.599.000",
      stock: "10 unit",
      rating: "4.7",
      status: "AKTIF",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
    },
    {
      id: 4,
      name: "APPLE WATCH SERIES 9 GPS 45MM",
      category: "WEARABLE",
      price: "Rp 6.299.000",
      stock: "10 unit",
      rating: "4.8",
      status: "AKTIF",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600",
    },
  ];

  const [products, setProducts] =
    useState(initialProducts);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'Produk "iPhone 15 Pro Max" berhasil ditambahkan',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Laporan baru masuk pada produk "Macbook Air M2"',
        time: "5 menit lalu",
        read: false,
      },
      {
        id: 3,
        title:
          'Produk "Sony WH-1000XM5" berhasil diaktifkan',
        time: "20 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(event) {

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotif(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* ================= FILTER PRODUCT ================= */
  const filteredProducts =
    products.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount =
    notifications.filter(
      (notif) => !notif.read
    ).length;

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif
      )
    );

  };

  const deleteNotif = (id) => {

    setNotifications(
      notifications.filter(
        (notif) => notif.id !== id
      )
    );

  };

  const markAllRead = () => {

    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }))
    );

  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = (id) => {

    setProducts(
      products.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "AKTIF"
                  ? "DITAHAN"
                  : "AKTIF",
            }
          : item
      )
    );

  };

  return (
    <AdminLayout>

      <div className="min-h-screen bg-[#f6f8fc] p-8">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-[48px] font-black text-slate-900">

              Semua Produk

            </h1>

            <p className="text-slate-500 mt-2 text-lg">

              Monitoring semua produk yang diunggah oleh berbagai penjual di platform BelanjaIn.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <div className="bg-[#f1f5f9] border h-14 w-[320px] rounded-2xl px-5 flex items-center">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari produk..."
                className="w-full h-full bg-transparent outline-none px-3"
              />

            </div>

            {/* ================= NOTIF ================= */}
            <div
              className="relative"
              ref={notifRef}
            >

              <button
                onClick={() =>
                  setShowNotif(!showNotif)
                }
                className="relative w-14 h-14 rounded-2xl bg-white border shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
              >

                <Bell
                  size={20}
                  className="text-slate-500"
                />

                {unreadCount > 0 && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-pink-500"></div>
                )}

              </button>

              {/* PANEL */}
              {showNotif && (

                <div className="absolute top-[70px] right-0 w-[380px] bg-white rounded-[30px] border border-slate-200 shadow-2xl p-5 z-50">

                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <h2 className="text-[15px] font-black text-slate-800">

                        NOTIFIKASI

                      </h2>

                      <p className="text-[12px] text-slate-400 font-bold mt-1">

                        {notifications.length} Notifikasi

                      </p>

                    </div>

                    <button
                      onClick={markAllRead}
                      className="text-blue-600 font-black text-[12px]"
                    >

                      Tandai semua

                    </button>

                  </div>

                  {/* LIST */}
                  <div className="max-h-[320px] overflow-y-auto flex flex-col gap-4">

                    {notifications.map((notif) => (

                      <div
                        key={notif.id}
                        className={`
                          rounded-[24px]
                          p-5
                          border
                          ${
                            notif.read
                              ? "bg-white border-slate-200"
                              : "bg-blue-50 border-blue-100"
                          }
                        `}
                      >

                        <div className="flex justify-between gap-3">

                          <div
                            onClick={() =>
                              markAsRead(notif.id)
                            }
                            className="flex-1 cursor-pointer"
                          >

                            <h3 className="text-[14px] font-black text-slate-700 leading-relaxed">

                              {notif.title}

                            </h3>

                            <p className="text-[12px] text-slate-400 font-bold mt-3">

                              {notif.time}

                            </p>

                          </div>

                          <button
                            onClick={() =>
                              deleteNotif(notif.id)
                            }
                            className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500"
                          >

                            <X size={16} />

                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[40px] border shadow-sm mt-10 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[3fr_1fr_1fr_0.8fr_0.8fr_1fr_1fr] px-8 py-6 border-b text-[13px] font-black tracking-[1px] text-slate-400 uppercase">

            <p>Produk</p>
            <p>Kategori</p>
            <p>Harga</p>
            <p>Stok</p>
            <p>Rating</p>
            <p>Status</p>
            <p className="text-center">
              Aksi
            </p>

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
              className="grid grid-cols-[3fr_1fr_1fr_0.8fr_0.8fr_1fr_1fr] items-center px-8 py-6 border-b hover:bg-slate-50 duration-300"
            >

              {/* PRODUCT */}
              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover border"
                />

                <div>

                  <h3 className="font-black text-slate-900 text-[17px] uppercase leading-none">

                    {item.name}

                  </h3>

                  <p className="text-slate-400 text-sm mt-2">

                    ID: {item.id}

                  </p>

                </div>

              </div>

              {/* CATEGORY */}
              <div>

                <p className="font-black tracking-[2px] text-slate-600 text-sm uppercase">

                  {item.category}

                </p>

              </div>

              {/* PRICE */}
              <div>

                <p className="font-black text-slate-900">

                  {item.price}

                </p>

              </div>

              {/* STOCK */}
              <div>

                <p className="font-semibold text-slate-500">

                  {item.stock}

                </p>

              </div>

              {/* RATING */}
              <div className="flex items-center gap-2">

                <Star
                  size={14}
                  className="fill-orange-400 text-orange-400"
                />

                <p className="font-black text-orange-500">

                  {item.rating}

                </p>

              </div>

              {/* STATUS */}
              <div>

                <span
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-[2px] ${
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
                    onClick={() =>
                      toggleStatus(item.id)
                    }
                    className="bg-red-50 text-red-500 px-6 h-11 rounded-2xl font-black tracking-[1px] hover:bg-red-100 duration-300"
                  >

                    TAHAN PRODUK

                  </button>
                ) : (
                  <button
                    onClick={() =>
                      toggleStatus(item.id)
                    }
                    className="bg-emerald-100 text-emerald-600 px-6 h-11 rounded-2xl font-black tracking-[1px] hover:bg-emerald-200 duration-300"
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