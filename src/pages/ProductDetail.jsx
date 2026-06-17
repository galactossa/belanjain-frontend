import {
  Star,
  Heart,
  ShoppingCart,
  MessageCircle,
  Flag,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/api";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ProductReviewModal from "../components/home/ProductReviewModal";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [authModal, setAuthModal] = useState(null);
  const [search, setSearch] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
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
        const prod = response.data.data;
        setProduct(prod);

        // Fetch seller
        if (prod.id_toko) {
          const sellerRes = await api.get(`/toko/${prod.id_toko}`);
          setSeller(sellerRes.data.data);
        }

        // Fetch reviews
        const reviewRes = await api.get(`/ulasan/produk/${id}`);
        setProductReviews(reviewRes.data.data.ulasan || []);

        // Fetch recommended products
        const recRes = await api.get("/produk");
        setRecommendedProducts((recRes.data.data.data || []).slice(0, 5));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Review calculation
  const totalReviewCount = productReviews.length;
  const averageRating =
    totalReviewCount > 0
      ? productReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
        totalReviewCount
      : 0;

  const ratingSummary = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => Math.round(r.rating || 0) === star)
      .length,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-black">Produk Tidak Ditemukan</h1>
      </div>
    );
  }

  const handleCart = () => {
    setAuthModal("login");
  };

  const handleBuyNow = () => {
    setAuthModal("login");
  };

  const handleWishlist = () => {
    setAuthModal("login");
  };

  const handleChat = () => {
    setAuthModal("login");
  };

  const handleReport = () => {
    setAuthModal("login");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: product.nama_produk,
        text: product.nama_produk,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
  };

  const handleFollow = () => {
    setAuthModal("login");
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        search={search}
        setSearch={setSearch}
        setAuthModal={setAuthModal}
        onSearch={() => {
          navigate(`/?search=${search}`);
        }}
      />

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {/* BREADCRUMB */}
        <div className="text-xs text-slate-400 flex gap-2 mb-6">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer hover:text-black"
          >
            Beranda
          </span>
          <span>/</span>
          <span>Pencarian</span>
          <span>/</span>
          <span className="text-slate-700">{product.nama_produk}</span>
        </div>

        {/* GRID */}
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
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 border rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      product.url_gambar || "https://via.placeholder.com/100"
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              ))}
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
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                Trust {Math.round(((product.rata_rating || 0) / 5) * 100)}%
              </span>
            </div>

            <h2 className="text-2xl font-black text-black leading-none mt-6">
              Rp {Number(product.harga).toLocaleString("id-ID")}
            </h2>

            {/* STORE */}
            <div className="flex items-center justify-between border rounded-xl p-3 mt-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {seller?.nama_toko?.charAt(0) || "T"}
                </div>
                <div>
                  <button
                    onClick={() =>
                      navigate(`/store/${seller?.id_toko || product.id_toko}`)
                    }
                    className="font-bold hover:text-indigo-600"
                  >
                    {seller?.nama_toko || "Toko"}
                  </button>
                  <p className="text-xs text-slate-500">Official Store</p>
                </div>
              </div>
              <button
                onClick={handleFollow}
                className="px-5 py-2 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Follow
              </button>
            </div>

            {/* TABS */}
            <div className="flex gap-8 border-b mt-8">
              {["deskripsi", "info", "ulasan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-semibold ${
                    activeTab === tab
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-slate-400"
                  }`}
                >
                  {tab === "deskripsi"
                    ? "Deskripsi Produk"
                    : tab === "info"
                      ? "Info"
                      : `Ulasan (${totalReviewCount})`}
                </button>
              ))}
            </div>

            {/* CONTENT */}
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
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
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
                        <div className="space-y-2">
                          {ratingSummary.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="w-8 text-sm font-semibold">
                                {star}⭐
                              </span>
                              <div className="flex-1 h-2 bg-slate-200 rounded-full">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{
                                    width: `${totalReviewCount > 0 ? (count / totalReviewCount) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="w-8 text-sm text-slate-500">
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {productReviews.slice(0, 3).map((review) => (
                          <div
                            key={review.id_ulasan}
                            className="border rounded-xl p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">
                                    {review.pembeli_nama || "User"}
                                  </h4>
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    ✓
                                  </span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i < Math.round(review.rating || 0)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-slate-300"
                                      }
                                    />
                                  ))}
                                </div>
                                <p className="text-slate-600 mt-2 text-xs">
                                  {review.komentar || "-"}
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                  {review.date || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalReviewCount > 3 && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="w-full py-4 rounded-3xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
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
                  <div>
                    <p className="font-black text-sm">✨ Flash Sale</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold">Berakhir Dalam</span>
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold text-xs">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    :
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold text-xs">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    :
                    <div className="bg-white text-blue-600 px-1.5 py-0.5 rounded font-bold text-xs">
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
                <div className="text-right">
                  <p className="text-slate-400 line-through font-semibold">
                    Rp{" "}
                    {(Number(product.harga) * quantity * 1.2).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-500 font-medium">Subtotal</p>
                  <h2 className="text-3xl font-black">
                    Rp{" "}
                    {(Number(product.harga) * quantity).toLocaleString("id-ID")}
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
                  onClick={handleChat}
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
                  onClick={handleReport}
                  className="flex items-center justify-center gap-1"
                >
                  <Flag size={18} /> Report
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1"
                >
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* REKOMENDASI */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase">
              Rekomendasi Untukmu
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 font-bold hover:underline"
            >
              LIHAT SEMUA
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {recommendedProducts.map((item) => (
              <div
                key={item.id_produk}
                onClick={() => navigate(`/product-detail/${item.id_produk}`)}
                className="bg-white border rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition"
              >
                <div className="relative">
                  <img
                    src={item.url_gambar || "https://via.placeholder.com/300"}
                    alt={item.nama_produk}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BARU
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-sm line-clamp-2 min-h-[42px]">
                    {item.nama_produk}
                  </h3>
                  <p className="text-2xl font-black mt-2">
                    Rp {Number(item.harga).toLocaleString("id-ID")}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="font-semibold">
                        {item.rata_rating || 0}
                      </span>
                    </div>
                    <span>•</span>
                    <span>Terjual {item.total_terjual || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AUTH MODAL */}
      {authModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          {authModal === "login" && <Login setAuthModal={setAuthModal} />}
          {authModal === "register" && <Register setAuthModal={setAuthModal} />}
          {authModal === "forgot" && (
            <ForgotPassword setAuthModal={setAuthModal} />
          )}
        </div>
      )}

      {/* REVIEW MODAL */}
      <ProductReviewModal
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
