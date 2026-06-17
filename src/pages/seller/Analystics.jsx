import {
  TrendingUp,
  Star,
  Eye,
  MessageSquare,
  Sparkles,
  Download,
  Plus,
  Search,
  Bell,
  X,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orders as ordersData } from "../../data/orders";
import { products } from "../../data/products";
import { sales } from "../../data/sales";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { notifications as defaultNotifications } from "../../data/notifications";
function AnalyticsSeller() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [animateChart, setAnimateChart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const sellerNotifications =
    JSON.parse(
      localStorage.getItem(`sellerNotifications_${currentUser?.id}`),
    ) ??
    defaultNotifications.filter((notif) => notif.sellerId === currentUser?.id);

  const getStatusColor = (status) => {
    switch (status) {
      case "MENUNGGU PEMBAYARAN":
        return "bg-orange-100 text-orange-600";
      case "DIPROSES":
        return "bg-purple-100 text-purple-700";
      case "DIKIRIM":
        return "bg-blue-100 text-blue-600";
      case "SELESAI":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const sellerOrders = useMemo(() => {
    const normalized = ordersData.map((order) => ({
      ...order,
      totalNumber: Number(order.total || 0),
      qty: order.qty || 1,
    }));

    return currentUser?.role === "seller"
      ? normalized.filter((order) => order.sellerId === currentUser.id)
      : normalized;
  }, [currentUser]);

  const reports = useMemo(
    () =>
      sellerOrders.map((order) => {
        const product =
          products.find((item) => item.id === order.productId) || {};
        return {
          ...order,
          customer: order.customer || "-",
          productName: product.name || "Produk tidak ditemukan",
          productImage:
            product.image ||
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
          productCategory: product.category || "-",
          productStore: product.store || "-",
          statusColor: getStatusColor(order.status),
          totalLabel: `Rp ${Number(order.total || 0).toLocaleString("id-ID")}`,
          detailTitle: product.name || "Produk tidak ditemukan",
        };
      }),
    [sellerOrders],
  );

  const filteredReports = useMemo(
    () =>
      reports.filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
          item.id.toLowerCase().includes(term) ||
          item.customer.toLowerCase().includes(term) ||
          item.productName.toLowerCase().includes(term) ||
          item.status.toLowerCase().includes(term)
        );
      }),
    [reports, searchTerm],
  );

  const sellerSales = useMemo(
    () =>
      sales.find((item) => item.sellerId === currentUser?.id) || { weekly: [] },
    [currentUser],
  );

  const chartData = useMemo(
    () =>
      sellerSales.weekly.map((item) => ({
        day: item.day,
        amount: Number(item.amount || 0),
      })),
    [sellerSales],
  );

  const maxChartValue = Math.max(
    ...chartData.map((item) => item.amount),
    1000000,
  );

  const points = chartData.map((item, index) => {
    const x = (index / Math.max(chartData.length - 1, 1)) * 1000;
    const y = 280 - (item.amount / maxChartValue) * 240;
    return { ...item, x, y };
  });

  const linePath = points.reduce((path, point, index, arr) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const prev = arr[index - 1];
    const cx = (prev.x + point.x) / 2;

    return `${path} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const areaPath = `${linePath} L 1000 320 L 0 320 Z`;

  const pathLength = 3000;

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (value) =>
    `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

  const formatDate = (value) =>
    new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleDownloadReport = () => {
    const headers = ["ID Pesanan", "Pelanggan", "Tanggal", "Total", "Status"];
    const rows = reports.map((item) => [
      item.id,
      item.customer,
      item.date,
      item.totalLabel,
      item.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-penjualan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SellerLayout>
      <div className="max-w-[1600px] mx-auto min-h-screen bg-[#f6f8fc] p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between mb-6">
          <div>
            <h1 className="text-[34px] xl:text-[25px] font-black uppercase text-slate-900 leading-none">
              Analitik Penjualan
            </h1>
            <p className="text-slate-400 text-sm mt-2 uppercase tracking-[2px] font-black">
              Lihat data mendalam tentang performa bisnis anda.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px] h-11 rounded-2xl bg-white border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-slate-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center relative"
                >
                  <Bell size={18} className="text-slate-500" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {sellerNotifications.length}
                  </span>
                </button>
                {showNotif && (
                  <ModalNotifications
                    notifications={sellerNotifications}
                    onReadAll={() => setShowNotif(false)}
                  />
                )}
              </div>
              <button
                onClick={() => navigate("/seller/add-product")}
                className="h-11 px-5 rounded-2xl bg-blue-600 text-white text-[12px] font-black shadow-lg hover:bg-blue-700 duration-300"
              >
                + PRODUK BARU
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-[22px] font-black text-slate-900">
                    Performa Penjualan
                  </h2>
                  <p className="text-slate-400 text-sm uppercase tracking-[1px] mt-1">
                    Grafik pendapatan 7 hari terakhir
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <Plus size={18} />
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="w-11 h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-500 flex items-center justify-center"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-8 relative h-[320px]">
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="border-t border-dashed border-slate-200"
                    />
                  ))}
                </div>

                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[12px] font-black text-slate-400 z-10 pl-4">
                  <span>{formatPrice(Math.round(maxChartValue * 1))}</span>
                  <span>{formatPrice(Math.round(maxChartValue * 0.8))}</span>
                  <span>{formatPrice(Math.round(maxChartValue * 0.6))}</span>
                  <span>{formatPrice(Math.round(maxChartValue * 0.4))}</span>
                  <span>{formatPrice(Math.round(maxChartValue * 0.2))}</span>
                  <span>{formatPrice(0)}</span>
                </div>

                <div className="absolute inset-0 left-[96px] right-4 top-4 bottom-12 z-20">
                  <svg
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
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path d={areaPath} fill="url(#salesGradient)" opacity="0">
                      <animate
                        attributeName="opacity"
                        from="0"
                        to="1"
                        dur="1.2s"
                        fill="freeze"
                      />
                    </path>

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

                    {points.map((point, index) => (
                      <circle
                        key={point.day}
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

                <div className="absolute bottom-0 left-[96px] right-4 flex items-center justify-between px-1 text-[13px] font-black text-slate-400 uppercase">
                  {chartData.map((item) => (
                    <span key={item.day} className="block text-center flex-1">
                      {item.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
              <h2 className="text-[22px] font-black text-slate-900">
                Distribusi Kategori
              </h2>
              <div className="grid grid-cols-2 gap-5 mt-8">
                {[
                  {
                    name: "ELEKTRONIK",
                    percent: "45%",
                    width: "45%",
                    color: "bg-blue-500",
                  },
                  {
                    name: "FASHION",
                    percent: "25%",
                    width: "25%",
                    color: "bg-pink-500",
                  },
                  {
                    name: "RUMAH TANGGA",
                    percent: "20%",
                    width: "20%",
                    color: "bg-orange-500",
                  },
                  {
                    name: "LAINNYA",
                    percent: "10%",
                    width: "10%",
                    color: "bg-emerald-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-slate-900">{item.name}</h3>
                      <span className="font-black text-slate-500">
                        {item.percent}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 mt-5 overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] p-6 text-white relative overflow-hidden h-[220px]">
              <div className="absolute right-4 top-4 opacity-10">
                <Star size={130} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Star size={20} />
              </div>
              <h2 className="text-3xl font-black mt-3">SKOR TOKO</h2>
              <p className="uppercase text-sm font-bold opacity-80 mt-2">
                Peringkat 5% Teratas
              </p>
              <div className="mt-4 flex items-end gap-2">
                <h1 className="text-3xl font-black">4.9</h1>
                <span className="mb-3 font-black">/ 5.0</span>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-4 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Saran AI</h2>
              <div className="mt-6 flex flex-col gap-3">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-3 flex items-start gap-3">
                  <Sparkles className="text-orange-500 mt-1" size={18} />
                  <div>
                    <h3 className="font-black text-orange-600">
                      Optimalkan Stock
                    </h3>
                    <p className="text-sm text-orange-500 mt-1">
                      Tambah stok produk fashion terlaris karena tren naik.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 flex items-start gap-3">
                  <TrendingUp className="text-blue-500 mt-1" size={18} />
                  <div>
                    <h3 className="font-black text-blue-600">
                      Promosi Flash Sale
                    </h3>
                    <p className="text-sm text-blue-500 mt-1">
                      Aktifkan promo malam hari untuk meningkatkan konversi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-x-auto">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-[22px] font-black text-slate-900">
              Laporan Penjualan Detail
            </h2>
            <p className="text-slate-400 text-sm uppercase font-bold mt-1">
              Lacak semua pendapatan masuk dari pesanan
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[2px] text-slate-400">
                <th className="px-7 py-5">ID PESANAN</th>
                <th className="px-7 py-5">PELANGGAN</th>
                <th className="px-7 py-5">TANGGAL</th>
                <th className="px-7 py-5">TOTAL PENJUALAN</th>
                <th className="px-7 py-5">STATUS</th>
                <th className="px-7 py-5 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50 duration-300"
                >
                  <td className="px-7 py-5 font-black text-slate-900">
                    {item.id}
                  </td>
                  <td className="px-7 py-5 font-semibold text-slate-700">
                    {item.customer}
                  </td>
                  <td className="px-7 py-5 text-slate-500 font-semibold">
                    {item.date}
                  </td>
                  <td className="px-7 py-5 font-black text-slate-900">
                    {item.totalLabel}
                  </td>
                  <td className="px-7 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-7 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(item)}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 duration-300 flex items-center justify-center"
                      >
                        <Eye size={16} className="text-slate-500" />
                      </button>
                      <button
                        onClick={() => navigate("/seller/chat")}
                        className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 duration-300 flex items-center justify-center"
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

        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Detail Pesanan
                  </p>
                  <h2 className="text-2xl font-black text-slate-900">
                    ID Pesanan: {selectedOrder.id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">
                    Status Pesanan
                  </p>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-black ${selectedOrder.statusColor}`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">
                    Tanggal Pemesanan
                  </p>
                  <p className="font-black text-slate-900">
                    {formatDate(selectedOrder.date)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">
                    Info Pelanggan
                  </p>
                  <p className="font-black text-slate-900">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    ID Pengguna: {selectedOrder.id}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-3">
                    Alamat Pengiriman
                  </p>
                  <p className="font-black text-slate-900">
                    {selectedOrder.address || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[32px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    className="w-24 h-24 rounded-[24px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                      {selectedOrder.productName}
                    </p>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400 mt-2">
                      Jumlah: {selectedOrder.qty}x
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      {selectedOrder.totalLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[32px] bg-slate-900 p-6 text-white">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                      Subtotal
                    </p>
                    <p className="font-black text-base">
                      {selectedOrder.totalLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                      Ongkos Kirim
                    </p>
                    <p className="font-black text-base">Rp 0</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                      Total Pembayaran
                    </p>
                    <p className="font-black text-xl">
                      {selectedOrder.totalLabel}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.15em]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

export default AnalyticsSeller;
