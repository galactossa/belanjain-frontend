// ================= src/pages/customer/Orders.jsx =================
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, ChevronRight, Clock } from "lucide-react";
import api from "../../api/api";
import OrderDetailModal from "../../components/customer/OrderDetailModal";
import TrackingModal from "../../components/customer/TrackingModal";
import ReviewModal from "../../components/customer/ReviewModal";
import ComplaintModal from "../../components/customer/ComplaintModal";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  console.log("🔍 Orders page loaded, currentUser:", currentUser);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id_pengguna) {
        console.log("⚠️ No user id found, skipping fetch");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        console.log("🔍 Fetching orders for user:", currentUser.id_pengguna);
        const response = await api.get(
          `/pesanan/pengguna/${currentUser.id_pengguna}`,
        );
        console.log("✅ Orders response:", response.data);

        const formattedOrders = (response.data.data || []).map((order) => ({
          ...order,
          id: order.id_pesanan,
          customer: currentUser.name || "User",
          userId: currentUser.id_pengguna,
          total: order.harga_akhir || 0,
          status: order.status || "Menunggu",
          date:
            order.created_at?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          address: order.alamat || "-",
          products:
            order.items?.map((item) => ({
              id: item.id_produk,
              name: item.nama_produk || "Produk",
              image: item.url_gambar || "https://via.placeholder.com/100",
              price: item.harga || 0,
              qty: item.jumlah || 1,
              sellerId: item.seller_id || null,
            })) || [],
          shippingName: order.nama_penerima || currentUser.name,
          shippingAddress: order.alamat || "-",
          paymentMethod: order.metode_pembayaran || "-",
          paymentStatus: order.status_pembayaran || "belum_bayar",
          resi: order.nomor_resi || null,
        }));

        console.log("✅ Formatted orders:", formattedOrders);
        setOrders(formattedOrders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser?.id_pengguna]);

  const tabs = [
    "Semua",
    "Menunggu",
    "Diproses",
    "Dikirim",
    "Selesai",
    "Dibatalkan",
    "Komplain",
  ];

  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (activeTab !== "Semua") {
      data = data.filter((o) =>
        (o.status || "").toLowerCase().includes(activeTab.toLowerCase()),
      );
    }
    if (search.trim()) {
      data = data.filter((order) =>
        order.products?.some((p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
    return data;
  }, [orders, search, activeTab]);

  const statusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu"))
      return "bg-amber-50 text-amber-600 border border-amber-200";
    if (s.includes("diproses"))
      return "bg-blue-50 text-blue-600 border border-blue-200";
    if (s.includes("dikirim")) return "bg-purple-100 text-purple-600";
    if (s.includes("selesai")) return "bg-green-100 text-green-600";
    if (s.includes("dibatalkan")) return "bg-red-100 text-red-600";
    if (s.includes("komplain")) return "bg-pink-100 text-pink-600";
    return "bg-slate-100 text-slate-500";
  };

  const handleBuyAgain = (order) => {
    const cartKey = currentUser?.id_pengguna
      ? `cart_${currentUser.id_pengguna}`
      : "cart";
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    order.products?.forEach((product) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        existing.qty = (existing.qty || 1) + (product.qty || 1);
      } else {
        currentCart.push({ ...product, qty: product.qty || 1 });
      }
    });
    localStorage.setItem(cartKey, JSON.stringify(currentCart));
    navigate("/customer?showCart=true");
  };

  const handleComplaintSubmit = (payload) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === payload.orderId ? { ...o, status: "Komplain" } : o,
      ),
    );
    setShowComplaint(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen">
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/customer")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="font-black text-lg uppercase tracking-[1px]">
              Daftar Transaksi
            </h1>
            <span className="text-sm text-slate-400 ml-2">
              ({orders.length} pesanan)
            </span>
          </div>
          <div className="w-[280px] relative">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full h-9 rounded-lg bg-slate-100 pl-10 outline-none font-semibold text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 h-8 rounded-full text-xs font-bold uppercase tracking-wide duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package size={64} className="mx-auto text-slate-300 mb-6" />
            <h1 className="text-2xl lg:text-3xl font-black">
              Tidak ada transaksi
            </h1>
            <p className="text-slate-500 mt-2">
              {orders.length === 0
                ? "Belum ada pesanan yang dibuat"
                : "Tidak ada pesanan dengan filter ini"}
            </p>
            <button
              onClick={() => navigate("/customer")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <Package size={18} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[11px] tracking-widest text-slate-400 font-bold uppercase">
                            BELANJA
                          </p>
                          <h2 className="font-black text-base text-slate-900">
                            {order.date}
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor(order.status)}`}
                      >
                        <Clock size={12} />
                        {order.status}
                      </div>
                      <p className="text-slate-400 text-sm">#{order.id}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="grid lg:grid-cols-[1fr_220px] bg-slate-50 rounded-2xl overflow-hidden border">
                      <div className="p-4 space-y-3">
                        {order.products?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-extrabold text-base truncate">
                                {item.name}
                              </h3>
                              <p className="text-slate-500 text-sm">
                                x {item.qty}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-l bg-white px-6 flex flex-col justify-center">
                        <p className="text-sm text-slate-500">Total Belanja</p>
                        <h3 className="text-base font-black text-slate-900 mt-1">
                          Rp {Number(order.total).toLocaleString("id-ID")}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t bg-slate-50 px-6 py-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <span className="font-extrabold text-sm tracking-[2px]">
                          LIHAT DETAIL
                        </span>
                        <ChevronRight size={16} />
                      </button>

                      {/* 🔥 TOMBOL BATALKAN - HANYA UNTUK STATUS MENUNGGU */}
                      {(order.status || "").toLowerCase() === "menunggu" && (
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Yakin ingin membatalkan pesanan #${order.id}?`,
                              )
                            ) {
                              try {
                                await api.put(`/pesanan/${order.id}/cancel`);
                                alert("✅ Pesanan berhasil dibatalkan");
                                // Refresh orders
                                const response = await api.get(
                                  `/pesanan/pengguna/${currentUser.id_pengguna}`,
                                );
                                const formattedOrders = (
                                  response.data.data || []
                                ).map((o) => ({
                                  ...o,
                                  id: o.id_pesanan,
                                  customer: currentUser.name || "User",
                                  userId: currentUser.id_pengguna,
                                  total: o.harga_akhir || 0,
                                  status: o.status || "Menunggu",
                                  date:
                                    o.created_at?.split("T")[0] ||
                                    new Date().toISOString().split("T")[0],
                                  address: o.alamat || "-",
                                  products:
                                    o.items?.map((item) => ({
                                      id: item.id_produk,
                                      name: item.nama_produk || "Produk",
                                      image:
                                        item.url_gambar ||
                                        "https://via.placeholder.com/100",
                                      price: item.harga || 0,
                                      qty: item.jumlah || 1,
                                      sellerId: item.seller_id || null,
                                    })) || [],
                                  shippingName:
                                    o.nama_penerima || currentUser.name,
                                  shippingAddress: o.alamat || "-",
                                  paymentMethod: o.metode_pembayaran || "-",
                                  paymentStatus:
                                    o.status_pembayaran || "belum_bayar",
                                  resi: o.nomor_resi || null,
                                }));
                                setOrders(formattedOrders);
                              } catch (error) {
                                console.error(
                                  "❌ Error canceling order:",
                                  error,
                                );
                                alert(
                                  error.response?.data?.message ||
                                    "Gagal membatalkan pesanan",
                                );
                              }
                            }
                          }}
                          className="h-11 px-6 rounded-xl bg-red-50 text-red-600 font-extrabold text-xs tracking-wider uppercase hover:bg-red-100"
                        >
                          BATALKAN
                        </button>
                      )}

                      {/* KOMPLAIN - HANYA UNTUK PESANAN SELESAI */}
                      {(order.status || "")
                        .toLowerCase()
                        .includes("selesai") && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowComplaint(true);
                          }}
                          className="h-11 px-6 rounded-xl bg-pink-50 text-pink-600 font-extrabold text-xs tracking-wider uppercase hover:bg-pink-100"
                        >
                          KOMPLAIN
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {(order.status || "")
                        .toLowerCase()
                        .includes("dikirim") && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowTracking(true);
                          }}
                          className="h-11 px-6 rounded-xl bg-blue-600 text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:bg-blue-700"
                        >
                          LACAK
                        </button>
                      )}
                      {!(order.status || "")
                        .toLowerCase()
                        .includes("dibatalkan") && (
                        <button
                          onClick={() => handleBuyAgain(order)}
                          className="h-11 px-6 rounded-xl bg-white border border-slate-300 text-slate-700 font-extrabold text-xs tracking-wider uppercase hover:bg-slate-50"
                        >
                          BELI LAGI
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <OrderDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        order={selectedOrder}
        onOpenTracking={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          setShowTracking(true);
        }}
        onOpenComplaint={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          setShowComplaint(true);
        }}
        onBuyAgain={(o) => {
          setSelectedOrder(o);
          setShowModal(false);
          handleBuyAgain(o);
        }}
      />

      <TrackingModal
        show={showTracking}
        onClose={() => setShowTracking(false)}
        order={selectedOrder}
      />
      <ReviewModal
        show={showReview}
        onClose={() => setShowReview(false)}
        order={selectedOrder}
        onSubmit={() => {}}
      />
      <ComplaintModal
        show={showComplaint}
        onClose={() => setShowComplaint(false)}
        order={selectedOrder}
        onSubmit={handleComplaintSubmit}
      />
    </div>
  );
}

export default Orders;
