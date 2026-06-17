import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import api from "../../api/api";

function RekomendasiSpesial({
  shoppingMode,
  isCustomer,
  setWishlistItems,
  setShowWishlist,
  setCartItems,
  setShowCart,
  setAuthModal,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/produk");
        const data = response.data.data.data || [];
        const sorted = data
          .sort((a, b) => (b.rata_rating || 0) - (a.rata_rating || 0))
          .slice(0, 8);
        setProducts(sorted);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleScroll = () => {
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[34px] font-black text-slate-900">
              Rekomendasi Spesial
            </h2>
            <p className="text-slate-500 mt-2">
              Produk pilihan khusus untuk Anda.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className="mt-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[34px] font-black text-slate-900">
            Rekomendasi Spesial
          </h2>
          <p className="text-slate-500 mt-2">
            Produk pilihan khusus untuk Anda.
          </p>
        </div>
        <button
          onClick={handleScroll}
          className="text-blue-600 font-black hover:text-blue-700 duration-300"
        >
          Lihat Semua
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard
            key={item.id_produk}
            item={item}
            isCustomer={isCustomer}
            setWishlistItems={setWishlistItems}
            setShowWishlist={setShowWishlist}
            setCartItems={setCartItems}
            setShowCart={setShowCart}
            setAuthModal={setAuthModal}
          />
        ))}
      </div>
    </div>
  );
}

export default RekomendasiSpesial;
