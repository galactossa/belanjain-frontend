import { Search, Bell, ChevronDown, Download, Trash2, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const notifRef = useRef();
  const downloadRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

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
        console.warn("⚠️ Notifikasi belum tersedia:", error.message);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);

  // ================= 🔥 FETCH TRANSAKSI =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Coba ambil dari endpoint transaksi
        let transData = [];
        try {
          const response = await api.get("/transaksi");
          console.log("📊 Transactions response:", response.data);
          // 🔥 Cek struktur response yang berbeda
          if (response.data?.data?.data) {
            transData = response.data.data.data;
          } else if (response.data?.data) {
            transData = response.data.data;
          } else if (Array.isArray(response.data)) {
            transData = response.data;
          } else {
            transData = [];
          }
        } catch (transError) {
          console.warn("⚠️ Transaksi API error:", transError.message);
        }

        // 2. Jika transaksi kosong, ambil dari pesanan yang sudah dibayar
        if (transData.length === 0) {
          console.log("📊 No transactions, fetching completed orders...");
          const ordersResponse = await api.get("/pesanan");
          console.log("📊 Orders response:", ordersResponse.data);

          const allOrders = ordersResponse.data.data || [];

          // Filter pesanan yang sudah dibayar / diproses / selesai
          const completedOrders = allOrders.filter(
            (o) =>
              o.status_pembayaran === "sukses" ||
              o.status === "diproses" ||
              o.status === "selesai" ||
              o.status === "dikirim",
          );

          console.log("📊 Completed orders:", completedOrders.length);

          transData = completedOrders.map((o) => ({
            id_transaksi: o.id_pesanan || o.id_pesanan,
            id_pesanan: o.id_pesanan,
            metode_pembayaran: o.metode_pembayaran || "Transfer",
            jumlah_dibayar: o.harga_akhir || o.total_harga || 0,
            status_pembayaran: o.status_pembayaran || "sukses",
            pembeli_nama: o.nama_penerima || "-",
            pembeli_email: o.email || "-",
            created_at: o.created_at,
            updated_at: o.updated_at,
          }));
        }

        setTransactions(transData);
        setFilteredTransactions(transData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        console.error("❌ Error response:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  useEffect(() => {
    const result = transactions.filter(
      (item) =>
        (item.id_pesanan?.toString() || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.pembeli_nama || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (item.pembeli_email || "").toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredTransactions(result);
  }, [search, transactions]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-amber-100 text-amber-700";
    if (s.includes("sukses") || s.includes("lunas"))
      return "bg-emerald-100 text-emerald-700";
    if (s.includes("gagal") || s.includes("batal"))
      return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("sukses") || s.includes("lunas")) return "✅ LUNAS";
    if (s.includes("menunggu")) return "⏳ MENUNGGU";
    if (s.includes("gagal") || s.includes("batal")) return "❌ GAGAL";
    return "🔄 PROSES";
  };

  const downloadExcel = () => {
    const headers = "ID Pesanan,Pelanggan,Email,Total,Tanggal,Status\n";
    const rows = filteredTransactions
      .map(
        (item) =>
          `${item.id_pesanan},${item.pembeli_nama || "-"},${item.pembeli_email || "-"},${item.jumlah_dibayar || 0},${formatDate(item.created_at)},${item.status_pembayaran || "Menunggu"}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "laporan-transaksi.csv";
    link.click();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
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
      <div className="min-h-screen bg-[#f6f8fc] p-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-black text-slate-900 leading-tight">
              Seluruh Transaksi
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Riwayat semua transaksi pembelian di platform BelanjaIn
            </p>
            {transactions.length === 0 && (
              <p className="text-yellow-600 text-sm mt-2 font-semibold">
                ⚠️ Belum ada transaksi selesai
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                className="h-[44px] px-4 rounded-[16px] bg-[#eef6ff] border border-blue-200 text-blue-700 font-semibold text-[13px] flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Download <ChevronDown size={14} />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-36 rounded-[18px] border border-slate-200 bg-white shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      downloadExcel();
                      setShowDownloadMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    📊 Excel / CSV
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[260px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ID, pelanggan, atau email..."
                className="bg-transparent outline-none w-full h-full px-2 text-slate-700 text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>
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

        {/* ================= TABEL ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[3px] text-slate-400 uppercase">
              Total {filteredTransactions.length} Transaksi
            </p>
            <p className="text-xs text-slate-400">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-4 whitespace-nowrap">ID Pesanan</th>
                  <th className="px-6 py-4 whitespace-nowrap">Pelanggan</th>
                  <th className="px-6 py-4 whitespace-nowrap">Total</th>
                  <th className="px-6 py-4 whitespace-nowrap">Metode</th>
                  <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-16 text-center text-slate-400"
                    >
                      <div className="text-6xl mb-4">💳</div>
                      <h3 className="text-xl font-black">
                        Belum Ada Transaksi
                      </h3>
                      <p className="mt-2 text-sm">
                        Belum ada pembayaran yang berhasil
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((item, index) => (
                    <tr
                      key={item.id_transaksi || item.id_pesanan || index}
                      className="border-b border-slate-100 hover:bg-slate-50 duration-300 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-black text-sm">
                          #{item.id_pesanan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {item.pembeli_nama || "-"}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[160px]">
                            {item.pembeli_email || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900">
                          {formatCurrency(item.jumlah_dibayar)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                          {item.metode_pembayaran || "Transfer"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.5px] ${getStatusColor(item.status_pembayaran)}`}
                          >
                            {getStatusBadge(item.status_pembayaran)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ================= FOOTER ================= */}
          {filteredTransactions.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <p className="text-xs text-slate-400">
                Menampilkan {filteredTransactions.length} transaksi
              </p>
              <p className="text-xs text-slate-400">
                {/* Total pendapatan:{" "} */}
                <span className="font-black text-slate-700">
                  {formatCurrency(
                    filteredTransactions.reduce(
                      (sum, item) =>
                        sum + (parseFloat(item.jumlah_dibayar) || 0), // 🔥 FIX
                      0,
                    ),
                  )}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Transactions;
