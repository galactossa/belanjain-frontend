/* ================= IMPORT ================= */
import { Search, Bell, ChevronDown, Download, Trash2 } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import { orders } from "../../data/orders";
import { notifications as defaultNotifications } from "../../data/notifications";

function Transactions() {
  /* ================= TRANSACTIONS ================= */
  const [transactions] = useState(orders);

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const notifRef = useRef();
  const downloadRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((item) => ({
        ...item,
        time: "Baru saja",
        read: false,
      })),
  );

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

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    const result = transactions.filter(
      (item) =>
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredTransactions(result);
  }, [search, transactions]);

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

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

  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const getStatusColor = (status) => {
    if (status.includes("MENUNGGU")) return "bg-amber-100 text-amber-700";
    if (status.includes("DIPROSES") || status.includes("DIKIRIM"))
      return "bg-sky-100 text-sky-700";
    if (status.includes("SELESAI")) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status.includes("MENUNGGU")) return "MENUNGGU";
    return status;
  };

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    const content =
      "ID,Pelanggan,Total,Tanggal,Status\n" +
      transactions
        .map(
          (item) =>
            `${item.id},${item.customer},${item.total},${item.date},${item.status}`,
        )
        .join("\n");

    const blob = new Blob([content], {
      type: "text/csv",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "laporan-transaksi.csv";

    link.click();
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {
    const content = transactions
      .map(
        (item) =>
          `ID: ${item.id}
Pelanggan: ${item.customer}
Total: ${item.total}
Tanggal: ${item.date}
Status: ${item.status}

`,
      )
      .join("");

    const blob = new Blob([content], {
      type: "application/pdf",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "laporan-transaksi.pdf";

    link.click();
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Seluruh Transaksi
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Riwayat transaksi pembelian dan pengiriman di platform BelanjaIn.
            </p>
          </div>

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari transaksi..."
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

        {/* ================= TABLE ================= */}
        <div className="mt-8 bg-white border border-[#E7ECF3] rounded-[42px] overflow-hidden shadow-sm">
          {/* TOP */}
          <div className="px-10 py-8 border-b border-[#EEF2F7]">
            <p className="text-[#94A3B8] text-sm font-black tracking-[2px] uppercase">
              Total {filteredTransactions.length} Log Transaksi Terbaru
            </p>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1fr_2fr_1.1fr_1fr_0.8fr] px-8 py-6 border-b border-[#EEF2F7] bg-[#FCFDFE]">
            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              ID Transaksi
            </p>

            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              Pelanggan/Pembeli
            </p>

            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              Total Bayar
            </p>

            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              Tanggal Order
            </p>

            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase text-center">
              Status
            </p>
          </div>

          {/* EMPTY */}
          {filteredTransactions.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-black text-xl">
              Transaksi tidak ditemukan
            </div>
          )}

          {/* TABLE BODY */}
          {filteredTransactions.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_2fr_1.1fr_1fr_0.8fr] items-center gap-4 px-8 py-6 border-b border-[#EEF2F7] hover:bg-slate-50 duration-300"
            >
              {/* ID */}
              <div>
                <p className="text-[#2563FF] font-black text-base tracking-tight">
                  {item.id}
                </p>
              </div>

              {/* CUSTOMER */}
              <div>
                <h3 className="text-[#0F172A] text-sm font-black uppercase tracking-tight">
                  {item.customer}
                </h3>
              </div>

              {/* TOTAL */}
              <div>
                <p className="text-[#0F172A] text-sm font-black">
                  {formatCurrency(item.total)}
                </p>
              </div>

              {/* DATE */}
              <div>
                <p className="text-[#64748B] text-sm font-semibold">
                  {item.date}
                </p>
              </div>

              {/* STATUS */}
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.22em] ${getStatusColor(item.status)}`}
                >
                  {getStatusLabel(item.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Transactions;
