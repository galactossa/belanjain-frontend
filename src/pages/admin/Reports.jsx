/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  AlertTriangle,
  FileSpreadsheet,
  FileDown,
  X,
} from "lucide-react";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

function Reports() {

  const navigate = useNavigate();

  const notifRef = useRef();

  /* ================= REPORT ================= */
  const initialReports = [
    {
      id: 1,
      type: "PRODUCT REPORT",
      title: "DESAIN & DESKRIPSI TIDAK SESUAI",
      reporter: "Hamid Saputra",
      reporterEmail: "hamidsaputra6@gmail.com",
      target: "Toko Hamid Jaya",
      targetEmail: "seller@example.com",
      product: "PRODUK: IPHONE 15 PRO MAX (ID: 1)",
      date: "21/5/2026",
    },
    {
      id: 2,
      type: "USER REPORT",
      title: "MELAKUKAN SPAM CHAT & PROMOSI LUAR",
      reporter: "Toko Hamid Jaya",
      reporterEmail: "seller@example.com",
      target: "Hamid Saputra",
      targetEmail: "hamidsaputra6@gmail.com",
      product: "",
      date: "21/5/2026",
    },
  ];

  const [reports, setReports] =
    useState(initialReports);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  /* ================= NOTIF ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'User baru "Hamid Saputra" berhasil terdaftar',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Laporan baru masuk untuk produk "iPhone 15 Pro Max"',
        time: "5 menit lalu",
        read: false,
      },
      {
        id: 3,
        title:
          'Voucher GLOBAL "HEMAT10" berhasil diaktifkan',
        time: "20 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(event) {

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotif(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* ================= SEARCH REPORT ================= */
  const filteredReports =
    reports.filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount =
    notifications.filter(
      (notif) => !notif.read
    ).length;

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif
      )
    );

  };

  const deleteNotif = (id) => {

    setNotifications(
      notifications.filter(
        (notif) => notif.id !== id
      )
    );

  };

  const markAllRead = () => {

    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }))
    );

  };

  /* ================= EXPORT ================= */
  /* ================= EXPORT ================= */
const exportExcel = () => {

  const data =
    "ID,TYPE,TITLE,REPORTER,TARGET,DATE\n" +
    reports.map((item) =>
      `${item.id},
      ${item.type},
      ${item.title},
      ${item.reporter},
      ${item.target},
      ${item.date}`
    ).join("\n");

  const blob = new Blob(
    [data],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    "laporan-report.csv"
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

};

const exportPDF = () => {

  const content = reports.map(
    (item) => `
REPORT ID : ${item.id}

TYPE : ${item.type}

TITLE : ${item.title}

REPORTER : ${item.reporter}

TARGET : ${item.target}

DATE : ${item.date}

------------------------------------
`
  ).join("\n");

  const blob = new Blob(
    [content],
    {
      type: "application/pdf",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.setAttribute(
    "download",
    "laporan-report.pdf"
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

};

  /* ================= IGNORE REPORT ================= */
  const handleIgnore = (id) => {

    setReports(
      reports.filter(
        (item) => item.id !== id
      )
    );

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
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-[52px] font-black text-slate-900 leading-none">

              Reports

            </h1>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <div className="bg-white border border-slate-200 shadow-sm h-16 w-[320px] rounded-2xl px-5 flex items-center">

              <Search
                size={20}
                className="text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="cari laporan..."
                className="w-full h-full bg-transparent outline-none px-4 text-slate-700"
              />

            </div>

            {/* ================= NOTIF ================= */}
            <div
              className="relative"
              ref={notifRef}
            >

              <button
                onClick={() =>
                  setShowNotif(!showNotif)
                }
                className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300 relative"
              >

                <Bell
                  size={22}
                  className="text-slate-600"
                />

                {unreadCount > 0 && (
                  <div className="w-3 h-3 bg-pink-500 rounded-full absolute top-4 right-4"></div>
                )}

              </button>

              {/* PANEL */}
              {showNotif && (

                <div className="absolute top-[75px] right-0 w-[380px] bg-white rounded-[30px] border border-slate-200 shadow-2xl p-5 z-50">

                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <h2 className="text-[15px] font-black text-slate-800">

                        NOTIFIKASI

                      </h2>

                      <p className="text-[12px] text-slate-400 font-bold mt-1">

                        {notifications.length} Notifikasi

                      </p>

                    </div>

                    <button
                      onClick={markAllRead}
                      className="text-blue-600 font-black text-[12px]"
                    >

                      Tandai semua

                    </button>

                  </div>

                  {/* LIST */}
                  <div className="max-h-[320px] overflow-y-auto flex flex-col gap-4">

                    {notifications.map((notif) => (

                      <div
                        key={notif.id}
                        className={`
                          rounded-[24px]
                          p-5
                          border
                          ${
                            notif.read
                              ? "bg-white border-slate-200"
                              : "bg-blue-50 border-blue-100"
                          }
                        `}
                      >

                        <div className="flex justify-between gap-3">

                          <div
                            onClick={() =>
                              markAsRead(notif.id)
                            }
                            className="flex-1 cursor-pointer"
                          >

                            <h3 className="text-[14px] font-black text-slate-700 leading-relaxed">

                              {notif.title}

                            </h3>

                            <p className="text-[12px] text-slate-400 font-bold mt-3">

                              {notif.time}

                            </p>

                          </div>

                          <button
                            onClick={() =>
                              deleteNotif(notif.id)
                            }
                            className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500"
                          >

                            <X size={16} />

                          </button>

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* ================= TITLE ================= */}
        <div className="mt-14">

          <h1 className="text-5xl font-black text-slate-900">

            Reports

          </h1>

        </div>

        {/* ================= EXPORT BOX ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-10 px-8 py-8 flex items-center justify-between">

          {/* LEFT */}
          <div>

            <h2 className="text-3xl font-black text-slate-900 uppercase">

              Unduh Laporan Pelaporan

            </h2>

            <p className="text-slate-400 uppercase tracking-[2px] text-sm font-black mt-3">

              Ekspor semua log pengaduan & laporan ke format yang diinginkan.

            </p>

          </div>

          {/* BUTTON */}
          <div className="flex items-center gap-5">

            {/* EXCEL */}
            <button
              onClick={exportExcel}
              className="bg-emerald-500 text-white px-8 h-14 rounded-2xl font-black tracking-widest flex items-center gap-3 shadow-lg hover:bg-emerald-600 duration-300"
            >

              <FileSpreadsheet size={20} />

              EKSPOR EXCEL

            </button>

            {/* PDF */}
            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-8 h-14 rounded-2xl font-black tracking-widest flex items-center gap-3 shadow-lg hover:bg-red-700 duration-300"
            >

              <FileDown size={20} />

              UNDUH PDF (DOKUMEN)

            </button>

          </div>

        </div>

        {/* ================= REPORTS ================= */}
        <div className="mt-10 flex flex-col gap-8">

          {filteredReports.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-[45px] border border-slate-200 shadow-sm px-8 py-10 flex items-center justify-between hover:shadow-xl duration-300"
            >

              {/* LEFT */}
              <div className="flex items-start gap-8">

                {/* ICON */}
                <div className="w-16 h-16 rounded-3xl bg-yellow-50 flex items-center justify-center">

                  <AlertTriangle
                    size={34}
                    className="text-orange-500"
                  />

                </div>

                {/* CONTENT */}
                <div>

                  {/* TOP */}
                  <div className="flex items-center gap-5">

                    <span className="bg-yellow-100 text-orange-500 px-4 py-2 rounded-xl text-xs font-black tracking-[2px] uppercase">

                      {item.type}

                    </span>

                    <p className="text-slate-400 font-black">

                      {item.date}

                    </p>

                  </div>

                  {/* TITLE */}
                  <h2 className="text-[38px] leading-none font-black text-slate-900 mt-5 uppercase">

                    {item.title}

                  </h2>

                  {/* CARD */}
                  <div className="bg-slate-50 border border-slate-100 rounded-[24px] mt-8 px-6 py-5 flex items-center gap-8">

                    {/* REPORTER */}
                    <div>

                      <p className="text-pink-500 text-xs font-black tracking-[3px] uppercase">

                        Pelapor (Reporter)

                      </p>

                      <h3 className="font-black text-slate-900 mt-3 text-lg">

                        {item.reporter}

                      </h3>

                      <p className="text-slate-400 font-semibold text-sm mt-1">

                        {item.reporterEmail}

                      </p>

                    </div>

                    {/* LINE */}
                    <div className="w-px h-20 bg-slate-200"></div>

                    {/* TARGET */}
                    <div>

                      <p className="text-blue-600 text-xs font-black tracking-[3px] uppercase">

                        Yang Dilaporkan (Reported)

                      </p>

                      <h3 className="font-black text-slate-900 mt-3 text-lg">

                        {item.target}

                      </h3>

                      <p className="text-slate-400 font-semibold text-sm mt-1">

                        {item.targetEmail}

                      </p>

                      {item.product && (
                        <p className="text-blue-600 text-xs font-black mt-3 uppercase">

                          {item.product}

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
                  onClick={() =>
                    handleIgnore(item.id)
                  }
                  className="bg-slate-200 text-slate-700 font-black tracking-wider px-10 h-14 rounded-2xl hover:bg-slate-300 duration-300"
                >

                  ABAIKAN

                </button>

                {/* ACTION */}
                <button
                  onClick={() =>
                    handleAction(item)
                  }
                  className="bg-red-600 text-white font-black tracking-wider px-10 h-14 rounded-2xl shadow-xl hover:bg-red-700 duration-300"
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