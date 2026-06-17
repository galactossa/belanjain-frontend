// ================= src/pages/customer/ProductDetail.jsx =================
import {
  Star,
  Heart,
  ShoppingCart,
  MessageCircle,
  CircleAlert,
  Share2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/api";
import Navbar from "../../components/customer/CustomerNavbar";
import Footer from "../../components/home/Footer";
import ViewAllReviewsModal from "../../components/customer/ViewAllReviewsModal";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [search, setSearch] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 17,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/produk/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/ulasan/produk/${id}`);
        setProductReviews(response.data.data.ulasan || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [id]);

  // Load cart from API
  useEffect(() => {
    const loadCart = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/keranjang/pengguna/${currentUser.id_pengguna}`,
        );
        setCartItems(response.data.data.items || []);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, [currentUser?.id_pengguna]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-black">
        Produk Tidak Ditemukan
      </div>
    );
  }

  const totalReviewCount = productReviews.length;
  const averageRating = totalReviewCount
    ? productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      totalReviewCount
    : 0;

  // ================= HANDLE CART =================
  const handleCart = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }
    try {
      await api.post("/keranjang", {
        id_pengguna: currentUser.id_pengguna,
        id_produk: product.id_produk,
        jumlah: quantity,
      });
      const response = await api.get(
        `/keranjang/pengguna/${currentUser.id_pengguna}`,
      );
      setCartItems(response.data.data.items || []);
      setShowCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  // ================= HANDLE BUY NOW (LANGSUNG CHECKOUT) =================
  const handleBuyNow = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }

    // Simpan produk yang akan dibeli langsung ke localStorage
    const directCheckoutItem = {
      id_produk: product.id_produk,
      nama_produk: product.nama_produk,
      harga: product.harga,
      url_gambar: product.url_gambar,
      jumlah: quantity,
      is_direct_checkout: true,
    };

    localStorage.setItem(
      "directCheckoutItem",
      JSON.stringify(directCheckoutItem),
    );

    // Navigate ke checkout
    navigate("/customer/checkout");
  };

  // ================= HANDLE WISHLIST =================
  const handleWishlist = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }
    try {
      await api.post("/wishlist", {
        id_pengguna: currentUser.id_pengguna,
        id_produk: product.id_produk,
      });
      setShowWishlist(true);
    } catch (error) {
      if (error.response?.status === 400) {
        setShowWishlist(true);
      } else {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Gagal menambahkan ke wishlist");
      }
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) {
      alert("Alasan laporan wajib diisi");
      return;
    }
    alert("Laporan berhasil dikirim. Terima kasih!");
    setReportReason("");
    setShowReport(false);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.harga_produk || 0) * (item.jumlah || 1),
    0,
  );
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        search={search}
        setSearch={setSearch}
        setShowWishlist={setShowWishlist}
        setShowCart={setShowCart}
        wishlistCount={wishlistItems.length}
        cartCount={cartItems.length}
        onSearch={() => navigate(`/customer?search=${search}`)}
      />

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="text-xs text-slate-400 flex gap-2 mb-6">
          <span
            onClick={() => navigate("/customer")}
            className="cursor-pointer hover:text-black"
          >
            Beranda
          </span>
          <span>/</span>
          <span>Pencarian</span>
          <span>/</span>
          <span className="text-slate-700">{product.nama_produk}</span>
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)_360px] gap-10 items-start">
          {/* LEFT IMAGE */}
          <div className="sticky top-28">
            <div className="border rounded-2xl p-3 shadow-sm">
              <img
                src={product.url_gambar || "https://via.placeholder.com/400"}
                className="w-full h-[380px] object-cover rounded-xl"
                alt={product.nama_produk}
              />
            </div>
          </div>

          {/* CENTER INFO */}
          <div>
            <h1 className="text-2xl font-black leading-snug">
              {product.nama_produk}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
              <span>Terjual {product.total_terjual || 0}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-black">
                {product.rata_rating || 0}
              </span>
            </div>
            <h2 className="text-2xl font-black text-black leading-none mt-6">
              Rp {Number(product.harga).toLocaleString("id-ID")}
            </h2>

            <div className="border rounded-xl p-3 mt-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {product.nama_toko?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="font-bold">{product.nama_toko || "Toko"}</p>
                  <p className="text-xs text-slate-500">Official Store</p>
                </div>
              </div>
            </div>

            <div className="flex gap-8 border-b mt-8">
              {["deskripsi", "info", "ulasan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-semibold ${activeTab === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400"}`}
                >
                  {tab === "deskripsi"
                    ? "Deskripsi Produk"
                    : tab === "info"
                      ? "Info"
                      : `Ulasan (${totalReviewCount})`}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600">
              {activeTab === "deskripsi" && (
                <div className="space-y-2">
                  <p>
                    <b>Kategori:</b> {product.nama_kategori || "-"}
                  </p>
                  <p>
                    <b>Stok:</b> {product.stok || 0}
                  </p>
                  <p className="mt-3">
                    {product.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </div>
              )}
              {activeTab === "info" && (
                <div className="space-y-3">
                  <div>
                    <b>Berat/Satuan:</b> -
                  </div>
                  <div>
                    <b>Min. Pembelian:</b> 1 Buah
                  </div>
                  <div>
                    <b>Kondisi:</b> Baru
                  </div>
                </div>
              )}
              {activeTab === "ulasan" && (
                <div>
                  {totalReviewCount > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star
                            size={24}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span className="text-3xl font-black">
                            {averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          {totalReviewCount} ulasan
                        </p>
                      </div>
                      {productReviews.slice(0, 3).map((review) => (
                        <div
                          key={review.id_ulasan}
                          className="border rounded-xl p-4"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-semibold">
                              {review.pembeli_nama || "User"}
                            </h4>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < (review.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-300"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 mt-2">
                            {review.komentar || "-"}
                          </p>
                        </div>
                      ))}
                      {totalReviewCount > 3 && (
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="w-full py-2 border rounded-xl font-semibold hover:bg-slate-50"
                        >
                          Lihat Semua Ulasan
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>Belum ada ulasan untuk produk ini</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="sticky top-28">
            <div className="bg-white border rounded-[24px] p-6 shadow-lg">
              <div className="bg-blue-600 text-white rounded-t-2xl px-5 py-4 -mx-6 -mt-6 mb-5">
                <div className="flex items-center justify-between">
                  <p className="font-black text-sm">✨ Flash Sale</p>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold">Berakhir</span>
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    :
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    :
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-black text-sm">Atur jumlah dan catatan</h3>
              <div className="flex items-center justify-between mt-4">
                <div className="flex border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-10 border-r"
                  >
                    -
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center font-bold">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-10 border-l text-blue-600"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-slate-600">
                  Stok: {product.stok || 0}
                </span>
              </div>

              <div className="border-t mt-5 pt-4">
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-500 font-medium">Subtotal</p>
                  <h2 className="text-3xl font-black">
                    Rp {(product.harga * quantity).toLocaleString("id-ID")}
                  </h2>
                </div>
              </div>

              <button
                onClick={handleCart}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold mt-5 hover:bg-blue-700"
              >
                <ShoppingCart className="inline w-4 h-4 mr-2" /> Keranjang
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full h-14 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold mt-3 hover:bg-blue-50"
              >
                Beli Langsung
              </button>

              <div className="grid grid-cols-4 gap-3 mt-5 text-xs text-center text-slate-600">
                <button
                  onClick={() => navigate("/customer/chat")}
                  className="flex items-center justify-center gap-1"
                >
                  <MessageCircle size={18} /> Chat
                </button>
                <button
                  onClick={handleWishlist}
                  className="flex items-center justify-center gap-1"
                >
                  <Heart size={18} /> Wishlist
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center justify-center gap-1"
                >
                  <CircleAlert size={18} /> Report
                </button>
                <button
                  onClick={() =>
                    navigator.share
                      ? navigator.share({
                          title: product.nama_produk,
                          url: window.location.href,
                        })
                      : navigator.clipboard.writeText(window.location.href)
                  }
                  className="flex items-center justify-center gap-1"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* REPORT MODAL */}
      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
          <div className="w-[500px] bg-white rounded-[30px] overflow-hidden">
            <div className="flex justify-between items-center p-8 border-b">
              <h2 className="text-3xl font-black uppercase">Laporkan Produk</h2>
              <button
                onClick={() => setShowReport(false)}
                className="text-3xl text-slate-400 hover:text-black"
              >
                ×
              </button>
            </div>
            <div className="p-8">
              <p className="text-slate-600 font-medium mb-6">
                Bantu kami menjaga komunitas tetap aman.
              </p>
              <label className="block text-sm font-black uppercase tracking-wider mb-3">
                Laporkan Produk
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={5}
                placeholder="Contoh: Produk palsu, deskripsi menyesatkan..."
                className="w-full border rounded-2xl p-4 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleReport}
                className="w-full h-14 mt-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg"
              >
                KIRIM LAPORAN
              </button>
            </div>
          </div>
        </div>
      )}

      <ViewAllReviewsModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        productReviews={productReviews}
        totalReviewCount={totalReviewCount}
      />

      <Footer />
    </div>
  );
}

export default ProductDetail;
