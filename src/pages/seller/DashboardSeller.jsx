import {
  DollarSign,
  ShoppingBag,
  Package,
  Bell,
  Plus,
  Eye,
  MessageSquare,
  AlertCircle,
  Search,
  ChevronDown,
  X,
  Upload,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerLayout from "../../layouts/SellerLayout";

function DashboardSeller() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [showDetailOrder, setShowDetailOrder] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    brand: "",
    description: "",
    file: null,
  });
  const [chartFilter, setChartFilter] = useState("Mingguan");

const [showChartFilter, setShowChartFilter] = useState(false);

  const stats = [
    {
      title: "TOTAL PRODUK",
      value: "3",
      growth: "+12%",
      icon: <Package size={22} />,
      color: "bg-blue-100 text-blue-600",
    },

    {
      title: "TOTAL PESANAN",
      value: "856",
      growth: "+8%",
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-100 text-orange-500",
    },

    {
      title: "TOTAL PENJUALAN",
      value: "Rp 42.5JT",
      growth: "+15%",
      icon: <DollarSign size={22} />,
      color: "bg-red-100 text-red-500",
    },

    {
      title: "PESANAN BARU",
      value: "12",
      growth: "-2%",
      icon: <Bell size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const orders = [
    {
      id: "ORD-001",
      customer: "Budi Santoso",
      total: "Rp 18.999.000",
      date: "2026-03-31",
      status: "MENUNGGU PEMBAYARAN",
      color: "bg-orange-100 text-orange-500",
      address: "Jl. Sudirman No. 123, Jakarta Pusat",
      product: "IPHONE 15 PRO MAX - 256GB TITANIUM",
      qty: "1X",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600",
    },

    {
      id: "ORD-002",
      customer: "Siti Aminah",
      total: "Rp 4.599.000",
      date: "2026-03-30",
      status: "DIKIRIM",
      color: "bg-blue-100 text-blue-500",
      address: "Bandung",
      product: "SONY WH1000XM5",
      qty: "1X",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
    },

    {
      id: "ORD-003",
      customer: "Andi Wijaya",
      total: "Rp 16.499.000",
      date: "2026-03-29",
      status: "SELESAI",
      color: "bg-emerald-100 text-emerald-500",
      address: "Surabaya",
      product: "MACBOOK AIR M3",
      qty: "1X",
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=600",
    },

    {
      id: "ORD-004",
      customer: "Dewi Lestari",
      total: "Rp 199.000",
      date: "2026-03-28",
      status: "DIPROSES",
      color: "bg-purple-100 text-purple-500",
      address: "Bekasi",
      product: "LOGITECH MX MASTER 3S",
      qty: "1X",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600",
    },
  ];

const [stocks, setStocks] = useState([
  {
    name: "IPHONE 15 PRO MAX - 256GB TITANIUM",
    stock: 50,
  },
  {
    name: "SONY WH-1000XM5",
    stock: 55,
  },
  {
    name: "LOGITECH MX MASTER 3S",
    stock: 63,
  },
]);

  const notifications = [
    "Pesanan baru masuk dari Budi Santoso",
    "Produk Sony berhasil ditambahkan",
    "Pesanan ORD-002 sedang dikirim",
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.customer.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.product.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

const handleStockPlus = (name) => {
  setStocks((prev) =>
    prev.map((item) =>
      item.name === name
        ? {
            ...item,
            stock: item.stock + 10,
          }
        : item
    )
  );
};

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailOrder(true);
  };

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6 relative">
        {/* MODAL TAMBAH PRODUK */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[560px] bg-white rounded-[36px] shadow-2xl overflow-hidden">
              {/* HEADER */}
              <div className="p-7 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h2 className="text-[34px] font-black text-[#0f172a] uppercase leading-none">
                    + Tambah Produk
                  </h2>

                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                    Lengkapi informasi produk anda
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProduct(false)}
                  className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* BODY */}
              <div className="p-7 grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Nama Produk
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: iPhone 15 Pro Max"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Harga
                  </label>

                  <input
                    type="number"
                    placeholder="0"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Kategori
                  </label>

                  <select
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Pilih Kategori</option>
                    <option>Elektronik</option>
                    <option>Fashion</option>
                    <option>Gaming</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Stock
                  </label>

                  <input
                    type="number"
                    placeholder="0"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>

                {/* FILE */}
                <div className="col-span-2">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Gambar Produk Url / Upload File
                  </label>

                  <div className="flex gap-3 mt-2">
                    <div className="flex-1 h-12 rounded-2xl border border-slate-200 px-4 flex items-center gap-3">
                      <Upload size={17} className="text-slate-400" />

                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-transparent outline-none text-sm"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            image: e.target.value,
                          })
                        }
                      />
                    </div>

                    <label className="h-12 px-5 rounded-2xl border border-blue-200 text-blue-600 font-black text-sm flex items-center cursor-pointer">
                      PILIH FILE

                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            file: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  </div>

                  {productForm.file && (
                    <p className="text-xs text-slate-500 mt-2">
                      {productForm.file.name}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Merek / Brand
                  </label>

                  <input
                    type="text"
                    placeholder="Contoh: Apple, Sony"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.brand}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        brand: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black tracking-[2px] text-slate-500 uppercase">
                    Deskripsi Produk
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Jelaskan detail produk anda..."
                    className="w-full rounded-2xl border border-slate-200 p-4 mt-2 outline-none"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2 flex gap-4 mt-2">
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 h-12 rounded-2xl bg-slate-100 font-black text-slate-600"
                  >
                    BATAL
                  </button>

                  <button
                    onClick={() => {
                      alert("Produk berhasil ditambahkan");
                      setShowAddProduct(false);
                    }}
                    className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-black"
                  >
                    TAMBAH PRODUK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DETAIL ORDER */}
        {showDetailOrder && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-white rounded-[36px] shadow-2xl overflow-hidden">
              <div className="p-7 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-[34px] font-black uppercase text-[#0f172a] leading-none">
                    Detail Pesanan
                  </h2>

                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                    ID Pesanan : {selectedOrder.id}
                  </p>
                </div>

                <button
                  onClick={() => setShowDetailOrder(false)}
                  className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              <div className="p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Status Pesanan
                    </p>

                    <span
                      className={`inline-flex mt-3 px-3 py-1 rounded-full text-[10px] font-black ${selectedOrder.color}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Tanggal
                    </p>

                    <h3 className="font-black text-slate-900 mt-3">
                      {selectedOrder.date}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Info Pelanggan
                    </p>

                    <h3 className="font-black text-slate-900 mt-2">
                      {selectedOrder.customer}
                    </h3>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Alamat
                    </p>

                    <h3 className="font-semibold text-slate-700 mt-2 text-sm">
                      {selectedOrder.address}
                    </h3>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mb-3">
                    Produk Yang Dipesan
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedOrder.image}
                        alt=""
                        className="w-16 h-16 rounded-2xl object-cover"
                      />

                      <div>
                        <h3 className="font-black text-sm text-slate-900 uppercase">
                          {selectedOrder.product}
                        </h3>

                        <p className="text-[11px] font-black text-slate-400 mt-1">
                          JUMLAH : {selectedOrder.qty}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-black text-slate-900">
                      {selectedOrder.total}
                    </h3>
                  </div>
                </div>

                <div className="mt-5 bg-[#0f172a] rounded-[28px] p-5 text-white">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{selectedOrder.total}</span>
                  </div>

                  <div className="flex justify-between text-sm mt-3">
                    <span>Ongkos Kirim</span>
                    <span>Rp 0</span>
                  </div>

                  <div className="border-t border-white/10 mt-5 pt-5 flex justify-between">
                    <span className="font-black text-blue-400 uppercase">
                      Total Pembayaran
                    </span>

                    <span className="font-black text-2xl">
                      {selectedOrder.total}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailOrder(false)}
                  className="w-full h-12 rounded-2xl bg-blue-600 text-white font-black mt-6"
                >
                  TUTUP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
          <div>
            <h1 className="text-[34px] font-black uppercase text-[#111827] leading-none">
              Ringkasan Toko
            </h1>

            <p className="text-[11px] font-black tracking-[2px] uppercase text-slate-400 mt-2">
              Selamat datang kembali, toko hamid jaya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative">
            {/* SEARCH */}
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* NOTIF */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative"
              >
                <Bell size={18} className="text-slate-500" />

                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-14 w-[320px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 z-40">
                  <h3 className="font-black text-slate-900">
                    Notifikasi
                  </h3>

                  <div className="mt-4 flex flex-col gap-3">
                    {notifications.map((notif, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700"
                      >
                        {notif}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON */}
           <button
  onClick={() => navigate("/seller/add-product")}
  className="h-11 px-5 rounded-2xl bg-blue-600 text-white font-black text-[12px] shadow-lg hover:bg-blue-700 duration-300"
>
  + PRODUK BARU
</button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm flex items-center justify-between min-h-[120px]"
            >
              <div>
                <p className="text-[10px] font-black tracking-[2px] uppercase text-slate-400">
                  {item.title}
                </p>

                <h2 className="text-[26px] font-black text-[#111827] mt-2 leading-none break-words">
  {item.value}
</h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-5">
          {/* CHART */}
          <div className="xl:col-span-8 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
  <div>
    <h2 className="text-[30px] font-black text-[#111827]">
      Statistik Penjualan
    </h2>

    <p
      className="
        text-[11px]
        uppercase
        tracking-[2px]
        font-black
        text-slate-400
        mt-1
      "
    >
      7 Hari Terakhir
    </p>
  </div>

  {/* DROPDOWN */}
  <div className="relative">
    <button
      onClick={() => setShowChartFilter(!showChartFilter)}
      className="
        h-10
        px-4
        rounded-xl
        border
        border-blue-200
        text-blue-600
        text-sm
        font-black
        flex
        items-center
        gap-2
        bg-white
      "
    >
      {chartFilter}
      <ChevronDown size={16} />
    </button>

    {showChartFilter && (
      <div
        className="
          absolute
          right-0
          top-12
          w-[140px]
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-xl
          overflow-hidden
          z-40
        "
      >
        {["Mingguan", "Bulanan"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setChartFilter(item);
              setShowChartFilter(false);
            }}
            className={`
              w-full
              px-4
              py-3
              text-left
              text-sm
              font-bold
              duration-200
              ${
                chartFilter === item
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-50 text-slate-700"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    )}
  </div>
</div>

{/* CHART */}
<div className="mt-8 relative h-[320px]">
  {/* GRID */}
  <div className="absolute inset-0 flex flex-col justify-between">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="border-t border-dashed border-slate-200"
      />
    ))}
  </div>

  {/* LABEL */}
  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] text-slate-400 font-semibold">
    <span>Rp 12.0jt</span>
    <span>Rp 9.0jt</span>
    <span>Rp 6.0jt</span>
    <span>Rp 3.0jt</span>
    <span>Rp 0.0jt</span>
  </div>

  {/* SVG */}
  <div className="absolute inset-0 pl-16 pr-4 pt-2">
    <svg
      viewBox="0 0 1000 320"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {/* AREA */}
      <path
        d="
          M0 220
          C80 180 120 170 180 160
          C240 150 290 210 360 190
          C430 170 450 120 520 110
          C590 100 650 150 720 150
          C790 150 860 100 1000 60
          L1000 320
          L0 320
          Z
        "
        fill="#2563eb15"
      />

      {/* LINE */}
      <path
        d="
          M0 220
          C80 180 120 170 180 160
          C240 150 290 210 360 190
          C430 170 450 120 520 110
          C590 100 650 150 720 150
          C790 150 860 100 1000 60
        "
        fill="none"
        stroke="#2563eb"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>

  {/* HARI */}
  <div
    className="
      absolute
      bottom-0
      left-16
      right-4
      flex
      justify-between
      text-[11px]
      text-slate-400
      font-bold
    "
  >
    <span>Sen</span>
    <span>Sel</span>
    <span>Rab</span>
    <span>Kam</span>
    <span>Jum</span>
    <span>Sab</span>
    <span>Min</span>
  </div>
</div>
          </div>

          {/* STOCK */}
          <div className="xl:col-span-4 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={16} className="text-red-500" />
              </div>

              <div>
                <h2 className="font-black text-slate-900">
                  Stok Menipis
                </h2>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4">
              {stocks.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-[11px] font-black uppercase text-slate-900">
                      {item.name}
                    </h3>

                    <p className="text-[10px] uppercase font-black text-red-500 mt-1">
                      Sisa Stock: {item.stock}
                    </p>
                  </div>

                  <button
                    onClick={() => handleStockPlus(item.name)}
                    className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"
                  >
                    <Plus size={17} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/seller/products")}
              className="w-full h-11 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm mt-5"
            >
              LIHAT INVENTARIS
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-5 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-[30px] font-black text-[#111827]">
                Pesanan Terbaru
              </h2>
            </div>

            <button
              onClick={() => navigate("/seller/orders")}
              className="text-blue-600 font-black text-sm"
            >
              LIHAT SEMUA
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                  <th className="px-6 py-5">ID PESANAN</th>
                  <th className="px-6 py-5">PELANGGAN</th>
                  <th className="px-6 py-5">TANGGAL</th>
                  <th className="px-6 py-5">TOTAL</th>
                  <th className="px-6 py-5">STATUS</th>
                  <th className="px-6 py-5 text-center">AKSI</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((item, index) => (
                  <tr key={index} className="border-t border-slate-100">
                    <td className="px-6 py-5 font-black text-slate-900">
                      {item.id}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                          {item.customer[0]}
                        </div>

                        <span className="font-semibold text-slate-700">
                          {item.customer}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-500 font-semibold">
                      {item.date}
                    </td>

                    <td className="px-6 py-5 font-black text-slate-900">
                      {item.total}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${item.color}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openOrderDetail(item)}
                          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
                        >
                          <Eye
                            size={16}
                            className="text-slate-500"
                          />
                        </button>

                        <button
                          onClick={() =>
                            navigate("/seller/chat")
                          }
                          className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"
                        >
                          <MessageSquare
                            size={16}
                            className="text-blue-600"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default DashboardSeller;