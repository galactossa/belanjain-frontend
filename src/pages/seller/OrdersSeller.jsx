import { Search, Bell, Eye, MessageSquare, Download } from "lucide-react";
import SellerLayout from "../../layouts/SellerLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

function OrdersSeller() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [resiValue, setResiValue] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id_pengguna || currentUser?.id;

  // Fetch store and orders
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storeRes = await api.get(`/toko/user/${userId}`);
        const store = storeRes.data.data;
        setStoreId(store.id_toko);

        const ordersRes = await api.get(`/pesanan/toko/${store.id_toko}`);
        const ordersData = ordersRes.data.data || [];
        setOrders(
          ordersData.map((o) => ({
            ...o,
            id: o.id_pesanan,
            customer: o.nama_penerima || "-",
            total: o.harga_akhir || 0,
            status: o.status || "menunggu",
            date: o.created_at?.split("T")[0] || "-",
            address: o.alamat || "-",
            initial: (o.nama_penerima?.charAt(0) || "U").toUpperCase(),
          })),
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-yellow-100 text-yellow-700";
    if (s.includes("diproses")) return "bg-orange-100 text-orange-700";
    if (s.includes("dikirim")) return "bg-blue-100 text-blue-500";
    if (s.includes("selesai")) return "bg-emerald-100 text-emerald-700";
    if (s.includes("dibatalkan")) return "bg-red-100 text-red-600";
    return "bg-slate-100 text-slate-500";
  };

  // ================= 🔥 UPDATE STATUS (TANPA SELESAI) =================
  const updateOrderStatus = async (orderId, newStatus, resi = null) => {
    try {
      const payload = { status: newStatus };
      if (resi) payload.nomor_resi = resi;

      await api.put(`/pesanan/${orderId}/status`, payload);

      // Refresh orders
      const ordersRes = await api.get(`/pesanan/toko/${storeId}`);
      setOrders(
        ordersRes.data.data.map((o) => ({
          ...o,
          id: o.id_pesanan,
          customer: o.nama_penerima || "-",
          total: o.harga_akhir || 0,
          status: o.status || "menunggu",
          date: o.created_at?.split("T")[0] || "-",
          address: o.alamat || "-",
          initial: (o.nama_penerima?.charAt(0) || "U").toUpperCase(),
        })),
      );
      setSelectedOrder(null);
      alert(`✅ Status berhasil diupdate ke ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Gagal update status");
    }
  };

  const handleResiSave = async (id) => {
    const value = resiValue.trim();
    if (!value) {
      alert("Nomor resi wajib diisi!");
      return;
    }
    await updateOrderStatus(id, "dikirim", value);
  };

  const filteredOrders = orders.filter((item) => {
    const query = search.toLowerCase();
    const matchSearch =
      (item.id?.toString() || "").includes(query) ||
      (item.customer || "").toLowerCase().includes(query);
    const matchStatus =
      activeTab === "SEMUA"
        ? true
        : (item.status || "").toLowerCase().includes(activeTab.toLowerCase());
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-5">
          <div>
            <h1 className="text-[28px] md:text-[20px] font-black uppercase text-slate-900 leading-none">
              Daftar Pesanan
            </h1>
            <p className="text-xs uppercase tracking-[1.5px] font-black text-slate-400 mt-1.5">
              Pantau dan proses pesanan pelanggan
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px] h-11 rounded-2xl bg-white border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pesanan..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-3 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              "SEMUA",
              "MENUNGGU",
              "DIPROSES",
              "DIKIRIM",
              "SELESAI",
              "DIBATALKAN",
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

          {filteredOrders.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[200px_160px_1fr_140px_140px_120px] items-center px-5 py-3 border-t border-slate-100 text-slate-700"
            >
              <div className="font-black text-slate-900 text-sm">
                #{item.id}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                  {item.initial}
                </div>
                <span className="text-xs font-semibold truncate">
                  {item.customer}
                </span>
              </div>
              <div className="text-xs font-black text-slate-900 uppercase truncate">
                {item.produk || "-"}
              </div>
              <div className="text-xs font-black text-slate-900">
                Rp {Number(item.total).toLocaleString("id-ID")}
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black ${getStatusColor(item.status)}`}
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
              </div>
            </div>
          ))}
        </div>

        {/* ================= DETAIL ORDER MODAL ================= */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6">
            <div className="bg-white w-full max-w-[760px] rounded-[28px] p-6 shadow-[0_30px_90px_rgba(15,23,42,0.15)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900">
                    Detail Pesanan
                  </h2>
                  <p className="text-slate-400 text-xs uppercase tracking-[0.15em]">
                    #{selectedOrder.id}
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
                    Tanggal
                  </p>
                  <p className="font-black text-slate-900 text-sm">
                    {selectedOrder.date}
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-900 p-5 text-white mb-5">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                      Total
                    </p>
                    <p className="font-black text-sm mt-1">
                      Rp {Number(selectedOrder.total).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= 🔥 UPDATE STATUS MANUAL (TANPA SELESAI) ================= */}
              <div className="border-t border-slate-200 pt-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-3">
                  Update Status Pesanan
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* MENUNGGU → DIPROSES */}
                  {selectedOrder.status === "menunggu" && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Ubah pesanan #${selectedOrder.id} menjadi DIPROSES?`,
                          )
                        ) {
                          updateOrderStatus(selectedOrder.id, "diproses");
                        }
                      }}
                      className="h-10 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition"
                    >
                      Proses Pesanan
                    </button>
                  )}

                  {/* DIPROSES → DIKIRIM (dengan resi) */}
                  {selectedOrder.status === "diproses" && (
                    <button
                      onClick={() => {
                        const resi = prompt("Masukkan nomor resi pengiriman:");
                        if (resi === null) return;
                        if (!resi.trim()) {
                          alert("Nomor resi wajib diisi!");
                          return;
                        }
                        updateOrderStatus(
                          selectedOrder.id,
                          "dikirim",
                          resi.trim(),
                        );
                      }}
                      className="h-10 px-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
                    >
                      Kirim Pesanan
                    </button>
                  )}

                  {/* 🔥 HAPUS TOMBOL "SELESAI" - SUDAH DIPINDAH KE CUSTOMER */}

                  {/* DIKIRIM → tidak ada aksi (customer yang selesai) */}
                  {selectedOrder.status === "dikirim" && (
                    <span className="text-sm text-slate-400 italic">
                      ⏳ Menunggu konfirmasi pembeli
                    </span>
                  )}

                  {/* SELESAI → tidak ada aksi */}
                  {selectedOrder.status === "selesai" && (
                    <span className="text-sm text-slate-400 italic">
                      ✅ Pesanan sudah selesai
                    </span>
                  )}

                  {/* DIBATALKAN → tidak ada aksi */}
                  {selectedOrder.status === "dibatalkan" && (
                    <span className="text-sm text-red-400 italic">
                      ❌ Pesanan sudah dibatalkan
                    </span>
                  )}
                </div>
              </div>

              {/* ================= INPUT RESI (alternatif) ================= */}
              {selectedOrder.status === "diproses" && (
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 mt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Atau Input Resi Manual
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
                      Kirim dengan Resi
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full h-12 rounded-xl bg-blue-600 text-white font-black text-sm mt-4 hover:bg-blue-700 transition"
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
