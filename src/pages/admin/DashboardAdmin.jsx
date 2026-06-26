import {
  ShoppingBag,
  Users,
  Package,
  Bell,
  Search,
  TrendingUp,
  Download,
  Star,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

const COLORS = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

function DashboardAdmin() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const notifRef = useRef();
  const downloadRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const [chartMounted, setChartMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= STATE =================
  const [stats, setStats] = useState({
    jumlah_user: 0,
    jumlah_penjual: 0,
    jumlah_produk: 0,
    jumlah_pesanan: 0,
    total_transaksi: 0,
    pesanan_menunggu: 0,
    pesanan_selesai: 0,
    rata_rata_rating: 0,
  });

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifikasi");
        const data = (response.data.data || []).map((n) => ({
          ...n,
          read: n.sudah_dibaca || false,
          time: n.created_at
            ? new Date(n.created_at).toLocaleString()
            : "Baru saja",
          message: n.pesan || n.judul,
        }));
        setNotifications(data);
      } catch (error) {
        console.warn("⚠️ Notifikasi belum tersedia");
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ================= 1. STATISTIK ADMIN =================
        try {
          const statsRes = await api.get("/statistik/admin");
          console.log("📊 Stats response:", statsRes.data);
          const statsData = statsRes.data.data || {};

          setStats({
            jumlah_user: statsData.jumlah_user || 0,
            jumlah_penjual: statsData.jumlah_penjual || 0,
            jumlah_produk: statsData.jumlah_produk || 0,
            jumlah_pesanan: statsData.jumlah_pesanan || 0,
            total_transaksi: statsData.total_transaksi || 0,
            pesanan_menunggu: statsData.pesanan_menunggu || 0,
            pesanan_selesai: statsData.pesanan_selesai || 0,
            rata_rata_rating: statsData.rata_rata_rating || 0,
          });
        } catch (err) {
          console.error("❌ Gagal fetch statistik:", err);
        }

        // ================= 2. USERS =================
        try {
          const usersRes = await api.get("/pengguna?limit=5");
          const usersData = usersRes.data.data.data || [];
          setUsers(
            usersData
              .filter((user) => user.role !== "admin")
              .slice(0, 4)
              .map((user) => ({
                id: user.id_pengguna,
                name: user.nama || "User",
                role:
                  user.role === "pembeli"
                    ? "PEMBELI"
                    : user.role === "penjual"
                      ? "PENJUAL"
                      : "USER",
                letter: (user.nama || "U").charAt(0).toUpperCase(),
                aktif: user.aktif,
              })),
          );
        } catch (err) {
          console.warn("⚠️ Gagal fetch users:", err);
        }

        // ================= 3. REPORTS =================
        try {
          const reportsRes = await api.get("/laporan?limit=3");
          const reportsData = reportsRes.data.data.data || [];
          setReports(reportsData);
        } catch (err) {
          console.warn("⚠️ Gagal fetch reports:", err);
          setReports([]);
        }

        // ================= 4. ORDERS =================
        try {
          const ordersRes = await api.get("/pesanan");
          console.log("📦 Orders response FULL:", ordersRes.data);

          let orders = [];
          if (ordersRes.data?.data) {
            orders = ordersRes.data.data;
          } else if (Array.isArray(ordersRes.data)) {
            orders = ordersRes.data;
          }
          console.log("📦 Orders processed:", orders.length, "orders");

          // 🔥 MONTHLY REVENUE
          const monthlySales = {};
          const now = new Date();
          for (let i = 0; i < 6; i++) {
            const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = month.toLocaleString("id-ID", {
              month: "short",
              year: "numeric",
            });
            monthlySales[key] = 0;
          }

          orders.forEach((order) => {
            if (order.status === "selesai") {
              const date = new Date(order.created_at);
              const key = date.toLocaleString("id-ID", {
                month: "short",
                year: "numeric",
              });
              if (monthlySales[key] !== undefined) {
                monthlySales[key] += Number(order.harga_akhir || 0);
              }
            }
          });

          const monthlyArray = Object.keys(monthlySales)
            .map((key) => ({ bulan: key, total: monthlySales[key] }))
            .reverse();
          console.log("📊 Monthly revenue:", monthlyArray);
          setMonthlyRevenue(monthlyArray);

          // 🔥 ORDER STATUS
          const statusCount = {};
          orders.forEach((order) => {
            const status = order.status || "menunggu";
            statusCount[status] = (statusCount[status] || 0) + 1;
          });
          const statusData = Object.keys(statusCount).map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: statusCount[key],
          }));
          console.log("📊 Order status:", statusData);
          setOrderStatusData(statusData);

          // 🔥 RECENT ACTIVITIES
          const recent = orders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map((order) => ({
              id: order.id_pesanan,
              customer: order.nama_penerima || "Customer",
              status: order.status || "Menunggu",
              total: order.harga_akhir || 0,
              date: new Date(order.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));
          console.log("🕐 Recent activities:", recent);
          setRecentActivities(recent);
        } catch (err) {
          console.error("❌ Error fetching orders:", err);
        }

        // ================= 5. TOP PRODUCTS =================
        try {
          const topProductsRes = await api.get("/produk?limit=100");
          console.log("🏆 Top products response:", topProductsRes.data);

          let products = [];
          if (topProductsRes.data?.data?.data) {
            products = topProductsRes.data.data.data;
          } else if (topProductsRes.data?.data) {
            products = topProductsRes.data.data;
          } else if (Array.isArray(topProductsRes.data)) {
            products = topProductsRes.data;
          }

          const sorted = [...products]
            .sort((a, b) => (b.total_terjual || 0) - (a.total_terjual || 0))
            .slice(0, 5)
            .map((p) => ({
              name: p.nama_produk || "Produk",
              terjual: p.total_terjual || 0,
            }));
          console.log("🏆 Top products sorted:", sorted);
          setTopProducts(sorted);
        } catch (err) {
          console.warn("⚠️ Gagal fetch top products:", err);
          setTopProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setChartMounted(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= DOWNLOAD =================
  const downloadExcel = () => {
    const content = `LAPORAN BELANJAIN
TOTAL USER : ${stats.jumlah_user}
TOTAL PENJUAL : ${stats.jumlah_penjual}
TOTAL PRODUK : ${stats.jumlah_produk}
TOTAL PESANAN : ${stats.jumlah_pesanan}
TOTAL PENDAPATAN : Rp ${stats.total_transaksi.toLocaleString("id-ID")}`;
    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-belanjain-${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const content = `RINGKASAN PDF BELANJAIN
TOTAL USER : ${stats.jumlah_user}
TOTAL PENJUAL : ${stats.jumlah_penjual}
TOTAL PRODUK : ${stats.jumlah_produk}
TOTAL PESANAN : ${stats.jumlah_pesanan}
TOTAL PENDAPATAN : Rp ${stats.total_transaksi.toLocaleString("id-ID")}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ringkasan-belanjain-${new Date().toISOString().split("T")[0]}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // ================= HELPERS =================
  const formatPrice = (value) => {
    if (!value || value === 0) return "Rp 0";
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("diproses")) return "bg-blue-100 text-blue-700";
    if (s.includes("dikirim")) return "bg-purple-100 text-purple-700";
    if (s.includes("selesai")) return "bg-green-100 text-green-700";
    if (s.includes("dibatalkan")) return "bg-red-100 text-red-700";
    if (s.includes("komplain")) return "bg-pink-100 text-pink-700";
    return "bg-slate-100 text-slate-700";
  };

  // ================= RENDER CHARTS =================
  const renderRevenueChart = () => {
    if (
      !monthlyRevenue ||
      monthlyRevenue.length === 0 ||
      monthlyRevenue.every((d) => d.total === 0)
    ) {
      return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <div className="text-4xl mb-4">📊</div>
          <p className="font-semibold">Belum ada data pendapatan</p>
          <p className="text-sm">
            Data akan muncul setelah ada transaksi selesai
          </p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="bulan" stroke="#94A3B8" fontSize={11} />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            tickFormatter={(v) => `Rp${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip formatter={(v) => formatPrice(v)} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderTopProductsChart = () => {
    if (
      !topProducts ||
      topProducts.length === 0 ||
      topProducts.every((p) => p.terjual === 0)
    ) {
      return (
        <div className="text-center text-slate-400 py-8">
          <div className="text-3xl mb-2">🏪</div>
          <p className="font-semibold">Belum ada produk terjual</p>
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={topProducts} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10 }}
            width={60}
          />
          <Tooltip formatter={(v) => [`${v} terjual`, "Jumlah"]} />
          <Bar dataKey="terjual" fill="#3B82F6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    if (!orderStatusData || orderStatusData.length === 0) {
      return (
        <div className="text-center text-slate-400 py-4">
          <p className="font-semibold">Tidak ada data status</p>
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={65}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {orderStatusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statsCards = [
    {
      title: "Total User",
      value: stats.jumlah_user || 0,
      icon: <Users size={22} />,
    },
    {
      title: "Total Penjual",
      value: stats.jumlah_penjual || 0,
      icon: <Users size={22} />,
    },
    {
      title: "Total Produk",
      value: stats.jumlah_produk || 0,
      icon: <Package size={22} />,
    },
    {
      title: "Total Pesanan",
      value: stats.jumlah_pesanan || 0,
      icon: <ShoppingBag size={22} />,
    },
    {
      title: "Pendapatan",
      value: formatPrice(stats.total_transaksi || 0),
      icon: <TrendingUp size={22} />,
    },
    {
      title: "Rating",
      value: stats.rata_rata_rating
        ? `⭐ ${Number(stats.rata_rata_rating).toFixed(1)}`
        : "⭐ 0",
      icon: <Star size={22} />,
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] px-7 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-black text-slate-900">
              Dashboard Admin
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="h-[44px] px-4 rounded-[16px] bg-[#eef6ff] border border-blue-200 text-blue-700 font-semibold flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Download <ChevronDown size={14} />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-36 rounded-[18px] border bg-white shadow-lg py-2">
                  <button
                    onClick={downloadExcel}
                    className="w-full px-4 py-2 text-left hover:bg-slate-100 text-sm"
                  >
                    📊 Excel
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="w-full px-4 py-2 text-left hover:bg-slate-100 text-sm"
                  >
                    📄 PDF
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white border h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari sesuatu..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border flex items-center justify-center shadow-sm"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <ModalNotfications
                open={showNotif}
                onClose={() => setShowNotif(false)}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
          {statsCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] border p-5 shadow-sm"
            >
              <p className="text-[10px] font-black tracking-[2px] uppercase text-slate-400">
                {item.title}
              </p>
              <h2 className="text-[28px] font-black text-slate-900 mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHART + STATUS */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 xl:col-span-8 bg-white rounded-[34px] border p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-slate-900">
              📈 Statistik Pendapatan Kumulatif
            </h2>
            <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-1">
              6 Bulan Terakhir
            </p>
            {renderRevenueChart()}
          </div>
          <div className="col-span-12 xl:col-span-4 bg-white rounded-[34px] border p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-slate-900 mb-4">
              📊 Status Pesanan
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Menunggu</span>
                <span className="font-black text-yellow-600">
                  {stats.pesanan_menunggu || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Selesai</span>
                <span className="font-black text-green-600">
                  {stats.pesanan_selesai || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Total Pesanan</span>
                <span className="font-black text-blue-600">
                  {stats.jumlah_pesanan || 0}
                </span>
              </div>
            </div>
            {renderPieChart()}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          <div className="col-span-12 xl:col-span-4 bg-white rounded-[34px] border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-black text-slate-900">
                🏆 Produk Terlaris
              </h2>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-blue-600 text-[12px] font-black"
              >
                LIHAT SEMUA
              </button>
            </div>
            {renderTopProductsChart()}
          </div>
          <div className="col-span-12 xl:col-span-4 bg-white rounded-[34px] border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-black text-slate-900">
                👤 User Baru
              </h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-blue-600 text-[12px] font-black"
              >
                LIHAT SEMUA
              </button>
            </div>
            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
              {users.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  Belum ada user
                </div>
              ) : (
                users.map((user, index) => (
                  <div
                    key={user.id || index}
                    className="bg-[#f8fafc] rounded-[22px] p-3 flex items-center justify-between hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#edf3ff] flex items-center justify-center text-blue-600 font-black text-sm">
                        {user.letter || "U"}
                      </div>
                      <div>
                        <h3 className="font-black text-[13px] text-slate-900 truncate max-w-[120px]">
                          {user.name || "User"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {user.role || "USER"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${user.aktif !== false ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="col-span-12 xl:col-span-4 bg-white rounded-[34px] border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[18px] font-black text-slate-900">
                📋 Laporan Terbaru
              </h2>
              <button
                onClick={() => navigate("/admin/reports")}
                className="text-blue-600 text-[12px] font-black"
              >
                LIHAT SEMUA
              </button>
            </div>
            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
              {reports.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  Belum ada laporan
                </div>
              ) : (
                reports.slice(0, 3).map((report, index) => (
                  <div
                    key={report.id_laporan || index}
                    className="bg-[#f8fafc] rounded-[22px] p-3 flex items-center justify-between border border-slate-200 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-[16px] font-black shrink-0">
                        !
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 text-[12px] uppercase leading-tight truncate max-w-[120px]">
                          {report.alasan?.substring(0, 25) || "Laporan"}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 mt-0.5">
                          Status: {report.status || "Menunggu"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-xl text-[9px] font-black whitespace-nowrap ${getStatusColor(report.status)}`}
                    >
                      {report.status || "MENUNGGU"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ACTIVITIES */}
        <div className="bg-white rounded-[34px] border p-6 shadow-sm mt-6">
          <h2 className="text-[18px] font-black text-slate-900 mb-4">
            🕐 Aktivitas Terbaru
          </h2>
          {recentActivities.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <div className="text-4xl mb-3">🕐</div>
              <p className="font-semibold">Belum ada aktivitas</p>
              <p className="text-sm">
                Aktivitas akan muncul setelah ada transaksi
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900 text-sm">
                        #{item.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 text-sm truncate max-w-[100px]">
                        {item.customer}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 text-sm">
                        {formatPrice(item.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[9px] font-black ${getStatusColor(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;
