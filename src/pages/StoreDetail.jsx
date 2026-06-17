import {
  Star,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function StoreDetail() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const storeRes = await api.get(`/toko/${id}`);
        const storeData = storeRes.data.data;
        setStore(storeData);

        const productsRes = await api.get(`/produk/toko/${id}`);
        setProducts(productsRes.data.data.data || []);

        if (currentUser?.id) {
          try {
            const followRes = await api.get(
              `/follow/cek/${currentUser.id}/${id}`,
            );
            setIsFollowing(followRes.data.data.is_following || false);
          } catch (error) {
            console.error("Error checking follow status:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id, currentUser?.id]);

  const handleFollow = async () => {
    if (!currentUser) {
      setAuthModal("login");
      return;
    }

    try {
      if (isFollowing) {
        await api.delete(`/follow/${currentUser.id}/${id}`);
        setIsFollowing(false);
      } else {
        await api.post("/follow", {
          id_pengguna: currentUser.id,
          id_toko: id,
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.response?.data?.message || "Gagal mengikuti toko");
    }
  };

  const filteredProducts = [...products]
    .filter((product) =>
      product.nama_produk?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.harga) - Number(b.harga);
      if (sortBy === "price-high") return Number(b.harga) - Number(a.harga);
      if (sortBy === "sold")
        return (b.total_terjual || 0) - (a.total_terjual || 0);
      return b.id_produk - a.id_produk;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-black">Toko Tidak Ditemukan</h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-20 bg-black/40 text-white px-5 py-3 rounded-xl backdrop-blur"
          >
            ← Kembali
          </button>
          <div className="h-[340px] rounded-[40px] overflow-hidden relative">
            <img
              src={
                store.banner_toko ||
                "https://images.unsplash.com/photo-1556740749-887f6717d7e4"
              }
              alt={store.nama_toko}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-5">
                <img
                  src={
                    store.logo_toko || "https://ui-avatars.com/api/?name=Toko"
                  }
                  alt={store.nama_toko}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-4xl font-black text-white">
                    {store.nama_toko}
                  </h1>
                  <div className="flex gap-4 mt-2 text-white/90">
                    <span>⭐ {store.rating || 4.5}/5.0</span>
                    <span>📍 {store.kota || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 h-12 rounded-xl font-semibold transition ${isFollowing ? "bg-white text-slate-700 border border-slate-300" : "bg-indigo-600 text-white"}`}
                >
                  {isFollowing ? "✓ Mengikuti" : "+ Ikuti"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-400 text-sm">Kecepatan Respon</p>
            <h3 className="text-2xl font-bold mt-2">99%</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-400 text-sm">Waktu Proses</p>
            <h3 className="text-2xl font-bold mt-2">&lt; 24 Jam</h3>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-400 text-sm">Bergabung Sejak</p>
            <h3 className="text-2xl font-bold mt-2">
              {new Date(store.created_at).toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-slate-400 text-sm">Produk Terjual</p>
            <h3 className="text-2xl font-bold mt-2">
              {products.reduce((sum, p) => sum + (p.total_terjual || 0), 0)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border shadow-sm mt-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk di toko ini..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 border"
              />
            </div>
            <button
              onClick={() => setViewMode("grid")}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              <List size={20} />
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 rounded-xl border"
            >
              <option value="latest">Terbaru</option>
              <option value="sold">Terlaris</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
            </select>
            <button className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="mt-14 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black">Semua Produk</h2>
            <p className="text-slate-500 mt-2">
              {filteredProducts.length} produk tersedia
            </p>
          </div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8"
              : "flex flex-col gap-4 mt-8"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id_produk}
              onClick={() => navigate(`/product-detail/${product.id_produk}`)}
              className={`bg-white border overflow-hidden cursor-pointer transition ${viewMode === "grid" ? "rounded-[28px]" : "flex rounded-2xl min-h-[190px]"}`}
            >
              <img
                src={product.url_gambar || "https://via.placeholder.com/300"}
                alt={product.nama_produk}
                className={
                  viewMode === "grid"
                    ? "w-full h-56 object-cover"
                    : "w-56 h-56 object-cover"
                }
              />
              <div className="p-5">
                <h3 className="font-black line-clamp-2 min-h-[55px]">
                  {product.nama_produk}
                </h3>
                <p className="text-blue-600 text-xl font-black mt-3">
                  Rp {Number(product.harga).toLocaleString("id-ID")}
                </p>
                <div className="flex justify-between mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {product.rata_rating || 0}
                  </div>
                  <span className="text-slate-400">
                    {product.total_terjual || 0} Terjual
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoreDetail;
