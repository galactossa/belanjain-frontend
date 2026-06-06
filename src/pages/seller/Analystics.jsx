import {
  TrendingUp,
  Star,
  Eye,
  MessageSquare,
  Sparkles,
  Download,
  Plus,
  Search,
  Bell,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function AnalyticsSeller() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const reports = [
    {
      id: "ORD-001",
      customer: "Budi Santoso",
      date: "2026-03-31",
      total: "Rp 18.999.000",
      status: "MENUNGGU PEMBAYARAN",
      color:
        "bg-orange-100 text-orange-500",
    },

    {
      id: "ORD-002",
      customer: "Siti Aminah",
      date: "2026-03-30",
      total: "Rp 4.599.000",
      status: "DIKIRIM",
      color:
        "bg-blue-100 text-blue-500",
    },

    {
      id: "ORD-003",
      customer: "Andi Wijaya",
      date: "2026-03-29",
      total: "Rp 16.499.000",
      status: "SELESAI",
      color:
        "bg-emerald-100 text-emerald-500",
    },

    {
      id: "ORD-004",
      customer: "Dewi Lestari",
      date: "2026-03-28",
      total: "Rp 199.000",
      status: "DIPROSES",
      color:
        "bg-purple-100 text-purple-500",
    },
  ];
  const filteredReports = reports.filter((item) =>
  item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.status.toLowerCase().includes(searchTerm.toLowerCase())
);
const handleDownloadReport = () => {
  const headers = [
    "ID Pesanan",
    "Pelanggan",
    "Tanggal",
    "Total",
    "Status",
  ];

  const rows = reports.map((item) => [
    item.id,
    item.customer,
    item.date,
    item.total,
    item.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-penjualan.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (

    <SellerLayout>

      <div className="max-w-[1600px] mx-auto min-h-screen bg-[#f6f8fc] p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">

          <div>

            <h1
              className="
              text-[34px] 
              xl:text-[40px]
              font-black
              uppercase
              text-slate-900
              leading-none
            "
            >

              Analitik Penjualan

            </h1>

            <p
              className="
              text-slate-400
              text-sm
              mt-2
              uppercase
              tracking-[2px]
              font-black
            "
            >

              Lihat data mendalam tentang performa bisnis anda.

            </p>

          </div>

          <div className="flex items-center gap-3">

  {/* SEARCH */}
  <div
    className="
    w-[280px]
    h-11
    bg-white
    border
    border-slate-200
    rounded-2xl
    px-4
    flex
    items-center
    gap-3
    shadow-sm
  "
  >
    <Search
      size={16}
      className="text-slate-400"
    />

    <input
  type="text"
  placeholder="Cari pesanan atau produk..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    flex-1
    bg-transparent
    outline-none
    text-sm
    text-slate-600
  "
/>
  </div>

  {/* BELL */}
<button
  onClick={() => setShowNotif(!showNotif)}
  className="
    relative
    w-11
    h-11
    rounded-2xl
    bg-white
    border
    border-slate-200
    shadow-sm
    flex
    items-center
    justify-center
  "
>
    <Bell
      size={18}
      className="text-slate-500"
    />
    {showNotif && (
  <div
    className="
      absolute
      top-14
      right-0
      w-72
      bg-white
      rounded-3xl
      border
      border-slate-200
      shadow-xl
      p-4
      z-50
    "
  >
    <h3 className="font-black text-slate-900 mb-3">
      Notifikasi
    </h3>

    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-slate-50">
        Pesanan baru masuk
      </div>

      <div className="p-3 rounded-xl bg-slate-50">
        Produk berhasil dipublikasikan
      </div>

      <div className="p-3 rounded-xl bg-slate-50">
        Flash Sale dimulai pukul 19:00
      </div>
    </div>
  </div>
)}

    <span
      className="
      absolute
      -top-1
      -right-1
      w-5
      h-5
      rounded-full
      bg-red-500
      text-white
      text-[10px]
      font-bold
      flex
      items-center
      justify-center
    "
    >
      3
    </span>
  </button>

  {/* PRODUK BARU */}
<button
  onClick={() => navigate("/seller/add-product")}
  className="
    h-11
    px-5
    rounded-2xl
    bg-blue-600
    text-white
    font-black
    text-sm
    shadow-lg
    hover:bg-blue-700
    duration-300
    flex
    items-center
    gap-2
  "
>
  <Plus size={18} />
  PRODUK BARU
</button>

</div>

        </div>

        {/* CONTENT */}
<div
  className="
  mt-10
  grid
  grid-cols-1
  xl:grid-cols-[1fr_280px]
  gap-6
"
>

          {/* LEFT */}
          <div className="flex flex-col gap-6">

            {/* GRAPH */}
<div
  className="
  bg-white
  rounded-[32px]
  border
  border-slate-200
  p-6
  shadow-sm
  overflow-hidden
"
>

  {/* HEADER */}
  <div className="flex items-center justify-between">

    <div>

      <h2
        className="
        text-[30px]
        font-black
        text-slate-900
      "
      >

        Performa Penjualan

      </h2>

      <p
        className="
        text-slate-400
        text-sm
        font-bold
        uppercase
        mt-1
      "
      >

        Grafik pendapatan 7 hari terakhir

      </p>

    </div>

    <div className="flex items-center gap-3">

      <button
        className="
        w-11
        h-11
        rounded-xl
        bg-red-50
        text-red-500
        flex
        items-center
        justify-center
      "
      >

        <Plus size={18} />

      </button>
<button
  onClick={handleDownloadReport}
  className="
  w-11
  h-11
  rounded-xl
  bg-emerald-50
  hover:bg-emerald-100
  text-emerald-500
  flex
  items-center
  justify-center
"
>
  <Download size={18} />
</button>

    </div>

  </div>

  {/* BIG GRAPH */}
 <div
  className="
    mt-8
    h-[280px]
    relative
  "
>

    {/* GRID */}
    <div
      className="
      absolute
      inset-0
      flex
      flex-col
      justify-between
    "
    >

      {[1, 2, 3, 4, 5, 6].map((item) => (

        <div
          key={item}
          className="
          border-t
          border-dashed
          border-slate-200
        "
        ></div>

      ))}

    </div>

    {/* LEFT LABEL */}
    <div
      className="
      absolute
      left-0
      top-0
      h-full
      flex
      flex-col
      justify-between
      text-[12px]
      font-black
      text-slate-400
      z-20
    "
    >

      <span>Rp 14JT</span>
      <span>Rp 12JT</span>
      <span>Rp 10JT</span>
      <span>Rp 8JT</span>
      <span>Rp 6JT</span>
      <span>Rp 4JT</span>
      <span>Rp 2JT</span>

    </div>

    {/* SVG */}
    <div
      className="
      absolute
      inset-0
      left-16
      right-0
      top-0
      bottom-0
    "
    >

      <svg
        viewBox="0 0 1400 520"
        className="w-full h-full"
        preserveAspectRatio="none"
        fill="none"
      >

        {/* SHADOW */}
        <defs>

          <linearGradient
            id="paint0_linear"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#2563eb"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="#2563eb"
              stopOpacity="0"
            />

          </linearGradient>

        </defs>

        {/* AREA */}
        <path
          d="
          M0 420
          C100 390,160 320,260 340
          C360 360,430 160,560 200
          C700 240,760 190,900 120
          C1040 60,1160 80,1400 20
          L1400 520
          L0 520
          Z
        "
          fill="url(#paint0_linear)"
        />

        {/* MAIN LINE */}
        <path
          d="
          M0 420
          C100 390,160 320,260 340
          C360 360,430 160,560 200
          C700 240,760 190,900 120
          C1040 60,1160 80,1400 20
        "
          stroke="#2563eb"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* GLOW */}
        <path
          d="
          M0 420
          C100 390,160 320,260 340
          C360 360,430 160,560 200
          C700 240,760 190,900 120
          C1040 60,1160 80,1400 20
        "
          stroke="#60a5fa"
          strokeWidth="14"
          opacity="0.15"
          fill="none"
          strokeLinecap="round"
        />

        {/* DOTS */}
        {[
          { x: 0, y: 420 },
          { x: 260, y: 340 },
          { x: 560, y: 200 },
          { x: 900, y: 120 },
          { x: 1400, y: 20 },
        ].map((dot, index) => (

          <g key={index}>

            <circle
              cx={dot.x}
              cy={dot.y}
              r="16"
              fill="#2563eb"
              opacity="0.12"
            />

            <circle
              cx={dot.x}
              cy={dot.y}
              r="8"
              fill="#2563eb"
              stroke="white"
              strokeWidth="5"
            />

          </g>

        ))}

      </svg>

    </div>

    {/* BOTTOM LABEL */}
    <div
      className="
      absolute
      bottom-0
      left-16
      right-0
      flex
      justify-between
      text-[13px]
      font-black
      text-slate-400
      uppercase
    "
    >

      <span>Senin</span>
      <span>Selasa</span>
      <span>Rabu</span>
      <span>Kamis</span>
      <span>Jumat</span>
      <span>Sabtu</span>
      <span>Minggu</span>

    </div>

  </div>

</div>

            {/* CATEGORY */}
            <div
              className="
              bg-white
              rounded-[32px]
              border
              border-slate-200
              p-6
              shadow-sm
            "
            >

              <h2 className="text-[24px] font-black text-slate-900">

                Distribusi Kategori

              </h2>

              <div className="grid grid-cols-2 gap-5 mt-8">

                {[
                  {
                    name: "ELEKTRONIK",
                    percent: "45%",
                    width: "45%",
                    color: "bg-blue-500",
                  },

                  {
                    name: "FASHION",
                    percent: "25%",
                    width: "25%",
                    color: "bg-pink-500",
                  },

                  {
                    name: "AUDIO",
                    percent: "20%",
                    width: "20%",
                    color: "bg-orange-500",
                  },

                  {
                    name: "LAINNYA",
                    percent: "10%",
                    width: "10%",
                    color: "bg-emerald-500",
                  },
                ].map((item, index) => (

                  <div
                    key={index}
                    className="
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-2xl
                    p-5
                  "
                  >

                    <div className="flex items-center justify-between">

                      <h3 className="font-black text-slate-900">

                        {item.name}

                      </h3>

                      <span className="font-black text-slate-500">

                        {item.percent}

                      </span>

                    </div>

                    <div
                      className="
                      w-full
                      h-3
                      rounded-full
                      bg-slate-200
                      mt-5
                      overflow-hidden
                    "
                    >

                      <div
                        className={`
                        h-full
                        rounded-full
                        ${item.color}
                      `}
                        style={{
                          width: item.width,
                        }}
                      ></div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}
           <div className="flex flex-col">

            {/* SCORE */}
            <div
  className="
  bg-gradient-to-br
  from-blue-600
  to-blue-700
  rounded-[32px]
  p-6
  text-white
  relative
  overflow-hidden
  h-[220px]
"
>

              <div
                className="
                absolute
                right-4
                top-4
                opacity-10
              "
              >

                <Star size={130} />

              </div>

              <div
                className="
                w-12
                h-12
                rounded-2xl
                bg-white/20
                flex
                items-center
                justify-center
              "
              >

                <Star size={20} />

              </div>

              <h2 className="text-3xl font-black mt-3">

                SKOR TOKO

              </h2>

              <p className="uppercase text-sm font-bold opacity-80 mt-2">

                Peringkat 5% Teratas

              </p>

              <div className="mt-4 flex items-end gap-2">

                <h1 className="text-3xl font-black">
                 4.9
                </h1>

                <span className="mb-3 font-black">

                  / 5.0

                </span>

              </div>

            </div>

            {/* AI */}
           <div
  className="
  mt-6
  bg-white
  rounded-[32px]
  border
  border-slate-200
  p-4
  shadow-sm
"
>

              <h2 className="text-xl font-black text-slate-900">

                Saran AI

              </h2>

              <div className="mt-6 flex flex-col gap-3">

                <div
                  className="
                  rounded-2xl
                  border
                  border-orange-200
                  bg-orange-50
                  p-3
                  flex
                  items-start
                  gap-3
                "
                >

                  <Sparkles
                    className="text-orange-500 mt-1"
                    size={18}
                  />

                  <div>

                    <h3 className="font-black text-orange-600">

                      Optimalkan Stock

                    </h3>

                    <p className="text-sm text-orange-500 mt-1">

                      Tambah stok MacBook Pro karena tren pencarian naik.

                    </p>

                  </div>

                </div>

                <div
                  className="
                  rounded-2xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-5
                  flex
                  items-start
                  gap-3
                "
                >

                  <TrendingUp
                    className="text-blue-500 mt-1"
                    size={18}
                  />

                  <div>

                    <h3 className="font-black text-blue-600">

                      Promosi Flash Sale

                    </h3>

                    <p className="text-sm text-blue-500 mt-1">

                      Aktifkan promo malam hari untuk menaikkan konversi.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}
        <div
          className="
          mt-6
          bg-white
          rounded-[32px]
          border
          border-slate-200
          shadow-sm
          overflow-x-auto

        "
        >

          <div className="p-6 border-b border-slate-100">

            <h2 className="text-[30px] font-black text-slate-900">

              Laporan Penjualan Detail

            </h2>

            <p
              className="
              text-slate-400
              text-sm
              uppercase
              font-bold
              mt-1
            "
            >

              Lacak semua pendapatan masuk dari pesanan

            </p>

          </div>

          <table className="w-full">

            <thead>

              <tr
                className="
                text-left
                text-[11px]
                uppercase
                tracking-[2px]
                text-slate-400
              "
              >

                <th className="px-7 py-5">
                  ID PESANAN
                </th>

                <th className="px-7 py-5">
                  PELANGGAN
                </th>

                <th className="px-7 py-5">
                  TANGGAL
                </th>

                <th className="px-7 py-5">
                  TOTAL PENJUALAN
                </th>

                <th className="px-7 py-5">
                  STATUS
                </th>

                <th className="px-7 py-5 text-center">
                  AKSI
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReports.map((item, index) => (

                <tr
                  key={index}
                  className="
                  border-t
                  border-slate-100
                  hover:bg-slate-50
                  duration-300
                "
                >

                  <td className="px-7 py-5 font-black text-slate-900">

                    {item.id}

                  </td>

                  <td className="px-7 py-5 font-semibold text-slate-700">

                    {item.customer}

                  </td>

                  <td className="px-7 py-5 text-slate-500 font-semibold">

                    {item.date}

                  </td>

                  <td className="px-7 py-5 font-black text-slate-900">

                    {item.total}

                  </td>

                  <td className="px-7 py-5">

                    <span
                      className={`
                      px-3
                      py-1
                      rounded-full
                      text-[10px]
                      font-black
                      ${item.color}
                    `}
                    >

                      {item.status}

                    </span>

                  </td>

                  <td className="px-7 py-5">

                    <div className="flex justify-center gap-3">

                      <button
  onClick={() => setSelectedOrder(item)}
  className="
    w-10
    h-10
    rounded-xl
    bg-slate-100
    hover:bg-slate-200
    duration-300
    flex
    items-center
    justify-center
  "
>
  <Eye size={16} className="text-slate-500" />
</button>
                      <button
  onClick={() => navigate("/seller/chat")}
  className="
    w-10
    h-10
    rounded-xl
    bg-blue-100
    hover:bg-blue-200
    duration-300
    flex
    items-center
    justify-center
  "
>
  <MessageSquare
    size={16}
    className="text-blue-600"
  />
</button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

{/* MODAL DETAIL PESANAN */}
{selectedOrder && (
  <div
    className="
      fixed
      inset-0
      bg-black/40
      z-50
      flex
      items-center
      justify-center
      p-4
    "
  >
    <div
      className="
        bg-white
        w-full
        max-w-lg
        rounded-3xl
        p-6
      "
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">
          Detail Pesanan
        </h2>

        <button
          onClick={() => setSelectedOrder(null)}
          className="text-slate-500"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-4">

        <div>
          <p className="text-slate-400 text-sm">
            ID Pesanan
          </p>

          <p className="font-black">
            {selectedOrder.id}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Pelanggan
          </p>

          <p className="font-black">
            {selectedOrder.customer}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Tanggal
          </p>

          <p className="font-black">
            {selectedOrder.date}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Total
          </p>

          <p className="font-black">
            {selectedOrder.total}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Status
          </p>

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-black
              ${selectedOrder.color}
            `}
          >
            {selectedOrder.status}
          </span>
        </div>

      </div>
    </div>
  </div>
)}

</SellerLayout>
  );
}

export default AnalyticsSeller;