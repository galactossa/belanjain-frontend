import {
  DollarSign,
  ShoppingBag,
  Package,
  Bell,
  Plus,
  Eye,
  MessageSquare,
  AlertCircle,
  Search,
  ChevronDown,
  X,
  Upload,
} from "lucide-react";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
import api from "../../api/api";

function DashboardSeller() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  // 🔥 PERBAIKAN: Gunakan id_pengguna
  const userId = currentUser?.id_pengguna || currentUser?.id;

  const [sellerData, setSellerData] = useState(null);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    newOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showDetailOrder, setShowDetailOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chartFilter, setChartFilter] = useState("Mingguan");
  const [showChartFilter, setShowChartFilter] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [stocks, setStocks] = useState([]);

  // Fetch seller data
  useEffect(() => {
    const fetchSellerData = async () => {
      // 🔥 PERBAIKAN: Cek userId
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Get store info
        const storeRes = await api.get(`/toko/user/${userId}`);
        const store = storeRes.data.data;
        setSellerData(store);

        // Get products
        const productsRes = await api.get(`/produk/toko/${store.id_toko}`);
        const products = productsRes.data.data.data || [];
        setSellerProducts(products);

        // Get orders
        const ordersRes = await api.get(`/pesanan/toko/${store.id_toko}`);
        const orders = ordersRes.data.data || [];
        setSellerOrders(orders);

        // Get stats
        const statsRes = await api.get(`/statistik/penjual/${store.id_toko}`);
        const statsData = statsRes.data.data;
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalSales: statsData.total_penjualan || 0,
          newOrders: orders.filter((o) => o.status === "menunggu").length,
        });

        // Low stock products
        const lowStock = products
          .filter((p) => p.stok <= 10)
          .map((p) => ({
            id: p.id_produk,
            name: p.nama_produk,
            stock: p.stok,
          }));
        setStocks(lowStock);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [userId]); // 🔥 PERBAIKAN: Dependency userId

  useEffect(() => {
    setAnimateChart(false);
    setTimeout(() => setAnimateChart(true), 100);
  }, [chartFilter]);

  const statCards = [
    {
      title: "TOTAL PRODUK",
      value: stats.totalProducts,
      icon: <Package size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "TOTAL PESANAN",
      value: stats.totalOrders,
      icon: <ShoppingBag size={22} />,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "TOTAL PENJUALAN",
      value: `Rp ${(stats.totalSales / 1000000).toFixed(1)} Jt`,
      icon: <DollarSign size={22} />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "PESANAN BARU",
      value: stats.newOrders,
      icon: <Bell size={22} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const filteredOrders = sellerOrders.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      (item.id_pesanan?.toString() || "").includes(keyword) ||
      (item.nama_penerima || "").toLowerCase().includes(keyword) ||
      (item.status || "").toLowerCase().includes(keyword)
    );
  });

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) return "bg-orange-100 text-orange-500";
    if (s.includes("diproses")) return "bg-purple-100 text-purple-500";
    if (s.includes("dikirim")) return "bg-blue-100 text-blue-500";
    if (s.includes("selesai")) return "bg-emerald-100 text-emerald-500";
    return "bg-slate-100 text-slate-500";
  };

  const handleStockPlus = async (productId) => {
    try {
      const product = sellerProducts.find((p) => p.id_produk === productId);
      if (product) {
        await api.put(`/produk/${productId}`, { stok: product.stok + 10 });
        // Refresh products
        const storeRes = await api.get(`/toko/user/${userId}`);
        const productsRes = await api.get(
          `/produk/toko/${storeRes.data.data.id_toko}`,
        );
        setSellerProducts(productsRes.data.data.data || []);
        const lowStock = productsRes.data.data.data.filter((p) => p.stok <= 10);
        setStocks(
          lowStock.map((p) => ({
            id: p.id_produk,
            name: p.nama_produk,
            stock: p.stok,
          })),
        );
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

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
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#111827] leading-none">
              Ringkasan Toko
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Selamat datang kembali,{" "}
              {sellerData?.nama_toko || currentUser?.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-5 rounded-2xl bg-blue-600 text-white font-black text-[12px] shadow-lg hover:bg-blue-700 duration-300"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm flex items-center justify-between min-h-[120px]"
            >
              <div>
                <p className="text-[10px] font-black tracking-[2px] uppercase text-slate-400">
                  {item.title}
                </p>
                <h2 className="text-[26px] font-black text-[#111827] mt-2 leading-none">
                  {item.value}
                </h2>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        {/* CHART + STOCK */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-5">
          <div className="xl:col-span-8 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-black text-[#111827]">
                  Statistik Penjualan
                </h2>
                <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-1">
                  7 Hari Terakhir
                </p>
              </div>
            </div>
            <div className="mt-8 h-[320px] flex items-center justify-center bg-slate-50 rounded-2xl">
              <p className="text-slate-400 font-black">
                Data penjualan akan tampil di sini
              </p>
            </div>
          </div>

          <div className="xl:col-span-4 bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={16} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-black text-slate-900">Stok Menipis</h2>
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-4">
              {stocks.length === 0 ? (
                <div className="text-center text-slate-400 py-4">
                  Semua stok aman
                </div>
              ) : (
                stocks.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-[11px] font-black uppercase text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-[10px] uppercase font-black text-red-500 mt-1">
                        Sisa Stock: {item.stock}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStockPlus(item.id)}
                      className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate("/seller/products")}
              className="w-full h-11 rounded-2xl bg-slate-100 text-slate-700 font-black text-sm mt-5"
            >
              LIHAT INVENTARIS
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-5 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-[22px] font-black text-[#111827]">
                Pesanan Terbaru
              </h2>
            </div>
            <button
              onClick={() => navigate("/seller/orders")}
              className="text-blue-600 font-black text-sm"
            >
              LIHAT SEMUA
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                  <th className="px-6 py-5">ID PESANAN</th>
                  <th className="px-6 py-5">PELANGGAN</th>
                  <th className="px-6 py-5">TANGGAL</th>
                  <th className="px-6 py-5">TOTAL</th>
                  <th className="px-6 py-5">STATUS</th>
                  <th className="px-6 py-5 text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 5).map((item) => (
                  <tr
                    key={item.id_pesanan}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-5 font-medium text-slate-900">
                      #{item.id_pesanan}
                    </td>
                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {item.nama_penerima || "-"}
                    </td>
                    <td className="px-6 py-5 text-slate-500">
                      {item.created_at?.split("T")[0] || "-"}
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-900">
                      Rp {Number(item.harga_akhir).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(item.status)}`}
                      >
                        {item.status || "Menunggu"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedOrder(item);
                            setShowDetailOrder(true);
                          }}
                          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
                        >
                          <Eye size={16} className="text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL ORDER MODAL */}
      {showDetailOrder && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[480px] bg-white rounded-[36px] shadow-2xl overflow-hidden">
            <div className="p-7 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-[26px] font-black uppercase text-[#0f172a]">
                  Detail Pesanan
                </h2>
                <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                  ID : {selectedOrder.id_pesanan}
                </p>
              </div>
              <button
                onClick={() => setShowDetailOrder(false)}
                className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                    Status
                  </p>
                  <span
                    className={`inline-flex mt-3 px-3 py-1 rounded-full text-[15px] font-semibold ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status || "Menunggu"}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                    Tanggal
                  </p>
                  <h3 className="font-semibold text-slate-900 mt-3">
                    {selectedOrder.created_at?.split("T")[0] || "-"}
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4 border">
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                    Info Pelanggan
                  </p>
                  <h3 className="font-semibold text-slate-900 mt-2">
                    {selectedOrder.nama_penerima || "-"}
                  </h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border">
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400">
                    Alamat
                  </p>
                  <h3 className="font-semibold text-slate-700 mt-2 text-sm">
                    {selectedOrder.alamat || "-"}
                  </h3>
                </div>
              </div>
              <div className="mt-5 bg-[#0f172a] rounded-[28px] p-5 text-white">
                <div className="flex justify-between text-sm">
                  <span>Total</span>
                  <span>
                    Rp{" "}
                    {Number(selectedOrder.harga_akhir).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailOrder(false)}
                className="w-full h-12 rounded-2xl bg-blue-600 text-white font-black mt-6"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}

export default DashboardSeller;
