import ProductCard from "./ProductCard";
import { products } from "../../data/products";
function RekomendasiSpesial({
  shoppingMode,
  isCustomer,

  setWishlistItems,
  setShowWishlist,

  setCartItems,
  setShowCart,

  setAuthModal,
}) {


  /* =========================
     TANPA FILTER
  ========================= */
 const filteredProducts = products
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 8);
  /* =========================
     SCROLL TO PRODUCT GRID
  ========================= */
  const handleScroll = () => {
    const section =
      document.getElementById(
        "products"
      );

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
          className="
          text-blue-600
          font-black
          hover:text-blue-700
          duration-300
        "
        >
          Lihat Semua
        </button>

      </div>

      {/* GRID */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-6
      "
      >

        {filteredProducts.map(
          (item) => (

            <ProductCard
  key={item.id}
  item={item}

  isCustomer={isCustomer}

  setWishlistItems={
    setWishlistItems
  }

  setShowWishlist={
    setShowWishlist
  }

  setCartItems={
    setCartItems
  }

  setShowCart={
    setShowCart
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

export default RekomendasiSpesial;