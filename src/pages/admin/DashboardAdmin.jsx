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
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    const content = `
LAPORAN BELANJAIN

TOTAL USER : 3
TOTAL PRODUK : 10
TOTAL TRANSAKSI : 1243
TOTAL REVENUE : Rp 130.275.000
`;

    const blob = new Blob([content], {
      type: "application/vnd.ms-excel",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan-belanjain.xls";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = () => {
    const content = `
RINGKASAN PDF BELANJAIN

TOTAL USER : 3
TOTAL PRODUK : 10
TOTAL TRANSAKSI : 1243
TOTAL REVENUE : Rp 130.275.000
`;

    const blob = new Blob([content], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "ringkasan-belanjain.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
  };

  /* ================= DATA ================= */
  const stats = [
    {
      title: "TOTAL USER",
      value: "3",
      icon: <Users size={22} />,
      increase: "+12%",
    },
    {
      title: "TOTAL PRODUK",
      value: "10",
      icon: <Package size={22} />,
      increase: "+5%",
    },
    {
      title: "TOTAL TRANSAKSI",
      value: "1243",
      icon: <ShoppingBag size={22} />,
      increase: "+18%",
    },
    {
      title: "TOTAL REVENUE",
      value: "Rp\n130.275.000",
      icon: <TrendingUp size={22} />,
      increase: "+22%",
    },
    {
      title: "RATING APP (USER)",
      value: "★ 4.5 / 5.0",
      icon: <Star size={22} />,
      increase: "4 Ulasan",
    },
  ];

  const users = [
    {
      name: "TOKO HAMID JAYA",
      role: "PENJUAL",
      letter: "T",
    },
    {
      name: "TOKO HAMID JAYA",
      role: "PENJUAL",
      letter: "T",
    },
    {
      name: "SITI AMINAH",
      role: "PEMBELI",
      letter: "S",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] px-7 py-6">

        {/* ================= TOP ================= */}
        <div className="flex items-start justify-between">

          {/* LEFT */}
          <div className="pt-20">

            <h1 className="text-[28px] font-black text-slate-900">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-1 text-[15px]">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-5">

            {/* SEARCH */}
            <div className="flex items-center gap-4">

              <div
                className="
                  w-[290px]
                  h-[58px]
                  rounded-2xl
                  bg-white
                  border
                  border-slate-200
                  px-5
                  flex
                  items-center
                  gap-3
                  shadow-sm
                "
              >

                <Search
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type="text"
                  placeholder="cari sesuatu..."
                  className="
                    bg-transparent
                    outline-none
                    w-full
                    text-[14px]
                  "
                />

              </div>

             {/* NOTIF */}
<div className="relative">

  <button
    onClick={() => setShowNotif(!showNotif)}
    className="
      relative
      w-[58px]
      h-[58px]
      rounded-2xl
      bg-white
      border
      border-slate-200
      flex
      items-center
      justify-center
      shadow-sm
    "
  >

    <Bell
      size={21}
      className="text-slate-600"
    />

    <div
      className="
        absolute
        top-3
        right-3
        w-3
        h-3
        rounded-full
        bg-pink-500
      "
    />

  </button>

  {/* PANEL NOTIF */}
  {showNotif && (

    <div
      className="
        absolute
        top-[75px]
        right-0
        w-[340px]
        bg-white
        rounded-[30px]
        border
        border-slate-200
        shadow-2xl
        p-5
        z-50
      "
    >

      {/* HEADER */}
      <div className="mb-4">

        <h2
          className="
            text-[13px]
            font-black
            tracking-[1px]
            text-slate-400
          "
        >
          NOTIFIKASI (3)
        </h2>

      </div>

      {/* LIST */}
      <div
        className="
          max-h-[260px]
          overflow-y-auto
          pr-1
          flex
          flex-col
          gap-4
        "
      >

        {/* ITEM */}
        <div
          className="
            bg-[#f8fafc]
            rounded-[22px]
            p-4
            border
            border-slate-200
          "
        >

          <h3
            className="
              text-[14px]
              font-black
              text-slate-700
              leading-relaxed
            "
          >
            User baru "Hamid Saputra" berhasil terdaftar
          </h3>

          <p
            className="
              text-[12px]
              text-slate-400
              font-bold
              mt-2
            "
          >
            Baru saja
          </p>

        </div>

        {/* ITEM */}
        <div
          className="
            bg-[#f8fafc]
            rounded-[22px]
            p-4
            border
            border-slate-200
          "
        >

          <h3
            className="
              text-[14px]
              font-black
              text-slate-700
              leading-relaxed
            "
          >
            Laporan baru masuk untuk produk
            "iPhone 15 Pro Max"
          </h3>

          <p
            className="
              text-[12px]
              text-slate-400
              font-bold
              mt-2
            "
          >
            5 menit lalu
          </p>

        </div>

        {/* ITEM */}
        <div
          className="
            bg-[#f8fafc]
            rounded-[22px]
            p-4
            border
            border-slate-200
          "
        >

          <h3
            className="
              text-[14px]
              font-black
              text-slate-700
              leading-relaxed
            "
          >
            Voucher GLOBAL "HEMAT10"
            berhasil diaktifkan
          </h3>

          <p
            className="
              text-[12px]
              text-slate-400
              font-bold
              mt-2
            "
          >
            20 menit lalu
          </p>

        </div>

      </div>

    </div>

  )}

</div>
              

            </div>

            {/* BUTTON */}
            <div className="flex items-center gap-3">

              <button
                onClick={downloadExcel}
                className="
                  h-[48px]
                  px-6
                  rounded-[16px]
                  bg-[#e8faf1]
                  border
                  border-emerald-200
                  text-emerald-700
                  font-black
                  text-[13px]
                  flex
                  items-center
                  gap-2
                  shadow-sm
                "
              >

                <Layers size={16} />

                LAPORAN EXCEL

              </button>

              <button
                onClick={downloadPDF}
                className="
                  h-[48px]
                  px-6
                  rounded-[16px]
                  bg-[#fff1f3]
                  border
                  border-rose-200
                  text-rose-600
                  font-black
                  text-[13px]
                  flex
                  items-center
                  gap-2
                  shadow-sm
                "
              >

                <Download size={16} />

                RINGKASAN PDF

              </button>

            </div>

          </div>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-5 gap-5 mt-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="
                bg-white
                rounded-[28px]
                border
                border-slate-200
                p-7
                h-[190px]
                shadow-sm
                flex
                flex-col
                justify-between
              "
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    ${
                      index === 4
                        ? "bg-amber-50 text-amber-500"
                        : "bg-[#edf3ff] text-blue-600"
                    }
                  `}
                >

                  {item.icon}

                </div>

                <div
                  className={`
                    flex
                    items-center
                    gap-1
                    text-[13px]
                    font-black
                    ${
                      index === 4
                        ? "text-orange-500"
                        : "text-blue-600"
                    }
                  `}
                >

                  <ArrowUpRight size={14} />

                  {item.increase}

                </div>

              </div>

              {/* CONTENT */}
              <div>

                <p
                  className="
                    text-[12px]
                    font-black
                    tracking-[1px]
                    text-slate-400
                  "
                >

                  {item.title}

                </p>

                <h2
                  className={`
                    font-black
                    text-slate-900
                    leading-tight
                    whitespace-pre-line
                    mt-3
                    ${
                      index === 3
                        ? "text-[24px]"
                        : "text-[18px]"
                    }
                  `}
                >

                  {item.value}

                </h2>

              </div>

            </div>

          ))}

        </div>

        {/* ================= CHART + USER ================= */}
        <div className="grid grid-cols-12 gap-6 mt-7">

          {/* CHART */}
          <div
            className="
              col-span-8
              bg-white
              rounded-[34px]
              border
              border-slate-200
              p-7
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <h2 className="text-[16px] font-black text-slate-900">
                STATISTIK PENDAPATAN KUMULATIF
              </h2>

              <div className="flex items-center gap-2">

                <div className="w-3 h-3 rounded-full bg-blue-600"></div>

                <p className="text-[12px] font-black text-slate-500">
                  REVENUE
                </p>

              </div>

            </div>

            {/* CHART */}
            <div className="relative h-[320px] mt-6 overflow-hidden">

              {/* GRID */}
              <div className="absolute inset-0 flex flex-col justify-between">

                {[1,2,3,4,5].map((_,i)=>(

                  <div
                    key={i}
                    className="border-b border-dashed border-slate-200"
                  />

                ))}

              </div>

              {/* SVG */}
              <svg
                viewBox="0 0 900 320"
                className="absolute inset-0 w-full h-full"
              >

                <defs>

                  <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="#2563eb"
                      stopOpacity="0.3"
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
                    M40 240
                    C120 180 180 160 260 190
                    C340 220 390 210 460 140
                    C540 80 650 200 730 120
                    C790 70 850 50 880 40
                    L880 320
                    L40 320
                    Z
                  "
                  fill="url(#gradient)"
                />

                {/* LINE */}
                <path
                  d="
                    M40 240
                    C120 180 180 160 260 190
                    C340 220 390 210 460 140
                    C540 80 650 200 730 120
                    C790 70 850 50 880 40
                  "
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

              </svg>

              {/* BOTTOM */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  flex
                  justify-between
                  text-[12px]
                  text-slate-400
                  font-bold
                "
              >

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

          {/* USER */}
          <div
            className="
              col-span-4
              bg-white
              rounded-[34px]
              border
              border-slate-200
              p-7
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <h2 className="text-[16px] font-black text-slate-900">
                USER BARU
              </h2>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="text-blue-600 text-[12px] font-black"
              >
                LIHAT SEMUA
              </button>

            </div>

            <div className="mt-6 flex flex-col gap-4">

              {users.map((user, index) => (

                <div
                  key={index}
                  className="
                    bg-[#f8fafc]
                    rounded-[22px]
                    p-4
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        bg-[#edf3ff]
                        flex
                        items-center
                        justify-center
                        text-blue-600
                        font-black
                      "
                    >

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

                  <div className="text-emerald-500">
                    ✓
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ================= REPORT ================= */}
        {/* ================= REPORT ================= */}
<div
  className="
    bg-white
    rounded-[34px]
    border
    border-slate-200
    p-7
    shadow-sm
    mt-7
  "
>

  {/* HEADER */}
  <div className="flex items-center justify-between">

    <h2 className="text-[16px] font-black text-slate-900">
      LAPORAN TERBARU
    </h2>

    <button
      onClick={() =>
        navigate("/admin/reports")
      }
      className="text-blue-600 text-[12px] font-black"
    >
      LIHAT SEMUA
    </button>

  </div>

  {/* REPORT LIST */}
  <div className="grid grid-cols-2 gap-5 mt-7">

    {/* ITEM 1 */}
    <div
      className="
        bg-[#f8fafc]
        rounded-[24px]
        p-6
        flex
        items-center
        justify-between
        border
        border-slate-200
      "
    >

      {/* LEFT */}
      <div className="flex items-center gap-5">

        {/* ICON */}
        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-amber-50
            text-amber-500
            flex
            items-center
            justify-center
            text-[20px]
            font-black
          "
        >
          !
        </div>

        {/* CONTENT */}
        <div>

          <h3
            className="
              font-black
              text-slate-900
              text-[15px]
              uppercase
              leading-tight
            "
          >
            DESAIN & DESKRIPSI TIDAK SESUAI
          </h3>

          <p
            className="
              text-slate-400
              text-[11px]
              font-black
              tracking-[1px]
              uppercase
              mt-1
            "
          >
            OLEH: HAMID SAPUTRA
          </p>

        </div>

      </div>

      {/* STATUS */}
      <div
        className="
          bg-amber-100
          text-amber-600
          px-4
          h-9
          rounded-xl
          flex
          items-center
          font-black
          text-[11px]
          whitespace-nowrap
        "
      >
        PENDING
      </div>

    </div>

    {/* ITEM 2 */}
    <div
      className="
        bg-[#f8fafc]
        rounded-[24px]
        p-6
        flex
        items-center
        justify-between
        border
        border-slate-200
      "
    >

      {/* LEFT */}
      <div className="flex items-center gap-5">

        {/* ICON */}
        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-amber-50
            text-amber-500
            flex
            items-center
            justify-center
            text-[20px]
            font-black
          "
        >
          !
        </div>

        {/* CONTENT */}
        <div>

          <h3
            className="
              font-black
              text-slate-900
              text-[15px]
              uppercase
              leading-tight
            "
          >
            MELAKUKAN SPAM CHAT & PROMOSI LUAR
          </h3>

          <p
            className="
              text-slate-400
              text-[11px]
              font-black
              tracking-[1px]
              uppercase
              mt-1
            "
          >
            OLEH: TOKO HAMID JAYA
          </p>

        </div>

      </div>

      {/* STATUS */}
      <div
        className="
          bg-amber-100
          text-amber-600
          px-4
          h-9
          rounded-xl
          flex
          items-center
          font-black
          text-[11px]
          whitespace-nowrap
        "
      >
        PENDING
      </div>

    </div>

  </div>

</div>
          


        </div>




              {/* ================= ANALISIS KEPUASAN ================= */}
        <div
          className="
            bg-white
            rounded-[35px]
            border
            border-slate-200
            p-8
            shadow-sm
            mt-8
          "
        >

          {/* HEADER */}
          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-[30px] font-black text-slate-900">
                ANALISIS KEPUASAN & ULASAN PENGGUNA
              </h2>

              <p
                className="
                  text-slate-400
                  text-[13px]
                  font-black
                  tracking-[1px]
                  uppercase
                  mt-1
                "
              >
                RATING APLIKASI TERKINI DARI PEMBELI DAN PENJUAL TERDAFTAR
              </p>

            </div>

            {/* BADGE */}
            <div
              className="
                h-[52px]
                px-6
                rounded-[18px]
                bg-amber-50
                border
                border-amber-200
                text-amber-500
                font-black
                text-[18px]
                flex
                items-center
                gap-2
              "
            >

              ★ 4.8 DARI 5.0 BINTANG

            </div>

          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-12 gap-8 mt-8">

            {/* LEFT */}
            <div
              className="
                col-span-4
                bg-[#f8fafc]
                rounded-[30px]
                p-8
                border
                border-slate-200
              "
            >

              {/* SCORE */}
              <div className="text-center">

                <h1
                  className="
                    text-[70px]
                    font-black
                    text-slate-900
                    leading-none
                  "
                >
                  4.8
                </h1>

                <div className="flex justify-center gap-1 mt-4 text-[34px] text-amber-400">
                  ★ ★ ★ ★ ★
                </div>

                <p
                  className="
                    text-slate-400
                    font-black
                    text-[15px]
                    mt-4
                    tracking-[1px]
                  "
                >
                  96% KEPUASAN PELANGGAN
                </p>

              </div>

              {/* BAR */}
              <div className="mt-10 space-y-5">

                {[
                  {
                    star: "5",
                    percent: "85%",
                    width: "85%",
                  },
                  {
                    star: "4",
                    percent: "11%",
                    width: "11%",
                  },
                  {
                    star: "3",
                    percent: "3%",
                    width: "3%",
                  },
                  {
                    star: "2",
                    percent: "1%",
                    width: "1%",
                  },
                  {
                    star: "1",
                    percent: "0%",
                    width: "0%",
                  },
                ].map((item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >

                    <p className="w-[15px] text-slate-600 font-black">
                      {item.star}
                    </p>

                    <div
                      className="
                        flex-1
                        h-[10px]
                        rounded-full
                        bg-slate-200
                        overflow-hidden
                      "
                    >

                      <div
                        className="
                          h-full
                          rounded-full
                          bg-amber-400
                        "
                        style={{
                          width: item.width,
                        }}
                      />

                    </div>

                    <p
                      className="
                        w-[50px]
                        text-right
                        text-slate-600
                        font-black
                        text-sm
                      "
                    >
                      {item.percent}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* RIGHT */}
            <div
              className="
                col-span-8
                max-h-[430px]
                overflow-y-auto
                pr-2
                flex
                flex-col
                gap-5
              "
            >

              {[
                {
                  name: "SITI RAHMA",
                  role: "PEMBELI",
                  letter: "S",
                  date: "21/05/2026 14:15",
                  review:
                    "Sangat mudah digunakan untuk belanja dari produsen lokal! Fitur chat cepat dan responsif.",
                },
                {
                  name: "TOKO BUDI JAYA",
                  role: "PENJUAL",
                  letter: "T",
                  date: "20/05/2026 18:30",
                  review:
                    "Sistem komisi sangat bersahabat dibanding ecommerce lain, dan pencairan cepat.",
                },
                {
                  name: "DEWI LESTARI",
                  role: "PEMBELI",
                  letter: "D",
                  date: "19/05/2026 11:10",
                  review:
                    "Tampilan modern dan nyaman digunakan setiap hari.",
                },
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-[#f8fafc]
                    rounded-[28px]
                    p-6
                    border
                    border-slate-200
                  "
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between">

                    <div className="flex items-start gap-4">

                      {/* AVATAR */}
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-slate-200
                          text-slate-700
                          font-black
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {item.letter}
                      </div>

                      {/* INFO */}
                      <div>

                        <div className="flex items-center gap-3">

                          <h3 className="font-black text-slate-900">
                            {item.name}
                          </h3>

                          <span
                            className={`
                              px-3
                              py-1
                              rounded-lg
                              text-[11px]
                              font-black
                              ${
                                item.role === "PEMBELI"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-amber-100 text-amber-600"
                              }
                            `}
                          >
                            {item.role}
                          </span>

                        </div>

                        {/* STAR */}
                        <div className="flex gap-1 text-amber-400 mt-2">
                          ★ ★ ★ ★ ★
                        </div>

                      </div>

                    </div>

                    {/* DATE */}
                    <p
                      className="
                        text-slate-400
                        text-sm
                        font-bold
                      "
                    >
                      {item.date}
                    </p>

                  </div>

                  {/* REVIEW */}
                  <div
                    className="
                      mt-5
                      bg-white
                      rounded-[20px]
                      p-5
                      text-slate-600
                      text-[15px]
                      leading-relaxed
                    "
                  >

                    "{item.review}"

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      
    </AdminLayout>
  );
}

export default DashboardAdmin; 