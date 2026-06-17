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
import ModalNotifications from "../../components/seller/ModalNotifications";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/users";
import { products } from "../../data/products";
import SellerLayout from "../../layouts/SellerLayout";
import { orders } from "../../data/orders";
import { sales } from "../../data/sales";
import { notifications as defaultNotifications } from "../../data/notifications";
function DashboardSeller() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  const seller =
    users.find(
      (user) => user.id === currentUser?.id && user.role === "seller",
    ) || (currentUser?.role === "seller" ? currentUser : null);

  if (!seller) {
    return (
      <SellerLayout>
        <div className="p-10">Seller tidak ditemukan atau belum login.</div>
      </SellerLayout>
    );
  }
  console.log("Current User:", currentUser);
  console.log("Seller:", seller);
  const sellerOrders = orders.filter((order) => order.sellerId === seller?.id);

  const sellerSales = sales.find((sale) => sale.sellerId === seller?.id);

  const sellerNotifications =
    JSON.parse(localStorage.getItem(`sellerNotifications_${seller?.id}`)) ??
    defaultNotifications.filter((notif) => notif.sellerId === seller?.id);
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
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setAnimateChart(false);

    setTimeout(() => {
      setAnimateChart(true);
    }, 100);
  }, [chartFilter]);

  const [showChartFilter, setShowChartFilter] = useState(false);

  const sellerProducts = products.filter(
    (product) => product.sellerId === seller?.id,
  );

  const stats = [
    {
      title: "TOTAL PRODUK",
      value: sellerProducts.length,
      icon: <Package size={22} />,
      color: "bg-blue-100 text-blue-600",
    },

    {
      title: "TOTAL PESANAN",
      value: sellerOrders.length,
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-100 text-orange-500",
    },

    {
      title: "TOTAL PENJUALAN",
      value: `Rp ${(
        (sellerSales?.weekly?.reduce((sum, item) => sum + item.amount, 0) ||
          0) / 1000000
      ).toFixed(1)} Jt`,
      icon: <DollarSign size={22} />,
      color: "bg-red-100 text-red-500",
    },

    {
      title: "PESANAN BARU",
      value: sellerOrders.filter(
        (order) => order.status === "MENUNGGU PEMBAYARAN",
      ).length,
      icon: <Bell size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];
  const [stocks, setStocks] = useState(
    sellerProducts
      .filter((product) => product.stock <= 10)
      .map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
      })),
  );
  const filteredOrders = useMemo(() => {
    return sellerOrders.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.customer.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [search, sellerOrders]);

  const handleStockPlus = (name) => {
    setStocks((prev) =>
      prev.map((item) =>
        item.name === name
          ? {
              ...item,
              stock: item.stock + 10,
            }
          : item,
      ),
    );
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailOrder(true);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "MENUNGGU PEMBAYARAN":
        return "bg-orange-100 text-orange-500";

      case "DIPROSES":
        return "bg-purple-100 text-purple-500";

      case "DIKIRIM":
        return "bg-blue-100 text-blue-500";

      case "SELESAI":
        return "bg-emerald-100 text-emerald-500";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };
  const selectedProduct = products.find(
    (product) => product.id === selectedOrder?.productId,
  );
  const chartData =
    chartFilter === "Mingguan"
      ? sellerSales?.weekly || []
      : sellerSales?.monthly || [];
  const maxAmount = Math.max(...chartData.map((item) => item.amount), 1000000);
  const points = chartData.map((item, index) => {
    const x = (index / (chartData.length - 1)) * 1000;

    const y = 280 - (item.amount / maxAmount) * 240;

    return { x, y };
  });

  const linePath = points.reduce((path, point, index, arr) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const prev = arr[index - 1];

    const cx = (prev.x + point.x) / 2;

    return `${path}
      C ${cx} ${prev.y},
        ${cx} ${point.y},
        ${point.x} ${point.y}`;
  }, "");
  const areaPath =
    linePath +
    ` L 1000 320
    L 0 320 Z`;

  const pathLength = 3000;
  const formatPrice = (price) => `Rp ${Number(price).toLocaleString("id-ID")}`;
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
                  <h2 className="text-[26px] font-black uppercase text-[#0f172a] leading-none">
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
                      className={`inline-flex mt-3 px-3 py-1 rounded-full text-[15px] font-semibold  ${selectedOrder.color}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Tanggal
                    </p>

                    <h3 className="font-semibold  text-slate-900 mt-3">
                      {selectedOrder.date}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                      Info Pelanggan
                    </p>

                    <h3 className="font-semibold text-slate-900 mt-2">
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
                        src={selectedProduct?.image}
                        alt={selectedProduct?.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-sm text-slate-900">
                          {selectedProduct?.name}
                        </h3>

                        <p className="text-[11px] font-black text-slate-400 mt-1">
                          JUMLAH : {selectedOrder.qty}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      Rp {Number(selectedOrder.total).toLocaleString("id-ID")}
                    </h3>
                  </div>
                </div>

                <div className="mt-5 bg-[#0f172a] rounded-[28px] p-5 text-white">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      Rp {Number(selectedOrder.total).toLocaleString("id-ID")}
                    </span>
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
                      Rp {Number(selectedOrder.total).toLocaleString("id-ID")}
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
            <h1 className="text-[25px] font-black uppercase text-[#111827] leading-none">
              Ringkasan Toko
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Selamat datang kembali, {seller?.storeName || seller?.name}
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

                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {sellerNotifications.length}
                </span>
              </button>

              {showNotif && (
                <ModalNotifications
                  notifications={sellerNotifications}
                  onReadAll={() => {
                    console.log("Read all");
                  }}
                />
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
                <h2 className="text-[22px] font-black text-[#111827]">
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
                {[4, 3, 2, 1, 0].map((i) => (
                  <span key={i}>
                    Rp {((maxAmount * i) / 4 / 1000000).toFixed(1)}jt
                  </span>
                ))}
              </div>

              {/* SVG */}
              <div className="absolute inset-0 pl-16 pr-4 pt-2">
                <svg
                  key={chartFilter}
                  viewBox="0 0 1000 320"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity="0.25"
                      />

                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* AREA */}
                  <path d={areaPath} fill="url(#salesGradient)" opacity="0">
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="1.2s"
                      fill="freeze"
                    />
                  </path>

                  {/* GARIS */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from={pathLength}
                      to="0"
                      dur="1.5s"
                      fill="freeze"
                    />
                  </path>

                  {/* TITIK */}
                  {points.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="0"
                      fill="#2563eb"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <animate
                        attributeName="r"
                        from="0"
                        to="6"
                        begin={`${index * 0.15}s`}
                        dur="0.3s"
                        fill="freeze"
                      />
                    </circle>
                  ))}
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
                {chartData.map((item, index) => (
                  <span key={index}>{item.day || item.month}</span>
                ))}
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
                <h2 className="font-black text-slate-900">Stok Menipis</h2>
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
              <h2 className="text-[22px] font-black text-[#111827]">
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
                    <td className="px-6 py-5 font-medium text-slate-900">
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

                    <td className="px-6 py-5 font-medium text-slate-900">
                      Rp {Number(item.total).toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(item.status)}`}
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
                          <Eye size={16} className="text-slate-500" />
                        </button>

                        <button
                          onClick={() => navigate("/seller/chat")}
                          className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"
                        >
                          <MessageSquare size={16} className="text-blue-600" />
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
