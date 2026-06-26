// src/pages/seller/DashboardSeller.jsx
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
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  TrendingDown,
  Minus,
} from "lucide-react";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
import api from "../../api/api";

function DashboardSeller() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  const userId = currentUser?.id_pengguna || currentUser?.id;

  const [sellerData, setSellerData] = useState(null);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    newOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showDetailOrder, setShowDetailOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chartFilter, setChartFilter] = useState("6bulan");
  const [animateChart, setAnimateChart] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [trendAnalysis, setTrendAnalysis] = useState({
    trend: "stabil",
    persentase: 0,
    arah: "➡️",
    warna: "text-slate-500",
    deskripsi: "Data belum cukup untuk analisis tren",
  });

  // ================= ANALISIS TREND (LIMIT - KECENDERUNGAN) =================
  const analyzeTrend = (data) => {
    if (data.length < 2) {
      return {
        trend: "stabil",
        persentase: 0,
        arah: "➡️",
        warna: "text-slate-500",
        deskripsi: "Belum cukup data untuk analisis tren",
      };
    }

    // Ambil 2 periode terakhir untuk analisis
    const lastPeriod = data[data.length - 1]?.total || 0;
    const prevPeriod = data[data.length - 2]?.total || 0;

    if (prevPeriod === 0) {
      return {
        trend: "naik",
        persentase: lastPeriod > 0 ? 100 : 0,
        arah: "📈",
        warna: "text-emerald-600",
        deskripsi: "Pendapatan baru mulai terlihat",
      };
    }

    const perubahan = ((lastPeriod - prevPeriod) / prevPeriod) * 100;
    const persentase = Math.abs(Math.round(perubahan));

    if (perubahan > 10) {
      return {
        trend: "naik",
        persentase: persentase,
        arah: "📈",
        warna: "text-emerald-600",
        deskripsi: `Pendapatan naik ${persentase}% dari periode sebelumnya`,
      };
    } else if (perubahan < -10) {
      return {
        trend: "turun",
        persentase: persentase,
        arah: "📉",
        warna: "text-red-500",
        deskripsi: `Pendapatan turun ${persentase}% dari periode sebelumnya`,
      };
    } else {
      return {
        trend: "stabil",
        persentase: persentase,
        arah: "➡️",
        warna: "text-slate-500",
        deskripsi: `Pendapatan relatif stabil (perubahan ${persentase}%)`,
      };
    }
  };

  // ================= INTEGRAL (LUAS DI BAWAH KURVA) =================
  const calculateAreaUnderCurve = (data) => {
    if (data.length < 2) return 0;

    // Menggunakan metode trapezoidal rule untuk menghitung luas area
    // ∫ f(x) dx ≈ Σ (y_i + y_{i+1})/2 * Δx
    let area = 0;
    for (let i = 0; i < data.length - 1; i++) {
      const y1 = data[i].total || 0;
      const y2 = data[i + 1].total || 0;
      const dx = 1; // Jarak antar titik dianggap 1 (per bulan/minggu/hari)
      area += ((y1 + y2) / 2) * dx;
    }
    return Math.round(area);
  };

  // ================= FETCH SELLER DATA =================
  useEffect(() => {
    const fetchSellerData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storeRes = await api.get(`/toko/user/${userId}`);
        const store = storeRes.data.data;
        setSellerData(store);

        const productsRes = await api.get(`/produk/toko/${store.id_toko}`);
        const products = productsRes.data.data.data || [];
        setSellerProducts(products);

        const ordersRes = await api.get(`/pesanan/toko/${store.id_toko}`);
        const orders = ordersRes.data.data || [];
        setSellerOrders(orders);

        const statsRes = await api.get(`/statistik/penjual/${store.id_toko}`);
        const statsData = statsRes.data.data;

        const totalRevenue = statsData.total_penjualan || 0;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
          (o) => o.status === "menunggu" || o.status === "pending",
        ).length;
        const completedOrders = orders.filter(
          (o) => o.status === "selesai" || o.status === "completed",
        ).length;
        const uniqueCustomers = new Set(orders.map((o) => o.id_pengguna));

        // ================= DATA BULANAN (6 BULAN TERAKHIR) =================
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
          if (order.status === "selesai" || order.status === "completed") {
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
          .map((key) => ({
            bulan: key,
            total: monthlySales[key],
          }))
          .reverse();

        // ================= DATA HARIAN (7 HARI TERAKHIR) =================
        const dailySales = {};
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const key = date.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
          });
          dailySales[key] = 0;
        }

        orders.forEach((order) => {
          if (order.status === "selesai" || order.status === "completed") {
            const date = new Date(order.created_at);
            const key = date.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
            });
            if (dailySales[key] !== undefined) {
              dailySales[key] += Number(order.harga_akhir || 0);
            }
          }
        });

        const dailyArray = Object.keys(dailySales).map((key) => ({
          hari: key,
          total: dailySales[key],
        }));

        // ================= DATA MINGGUAN (4 MINGGU TERAKHIR) =================
        const weeklySales = {};
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * i));
          const key = `Minggu ${4 - i}`;
          weeklySales[key] = 0;
        }

        orders.forEach((order) => {
          if (order.status === "selesai" || order.status === "completed") {
            const date = new Date(order.created_at);
            const weekNum = Math.floor(
              (now - date) / (7 * 24 * 60 * 60 * 1000),
            );
            const key = `Minggu ${Math.min(weekNum + 1, 4)}`;
            if (weeklySales[key] !== undefined) {
              weeklySales[key] += Number(order.harga_akhir || 0);
            }
          }
        });

        const weeklyArray = Object.keys(weeklySales).map((key) => ({
          minggu: key,
          total: weeklySales[key],
        }));

        // ================= ANALISIS TREND (LIMIT) =================
        const trendResult = analyzeTrend(monthlyArray);
        setTrendAnalysis(trendResult);

        // ================= LUAS DI BAWAH KURVA (INTEGRAL) =================
        const areaMonthly = calculateAreaUnderCurve(monthlyArray);
        const areaDaily = calculateAreaUnderCurve(dailyArray);
        const areaWeekly = calculateAreaUnderCurve(weeklyArray);

        setStats({
          totalProducts: products.length,
          totalOrders: totalOrders,
          totalSales: statsData.total_penjualan || 0,
          newOrders: pendingOrders,
          totalRevenue: totalRevenue,
          totalCustomers: uniqueCustomers.size,
          pendingOrders: pendingOrders,
          completedOrders: completedOrders,
          areaMonthly: areaMonthly,
          areaDaily: areaDaily,
          areaWeekly: areaWeekly,
        });

        setMonthlyData(monthlyArray);
        setDailyData(dailyArray);
        setWeeklyData(weeklyArray);

        const topProductsData = statsData.top_5_produk || [];

        const recentCustomersData = [
          ...new Set(orders.map((o) => o.id_pengguna)),
        ]
          .slice(0, 5)
          .map((id) => {
            const order = orders.find((o) => o.id_pengguna === id);
            return {
              id: id,
              name: order?.nama_penerima || "Customer",
              total: orders
                .filter((o) => o.id_pengguna === id)
                .reduce((sum, o) => sum + Number(o.harga_akhir || 0), 0),
            };
          });

        setTopProducts(topProductsData);
        setRecentCustomers(recentCustomersData);

        const lowStock = products
          .filter((p) => p.stok <= 10)
          .map((p) => ({
            id: p.id_produk,
            name: p.nama_produk,
            stock: p.stok,
          }));
        setStocks(lowStock);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [userId]);

  useEffect(() => {
    setAnimateChart(false);
    setTimeout(() => setAnimateChart(true), 100);
  }, [chartFilter]);

  const getChartData = () => {
    switch (chartFilter) {
      case "harian":
        return dailyData;
      case "mingguan":
        return weeklyData;
      case "6bulan":
      default:
        return monthlyData;
    }
  };

  const getChartLabel = () => {
    switch (chartFilter) {
      case "harian":
        return "Hari";
      case "mingguan":
        return "Minggu";
      case "6bulan":
      default:
        return "Bulan";
    }
  };

  const statCards = [
    {
      title: "TOTAL PENDAPATAN",
      value: `Rp ${(stats.totalRevenue / 1000000).toFixed(1)} Jt`,
      icon: <DollarSign size={22} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "TOTAL PESANAN",
      value: stats.totalOrders,
      icon: <ShoppingBag size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "PELANGGAN",
      value: stats.totalCustomers,
      icon: <Users size={22} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "PRODUK TERJUAL",
      value: stats.totalProducts,
      icon: <Package size={22} />,
      color: "bg-orange-100 text-orange-500",
    },
  ];

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-orange-100 text-orange-500";
    if (s.includes("diproses")) return "bg-purple-100 text-purple-500";
    if (s.includes("dikirim")) return "bg-blue-100 text-blue-500";
    if (s.includes("selesai")) return "bg-emerald-100 text-emerald-500";
    return "bg-slate-100 text-slate-500";
  };

  const formatPrice = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const filteredOrders = sellerOrders.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      (item.id_pesanan?.toString() || "").includes(keyword) ||
      (item.nama_penerima || "").toLowerCase().includes(keyword) ||
      (item.status || "").toLowerCase().includes(keyword)
    );
  });

  // ================= RENDER CHART DENGAN AREA (INTEGRAL) =================
  const renderChart = () => {
    const data = getChartData();
    const label = getChartLabel();

    if (data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Belum ada data penjualan
        </div>
      );
    }

    const maxValue = Math.max(...data.map((d) => d.total), 1);
    const chartHeight = 200;
    const areaColor = "rgba(59, 130, 246, 0.2)";
    const lineColor = "#3B82F6";

    // ================= LUAS DI BAWAH KURVA (INTEGRAL) =================
    const area = calculateAreaUnderCurve(data);

    return (
      <div className="h-64 mt-4">
        <div className="flex justify-between text-[10px] text-slate-400 mb-2 px-2">
          <span>
            📊 Luas area di bawah kurva (Integral): {formatPrice(area)}
          </span>
          <span className="text-blue-600 font-bold">
            ∫ f(x) dx ≈ {formatPrice(area)}
          </span>
        </div>
        <div className="relative h-[200px] flex items-end gap-2">
          {/* AREA CHART (Integral - filled area) */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <polygon
              points={
                data
                  .map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (d.total / maxValue) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ") + `,100,100,0,0`
              }
              fill="url(#areaGradient)"
              opacity={animateChart ? 1 : 0}
              style={{ transition: "opacity 0.8s ease" }}
            />
            {/* LINE CHART */}
            <polyline
              points={data
                .map((d, i) => {
                  const x = (i / (data.length - 1)) * 100;
                  const y = 100 - (d.total / maxValue) * 100;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={animateChart ? 1 : 0}
              style={{ transition: "opacity 0.8s ease 0.3s" }}
            />
            {/* POINTS */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - (d.total / maxValue) * 100;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="white"
                  stroke={lineColor}
                  strokeWidth="2"
                  opacity={animateChart ? 1 : 0}
                  style={{ transition: `opacity 0.5s ease ${0.5 + i * 0.1}s` }}
                />
              );
            })}
          </svg>
          {/* BAR CHART (sebagai background) */}
          {data.map((item, index) => {
            const height = (item.total / maxValue) * chartHeight;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1 relative z-10"
              >
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full max-w-[32px] bg-blue-500/20 rounded-t-lg transition-all duration-500 hover:bg-blue-500/40"
                    style={{
                      height: `${Math.max(height, 4)}px`,
                      opacity: animateChart ? 0.5 : 0,
                      transform: animateChart ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "bottom",
                      transition: `all 0.5s ease ${index * 0.08}s`,
                    }}
                  />
                  <div className="text-[9px] font-bold text-slate-600 mt-1">
                    {item.total > 0 ? formatPrice(item.total) : "-"}
                  </div>
                  <div className="text-[8px] text-slate-400 font-semibold">
                    {item[label.toLowerCase()] ||
                      item.bulan ||
                      item.hari ||
                      item.minggu ||
                      "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ================= RENDER TREND INDICATOR =================
  const renderTrendIndicator = () => {
    const { trend, persentase, arah, warna, deskripsi } = trendAnalysis;
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`text-3xl ${warna}`}>{arah}</div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">
              Analisis Tren (Limit)
            </p>
            <p className={`text-lg font-black ${warna}`}>
              {trend === "naik"
                ? "📈 Meningkat"
                : trend === "turun"
                  ? "📉 Menurun"
                  : "➡️ Stabil"}
            </p>
            <p className="text-xs text-slate-500 mt-1">{deskripsi}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">
              Perubahan
            </p>
            <p className={`text-xl font-black ${warna}`}>
              {trend === "naik" ? "+" : trend === "turun" ? "-" : ""}
              {persentase}%
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER INTEGRAL INFO =================
  const renderIntegralInfo = () => {
    const data = getChartData();
    const area = calculateAreaUnderCurve(data);
    const label = getChartLabel();

    return (
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            ∫
          </div>
          <div>
            <p className="text-xs text-blue-600 font-bold uppercase">
              Integral (Luas di Bawah Kurva)
            </p>
            <p className="text-sm font-semibold text-slate-700">
              ∫ f(x) dx ≈ {formatPrice(area)} (per {label})
            </p>
            <p className="text-[10px] text-slate-500">
              Menggunakan metode trapezoidal rule untuk estimasi pendapatan
              kumulatif
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#111827] leading-none">
              Ringkasan Toko
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Selamat datang kembali,{" "}
              {sellerData?.nama_toko || currentUser?.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-5 rounded-2xl bg-blue-600 text-white font-black text-[12px] shadow-lg hover:bg-blue-700 duration-300"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* TREND & INTEGRAL SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
          <div className="xl:col-span-2">{renderTrendIndicator()}</div>
          <div className="xl:col-span-1">{renderIntegralInfo()}</div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm flex items-center justify-between min-h-[120px]"
            >
              <div>
                <p className="text-[10px] font-black tracking-[2px] uppercase text-slate-400">
                  {item.title}
                </p>
                <h2 className="text-[26px] font-black text-[#111827] mt-2 leading-none">
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

        {/* CHART + STOCK */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-5">
          <div className="xl:col-span-8 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-black text-[#111827]">
                  Statistik Penjualan
                </h2>
                <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-1">
                  Analisis Limit & Integral
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartFilter("harian")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    chartFilter === "harian"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setChartFilter("mingguan")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    chartFilter === "mingguan"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setChartFilter("6bulan")}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    chartFilter === "6bulan"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  6 Bulan
                </button>
              </div>
            </div>
            {renderChart()}
          </div>

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
              {stocks.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  ✅ Semua stok aman
                </div>
              ) : (
                stocks.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
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
                      onClick={async () => {
                        try {
                          await api.put(`/produk/${item.id}`, { stok: 20 });
                          const storeRes = await api.get(
                            `/toko/user/${userId}`,
                          );
                          const productsRes = await api.get(
                            `/produk/toko/${storeRes.data.data.id_toko}`,
                          );
                          const products = productsRes.data.data.data || [];
                          const lowStock = products
                            .filter((p) => p.stok <= 10)
                            .map((p) => ({
                              id: p.id_produk,
                              name: p.nama_produk,
                              stock: p.stok,
                            }));
                          setStocks(lowStock);
                          alert("✅ Stok berhasil ditambahkan!");
                        } catch (error) {
                          console.error("Error updating stock:", error);
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate("/seller/products")}
              className="w-full h-11 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm mt-5"
            >
              LIHAT INVENTARIS
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-5">
          <div className="xl:col-span-3 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-[#111827] mb-4">
              🏆 Produk Terlaris
            </h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {topProducts.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  Belum ada produk terjual
                </div>
              ) : (
                topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-slate-800 text-sm truncate max-w-[150px]">
                        {product.nama_produk}
                      </span>
                    </div>
                    <span className="font-bold text-slate-600 text-sm">
                      {product.total_terjual || 0} terjual
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="xl:col-span-3 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-[#111827] mb-4">
              👤 Pelanggan Terbaru
            </h2>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {recentCustomers.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  Belum ada pelanggan
                </div>
              ) : (
                recentCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {customer.name?.charAt(0) || "C"}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm truncate max-w-[120px]">
                        {customer.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatPrice(customer.total)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="xl:col-span-6 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-[18px] font-black text-[#111827]">
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
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 5).map((item) => (
                    <tr
                      key={item.id_pesanan}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 text-sm">
                        #{item.id_pesanan}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 text-sm">
                        {item.nama_penerima || "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 text-sm">
                        {formatPrice(item.harga_akhir)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[9px] font-black ${getStatusColor(item.status)}`}
                        >
                          {item.status || "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default DashboardSeller;
