import { useState, useRef, useEffect } from "react";
import Navbar from "../components/home/Navbar";
import HeroBanner from "../components/home/HeroBanner";
import SidebarFilter from "../components/home/SidebarFilter";
import CategorySection from "../components/home/CategorySection";
import ProductGrid from "../components/home/ProductGrid";
import ShoppingMode from "../components/home/ShoppingMode";
import RekomendasiSpesial from "../components/home/RekomendasiSpesial";
import Footer from "../components/home/Footer";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import api from "../api/api";

function HomePage() {
  const [search, setSearch] = useState("");
  const productRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [shoppingMode, setShoppingMode] = useState("PREMIUM");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000000,
    brands: [],
    ratings: [],
  });
  const [authModal, setAuthModal] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total_data: 0,
    total_page: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 12);

        if (selectedCategory !== "Semua") {
          try {
            const categoryResponse = await api.get("/kategori");
            const category = categoryResponse.data.data?.find(
              (cat) =>
                cat.nama_kategori?.toLowerCase() ===
                selectedCategory.toLowerCase(),
            );
            if (category) {
              params.append("id_kategori", category.id_kategori);
            }
          } catch (catError) {
            console.warn("Category API error, skipping filter:", catError);
          }
        }

        if (search) params.append("q", search);
        if (filters.minPrice > 0) params.append("min_harga", filters.minPrice);
        if (filters.maxPrice > 0) params.append("max_harga", filters.maxPrice);

        const response = await api.get(`/produk?${params.toString()}`);
        console.log("🔍 HomePage API Response:", response.data);

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
  }, [selectedCategory, search, filters, currentPage]);

  const handleSearch = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#f5f7fb] w-full min-h-screen overflow-x-hidden">
      <Navbar
        search={search}
        setSearch={setSearch}
        setAuthModal={setAuthModal}
        onSearch={handleSearch}
      />

      <main className="w-full max-w-[1920px] mx-auto px-5 py-6">
        <HeroBanner
          productRef={productRef}
          scrollToShoppingMode={() => {
            const section = document.getElementById("shopping-mode");
            if (section) {
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />

        <div className="grid grid-cols-[260px_1fr] gap-6 mt-6 items-start">
          <div className="sticky top-5 h-fit flex flex-col gap-5">
            <SidebarFilter filters={filters} setFilters={setFilters} />
          </div>

          <div className="w-full">
            <CategorySection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div id="shopping-mode" className="mt-5">
              <ShoppingMode
                shoppingMode={shoppingMode}
                setShoppingMode={setShoppingMode}
              />
            </div>

            <div id="products" ref={productRef} className="mt-5">
              <ProductGrid
                products={products}
                loading={loading}
                pagination={pagination}
                setCurrentPage={setCurrentPage}
                selectedCategory={selectedCategory}
                shoppingMode={shoppingMode}
                filters={filters}
                search={search}
                setAuthModal={setAuthModal}
                isCustomer={false}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 w-full">
          <RekomendasiSpesial
            shoppingMode={shoppingMode}
            setAuthModal={setAuthModal}
          />
        </div>

        <div className="mt-14">
          <Footer />
        </div>
      </main>

      {authModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            onClick={() => setAuthModal(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10">
            {authModal === "login" && <Login setAuthModal={setAuthModal} />}
            {authModal === "register" && (
              <Register setAuthModal={setAuthModal} />
            )}
            {authModal === "forgot" && (
              <ForgotPassword setAuthModal={setAuthModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
