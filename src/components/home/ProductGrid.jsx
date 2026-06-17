import { useState } from "react";
import ProductCard from "./ProductCard";
import { LayoutGrid, List, ArrowUpDown, Sparkles } from "lucide-react";

function ProductGrid({
  products = [],
  loading = false,
  pagination = {},
  setCurrentPage,
  selectedCategory,
  shoppingMode,
  filters,
  search = "",
  pageType,
  isCustomer,
  setWishlistItems,
  setShowWishlist,
  setCartItems,
  setShowCart,
  setAuthModal,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("Terbaru");

  // ================= SORT =================
  let sortedProducts = [...products];

  if (sortBy === "Termurah") {
    sortedProducts.sort(
      (a, b) => (a.harga || a.price || 0) - (b.harga || b.price || 0),
    );
  }
  if (sortBy === "Termahal") {
    sortedProducts.sort(
      (a, b) => (b.harga || b.price || 0) - (a.harga || a.price || 0),
    );
  }

  // ================= RENDER =================
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[22px] border p-4 animate-pulse"
          >
            <div className="w-full h-[170px] bg-slate-200 rounded-xl"></div>
            <div className="h-4 bg-slate-200 rounded mt-4"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3 mt-2"></div>
            <div className="h-6 bg-slate-200 rounded w-1/2 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" />
            <h2 className="text-3xl font-black">Produk</h2>
          </div>
          <p className="text-slate-500 mt-2">
            Menampilkan {products.length} produk
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-[55px] rounded-2xl bg-white border flex overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`w-14 flex items-center justify-center transition ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 bg-white"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`w-14 flex items-center justify-center transition ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 bg-white"
              }`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-[180px] h-[55px] rounded-2xl bg-white border px-5 pr-10 outline-none shadow-sm"
            >
              <option>Terbaru</option>
              <option>Termurah</option>
              <option>Termahal</option>
            </select>
            <ArrowUpDown
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <h3 className="text-2xl font-black">Produk tidak ditemukan</h3>
          <p className="mt-2">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div
          className={`gap-6 ${
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
              : "flex flex-col"
          }`}
        >
          {sortedProducts.map((item) => (
            <ProductCard
              key={item.id_produk || item.id || Math.random()}
              item={item}
              viewMode={viewMode}
              isCustomer={isCustomer}
              setCartItems={setCartItems}
              setShowCart={setShowCart}
              setShowWishlist={setShowWishlist}
              setWishlistItems={setWishlistItems}
              setAuthModal={setAuthModal}
            />
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {pagination.total_page > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.total_page }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl font-bold ${
                  page === pagination.current_page
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
