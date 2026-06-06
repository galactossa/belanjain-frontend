/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  FileSpreadsheet,
  FileDown,
  Trash2,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function Transactions() {

  /* ================= TRANSACTIONS ================= */
  const [transactions] =
    useState([
      {
        id: "TX-001",
        customer:
          "HAMID SAPUTRA",
        total: "Rp 450.000",
        date: "2024-03-19",
        status: "SELESAI",
        statusColor:
          "bg-emerald-100 text-emerald-600",
      },
      {
        id: "TX-002",
        customer:
          "TOKO HAMID JAYA",
        total: "Rp 1.250.000",
        date: "2024-03-20",
        status: "PROSES",
        statusColor:
          "bg-blue-100 text-blue-600",
      },
      {
        id: "TX-003",
        customer:
          "ADMIN BELANJAIN",
        total: "Rp 75.000",
        date: "2024-03-20",
        status: "MENUNGGU",
        statusColor:
          "bg-yellow-100 text-yellow-600",
      },
    ]);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  const [
    filteredTransactions,
    setFilteredTransactions,
  ] = useState(transactions);

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'Transaksi baru "TX-001" berhasil dibuat',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Pembayaran transaksi TX-002 berhasil dikonfirmasi',
        time: "5 menit lalu",
        read: false,
      },
      {
        id: 3,
        title:
          'Transaksi TX-003 sedang menunggu pembayaran',
        time: "20 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(
      event
    ) {

      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target
        )
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

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {

    const result =
      transactions.filter(
        (item) =>
          item.customer
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredTransactions(
      result
    );

  }, [search, transactions]);

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
        (notif) =>
          notif.id !== id
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

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {

    const content =
      "ID,Pelanggan,Total,Tanggal,Status\n" +
      transactions
        .map(
          (item) =>
            `${item.id},${item.customer},${item.total},${item.date},${item.status}`
        )
        .join("\n");

    const blob = new Blob(
      [content],
      {
        type: "text/csv",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "laporan-transaksi.csv";

    link.click();

  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {

    const content =
      transactions
        .map(
          (item) =>
            `ID: ${item.id}
Pelanggan: ${item.customer}
Total: ${item.total}
Tanggal: ${item.date}
Status: ${item.status}

`
        )
        .join("");

    const blob = new Blob(
      [content],
      {
        type: "application/pdf",
      }
    );

    const link =
      document.createElement("a");

    link.href =
      URL.createObjectURL(blob);

    link.download =
      "laporan-transaksi.pdf";

    link.click();

  };

  return (
    <AdminLayout>

      <div className="min-h-screen bg-[#f6f8fc] p-8">

        {/* ================= TOP BAR ================= */}
        <div className="flex justify-end items-center gap-4">

          {/* SEARCH */}
          <div className="w-[320px] h-[58px] bg-[#F5F7FB] border border-[#E2E8F0] rounded-2xl px-5 flex items-center">

            <Search
              size={20}
              className="text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="cari transaksi..."
              className="bg-transparent outline-none w-full h-full px-4 text-slate-600"
            />

          </div>

          {/* ================= NOTIF ================= */}
          <div
            className="relative"
            ref={notifRef}
          >

            <button
              onClick={() =>
                setShowNotif(
                  !showNotif
                )
              }
              className="w-[58px] h-[58px] rounded-2xl border border-[#E2E8F0] bg-[#F5F7FB] flex items-center justify-center relative"
            >

              <Bell
                size={20}
                className="text-slate-600"
              />

              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center">

                  {unreadCount}

                </div>
              )}

            </button>

            {/* ================= DROPDOWN ================= */}
            {showNotif && (
              <div className="absolute top-20 right-0 w-[420px] bg-white border border-slate-200 rounded-[30px] shadow-2xl overflow-hidden z-50">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

                  <div>

                    <h2 className="font-black text-slate-900 text-xl">

                      Notifikasi

                    </h2>

                    <p className="text-slate-400 text-sm mt-1">

                      {unreadCount} belum dibaca

                    </p>

                  </div>

                  <button
                    onClick={
                      markAllRead
                    }
                    className="text-blue-600 text-sm font-black hover:underline"
                  >

                    Tandai dibaca

                  </button>

                </div>

                {/* BODY */}
                <div className="max-h-[420px] overflow-y-auto">

                  {notifications.length ===
                  0 ? (
                    <div className="py-16 text-center text-slate-400 font-bold">

                      Tidak ada notifikasi

                    </div>
                  ) : (
                    notifications.map(
                      (notif) => (
                        <div
                          key={notif.id}
                          className={`px-6 py-5 border-b border-slate-100 hover:bg-slate-50 duration-300 ${
                            !notif.read
                              ? "bg-blue-50/40"
                              : ""
                          }`}
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div
                              onClick={() =>
                                markAsRead(
                                  notif.id
                                )
                              }
                              className="cursor-pointer flex-1"
                            >

                              <p className="font-bold text-slate-700 leading-relaxed">

                                {
                                  notif.title
                                }

                              </p>

                              <p className="text-sm text-slate-400 mt-2">

                                {
                                  notif.time
                                }

                              </p>

                            </div>

                            {/* DELETE */}
                            <button
                              onClick={() =>
                                deleteNotif(
                                  notif.id
                                )
                              }
                              className="text-slate-300 hover:text-red-500 duration-300"
                            >

                              <Trash2
                                size={17}
                              />

                            </button>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ================= HEADER ================= */}
        <div className="mt-14">

          <h1 className="text-[54px] leading-none font-black text-[#0F172A]">

            Seluruh Transaksi

          </h1>

          <p className="text-[#64748B] text-lg mt-4 font-medium">

            Riwayat transaksi pembelian dan pengiriman di platform BelanjaIn.

          </p>

        </div>

        {/* ================= EXPORT BOX ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-10 px-8 py-8 flex items-center justify-between">

          {/* LEFT */}
          <div>

            <h2 className="text-3xl font-black text-slate-900 uppercase">

              Unduh Laporan Transaksi

            </h2>

            <p className="text-slate-400 uppercase tracking-[2px] text-sm font-black mt-3">

              Ekspor seluruh log riwayat transaksi belanjain ke format yang diinginkan.

            </p>

          </div>

          {/* BUTTON */}
          <div className="flex items-center gap-5">

            {/* EXCEL */}
            <button
              onClick={
                downloadExcel
              }
              className="bg-emerald-500 text-white px-8 h-14 rounded-2xl font-black tracking-widest flex items-center gap-3 shadow-lg hover:bg-emerald-600 duration-300"
            >

              <FileSpreadsheet
                size={20}
              />

              EKSPOR EXCEL

            </button>

            {/* PDF */}
            <button
              onClick={downloadPDF}
              className="bg-red-600 text-white px-8 h-14 rounded-2xl font-black tracking-widest flex items-center gap-3 shadow-lg hover:bg-red-700 duration-300"
            >

              <FileDown
                size={20}
              />

              EKSPOR PDF

            </button>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="mt-8 bg-white border border-[#E7ECF3] rounded-[42px] overflow-hidden shadow-sm">

          {/* TOP */}
          <div className="px-10 py-8 border-b border-[#EEF2F7]">

            <p className="text-[#94A3B8] text-sm font-black tracking-[2px] uppercase">

              Total{" "}
              {
                filteredTransactions.length
              }{" "}
              Log Transaksi Terbaru

            </p>

          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.7fr] px-10 py-8 border-b border-[#EEF2F7] bg-[#FCFDFE]">

            <p className="text-[#94A3B8] text-sm font-black tracking-wider uppercase">

              ID Transaksi

            </p>

            <p className="text-[#94A3B8] text-sm font-black tracking-wider uppercase">

              Pelanggan/Pembeli

            </p>

            <p className="text-[#94A3B8] text-sm font-black tracking-wider uppercase">

              Total Bayar

            </p>

            <p className="text-[#94A3B8] text-sm font-black tracking-wider uppercase">

              Tanggal Order

            </p>

            <p className="text-[#94A3B8] text-sm font-black tracking-wider uppercase text-center">

              Status

            </p>

          </div>

          {/* EMPTY */}
          {filteredTransactions.length ===
            0 && (
            <div className="py-16 text-center text-slate-400 font-black text-xl">

              Transaksi tidak ditemukan

            </div>
          )}

          {/* TABLE BODY */}
          {filteredTransactions.map(
            (item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_1.5fr_1fr_1fr_0.7fr] items-center px-10 py-10 border-b border-[#EEF2F7] hover:bg-slate-50 duration-300"
              >

                {/* ID */}
                <div>

                  <p className="text-[#2563FF] font-black text-lg">

                    {item.id}

                  </p>

                </div>

                {/* CUSTOMER */}
                <div>

                  <h3 className="text-[#0F172A] text-xl font-black uppercase">

                    {
                      item.customer
                    }

                  </h3>

                </div>

                {/* TOTAL */}
                <div>

                  <p className="text-[#0F172A] text-xl font-black">

                    {item.total}

                  </p>

                </div>

                {/* DATE */}
                <div>

                  <p className="text-[#64748B] text-lg font-bold">

                    {item.date}

                  </p>

                </div>

                {/* STATUS */}
                <div className="flex justify-center">

                  <span
                    className={`px-5 py-2 rounded-xl text-sm font-black tracking-widest ${item.statusColor}`}
                  >

                    {
                      item.status
                    }

                  </span>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default Transactions;