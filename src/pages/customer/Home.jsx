// ================= src/pages/customer/Home.jsx =================
import { useState, useRef, useEffect } from "react";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import HeroBanner from "../../components/home/HeroBanner";
import SidebarFilter from "../../components/home/SidebarFilter";
import CategorySection from "../../components/home/CategorySection";
import ProductGrid from "../../components/home/ProductGrid";
import ShoppingMode from "../../components/home/ShoppingMode";
import RekomendasiSpesial from "../../components/home/RekomendasiSpesial";
import Footer from "../../components/home/Footer";
import LoginPopup from "../../components/home/LoginPopup";
import api from "../../api/api";

function Home() {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

  // ================= PRODUCT REF =================
  const productRef = useRef(null);

  // ================= STATE =================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total_data: 0,
    total_page: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // ================= CATEGORY =================
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // ================= SHOPPING MODE =================
  const [shoppingMode, setShoppingMode] = useState("PREMIUM");

  // ================= FILTER =================
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000000,
    brands: [],
    ratings: [],
  });

  // ================= LOGIN =================
  const [showLogin, setShowLogin] = useState(false);

  // ================= WISHLIST =================
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  // ================= CART =================
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // ================= TOTAL =================
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + (item.harga_produk || item.price || 0) * (item.jumlah || 1),
    0,
  );
  const serviceFee = 2000;
  const total = subtotal + serviceFee;

  // ================= READ SEARCH FROM URL =================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [location.search]);

  // ================= RESET PAGE SAAT KATEGORI ATAU SEARCH BERUBAH =================
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search]);

  // ================= LOAD WISHLIST FROM API =================
  useEffect(() => {
    const loadWishlist = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/wishlist/pengguna/${currentUser.id_pengguna}`,
        );
        setWishlistItems(response.data.data || []);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };
    loadWishlist();
  }, [currentUser?.id_pengguna]);

  // ================= LOAD CART FROM API =================
  useEffect(() => {
    const loadCart = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/keranjang/pengguna/${currentUser.id_pengguna}`,
        );
        const items = response.data.data.items || [];
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, [currentUser?.id_pengguna]);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 12);

        // 🔥 FILTER KATEGORI
        if (selectedCategory !== "Semua") {
          try {
            const categoryResponse = await api.get("/kategori");
            const categories = categoryResponse.data.data || [];
            const category = categories.find(
              (cat) =>
                cat.nama_kategori?.toLowerCase() ===
                selectedCategory.toLowerCase(),
            );
            if (category) {
              params.append("id_kategori", category.id_kategori);
              console.log(
                "🔍 Filter category:",
                selectedCategory,
                "ID:",
                category.id_kategori,
              );
            } else {
              console.warn("⚠️ Category not found:", selectedCategory);
            }
          } catch (catError) {
            console.warn("⚠️ Category API error:", catError);
          }
        }

        // 🔥 SHOPPING MODE
        if (shoppingMode) {
          params.append("shopping_mode", shoppingMode);
          console.log("🔍 Shopping mode applied:", shoppingMode);
        }

        if (search) params.append("q", search);
        if (filters.minPrice > 0) params.append("min_harga", filters.minPrice);
        if (filters.maxPrice > 0) params.append("max_harga", filters.maxPrice);

        // 🔥 FILTER MEREK
        if (filters.brands && filters.brands.length > 0) {
          params.append("brands", filters.brands.join(","));
          console.log("🔍 Filter brands:", filters.brands);
        }

        // 🔥 FILTER RATING
        if (filters.ratings && filters.ratings.length > 0) {
          const minRating = Math.min(...filters.ratings);
          params.append("min_rating", minRating);
          console.log("🔍 Filter min rating:", minRating);
        }

        console.log("📡 Fetching with params:", params.toString());
        const response = await api.get(`/produk?${params.toString()}`);
        console.log("🔍 API Response Home:", response.data);

        let productData = [];
        let paginationData = {
          current_page: 1,
          per_page: 12,
          total_data: 0,
          total_page: 0,
        };

        if (response.data?.data?.data) {
          productData = response.data.data.data;
          paginationData = response.data.data.pagination || paginationData;
        } else if (response.data?.data) {
          productData = response.data.data;
        } else {
          productData = response.data;
        }

        console.log("🔍 Products found:", productData.length);
        setProducts(productData);
        setPagination(paginationData);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, filters, currentPage, shoppingMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showCart") === "true") {
      setShowCart(true);
    }
  }, [location.search]);

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {
    if (productRef.current) {
      const topPosition = productRef.current.offsetTop - 120;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  };

  // ================= WISHLIST FUNCTIONS =================
  const handleAddWishlist = async (productId) => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    try {
      await api.post("/wishlist", {
        id_pengguna: currentUser.id_pengguna,
        id_produk: productId,
      });
      const response = await api.get(
        `/wishlist/pengguna/${currentUser.id_pengguna}`,
      );
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleRemoveWishlist = async (productId) => {
    if (!currentUser) return;
    try {
      await api.delete(`/wishlist/${currentUser.id_pengguna}/${productId}`);
      const response = await api.get(
        `/wishlist/pengguna/${currentUser.id_pengguna}`,
      );
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // ================= CART FUNCTIONS =================
  const handleAddCart = async (productId, quantity = 1) => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    try {
      await api.post("/keranjang", {
        id_pengguna: currentUser.id_pengguna,
        id_produk: productId,
        jumlah: quantity,
      });

      const cartResponse = await api.get(
        `/keranjang/pengguna/${currentUser.id_pengguna}`,
      );
      setCartItems(cartResponse.data.data.items || []);

      try {
        await api.delete(`/wishlist/${currentUser.id_pengguna}/${productId}`);
        const wishlistResponse = await api.get(
          `/wishlist/pengguna/${currentUser.id_pengguna}`,
        );
        setWishlistItems(wishlistResponse.data.data || []);
      } catch (wishlistError) {
        console.warn("Error removing from wishlist:", wishlistError);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  const handleRemoveCart = async (itemId) => {
    try {
      await api.delete(`/keranjang/${itemId}`);
      const response = await api.get(
        `/keranjang/pengguna/${currentUser.id_pengguna}`,
      );
      setCartItems(response.data.data.items || []);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <div className="bg-[#f5f7fb] w-full min-h-screen overflow-x-hidden">
      <CustomerNavbar
        search={search}
        setSearch={setSearch}
        setShowWishlist={setShowWishlist}
        setShowCart={setShowCart}
        onSearch={handleSearch}
        wishlistCount={wishlistItems.length}
        cartCount={cartItems.length}
      />

      <main className="w-full max-w-[1920px] mx-auto px-5 py-6">
        <HeroBanner
          productRef={productRef}
          scrollToShoppingMode={() => {
            const section = document.getElementById("shopping-mode");
            if (section) {
              section.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }}
        />

        <div className="grid grid-cols-[260px_1fr] gap-6 mt-6">
          <div className="h-fit">
            <SidebarFilter filters={filters} setFilters={setFilters} />
          </div>

          <div>
            <CategorySection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div id="shopping-mode" className="mt-5 scroll-mt-32">
              <ShoppingMode
                shoppingMode={shoppingMode}
                setShoppingMode={setShoppingMode}
              />
            </div>

            <section
              id="products"
              ref={productRef}
              className="mt-5 scroll-mt-32"
            >
              <ProductGrid
                products={products}
                loading={loading}
                pagination={pagination}
                setCurrentPage={setCurrentPage}
                selectedCategory={selectedCategory}
                shoppingMode={shoppingMode}
                filters={filters}
                search={search}
                isCustomer={true}
                setWishlistItems={setWishlistItems}
                setShowWishlist={setShowWishlist}
                setCartItems={setCartItems}
                setShowCart={setShowCart}
              />
            </section>
          </div>
        </div>

        <div className="mt-12">
          <RekomendasiSpesial
            shoppingMode={shoppingMode}
            pageType="customer"
            isCustomer={true}
            setWishlistItems={setWishlistItems}
            setShowWishlist={setShowWishlist}
            setCartItems={setCartItems}
            setShowCart={setShowCart}
            setAuthModal={setShowLogin}
          />
        </div>

        <div className="mt-14">
          <Footer />
        </div>
      </main>

      <LoginPopup show={showLogin} setShow={setShowLogin} />

      {showWishlist && (
        <>
          <div
            onClick={() => setShowWishlist(false)}
            className="fixed inset-0 bg-black/40 z-[998]"
          />
          <div className="fixed top-0 right-0 w-[420px] h-screen bg-white shadow-2xl z-[999] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Wishlist</h2>
              <button
                onClick={() => setShowWishlist(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                  <Heart size={55} className="text-slate-300" />
                </div>
                <h3 className="text-3xl font-black">WISHLIST KOSONG</h3>
                <p className="text-slate-500 mt-4 max-w-[280px]">
                  Simpan produk favoritmu untuk dibeli nanti.
                </p>
                <button
                  onClick={() => {
                    setShowWishlist(false);
                    document.getElementById("products")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="mt-8 h-14 px-10 rounded-2xl bg-blue-600 text-white font-black"
                >
                  Belanja Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id_produk || item.id}
                    className="border rounded-3xl p-3 flex gap-3 bg-white"
                  >
                    <img
                      src={item.url_gambar || item.image}
                      alt={item.nama_produk || item.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-black line-clamp-2">
                        {item.nama_produk || item.name}
                      </h3>
                      <p className="text-blue-600 font-black mt-2">
                        Rp{" "}
                        {Number(item.harga || item.harga_produk).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            const productId = item.id_produk || item.id;
                            handleAddCart(productId, 1);
                          }}
                          className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                        >
                          Pindah ke Keranjang
                        </button>
                        <button
                          onClick={() => {
                            const productId = item.id_produk || item.id;
                            handleRemoveWishlist(productId);
                          }}
                          className="w-11 h-11 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showCart && (
        <>
          <div
            onClick={() => setShowCart(false)}
            className="fixed inset-0 bg-black/40 z-[998]"
          />
          <div className="fixed top-0 right-0 w-[420px] h-screen bg-white shadow-2xl z-[999] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">Keranjang</h2>
                <p className="text-slate-400 text-sm font-bold mt-1">
                  {cartItems.length} ITEM
                </p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="h-[75vh] flex flex-col items-center justify-center text-center">
                <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-8">
                  <ShoppingCart size={50} className="text-slate-300" />
                </div>
                <h3 className="text-3xl font-black">KERANJANG KOSONG</h3>
                <p className="text-slate-500 mt-4 max-w-[300px]">
                  Tambahkan produk favoritmu ke keranjang untuk checkout.
                </p>
                <button
                  onClick={() => {
                    setShowCart(false);
                    document.getElementById("products")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="mt-8 px-10 h-14 rounded-2xl bg-blue-600 text-white font-black"
                >
                  Belanja Sekarang
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id_keranjang}
                      className="border rounded-3xl p-3 flex gap-3 bg-white"
                    >
                      <img
                        src={item.url_gambar || item.image}
                        alt={item.nama_produk || item.name}
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-black line-clamp-2">
                          {item.nama_produk || item.name}
                        </h3>
                        <p className="text-blue-600 font-black mt-2">
                          Rp{" "}
                          {Number(
                            item.harga_produk || item.price,
                          ).toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Qty: {item.jumlah || 1}
                        </p>
                        <button
                          onClick={() => handleRemoveCart(item.id_keranjang)}
                          className="mt-3 w-full h-10 rounded-xl bg-red-50 text-red-500 font-bold"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between mb-3">
                    <span className="text-slate-500 font-semibold">
                      Subtotal
                    </span>
                    <span className="font-black">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between mb-5">
                    <span className="text-slate-500 font-semibold">
                      Biaya Layanan
                    </span>
                    <span className="font-black">
                      Rp {serviceFee.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-black">TOTAL</span>
                    <span className="text-3xl font-black text-blue-600">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      navigate("/customer/checkout");
                    }}
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl duration-300 flex items-center justify-center gap-3"
                  >
                    Lanjut ke Pembayaran <ArrowRight size={22} />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
