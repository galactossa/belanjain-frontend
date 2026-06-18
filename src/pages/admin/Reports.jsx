import {
  Search,
  Bell,
  AlertTriangle,
  Download,
  ChevronDown,
  X,
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
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
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
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await api.get("/laporan");
        setReports(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
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
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const filteredReports = reports.filter(
    (item) =>
      (item.alasan || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.tipe_target || "").toLowerCase().includes(search.toLowerCase()),
  );

  // ================= 🔥 DOWNLOAD EXCEL =================
  const exportExcel = () => {
    const headers = "ID,Tipe,Alasan,Pelapor,Target,Status,Tanggal\n";
    const rows = reports
      .map(
        (item) =>
          `${item.id_laporan},${item.tipe_target},${item.alasan},${item.pelapor_nama || "-"},${item.id_target},${item.status},${formatDate(item.created_at)}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "laporan-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= 🔥 DOWNLOAD PDF =================
  const exportPDF = () => {
    // 🔥 Ambil semua laporan yang difilter (atau semua)
    const dataToExport = filteredReports.length > 0 ? filteredReports : reports;

    if (dataToExport.length === 0) {
      alert("Tidak ada data laporan untuk diexport");
      return;
    }

    // Buat konten PDF sederhana (pakai window.print atau blob)
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

    // Buat PDF dengan blob
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

  const handleAction = (item) => {
    navigate("/admin/chat-seller", { state: { report: item } });
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
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-black text-slate-900 leading-tight">
              Reports
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Lihat dan ekspor laporan pengaduan dengan cepat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* ================= 🔥 DOWNLOAD MENU ================= */}
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

            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari laporan..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>
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

        {/* ================= LIST REPORT ================= */}
        <div className="mt-10 flex flex-col gap-5">
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
            filteredReports.map((item) => (
              <div
                key={item.id_laporan}
                className="bg-white rounded-[28px] border border-slate-200 shadow-sm px-5 py-5 flex items-start justify-between hover:shadow-xl duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-yellow-50 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-yellow-100 text-orange-500 px-3 py-1 rounded-xl text-[10px] font-black tracking-[1px] uppercase">
                        {item.tipe_target || "Laporan"}
                      </span>
                      <p className="text-slate-400 font-semibold text-sm">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <h2 className="text-xl leading-snug font-black text-slate-900 mt-3 uppercase">
                      {item.alasan?.substring(0, 50) || "Laporan"}
                    </h2>
                    <div className="bg-slate-50 border border-slate-100 rounded-[22px] mt-6 px-5 py-4 flex items-start gap-6">
                      <div>
                        <p className="text-pink-500 text-[11px] font-black tracking-[2px] uppercase">
                          Pelapor
                        </p>
                        <h3 className="font-black text-slate-900 mt-3 text-base">
                          {item.pelapor_nama || "-"}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                          {item.pelapor_email || "-"}
                        </p>
                      </div>
                      <div className="w-px h-20 bg-slate-200"></div>
                      <div>
                        <p className="text-blue-600 text-[11px] font-black tracking-[2px] uppercase">
                          Target
                        </p>
                        <h3 className="font-black text-slate-900 mt-3 text-base">
                          ID: {item.id_target}
                        </h3>
                        <p className="text-slate-500 font-medium text-sm mt-1">
                          Status: {item.status || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => handleAction(item)}
                    className="bg-red-600 text-white font-black tracking-wider px-5 h-10 rounded-2xl shadow-xl hover:bg-red-700 duration-300 text-sm"
                  >
                    TINDAK LANJUT
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
