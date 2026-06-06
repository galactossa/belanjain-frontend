import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Star,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";

import { products } from "../../data/products";
import { sellers } from "../../data/sellers";

function StoreDetail() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [viewMode, setViewMode] = useState("grid");
    const { id } = useParams();
    const navigate = useNavigate();
    
  const [isFollowing, setIsFollowing] =
    useState(false);

  const seller = sellers.find(
    (item) => item.id === Number(id)
  );

  if (!seller) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-black">
          Toko Tidak Ditemukan
        </h1>
      </div>
    );
  }

  const storeProducts = products.filter(
    (item) => item.store === seller.name
  );
const filteredProducts = [...storeProducts]
  .filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === "price-low")
      return a.price - b.price;

    if (sortBy === "price-high")
      return b.price - a.price;

    if (sortBy === "sold")
      return b.sold - a.sold;

    return b.id - a.id;
  });
  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* BANNER */}
      <div className="max-w-7xl mx-auto px-6 pt-8">

        <div className="relative">
            <button
  onClick={() => navigate(-1)}
  className="
  absolute
  top-6
  left-6
  z-20
  bg-black/40
  text-white
  px-5
  py-3
  rounded-xl
  backdrop-blur
  "
>
  ← Kembali
</button>

         <div className="h-[340px] rounded-[40px] overflow-hidden relative">

  <img
    src={seller.banner}
    alt={seller.name}
    className="w-full h-full object-cover"
  />

  <div
    className="
    absolute
    inset-0
    bg-black/55
    "
  />

</div>

          {/* HEADER TOKO */}
<div className="absolute bottom-8 left-8 right-8">

  <div className="flex justify-between items-end">

    <div className="flex items-center gap-5">

      <img
        src={seller.logo}
        alt={seller.name}
        className="
        w-24
        h-24
        rounded-3xl
        object-cover
        border-4
        border-white
        shadow-lg
        "
      />

      <div>

        <h1 className="text-4xl font-black text-white">
          {seller.name}
        </h1>

        <div className="flex gap-4 mt-2 text-white/90">

          <span>
            ⭐ {seller.rating}/5.0
          </span>

          <span>
            👥 {seller.followers.toLocaleString()}
          </span>

          <span>
            📍 {seller.city}
          </span>

        </div>

      </div>

    </div>

    <div className="flex gap-3">

     <button
  onClick={() =>
    navigate(`/customer/chat`)
  }
  className="
  bg-white
  px-6
  h-12
  rounded-xl
  font-semibold
  "
>
  Chat
</button>

 <button
  onClick={() =>
    setIsFollowing(!isFollowing)
  }
  className={`
    px-6
    h-12
    rounded-xl
    font-semibold
    transition
    ${
      isFollowing
        ? "bg-white text-slate-700 border border-slate-300"
        : "bg-indigo-600 text-white"
    }
  `}
>
  {isFollowing ? "✓ Mengikuti" : "+ Ikuti"}
</button>

    </div>

  </div>

</div>

        </div>
        <div className="grid grid-cols-4 gap-5 mt-8">

  <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <p className="text-slate-400 text-sm">
      Kecepatan Respon
    </p>

    <h3 className="text-2xl font-bold mt-2">
      99%
    </h3>
  </div>

  <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <p className="text-slate-400 text-sm">
      Waktu Proses
    </p>

    <h3 className="text-2xl font-bold mt-2">
      &lt; 24 Jam
    </h3>
  </div>

  <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <p className="text-slate-400 text-sm">
      Bergabung Sejak
    </p>

    <h3 className="text-2xl font-bold mt-2">
      Jan {seller.joined}
    </h3>
  </div>

  <div className="bg-white rounded-2xl p-6 shadow-sm border">
    <p className="text-slate-400 text-sm">
      Produk Terjual
    </p>

    <h3 className="text-2xl font-bold mt-2">
      10rb+
    </h3>
  </div>

</div>
{/* SEARCH & FILTER */}

<div
  className="
  bg-white
  rounded-3xl
  p-6
  border
  shadow-sm
  mt-8
  "
>

  {/* BARIS ATAS */}
  <div className="flex items-center gap-3">

    <div className="flex-1 relative">

      <Search
        size={20}
        className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-slate-400
        "
      />

      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Cari produk di toko ini..."
        className="
        w-full
        h-12
        pl-12
        pr-4
        rounded-xl
        bg-slate-50
        border
        "
      />

    </div>

    {/* GRID */}
    <button
      onClick={() => setViewMode("grid")}
      className={`
        w-12
        h-12
        rounded-xl
        flex
        items-center
        justify-center
        ${
          viewMode === "grid"
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      <LayoutGrid size={20} />
    </button>

    {/* LIST */}
    <button
      onClick={() => setViewMode("list")}
      className={`
        w-12
        h-12
        rounded-xl
        flex
        items-center
        justify-center
        ${
          viewMode === "list"
            ? "bg-indigo-600 text-white"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      <List size={20} />
    </button>

    <select
      value={sortBy}
      onChange={(e) =>
        setSortBy(e.target.value)
      }
      className="
      h-12
      px-4
      rounded-xl
      border
      "
    >
      <option value="latest">
        Terbaru
      </option>

      <option value="sold">
        Terlaris
      </option>

      <option value="price-low">
        Harga Terendah
      </option>

      <option value="price-high">
        Harga Tertinggi
      </option>
    </select>

    <button
      className="
      w-12
      h-12
      rounded-xl
      bg-slate-100
      flex
      items-center
      justify-center
      "
    >
      <SlidersHorizontal size={20} />
    </button>

  </div>

</div>
       
        {/* HEADER PRODUK */}
        <div className="mt-14 flex justify-between items-center">

          <div>
            <h2 className="text-4xl font-black">
              Semua Produk
            </h2>

            <p className="text-slate-500 mt-2">
              {filteredProducts.length} produk tersedia
            </p>
          </div>

        </div>

        {/* GRID PRODUK */}
        <div
  className={
    viewMode === "grid"
      ? `
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-5
        gap-6
        mt-8
      `
      : `
        flex
        flex-col
        gap-4
        mt-8
      `
  }
>

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              onClick={() =>
                navigate(
                  `/customer/product-detail/${product.id}`
                )
              }
              className={`
bg-white
border
overflow-hidden
cursor-pointer
transition

${
  viewMode === "grid"
    ? "rounded-[28px]"
    : "flex rounded-2xl min-h-[190px]"
}
`}
            >

              <img
                src={product.image}
                alt={product.name}
                className="
                w-full
                h-56
                object-cover
                "
              />

              <div className="p-5">

                <h3
                  className="
                  font-black
                  line-clamp-2
                  min-h-[55px]
                  "
                >
                  {product.name}
                </h3>

                <p
                  className="
                  text-blue-600
                  text-xl
                  font-black
                  mt-3
                  "
                >
                  Rp{" "}
                  {product.price.toLocaleString(
                    "id-ID"
                  )}
                </p>

                <div
                  className="
                  flex
                  justify-between
                  mt-4
                  text-sm
                  "
                >

                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="
                      fill-yellow-400
                      text-yellow-400
                      "
                    />
                    {product.rating}
                  </div>

                  <span className="text-slate-400">
                    {product.sold} Terjual
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