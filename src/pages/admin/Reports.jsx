import {
  Search,
  Bell,
  AlertTriangle,
  Download,
  ChevronDown,
  X,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function Reports() {
  const navigate = useNavigate();
  const notifRef = useRef();
  const downloadRef = useRef();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [processStatus, setProcessStatus] = useState("diproses");
  const [processNote, setProcessNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Fetch notifications (skip if error)
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

  // ================= FETCH REPORTS =================
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await api.get("/laporan");
        console.log("📡 Reports response:", response.data);

        let data = [];
        if (response.data?.data?.data) {
          data = response.data.data.data;
        } else if (response.data?.data) {
          data = response.data.data;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
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

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu") || s === "pending") {
      return {
        label: "MENUNGGU",
        color: "bg-yellow-100 text-yellow-700",
        icon: <Clock size={14} />,
      };
    }
    if (s.includes("diproses") || s === "processing") {
      return {
        label: "DIPROSES",
        color: "bg-blue-100 text-blue-700",
        icon: <Clock size={14} />,
      };
    }
    if (s.includes("selesai") || s === "done" || s.includes("sukses")) {
      return {
        label: "SELESAI",
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle size={14} />,
      };
    }
    if (s.includes("ditolak") || s === "rejected") {
      return {
        label: "DITOLAK",
        color: "bg-red-100 text-red-700",
        icon: <XCircle size={14} />,
      };
    }
    return {
      label: status || "MENUNGGU",
      color: "bg-slate-100 text-slate-700",
      icon: <Clock size={14} />,
    };
  };

  const filteredReports = reports.filter((item) => {
    const matchSearch =
      (item.alasan || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.tipe_target || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.pelapor_nama || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "semua" ||
      (item.status || "").toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  // ================= EXPORT FUNCTIONS =================
  const exportExcel = () => {
    const headers = "ID,Tipe,Alasan,Pelapor,Target,Status,Tanggal\n";
    const rows = reports
      .map(
        (item) =>
          `${item.id_laporan},${item.tipe_target},${item.alasan},${item.pelapor_nama || "-"},${item.id_target},${item.status || "Pending"},${formatDate(item.created_at)}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const dataToExport = filteredReports.length > 0 ? filteredReports : reports;

    if (dataToExport.length === 0) {
      alert("Tidak ada data laporan untuk diexport");
      return;
    }

    const content = `
      LAPORAN BELANJAIN
      Total Laporan: ${dataToExport.length}
      Tanggal: ${new Date().toLocaleString("id-ID")}
      ${"-".repeat(50)}
      
      ${dataToExport
        .map(
          (item, i) => `
      ${i + 1}. ID: ${item.id_laporan}
         Tipe: ${item.tipe_target}
         Alasan: ${item.alasan}
         Pelapor: ${item.pelapor_nama || "-"}
         Status: ${item.status || "Pending"}
         Tanggal: ${formatDate(item.created_at)}
      ${"-".repeat(30)}
      `,
        )
        .join("\n")}
    `;

    const blob = new Blob([content], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan-report-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // ================= 🔥 PROSES LAPORAN =================
  const handleProcessReport = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);

    try {
      await api.put(`/laporan/${selectedReport.id_laporan}/status`, {
        status: processStatus,
        catatan_admin: processNote || null,
      });

      alert(`✅ Laporan berhasil diupdate ke ${processStatus.toUpperCase()}`);
      setShowProcessModal(false);
      setSelectedReport(null);
      setProcessStatus("diproses");
      setProcessNote("");

      // Refresh reports
      const response = await api.get("/laporan");
      let data = [];
      if (response.data?.data?.data) {
        data = response.data.data.data;
      } else if (response.data?.data) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      }
      setReports(data);
    } catch (error) {
      console.error("Error processing report:", error);
      alert(error.response?.data?.message || "Gagal memproses laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openProcessModal = (report) => {
    setSelectedReport(report);
    setProcessStatus(report.status || "diproses");
    setProcessNote(report.catatan_admin || "");
    setShowProcessModal(true);
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
        {/* ================= MODAL PROSES LAPORAN ================= */}
        {showProcessModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
            <div className="w-[500px] bg-white rounded-[38px] shadow-2xl relative z-10 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Proses Laporan
                    </h2>
                    <p className="text-xs text-slate-400">
                      ID: #{selectedReport.id_laporan}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Status Laporan
                  </label>
                  <select
                    value={processStatus}
                    onChange={(e) => setProcessStatus(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Catatan Admin
                  </label>
                  <textarea
                    rows={4}
                    value={processNote}
                    onChange={(e) => setProcessNote(e.target.value)}
                    placeholder="Tambahkan catatan untuk pelapor..."
                    className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">Alasan Laporan</p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedReport.alasan}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Pelapor: {selectedReport.pelapor_nama || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowProcessModal(false)}
                    className="h-12 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition"
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleProcessReport}
                    disabled={isSubmitting}
                    className={`h-12 rounded-2xl text-white font-black shadow-lg transition ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "MEMPROSES..." : "SIMPAN"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-black text-slate-900 leading-tight">
              Laporan & Pengaduan
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Kelola dan proses semua laporan dari pengguna BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* DOWNLOAD BUTTON */}
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                className="h-[44px] px-4 rounded-[16px] bg-[#eef6ff] border border-blue-200 text-blue-700 font-semibold text-[13px] flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Download <ChevronDown size={14} />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-[18px] border border-slate-200 bg-white shadow-lg py-2 z-50">
                  <button
                    onClick={() => {
                      exportExcel();
                      setShowDownloadMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <span className="text-green-600">📊</span> Excel / CSV
                  </button>
                  <button
                    onClick={() => {
                      exportPDF();
                      setShowDownloadMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
                  >
                    <span className="text-red-500">📄</span> PDF
                  </button>
                </div>
              )}
            </div>

            {/* SEARCH */}
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[220px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari laporan..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>

            {/* FILTER STATUS */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>

            {/* NOTIFICATION */}
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

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
            <h3 className="text-2xl font-black text-slate-900">
              {reports.length}
            </h3>
          </div>
          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4 shadow-sm">
            <p className="text-xs text-yellow-600 font-bold uppercase">
              Menunggu
            </p>
            <h3 className="text-2xl font-black text-yellow-700">
              {
                reports.filter(
                  (r) =>
                    (r.status || "").toLowerCase() === "menunggu" ||
                    r.status === "pending",
                ).length
              }
            </h3>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 shadow-sm">
            <p className="text-xs text-blue-600 font-bold uppercase">
              Diproses
            </p>
            <h3 className="text-2xl font-black text-blue-700">
              {
                reports.filter(
                  (r) =>
                    (r.status || "").toLowerCase() === "diproses" ||
                    r.status === "processing",
                ).length
              }
            </h3>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-200 p-4 shadow-sm">
            <p className="text-xs text-green-600 font-bold uppercase">
              Selesai
            </p>
            <h3 className="text-2xl font-black text-green-700">
              {
                reports.filter(
                  (r) =>
                    (r.status || "").toLowerCase() === "selesai" ||
                    r.status === "done" ||
                    r.status === "sukses",
                ).length
              }
            </h3>
          </div>
        </div>

        {/* ================= LIST REPORT ================= */}
        <div className="mt-6 flex flex-col gap-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-[28px] p-12 text-center text-slate-400 border border-slate-200">
              <AlertTriangle
                size={48}
                className="mx-auto text-slate-300 mb-4"
              />
              <h3 className="font-black text-xl">Belum ada laporan</h3>
              <p className="mt-2">
                Semua laporan dari pengguna akan muncul di sini.
              </p>
            </div>
          ) : (
            filteredReports.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              return (
                <div
                  key={item.id_laporan}
                  className="bg-white rounded-[28px] border border-slate-200 shadow-sm px-6 py-5 flex items-start justify-between hover:shadow-lg duration-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-3xl bg-yellow-50 flex items-center justify-center shrink-0">
                      <AlertTriangle size={24} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-xl text-[10px] font-black tracking-[1px] uppercase">
                          {item.tipe_target || "Laporan"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black ${statusBadge.color}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                        <p className="text-slate-400 font-semibold text-xs">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <h2 className="text-base font-black text-slate-900 mt-2">
                        {item.alasan?.substring(0, 80) || "Laporan"}
                        {item.alasan?.length > 80 && "..."}
                      </h2>
                      <div className="flex flex-wrap items-center gap-6 mt-3">
                        <div>
                          <p className="text-pink-500 text-[10px] font-black tracking-[2px] uppercase">
                            Pelapor
                          </p>
                          <p className="font-bold text-slate-800 text-sm">
                            {item.pelapor_nama || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-600 text-[10px] font-black tracking-[2px] uppercase">
                            Target
                          </p>
                          <p className="font-bold text-slate-800 text-sm">
                            ID: {item.id_target}
                          </p>
                        </div>
                        {item.catatan_admin && (
                          <div>
                            <p className="text-green-600 text-[10px] font-black tracking-[2px] uppercase">
                              Catatan Admin
                            </p>
                            <p className="text-sm text-slate-600">
                              {item.catatan_admin}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <button
                      onClick={() => openProcessModal(item)}
                      className="bg-blue-600 text-white font-black tracking-wider px-5 h-10 rounded-2xl shadow-lg hover:bg-blue-700 duration-300 text-sm whitespace-nowrap"
                    >
                      PROSES
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
