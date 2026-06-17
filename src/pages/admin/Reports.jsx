/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  AlertTriangle,
  FileSpreadsheet,
  FileDown,
  Download,
  ChevronDown,
  X,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import { reports as initialReports } from "../../data/reports";
import { notifications as defaultNotifications } from "../../data/notifications";

function Reports() {
  const navigate = useNavigate();

  const notifRef = useRef();
  const downloadRef = useRef();
  const formatReportDate = (value) => {
    const [day, month, year] = value.split("/");

    return `${Number(day)}-${month.padStart(2, "0")}-${year}`;
  };
  const [reports, setReports] = useState(initialReports);
  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((item) => ({
        ...item,
        read: false,
        time: "Baru saja",
      })),
  );

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  /* ================= CLOSE NOTIF ================= */
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= SEARCH REPORT ================= */
  const filteredReports = reports.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= NOTIF FUNCTION ================= */
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif,
      ),
    );
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAllRead = () => {
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      })),
    );
  };

  /* ================= EXPORT ================= */
  /* ================= EXPORT ================= */
  const exportExcel = () => {
    const data =
      "ID,TYPE,TITLE,REPORTER,TARGET,DATE\n" +
      reports
        .map(
          (item) =>
            `${item.id},
      ${item.type},
      ${item.title},
      ${item.reporter},
      ${item.target},
      ${item.date}`,
        )
        .join("\n");

    const blob = new Blob([data], {
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

  const exportPDF = () => {
    const content = reports
      .map(
        (item) => `
REPORT ID : ${item.id}

TYPE : ${item.type}

TITLE : ${item.title}

REPORTER : ${item.reporter}

TARGET : ${item.target}

DATE : ${item.date}

------------------------------------
`,
      )
      .join("\n");

    const blob = new Blob([content], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "laporan-report.pdf");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* ================= IGNORE REPORT ================= */
  const handleIgnore = (id) => {
    setReports(reports.filter((item) => item.id !== id));
  };

  /* ================= ACTION ================= */
  const handleAction = (item) => {
    navigate("/admin/chat-seller", {
      state: {
        report: item,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] font-black text-slate-900 leading-tight">
              Reports
            </h1>

            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Lihat dan ekspor laporan pengaduan dengan cepat.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu((prev) => !prev)}
                className="h-[44px] px-4 rounded-[16px] bg-[#eef6ff] border border-blue-200 text-blue-700 font-semibold text-[13px] flex items-center gap-2 shadow-sm"
              >
                <Download size={16} />
                Download
                <ChevronDown size={14} />
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-40 rounded-[18px] border border-slate-200 bg-white shadow-lg py-2">
                  <button
                    onClick={exportExcel}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span className="font-semibold">Excel</span>
                  </button>
                  <button
                    onClick={exportPDF}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <span className="font-semibold">PDF</span>
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

            {/* ================= NOTIF ================= */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />

                {notifications.filter((notif) => !notif.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {notifications.filter((notif) => !notif.read).length}
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

        {/* ================= REPORTS ================= */}
        <div className="mt-10 flex flex-col gap-5">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] border border-slate-200 shadow-sm px-5 py-5 flex items-start justify-between hover:shadow-xl duration-300"
            >
              {/* LEFT */}
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div className="w-12 h-12 rounded-3xl bg-yellow-50 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-orange-500" />
                </div>

                {/* CONTENT */}
                <div>
                  {/* TOP */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-yellow-100 text-orange-500 px-3 py-1 rounded-xl text-[10px] font-black tracking-[1px] uppercase">
                      {item.type}
                    </span>

                    <p className="text-slate-400 font-semibold text-sm">
                      {formatReportDate(item.date)}
                    </p>
                  </div>

                  {/* TITLE */}
                  <h2 className="text-xl leading-snug font-black text-slate-900 mt-3 uppercase">
                    {item.title}
                  </h2>

                  {/* CARD */}
                  <div className="bg-slate-50 border border-slate-100 rounded-[22px] mt-6 px-5 py-4 flex items-start gap-6">
                    {/* REPORTER */}
                    <div>
                      <p className="text-pink-500 text-[11px] font-black tracking-[2px] uppercase">
                        Pelapor (Reporter)
                      </p>

                      <h3 className="font-black text-slate-900 mt-3 text-base">
                        {item.reporter}
                      </h3>

                      <p className="text-slate-500 font-medium text-sm mt-1">
                        {item.reporterEmail}
                      </p>
                    </div>

                    {/* LINE */}
                    <div className="w-px h-20 bg-slate-200"></div>

                    {/* TARGET */}
                    <div>
                      <p className="text-blue-600 text-[11px] font-black tracking-[2px] uppercase">
                        Yang Dilaporkan (Reported)
                      </p>

                      <h3 className="font-black text-slate-900 mt-3 text-base">
                        {item.targetName}
                      </h3>

                      {item.storeName && (
                        <p className="text-slate-500 font-medium text-sm mt-1">
                          Toko: {item.storeName}
                        </p>
                      )}

                      {item.productName && (
                        <p className="text-blue-600 text-[11px] font-black mt-3 uppercase">
                          Produk: {item.productName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT BUTTON */}
              <div className="flex items-center gap-5">
                {/* IGNORE */}
                <button
                  onClick={() => handleIgnore(item.id)}
                  className="bg-slate-200 text-slate-700 font-black tracking-wider px-5 h-10 rounded-2xl hover:bg-slate-300 duration-300 text-sm"
                >
                  ABAIKAN
                </button>

                {/* ACTION */}
                <button
                  onClick={() => handleAction(item)}
                  className="bg-red-600 text-white font-black tracking-wider px-5 h-10 rounded-2xl shadow-xl hover:bg-red-700 duration-300 text-sm"
                >
                  TINDAK LANJUT
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
