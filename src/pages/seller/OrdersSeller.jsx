import { Search, Bell, Eye, MessageSquare, Download } from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orders as ordersData } from "../../data/orders";
import { products } from "../../data/products";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { notifications as defaultNotifications } from "../../data/notifications";

function OrdersSeller() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [resiValue, setResiValue] = useState("");
  const [orders, setOrders] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const sellerNotifications =
    JSON.parse(
      localStorage.getItem(`sellerNotifications_${currentUser?.id}`),
    ) ??
    defaultNotifications.filter((notif) => notif.sellerId === currentUser?.id);

  const getProductInfo = (productId) =>
    products.find((product) => product.id === productId) || {};

  const getStatusColor = (status) => {
    switch (status) {
      case "MENUNGGU PEMBAYARAN":
        return "bg-yellow-100 text-yellow-700";
      case "DIPROSES":
        return "bg-orange-100 text-orange-700";
      case "DIKIRIM":
        return "bg-blue-100 text-blue-500";
      case "SELESAI":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  useEffect(() => {
    const persistedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const mergedOrders = ordersData.map((order) => {
      const persisted = persistedOrders.find((item) => item.id === order.id);
      return persisted ? { ...order, ...persisted } : order;
    });

    const normalized = mergedOrders.map((order) => {
      const product = getProductInfo(order.productId);
      return {
        ...order,
        product: product.name || "Produk tidak ditemukan",
        productImage: product.image || "",
        productCategory: product.category || "",
        productStore: product.store || "",
        initial: order.customer ? order.customer.charAt(0).toUpperCase() : "",
        statusColor: getStatusColor(order.status),
      };
    });

    const sellerOrders =
      currentUser?.role === "seller"
        ? normalized.filter((order) => order.sellerId === currentUser.id)
        : normalized;

    setOrders(sellerOrders);
  }, [currentUser]);

  const saveOrders = (nextOrders) => {
    setOrders(nextOrders);
    const persistedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const mergedOrders = ordersData.map((order) => {
      const next = nextOrders.find((item) => item.id === order.id);
      const persisted = persistedOrders.find((item) => item.id === order.id);
      return next
        ? { ...order, ...persisted, ...next }
        : persisted
          ? { ...order, ...persisted }
          : order;
    });

    localStorage.setItem("orders", JSON.stringify(mergedOrders));
  };

  const handleResiSave = (id) => {
    const value = resiValue.trim();
    if (!value) return;

    const nextOrders = orders.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          resi: `RESI: ${value}`,
          status: "DIKIRIM",
          statusColor: getStatusColor("DIKIRIM"),
        };
      }
      return item;
    });

    saveOrders(nextOrders);
    const updated = nextOrders.find((order) => order.id === id);
    setSelectedOrder(updated || null);
    setResiValue("");
  };

  const downloadReport = () => {
    const headers = ["ID Pesanan", "Pelanggan", "Produk", "Total", "Status"];
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

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-pesanan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((item) => {
    const query = search.toLowerCase();
    const matchSearch =
      item.id.toLowerCase().includes(query) ||
      item.customer.toLowerCase().includes(query) ||
      item.product.toLowerCase().includes(query);

    const matchStatus =
      activeTab === "SEMUA" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
  });

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedOrder?.productId),
    [selectedOrder],
  );

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-5">
          <div>
            <h1 className="text-[28px] md:text-[20px] font-black uppercase text-slate-900 leading-none">
              Daftar Pesanan
            </h1>
            <p className="text-xs uppercase tracking-[1.5px] font-black text-slate-400 mt-1.5">
              Pantau dan proses pesanan pelanggan anda.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px] h-11 rounded-2xl bg-white border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pesanan atau produk..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative"
                >
                  <Bell size={17} className="text-slate-500" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                    {sellerNotifications.length}
                  </span>
                </button>
                {showNotif && (
                  <ModalNotifications
                    notifications={sellerNotifications}
                    onReadAll={() => setShowNotif(false)}
                  />
                )}
              </div>

              <button
                onClick={() => navigate("/seller/add-product")}
                className="h-11 px-5 rounded-2xl bg-blue-600 text-white text-[12px] font-black shadow-lg hover:bg-blue-700 duration-300"
              >
                + PRODUK BARU
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-3 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              "SEMUA",
              "MENUNGGU PEMBAYARAN",
              "DIPROSES",
              "DIKIRIM",
              "SELESAI",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase duration-200 ${
                  activeTab === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button
            onClick={downloadReport}
            className="h-9 px-5 rounded-xl border border-slate-200 bg-slate-50 text-blue-600 text-[10px] font-black flex items-center gap-2 hover:bg-blue-50"
          >
            <Download size={14} />
            UNDUH LAPORAN
          </button>
        </div>

        <div className="mt-4 bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-[200px_160px_1fr_140px_140px_120px] px-5 py-4 text-[9px] uppercase tracking-[1.5px] font-black text-slate-400 bg-slate-50">
            <div>ID PESANAN</div>
            <div>PELANGGAN</div>
            <div>PRODUK</div>
            <div>TOTAL</div>
            <div>STATUS</div>
            <div className="text-center">AKSI</div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              Tidak ada pesanan yang cocok dengan pencarian atau filter.
            </div>
          ) : (
            filteredOrders.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[200px_160px_1fr_140px_140px_120px] items-center px-5 py-3 border-t border-slate-100 text-slate-700"
              >
                <div className="font-black text-slate-900 text-sm">
                  {item.id}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs flex-shrink-0">
                    {item.initial}
                  </div>
                  <span className="text-xs font-semibold truncate">
                    {item.customer}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase truncate">
                    {item.product}
                  </div>
                  <div className="text-[8px] text-slate-400 mt-0.5">
                    {item.productCategory}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-900">
                  Rp {item.total.toLocaleString("id-ID")}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black ${item.statusColor}`}
                  >
                    ● {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedOrder(item);
                      setResiValue("");
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => navigate("/seller/chat")}
                    className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white w-full max-w-[760px] rounded-[28px] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.15)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900">
                    Detail Pesanan
                  </h2>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.15em]">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-11 h-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-5">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Status Pesanan
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black ${getStatusColor(selectedOrder.status)}`}
                  >
                    ● {selectedOrder.status}
                  </span>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Tanggal Pemesanan
                  </p>
                  <p className="font-black text-slate-900 text-sm">
                    {selectedOrder.date}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-5">
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Info Pelanggan
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5">
                    ID Pengguna: {selectedOrder.id}
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Alamat Pengiriman
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 p-4 mb-5 bg-slate-50">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      selectedProduct?.image ||
                      selectedOrder.productImage ||
                      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={selectedOrder.product}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm">
                      {selectedOrder.product}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedProduct?.category ||
                        selectedOrder.productCategory}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedProduct?.store || selectedOrder.productStore}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 text-sm whitespace-nowrap">
                    Rp {selectedOrder.total.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-900 p-5 text-white mb-5">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Subtotal
                    </p>
                    <p className="font-black text-sm mt-1">
                      Rp {selectedOrder.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Ongkos Kirim
                    </p>
                    <p className="font-black text-sm mt-1">Rp 0</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Total Pembayaran
                    </p>
                    <p className="font-black text-base mt-1">
                      Rp {selectedOrder.total.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.resi ? (
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Resi Pengiriman
                  </p>
                  <p className="font-black text-slate-900 text-sm">
                    {selectedOrder.resi}
                  </p>
                </div>
              ) : selectedOrder.status === "DIPROSES" ? (
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 mb-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Input Resi
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={resiValue}
                      onChange={(e) => setResiValue(e.target.value)}
                      placeholder="Masukkan nomor resi"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none"
                    />
                    <button
                      onClick={() => handleResiSave(selectedOrder.id)}
                      className="h-10 rounded-xl bg-blue-600 px-5 text-xs font-black text-white hover:bg-blue-700 whitespace-nowrap"
                    >
                      Simpan Resi
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-black text-sm"
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
