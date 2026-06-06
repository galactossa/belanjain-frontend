import { useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

function ProductGrid({
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
  const [viewMode, setViewMode] =
    useState("grid");

  const [sortBy, setSortBy] =
    useState("Terbaru");

  /* ================= FILTER ================= */
let filteredProducts =
  products.filter((item) => {

    // ================= CATEGORY =================
    const matchCategory =
      selectedCategory === "Semua" ||
      item.category === selectedCategory;

    // ================= MODE =================
    const matchMode =
  search.trim() !== ""
    ? true
    : shoppingMode === "SEMUA" ||
      item.mode === shoppingMode;

    // ================= SEARCH =================
    const matchSearch =
  search.trim() === "" ||
  item.name.toLowerCase().includes(search.toLowerCase());

    // ================= PRICE =================
    const matchPrice =
      item.price >=
        filters.minPrice &&
      item.price <=
        filters.maxPrice;

    // ================= BRAND =================
    const matchBrand =
      filters.brands.length === 0
        ? true
        : filters.brands.includes(
            item.brand
          );

    // ================= RATING =================
    const matchRating =
      filters.ratings.length === 0
        ? true
        : filters.ratings.some(
            (rating) =>
              item.rating >= rating
          );

    // ================= RETURN =================
    return (
      matchCategory &&
      matchMode &&
      matchSearch &&
      matchPrice &&
      matchBrand &&
      matchRating
    );
  });

  /* ================= SORT ================= */

  if (sortBy === "Termurah") {

    filteredProducts.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sortBy === "Termahal") {

    filteredProducts.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  return (
    <div className="mt-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">

        {/* LEFT */}
        <div>

          <div className="flex items-center gap-3">

            <Sparkles className="text-blue-600" />

            <h2 className="text-3xl font-black">
              Produk
            </h2>

          </div>

          <p className="text-slate-500 mt-2">
            Menampilkan{" "}
            {filteredProducts.length} produk
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* VIEW */}
          <div className="h-[55px] rounded-2xl bg-white border flex overflow-hidden shadow-sm">

            <button
              onClick={() =>
                setViewMode("grid")
              }
              className={`w-14 flex items-center justify-center transition ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 bg-white"
              }`}
            >

              <LayoutGrid size={18} />

            </button>

            <button
              onClick={() =>
                setViewMode("list")
              }
              className={`w-14 flex items-center justify-center transition ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 bg-white"
              }`}
            >

              <List size={18} />

            </button>

          </div>

          {/* SORT */}
          <div className="relative">

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="
                appearance-none
                w-[180px]
                h-[55px]
                rounded-2xl
                bg-white
                border
                px-5
                pr-10
                outline-none
                shadow-sm
              "
            >

              <option>
                Terbaru
              </option>

              <option>
                Termurah
              </option>

              <option>
                Termahal
              </option>

            </select>

            <ArrowUpDown
              size={18}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

          </div>

        </div>

      </div>

      {/* ================= PRODUCTS ================= */}
      <div
        className={`gap-6 ${
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
            : "flex flex-col"
        }`}
      >

        {filteredProducts.map(
          (item) => (
            <ProductCard
  key={item.id}
  item={item}
  viewMode={viewMode}

  isCustomer={isCustomer}

  setCartItems={setCartItems}
  setShowCart={setShowCart}
  setShowWishlist={
    setShowWishlist
  }
  setWishlistItems={
    setWishlistItems
  }
  setAuthModal={
    setAuthModal
  }
/>

          )
        )}

      </div>

    </div>
  );
}

export default ProductGrid;