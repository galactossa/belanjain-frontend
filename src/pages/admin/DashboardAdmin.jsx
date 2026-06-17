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
import { notifications as defaultNotifications } from "../../data/notifications";
import { products } from "../../data/products";
import { users as usersData } from "../../data/users";
import { orders } from "../../data/orders";
import { sellers } from "../../data/sellers";
import { reviews } from "../../data/reviews";

function DashboardAdmin() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState(() =>
    defaultNotifications.filter((item) => item.role === "admin"),
  );
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const downloadRef = useRef();
  const [chartMounted, setChartMounted] = useState(false);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalUsers = usersData.length;
  const totalProducts = products.length;
  const totalTransactions = orders.length;
  const totalRevenue = orders.reduce(
    (acc, order) => acc + Number(order.total || 0),
    0,
  );
  const averageRating = products.length
    ? (
        products.reduce((acc, item) => acc + Number(item.rating || 0), 0) /
        products.length
      ).toFixed(1)
    : "0.0";

  const totalReviews = reviews.length;
  const averageReviewRating = totalReviews
    ? (
        reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0) /
        totalReviews
      ).toFixed(1)
    : "0.0";

  const satisfactionPercent = totalReviews
    ? Math.round(
        (reviews.filter((review) => Number(review.rating) >= 4).length /
          totalReviews) *
          100,
      )
    : 0;

  const reviewDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (review) => Math.round(Number(review.rating || 0)) === star,
    ).length;

    return {
      star,
      count,
      percent: totalReviews
        ? `${Math.round((count / totalReviews) * 100)}%`
        : "0%",
      width: totalReviews
        ? `${Math.round((count / totalReviews) * 100)}%`
        : "0%",
    };
  });

  const recentReviews = [...reviews]
    .sort((a, b) => {
      const parseDate = (value) => {
        const [day, month, year] = value.split("/");
        return new Date(`${year}-${month}-${day}`);
      };

      return parseDate(b.date) - parseDate(a.date);
    })
    .slice(0, 3)
    .map((review) => ({
      ...review,
      role:
        usersData.find((user) => user.id === review.reviewerId)?.role ===
        "seller"
          ? "PENJUAL"
          : "PEMBELI",
      letter: review.reviewerName.charAt(0).toUpperCase(),
      stars: Array(Math.round(Number(review.rating || 0))).fill("★"),
    }));

  const pathLength = 3000;

  const recentUsers = [...usersData]
    .filter((user) => user.role !== "admin")
    .sort((a, b) => b.id - a.id)
    .slice(0, 3)
    .map((user) => ({
      name: user.storeName || user.name || "User",
      role: user.role === "customer" ? "PEMBELI" : user.role.toUpperCase(),
      letter: (user.storeName || user.name || "U").charAt(0).toUpperCase(),
    }));

  /* ================= DOWNLOAD EXCEL ================= */
  const downloadExcel = () => {
    const content = `
LAPORAN BELANJAIN

TOTAL USER : ${totalUsers}
TOTAL PRODUK : ${totalProducts}
TOTAL TRANSAKSI : ${totalTransactions}
TOTAL REVENUE : Rp ${totalRevenue.toLocaleString("id-ID")}
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

TOTAL USER : ${totalUsers}
TOTAL PRODUK : ${totalProducts}
TOTAL TRANSAKSI : ${totalTransactions}
TOTAL REVENUE : Rp ${totalRevenue.toLocaleString("id-ID")}
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
      value: `★ ${averageRating} / 5.0`,
      icon: <Star size={22} />,
      increase: `${products.length} Produk`,
    },
  ];

  const users = recentUsers;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] px-7 py-6">
        {/* ================= TOP ================= */}
        <div className="flex items-center justify-between gap-6">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-3">
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
                    ${index === 4 ? "text-orange-500" : "text-blue-600"}
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
                    ${index === 3 ? "text-[24px]" : "text-[18px]"}
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
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-black text-slate-900">
                STATISTIK PENDAPATAN KUMULATIF
              </h2>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>

                <p className="text-[12px] font-black text-slate-500">REVENUE</p>
              </div>
            </div>

            {/* CHART */}
            <div
              className={`relative h-[320px] mt-6 overflow-hidden transition-all duration-700 ease-out ${
                chartMounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {/* GRID */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((_, i) => (
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
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />

                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
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
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from={pathLength}
                    to="0"
                    dur="1.5s"
                    fill="freeze"
                  />
                </path>
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

                  <div className="text-emerald-500">✓</div>
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
              onClick={() => navigate("/admin/reports")}
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
            ★ {averageReviewRating} DARI 5.0 BINTANG
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
                {averageReviewRating}
              </h1>

              <div className="flex justify-center gap-1 mt-4 text-[34px] text-amber-400">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <span key={index}>★</span>
                  ))}
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
                {satisfactionPercent}% KEPUASAN PELANGGAN
              </p>
            </div>

            {/* BAR */}
            <div className="mt-10 space-y-5">
              {reviewDistribution.map((item) => (
                <div key={item.star} className="flex items-center gap-4">
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
            {recentReviews.map((item, index) => (
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
                          {item.reviewerName}
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

                      <div className="mt-2 flex items-center gap-2 text-amber-400">
                        {item.stars.map((star, starIndex) => (
                          <span key={starIndex}>{star}</span>
                        ))}
                        <span className="text-slate-500 font-bold ml-2">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-slate-500 text-sm mt-2">
                        {item.productName} • {item.storeName}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="text-right">
                    <p className="text-slate-400 text-sm font-bold">
                      {item.date}
                    </p>
                    <p className="text-slate-400 text-[12px] mt-1">
                      {item.helpful} berguna
                    </p>
                  </div>
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
                  "{item.comment}"
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
