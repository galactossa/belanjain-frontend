import {
  Search,
  Bell,
  Eye,
  MessageSquare,
  Download,
  Check,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function OrdersSeller() {
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [selectedOrder, setSelectedOrder] =
  useState(null);
const [resiInput, setResiInput] = useState({});
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "Budi Santoso",
      product: "IPHONE 15 PRO MAX - 256GB TI...",
      total: "Rp 18.999.000",
      qty: 1,
      address: "Jakarta Selatan",
      status: "MENUNGGU PEMBAYARAN",
      statusColor:
        "bg-orange-100 text-orange-500",
      initial: "B",
    },

    {
      id: "ORD-002",
      customer: "Siti Aminah",
      product: "SONY WH-1000XM5 NOISE CAN...",
      total: "Rp 4.599.000",
      qty: 2,
      address: "Bandung",
      status: "DIKIRIM",
      statusColor:
        "bg-blue-100 text-blue-500",
      initial: "S",
      resi: "RESI: REG849294119",
    },

    {
      id: "ORD-003",
      customer: "Andi Wijaya",
      product: "MACBOOK AIR M2 - MIDNIGHT ...",
      total: "Rp 16.499.000",
      qty: 3,
      address: "Surabaya",
      status: "SELESAI",
      statusColor:
        "bg-emerald-100 text-emerald-500",
      initial: "A",
    },

    {
      id: "ORD-004",
      customer: "Dewi Lestari",
      product: "BASIC WEAR - PREMIUM HOODIE",
      total: "Rp 199.000",
      qty: 4,
      address: "Medan",
      status: "DIPROSES",
      statusColor:
        "bg-purple-100 text-purple-500",
      initial: "D",
      inputResi: true,
    },
  ]);

  const updateResi = (id, resi) => {
    if (!resi) return;

    const updated = orders.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          resi: `RESI: ${resi}`,
          status: "DIKIRIM",
          statusColor:
            "bg-blue-100 text-blue-500",
          inputResi: false,
        };
      }

      return item;
    });

    setOrders(updated);
  };
  const downloadReport = () => {
  const headers = [
    "ID Pesanan",
    "Pelanggan",
    "Produk",
    "Total",
    "Status",
  ];

  const rows = orders.map((item) => [
    item.id,
    item.customer,
    item.product,
    item.total,
    item.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "laporan-pesanan.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const filteredOrders = orders.filter(
    (item) => {
      const matchSearch =
        item.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.product
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        activeTab === "SEMUA"
          ? true
          : item.status === activeTab;

      return (
        matchSearch &&
        matchStatus
      );
    }
  );

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-7">

          {/* LEFT */}
          <div>

            <h1
              className="
              text-[38px]
              font-black
              uppercase
              text-slate-900
              leading-none
            "
            >
              Daftar Pesanan
            </h1>

            <p
              className="
              text-[11px]
              uppercase
              tracking-[2px]
              font-black
              text-slate-400
              mt-2
            "
            >
              Pantau dan proses pesanan pelanggan anda.
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div
              className="
              w-[300px]
              h-11
              rounded-2xl
              bg-white
              border
              border-slate-200
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
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  placeholder="Cari pesanan atau produk..."
              />

            </div>

            {/* NOTIF */}
         <div className="relative">
  <button
    onClick={() => setShowNotif(!showNotif)}
    className="
      w-11
      h-11
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
      size={17}
      className="text-slate-500"
    />
  </button>

 {showNotif && (
  <div
    className="
      absolute
      top-14
      right-0
      w-[320px]
      bg-white
      rounded-3xl
      shadow-xl
      border
      border-slate-200
      p-4
      z-[999]
    "
  >
    <h3 className="font-black mb-4">
      Notifikasi Masuk
    </h3>

    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-slate-50">
        Pesanan baru dari Budi Santoso
      </div>

      <div className="p-3 rounded-xl bg-slate-50">
        Pesanan ORD-004 siap dikirim
      </div>
    </div>
  </div>
)}
</div>

            {/* BUTTON */}
            <button
  onClick={() => navigate("/seller/add-product")}
  className="
  h-11
  px-5
  rounded-2xl
  bg-blue-600
  text-white
  text-[12px]
  font-black
  shadow-lg
  hover:bg-blue-700
  duration-300
"
>
  + PRODUK BARU
</button>

          </div>

        </div>

        {/* FILTER */}
        <div
          className="
          bg-white
          border
          border-slate-200
          rounded-[28px]
          p-4
          flex
          items-center
          justify-between
          shadow-sm
        "
        >

          {/* LEFT */}
         <div className="flex items-center gap-2 flex-wrap">

  {[
    "SEMUA",
    "MENUNGGU PEMBAYARAN",
    "DIPROSES",
    "DIKIRIM",
    "SELESAI",
  ].map((status) => (
    <button
      key={status}
      onClick={() =>
        setActiveTab(status)
      }
      className={`
        h-10
        px-4
        rounded-xl
        text-[11px]
        font-black
        uppercase
        duration-200
        ${
          activeTab === status
            ? "bg-blue-600 text-white shadow-md"
            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
        }
      `}
    >
      {status}
    </button>
  ))}

</div>

          {/* RIGHT */}
          <button
  onClick={downloadReport}
  className="
    h-10
    px-5
    rounded-xl
    border
    border-slate-200
    bg-slate-50
    text-blue-600
    text-[11px]
    font-black
    flex
    items-center
    gap-2
    hover:bg-blue-50
  "
>

            <Download size={14} />
            UNDUH LAPORAN

          </button>

        </div>

        {/* TABLE */}
        <div
          className="
          mt-5
          bg-white
          rounded-[30px]
          border
          border-slate-200
          overflow-hidden
          shadow-sm
        "
        >

          {/* TABLE HEADER */}
          <div
            className="
            grid
            grid-cols-[1fr_1.4fr_2fr_1.2fr_1.3fr_1fr]
            px-6
            py-5
            text-[10px]
            uppercase
            tracking-[2px]
            font-black
            text-slate-400
          "
          >

            <p>ID PESANAN</p>
            <p>PELANGGAN</p>
            <p>PRODUK</p>
            <p>TOTAL</p>
            <p>STATUS</p>
            <p className="text-center">
              AKSI
            </p>

          </div>

          {/* BODY */}
          {filteredOrders.map((item, index) => (
            <div
              key={index}
              className="
              grid
              grid-cols-[1fr_1.4fr_2fr_1.2fr_1.3fr_1fr]
              items-center
              px-6
              py-4
              border-t
              border-slate-100
              hover:bg-slate-50
              duration-200
            "
            >

              {/* ID */}
              <div
                className="
                text-[14px]
                font-black
                text-slate-900
              "
              >
                {item.id}
              </div>

              {/* CUSTOMER */}
              <div className="flex items-center gap-3">

                <div
                  className="
                  w-8
                  h-8
                  rounded-full
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  text-[11px]
                  font-black
                "
                >
                  {item.initial}
                </div>

                <p
                  className="
                  text-[13px]
                  font-semibold
                  text-slate-700
                "
                >
                  {item.customer}
                </p>

              </div>

              {/* PRODUCT */}
              <div
                className="
                text-[12px]
                font-black
                text-slate-500
                uppercase
              "
              >
                {item.product}
              </div>

              {/* TOTAL */}
              <div
                className="
                text-[16px]
                font-black
                text-slate-900
              "
              >
                {item.total}
              </div>

             {/* STATUS */}
<div>

  <span
    className={`
    px-3
    py-1
    rounded-full
    text-[10px]
    font-black
    ${item.statusColor}
  `}
  >
    ● {item.status}
  </span>

</div>

              {/* ACTION */}
<div className="flex items-center justify-center gap-2">

  {item.resi && (
    <span
      className="
      px-3
      py-2
      rounded-lg
      bg-slate-100
      text-[10px]
      font-black
      text-slate-400
    "
    >
      {item.resi}
    </span>
  )}

  {item.inputResi && (
    <div className="flex items-center gap-2">

      <input
  type="text"
  placeholder="Input resi..."
  value={resiInput[item.id] || ""}
  onChange={(e) =>
    setResiInput({
      ...resiInput,
      [item.id]: e.target.value,
    })
  }
  className="
    h-8
    w-[120px]
    rounded-lg
    border
    border-slate-200
    px-3
    text-[10px]
    outline-none
  "
/>

     <button
  onClick={() =>
    updateResi(
      item.id,
      resiInput[item.id]
    )
    
  }
  className="
  w-8
  h-8
  rounded-lg
  bg-blue-600
  text-white
  flex
  items-center
  justify-center
  hover:bg-blue-700
  "
>
  <Check size={14} />
</button>

    </div>
  )}

<button
  onClick={() =>
    setSelectedOrder(item)
  }
  className="
  w-8
  h-8
  rounded-lg
  bg-slate-100
  flex
  items-center
  justify-center
  text-slate-400
"
>
  <Eye size={14} />
</button>

 <button
  onClick={() => navigate("/seller/chat")}
  className="
  w-8
  h-8
  rounded-lg
  bg-blue-100
  flex
  items-center
  justify-center
  text-blue-600
"
>
  <MessageSquare size={14} />
</button>

</div>

            </div>
          ))}

        </div>
        {selectedOrder && (
  <div
    className="
    fixed
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-50
  "
  >
    <div
      className="
      bg-white
      w-[600px]
      rounded-3xl
      p-8
      shadow-xl
    "
    >
      <div className="flex justify-between mb-6">

        <div>
          <h2 className="text-2xl font-black">
            DETAIL PESANAN
          </h2>

          <p className="text-slate-400 text-sm">
            {selectedOrder.id}
          </p>
        </div>

        <button
          onClick={() =>
            setSelectedOrder(null)
          }
          className="
          w-10
          h-10
          rounded-full
          bg-slate-100
        "
        >
          ✕
        </button>

      </div>

      <div className="space-y-4">

        <div>
          <p className="text-slate-400">
            Pelanggan
          </p>

          <p className="font-bold">
            {selectedOrder.customer}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Produk
          </p>

          <p className="font-bold">
            {selectedOrder.product}
          </p>
        </div>
        <div>
  <p className="text-slate-400">
    Jumlah
  </p>

  <p className="font-bold">
    {selectedOrder.qty} pcs
  </p>
</div>

<div>
  <p className="text-slate-400">
    Alamat Pengiriman
  </p>

  <p className="font-bold">
    {selectedOrder.address}
  </p>
</div>

        <div>
          <p className="text-slate-400">
            Total
          </p>

          <p className="font-bold text-xl">
            {selectedOrder.total}
          </p>
        </div>

        <div>
          <p className="text-slate-400">
            Status
          </p>

          <p className="font-bold">
            {selectedOrder.status}
          </p>
        </div>

      </div>

      <button
        onClick={() =>
          setSelectedOrder(null)
        }
        className="
        mt-8
        w-full
        h-12
        rounded-xl
        bg-blue-600
        text-white
        font-black
      "
      >
        TUTUP
      </button>

    </div>
  </div>
)}

      </div>
    </SellerLayout>
  );
}

export default OrdersSeller;