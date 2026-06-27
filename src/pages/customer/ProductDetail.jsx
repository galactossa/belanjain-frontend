// src/pages/customer/ProductDetail.jsx
import {
  Star,
  Heart,
  ShoppingCart,
  MessageCircle,
  CircleAlert,
  Share2,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
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
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("deskripsi");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [trustScore, setTrustScore] = useState(null);
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

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch product
        const response = await api.get(`/produk/${id}`);
        const prod = response.data.data;
        setProduct(prod);

        // Fetch seller
        if (prod.id_toko) {
          try {
            const sellerRes = await api.get(`/toko/${prod.id_toko}`);
            setSeller(sellerRes.data.data);
            if (currentUser?.id_pengguna) {
              try {
                const followRes = await api.get(
                  `/follow/cek/${currentUser.id_pengguna}/${prod.id_toko}`,
                );
                setIsFollowing(followRes.data.data.is_following || false);
              } catch (followError) {
                console.error("Error checking follow:", followError);
              }
            }
          } catch (sellerError) {
            console.error("Error fetching seller:", sellerError);
          }
        }

        // Fetch reviews
        try {
          const reviewRes = await api.get(`/ulasan/produk/${id}`);
          console.log("🔍 Review response:", reviewRes.data);

          let reviews = [];
          if (reviewRes.data?.data?.ulasan) {
            reviews = reviewRes.data.data.ulasan;
          } else if (reviewRes.data?.data) {
            reviews = reviewRes.data.data;
          } else if (Array.isArray(reviewRes.data)) {
            reviews = reviewRes.data;
          }
          setProductReviews(reviews);
        } catch (reviewError) {
          console.error("Error fetching reviews:", reviewError);
          setProductReviews([]);
        }

        // ================= 🔥 FETCH TRUST SCORE =================
        try {
          const trustRes = await api.get(`/trust-score/produk/${id}`);
          console.log("🔍 Trust score response:", trustRes.data);
          setTrustScore(trustRes.data.data);
        } catch (trustError) {
          console.error("Error fetching trust score:", trustError);
          setTrustScore(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, currentUser?.id_pengguna]);

  // Load cart
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

  // ================= FOLLOW =================
  const handleFollow = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }
    if (!seller?.id_toko) return;

    try {
      if (isFollowing) {
        await api.delete(
          `/follow/${currentUser.id_pengguna}/${seller.id_toko}`,
        );
        setIsFollowing(false);
        alert("Berhenti mengikuti toko");
      } else {
        await api.post("/follow", {
          id_pengguna: currentUser.id_pengguna,
          id_toko: seller.id_toko,
        });
        setIsFollowing(true);
        alert("Berhasil mengikuti toko!");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert(error.response?.data?.message || "Gagal mengikuti toko");
    }
  };

  // ================= CHAT =================
  const handleChat = () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }
    if (!seller?.id_pengguna) {
      alert("Toko tidak memiliki data penjual");
      return;
    }
    navigate(`/customer/chat/${seller.id_pengguna}`);
  };

  const handleStoreProfile = () => {
    if (!seller?.id_toko) {
      alert("Toko tidak ditemukan");
      return;
    }
    navigate(`/customer/store/${seller.id_toko}`);
  };

  // ================= CART =================
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

  // ================= BUY NOW =================
  const handleBuyNow = async () => {
    if (!currentUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }
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
    navigate("/customer/checkout");
  };

  // ================= WISHLIST =================
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

  // ================= REPORT =================
  const handleReport = () => {
    if (!reportReason.trim()) {
      alert("Alasan laporan wajib diisi");
      return;
    }
    alert("Laporan berhasil dikirim. Terima kasih!");
    setReportReason("");
    setShowReport(false);
  };

  // ================= SHARE =================
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
      alert("Link disalin!");
    }
  };

  // ================= RENDER TRUST SCORE =================
  const renderTrustScore = () => {
    if (!trustScore) {
      return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={18} />
            <span className="font-semibold text-sm">
              Trust Score belum tersedia
            </span>
          </div>
        </div>
      );
    }

    const { trust_score, level, badge, detail } = trustScore;
    const levelColors = {
      "Sangat Terpercaya": "bg-green-100 text-green-700 border-green-300",
      Terpercaya: "bg-blue-100 text-blue-700 border-blue-300",
      "Cukup Terpercaya": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Perlu Dipertimbangkan": "bg-red-100 text-red-700 border-red-300",
    };

    const levelColor =
      levelColors[level] || "bg-slate-100 text-slate-700 border-slate-300";

    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600" />
            <span className="font-black text-lg">Trust Score</span>
          </div>
          <div
            className={`px-4 py-1.5 rounded-full text-sm font-black border ${levelColor}`}
          >
            {badge} {trust_score}%
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Rating</span>
              <span className="font-semibold">{detail.rating} / 5.0</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${detail.rating_score}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Terjual</span>
              <span className="font-semibold">{detail.total_terjual} unit</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${detail.terjual_score}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Konsistensi Review</span>
              <span className="font-semibold">
                {detail.konsistensi_review}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${detail.konsistensi_review}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Kecepatan Kirim</span>
              <span className="font-semibold">{detail.kecepatan_kirim}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1">
              <div
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${detail.kecepatan_kirim}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700">Level: {level}</p>
          <p className="text-xs text-slate-400 mt-1">
            {trust_score >= 80
              ? "✅ Produk ini sangat terpercaya! Kualitas terjamin."
              : trust_score >= 60
                ? "👍 Produk ini cukup terpercaya. Cek ulasan untuk lebih yakin."
                : "⚠️ Produk ini perlu dipertimbangkan. Baca ulasan dengan teliti."}
          </p>
        </div>
      </div>
    );
  };

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
        {/* BREADCRUMB */}
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

            {/* ================= 🔥 TRUST SCORE SECTION ================= */}
            <div className="mt-4">{renderTrustScore()}</div>

            {/* STORE */}
            <div className="flex items-center justify-between border rounded-xl p-3 mt-6 shadow-sm">
              <div
                onClick={handleStoreProfile}
                className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition"
              >
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {seller?.nama_toko?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="font-bold hover:text-indigo-600">
                    {seller?.nama_toko || "Toko"}
                  </p>
                  <p className="text-xs text-slate-500">Official Store</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
                    isFollowing
                      ? "bg-slate-100 text-slate-600 border border-slate-300"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isFollowing ? "✓ Mengikuti" : "+ Ikuti"}
                </button>
                <button
                  onClick={handleChat}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>
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
                        {productReviews.slice(0, 5).map((review) => (
                          <div
                            key={review.id_ulasan || review.id}
                            className="border rounded-xl p-4 hover:bg-slate-50 transition"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {review.pembeli_nama
                                      ?.charAt(0)
                                      ?.toUpperCase() || "U"}
                                  </div>
                                  <h4 className="font-semibold text-sm">
                                    {review.pembeli_nama || "User"}
                                  </h4>
                                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                    ✓ TERVERIFIKASI
                                  </span>
                                </div>
                                <div className="flex gap-1 mt-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={
                                        i < Math.round(review.rating || 0)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-slate-300"
                                      }
                                    />
                                  ))}
                                </div>
                                <p className="text-slate-700 mt-3 text-sm leading-relaxed">
                                  {review.komentar || "Tidak ada komentar"}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                  <p className="text-slate-400 text-xs">
                                    {review.created_at
                                      ? new Date(
                                          review.created_at,
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        })
                                      : review.date || "-"}
                                  </p>
                                  {review.rating && (
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                      ⭐ {review.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                {review.foto_url && (
                                  <img
                                    src={review.foto_url}
                                    alt="Review photo"
                                    className="mt-3 w-20 h-20 rounded-xl object-cover border"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalReviewCount > 5 && (
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="w-full py-4 rounded-3xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                        >
                          Lihat Semua Ulasan ({totalReviewCount})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-5xl mb-4">📝</div>
                      <h3 className="font-bold text-slate-700 text-lg">
                        Belum Ada Ulasan
                      </h3>
                      <p className="text-slate-400 text-sm mt-2">
                        Jadilah yang pertama memberikan ulasan untuk produk ini
                      </p>
                    </div>
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
                    {Number(product.harga * quantity * 1.2).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-500 font-medium">Subtotal</p>
                  <h2 className="text-3xl font-black">
                    Rp{" "}
                    {Number(product.harga * quantity).toLocaleString("id-ID")}
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
                  onClick={() => setShowReport(true)}
                  className="flex items-center justify-center gap-1"
                >
                  <CircleAlert size={18} /> Report
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
