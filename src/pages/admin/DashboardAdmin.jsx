import {
  ShoppingBag,
  Users,
  Package,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  Download,
  Layers,
  Star,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

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

  const [stats, setStats] = useState({
    jumlah_user: 0,
    jumlah_penjual: 0,
    jumlah_produk: 0,
    total_transaksi: 0,
    jumlah_pesanan: 0,
  });

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  // Fetch notifications
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
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch statistik admin
        const statsRes = await api.get("/statistik/admin");
        console.log("📊 Stats response:", statsRes.data);
        setStats(statsRes.data.data);

        // Fetch users
        const usersRes = await api.get("/pengguna?limit=5");
        const usersData = usersRes.data.data.data || [];
        setUsers(
          usersData
            .filter((user) => user.role !== "admin")
            .slice(0, 3)
            .map((user) => ({
              name: user.nama || "User",
              role:
                user.role === "customer"
                  ? "PEMBELI"
                  : user.role?.toUpperCase() || "USER",
              letter: (user.nama || "U").charAt(0).toUpperCase(),
            })),
        );

        // Fetch reports
        const reportsRes = await api.get("/laporan?limit=2");
        setReports(reportsRes.data.data.data || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setChartMounted(true);
    }, 80);
    return () => window.clearTimeout(timeout);
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

  const totalRevenue = stats.total_transaksi || 0;
  const totalUsers = stats.jumlah_user || 0;
  const totalProducts = stats.jumlah_produk || 0;
  const totalTransactions = stats.jumlah_pesanan || 0;

  const statsCards = [
    {
      title: "TOTAL USER",
      value: `${totalUsers}`,
      icon: <Users size={22} />,
      increase: "+12%",
    },
    {
      title: "TOTAL PRODUK",
      value: `${totalProducts}`,
      icon: <Package size={22} />,
      increase: "+5%",
    },
    {
      title: "TOTAL TRANSAKSI",
      value: `${totalTransactions}`,
      icon: <ShoppingBag size={22} />,
      increase: "+18%",
    },
    {
      title: "TOTAL REVENUE",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: <TrendingUp size={22} />,
      increase: "+22%",
    },
    {
      title: "RATING APP (USER)",
      value: `★ 4.8 / 5.0`,
      icon: <Star size={22} />,
      increase: `${totalProducts} Produk`,
    },
  ];

  const downloadExcel = () => {
    const content = `
LAPORAN BELANJAIN
TOTAL USER : ${totalUsers}
TOTAL PRODUK : ${totalProducts}
TOTAL TRANSAKSI : ${totalTransactions}
TOTAL REVENUE : Rp ${totalRevenue.toLocaleString("id-ID")}
`;
    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-belanjain.xls";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const content = `
RINGKASAN PDF BELANJAIN
TOTAL USER : ${totalUsers}
TOTAL PRODUK : ${totalProducts}
TOTAL TRANSAKSI : ${totalTransactions}
TOTAL REVENUE : Rp ${totalRevenue.toLocaleString("id-ID")}
`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ringkasan-belanjain.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] px-7 py-6">
        {/* TOP */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                className="h-[44px] px-4 rounded-[16px] bg-[#eef6ff] border border-blue-200 text-blue-700 font-semibold text-[13px] flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Download <ChevronDown size={14} />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-36 rounded-[18px] border border-slate-200 bg-white shadow-lg py-2">
                  <button
                    onClick={() => {
                      downloadExcel();
                      setShowDownloadMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => {
                      downloadPDF();
                      setShowDownloadMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari sesuatu..."
                className="bg-transparent outline-none w-full text-sm text-slate-700"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
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

        {/* STATS */}
        <div className="grid grid-cols-5 gap-5 mt-8">
          {statsCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] border border-slate-200 p-7 h-[190px] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${index === 4 ? "bg-amber-50 text-amber-500" : "bg-[#edf3ff] text-blue-600"}`}
                >
                  {item.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-[13px] font-black ${index === 4 ? "text-orange-500" : "text-blue-600"}`}
                >
                  <ArrowUpRight size={14} /> {item.increase}
                </div>
              </div>
              <div>
                <p className="text-[12px] font-black tracking-[1px] text-slate-400">
                  {item.title}
                </p>
                <h2
                  className={`font-black text-slate-900 leading-tight whitespace-pre-line mt-3 ${index === 3 ? "text-[24px]" : "text-[18px]"}`}
                >
                  {item.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* CHART + USER */}
        <div className="grid grid-cols-12 gap-6 mt-7">
          <div className="col-span-8 bg-white rounded-[34px] border border-slate-200 p-7 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-black text-slate-900">
                STATISTIK PENDAPATAN KUMULATIF
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <p className="text-[12px] font-black text-slate-500">REVENUE</p>
              </div>
            </div>
            <div
              className={`relative h-[320px] mt-6 overflow-hidden transition-all duration-700 ease-out ${chartMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-dashed border-slate-200"
                  />
                ))}
              </div>
              <svg
                viewBox="0 0 900 320"
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M40 240 C120 180 180 160 260 190 C340 220 390 210 460 140 C540 80 650 200 730 120 C790 70 850 50 880 40 L880 320 L40 320 Z"
                  fill="url(#gradient)"
                  opacity="0"
                >
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="1.2s"
                    fill="freeze"
                  />
                </path>
                <path
                  d="M40 240 C120 180 180 160 260 190 C340 220 390 210 460 140 C540 80 650 200 730 120 C790 70 850 50 880 40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="3000"
                  strokeDashoffset="3000"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="3000"
                    to="0"
                    dur="1.5s"
                    fill="freeze"
                  />
                </path>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[12px] text-slate-400 font-bold">
                <p>Sen</p>
                <p>Sel</p>
                <p>Rab</p>
                <p>Kam</p>
                <p>Jum</p>
                <p>Sab</p>
                <p>Min</p>
              </div>
            </div>
          </div>

          <div className="col-span-4 bg-white rounded-[34px] border border-slate-200 p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-black text-slate-900">
                USER BARU
              </h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-blue-600 text-[12px] font-black"
              >
                LIHAT SEMUA
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="bg-[#f8fafc] rounded-[22px] p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#edf3ff] flex items-center justify-center text-blue-600 font-black">
                      {user.letter}
                    </div>
                    <div>
                      <h3 className="font-black text-[14px] text-slate-900">
                        {user.name}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-1">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-emerald-500">✓</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REPORT */}
        <div className="bg-white rounded-[34px] border border-slate-200 p-7 shadow-sm mt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-black text-slate-900">
              LAPORAN TERBARU
            </h2>
            <button
              onClick={() => navigate("/admin/reports")}
              className="text-blue-600 text-[12px] font-black"
            >
              LIHAT SEMUA
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-7">
            {reports.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-400">
                Belum ada laporan
              </div>
            ) : (
              reports.map((report, index) => (
                <div
                  key={index}
                  className="bg-[#f8fafc] rounded-[24px] p-6 flex items-center justify-between border border-slate-200"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-[20px] font-black">
                      !
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-[15px] uppercase leading-tight">
                        {report.alasan?.substring(0, 30) || "Laporan"}
                      </h3>
                      <p className="text-slate-400 text-[11px] font-black tracking-[1px] uppercase mt-1">
                        Status: {report.status || "Pending"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-100 text-amber-600 px-4 h-9 rounded-xl flex items-center font-black text-[11px] whitespace-nowrap">
                    {report.status || "MENUNGGU"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default DashboardAdmin;
