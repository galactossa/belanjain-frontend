import { TrendingUp, Star, Search, Bell } from "lucide-react";
import SellerLayout from "../../layouts/SellerLayout";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

function AnalyticsSeller() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPenjualan: 0,
    totalTerjual: 0,
    jumlahPesanan: 0,
    topProducts: [],
    penjualanPerBulan: [],
  });
  const [orders, setOrders] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  // 🔥 PERBAIKAN: Gunakan id_pengguna
  const userId = currentUser?.id_pengguna || currentUser?.id;
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // 🔥 PERBAIKAN: Cek userId
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storeRes = await api.get(`/toko/user/${userId}`);
        const store = storeRes.data.data;
        setStoreId(store.id_toko);

        const statsRes = await api.get(`/statistik/penjual/${store.id_toko}`);
        const statsData = statsRes.data.data;
        setStats({
          totalPenjualan: statsData.total_penjualan || 0,
          totalTerjual: statsData.total_produk_terjual || 0,
          jumlahPesanan: statsData.jumlah_pesanan || 0,
          topProducts: statsData.top_5_produk || [],
          penjualanPerBulan: statsData.penjualan_per_bulan || [],
        });

        const ordersRes = await api.get(`/pesanan/toko/${store.id_toko}`);
        setOrders(ordersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]); // 🔥 PERBAIKAN: Dependency userId

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-orange-100 text-orange-600";
    if (s.includes("diproses")) return "bg-purple-100 text-purple-700";
    if (s.includes("dikirim")) return "bg-blue-100 text-blue-600";
    if (s.includes("selesai")) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-500";
  };

  const formatPrice = (value) =>
    `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

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
      <div className="max-w-[1600px] mx-auto min-h-screen bg-[#f6f8fc] p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between mb-6">
          <div>
            <h1 className="text-[34px] xl:text-[25px] font-black uppercase text-slate-900 leading-none">
              Analitik Penjualan
            </h1>
            <p className="text-slate-400 text-sm mt-2 uppercase tracking-[2px] font-black">
              Lihat data performa bisnis anda
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px] h-11 rounded-2xl bg-white border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-5 rounded-2xl bg-blue-600 text-white text-[12px] font-black shadow-lg hover:bg-blue-700 duration-300"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-[28px] border p-6 shadow-sm">
            <p className="text-[12px] uppercase tracking-[1px] font-black text-slate-400">
              Total Penjualan
            </p>
            <h2 className="text-[28px] font-black text-slate-900 mt-2">
              {formatPrice(stats.totalPenjualan)}
            </h2>
          </div>
          <div className="bg-white rounded-[28px] border p-6 shadow-sm">
            <p className="text-[12px] uppercase tracking-[1px] font-black text-slate-400">
              Produk Terjual
            </p>
            <h2 className="text-[28px] font-black text-slate-900 mt-2">
              {stats.totalTerjual} unit
            </h2>
          </div>
          <div className="bg-white rounded-[28px] border p-6 shadow-sm">
            <p className="text-[12px] uppercase tracking-[1px] font-black text-slate-400">
              Total Pesanan
            </p>
            <h2 className="text-[28px] font-black text-slate-900 mt-2">
              {stats.jumlahPesanan}
            </h2>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[28px] p-6 text-white">
            <p className="text-[12px] uppercase tracking-[1px] font-black opacity-80">
              Skor Toko
            </p>
            <h2 className="text-[28px] font-black mt-2">4.9 / 5.0</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[22px] font-black text-slate-900">
              Top 5 Produk Terlaris
            </h2>
            <div className="mt-4 space-y-4">
              {stats.topProducts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Belum ada data penjualan
                </p>
              ) : (
                stats.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-sm">
                        {index + 1}
                      </span>
                      <span className="font-black text-slate-900">
                        {product.nama_produk}
                      </span>
                    </div>
                    <span className="font-black text-slate-600">
                      {product.total_terjual} terjual
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[22px] font-black text-slate-900">
              Penjualan per Bulan
            </h2>
            <div className="mt-4 space-y-4">
              {stats.penjualanPerBulan.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Belum ada data penjualan
                </p>
              ) : (
                stats.penjualanPerBulan.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <span className="font-black text-slate-900">
                      {item.bulan}
                    </span>
                    <span className="font-black text-blue-600">
                      {formatPrice(item.total_penjualan)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-x-auto">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-[22px] font-black text-slate-900">
              Laporan Penjualan Detail
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[2px] text-slate-400">
                <th className="px-7 py-5">ID PESANAN</th>
                <th className="px-7 py-5">PELANGGAN</th>
                <th className="px-7 py-5">TANGGAL</th>
                <th className="px-7 py-5">TOTAL</th>
                <th className="px-7 py-5">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr
                  key={order.id_pesanan}
                  className="border-t border-slate-100 hover:bg-slate-50 duration-300"
                >
                  <td className="px-7 py-5 font-black text-slate-900">
                    #{order.id_pesanan}
                  </td>
                  <td className="px-7 py-5 font-semibold text-slate-700">
                    {order.nama_penerima || "-"}
                  </td>
                  <td className="px-7 py-5 text-slate-500">
                    {order.created_at?.split("T")[0] || "-"}
                  </td>
                  <td className="px-7 py-5 font-black text-slate-900">
                    {formatPrice(order.harga_akhir)}
                  </td>
                  <td className="px-7 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(order.status)}`}
                    >
                      {order.status || "Menunggu"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
}

export default AnalyticsSeller;
