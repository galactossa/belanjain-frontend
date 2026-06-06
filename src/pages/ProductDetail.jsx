import {
  Star,
  Heart,
  ShoppingCart,
  Store,
  MapPin,
  MessageCircle,
  Flag,
  Share2,
} from "lucide-react";
import { sellers } from "../data/sellers";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import RekomendasiSpesial from "../components/home/RekomendasiSpesial";
import { products } from "../data/products";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

function ProductDetail() {
  const [activeTab, setActiveTab] =
  useState("deskripsi");
  const [quantity, setQuantity] =
  useState(1);
  const [authModal, setAuthModal] = useState(null);
 const { id } = useParams();
const navigate = useNavigate();

const product = products.find(
  (item) => item.id === Number(id)
);

const seller = sellers.find(
  (s) => s.name === product?.store
);

const produkTokoSama = products.filter(
  (item) =>
    item.store === product?.store &&
    item.id !== product?.id
);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-black">
          Produk Tidak Ditemukan
        </h1>
      </div>
    );
  }

  const handleCart = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (!currentUser) {
  setAuthModal("login");
  return;
}

    const oldCart =
      JSON.parse(localStorage.getItem("cart")) ||
      [];

    const updatedCart = [
      ...oldCart,
      {
        ...product,
        quantity: quantity,
        
        
      },
      
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert("Produk masuk ke keranjang");
  };

  const handleWishlist = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  if (!currentUser) {
    setAuthModal("login");
    return;
  }

  const oldWishlist =
    JSON.parse(
      localStorage.getItem("wishlist")
    ) || [];

  const isExist = oldWishlist.find(
    (item) => item.id === product.id
  );

  if (isExist) {
    alert("Produk sudah ada di wishlist");
    return;
  }

  const updatedWishlist = [
    ...oldWishlist,
    product,
  ];

  localStorage.setItem(
    "wishlist",
    JSON.stringify(updatedWishlist)
  );

  alert("Produk masuk wishlist");
};
  const handleChat = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  if (!currentUser) {
    setAuthModal("login");
    return;
  }

  alert("Membuka chat...");
};

const handleReport = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  if (!currentUser) {
    setAuthModal("login");
    return;
  }

  alert("Laporan berhasil dikirim");
};

const handleBuyNow = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  if (!currentUser) {
    setAuthModal("login");
    return;
  }

  alert("Menuju checkout");
};

const handleShare = async () => {
  const url = window.location.href;

  if (navigator.share) {
    await navigator.share({
      title: product.name,
      text: product.name,
      url,
    });
  } else {
    navigator.clipboard.writeText(url);
    alert("Link produk disalin");
  }
};
const handleFollow = () => {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  if (!currentUser) {
    setAuthModal("login");
    return;
  }

  alert("Berhasil mengikuti toko");
};
  return (
    <div className="bg-[#f5f7fb] min-h-screen">
      <Navbar />

      <main className="max-w-[1450px] mx-auto px-6 py-10">
        <div
  className="
  flex
  items-center
  gap-2
  text-sm
  text-slate-400
  mb-8
  "
>
  <button
  onClick={() => navigate("/")}
  className="
  hover:text-indigo-600
  cursor-pointer
  "
>
  Beranda
</button>
  <span>›</span>
  <span>Pencarian</span>
  <span>›</span>

  <span className="text-slate-700">
    {product.name}
  </span>
</div>

        {/* DETAIL */}
        <div
  className="
  grid
  lg:grid-cols-[350px_1fr_290px]
  gap-10
  items-start
  "
>

          {/* IMAGE */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm">

            <img
              src={product.image}
              alt={product.name}
              className="
                w-full
                h-[500px]
                object-cover
                rounded-[28px]
              "
            />

          </div>

          {/* INFO */}
          <div>

            <div
              className="
                inline-flex
                px-4
                py-2
                rounded-xl
                bg-blue-100
                text-blue-600
                font-bold
                mb-5
              "
            >
              {product.category}
            </div>

            <h1
              className="
                text-[28px]
                font-black
                leading-tight
              "
            >
              {product.name}
            </h1>

         <div className="flex items-center gap-3 mt-3 text-sm">
  <span className="text-slate-500">
    Terjual {product.sold}
  </span>

  <span>•</span>

  <div className="flex items-center gap-1">
    <Star
      size={16}
      className="fill-yellow-400 text-yellow-400"
    />
    <span className="font-bold">
      {product.rating}
    </span>
  </div>

  <span>•</span>

  <span
    className="
    px-3 py-1
    rounded-full
    bg-green-100
    text-green-700
    font-semibold
    "
  >
    Trust Score {product.trust}%
  </span>
</div>

            <h2
  className="
    text-[36px]
    font-black
    text-slate-900
    mt-8
  "
>
              Rp{" "}
              {product.price.toLocaleString(
                "id-ID"
              )}
            </h2>
            <div
  className="
  mt-6
  bg-white
  border
  rounded-2xl
  p-5
  flex
  items-center
  justify-between
  "
>
  <div className="flex items-center gap-4">

    <div
      className="
      w-12
      h-12
      rounded-full
      bg-indigo-600
      text-white
      flex
      items-center
      justify-center
      font-bold
      "
    >
      {product.store.charAt(0)}
    </div>

    <div>

      <button
        onClick={() =>
          navigate(`/customer/store/${seller?.id}`)
        }
        className="
        font-black
        hover:text-indigo-600
        "
      >
        {product.store}
      </button>

      <p className="text-sm text-slate-500">
        ⭐ {product.rating} • {product.sold} Terjual
      </p>

    </div>

  </div>

<button
  onClick={handleFollow}
  className="
  border
  border-indigo-600
  text-indigo-600
  px-5
  py-2
  rounded-xl
  font-semibold
  hover:bg-indigo-600
  hover:text-white
  "
>
  Follow
</button>
{authModal && (
  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
    "
  >
    <div
      onClick={() => setAuthModal(null)}
      className="
        absolute
        inset-0
        bg-black/60
      "
    />

    <div className="relative z-10">
      {authModal === "login" && (
        <Login setAuthModal={setAuthModal} />
      )}

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
            <div
  className="
  flex
  gap-8
  border-b
  mt-10
  pb-4
  "
>
  
  <button
  onClick={() =>
    setActiveTab("deskripsi")
  }
  className={
    activeTab === "deskripsi"
      ? "font-bold text-indigo-600"
      : "text-slate-400"
  }
>
  Deskripsi Produk
</button>

<button
  onClick={() =>
    setActiveTab("info")
  }
  className={
    activeTab === "info"
      ? "font-bold text-indigo-600"
      : "text-slate-400"
  }
>
  Info Penting
</button>

<button
  onClick={() =>
    setActiveTab("ulasan")
  }
  className={
    activeTab === "ulasan"
      ? "font-bold text-indigo-600"
      : "text-slate-400"
  }
>
  Ulasan
</button>
  <div>

    <div className="flex items-center gap-2">

    </div>

  </div>

</div>

            <div className="mt-8">

  {activeTab === "deskripsi" && (

    <div className="space-y-4">

      <div className="grid grid-cols-[120px_1fr]">
        <span className="text-slate-500">
          Kategori
        </span>

        <span>
          {product.category}
        </span>
      </div>

      <div className="grid grid-cols-[120px_1fr]">
        <span className="text-slate-500">
          Stok
        </span>

        <span>
          {product.stock} pcs
        </span>
      </div>

      <div className="grid grid-cols-[120px_1fr]">
        <span className="text-slate-500">
          Lokasi
        </span>

        <span>
          {product.city}
        </span>
      </div>

      <p className="pt-4 text-slate-600">
        {product.description}
      </p>

    </div>

  )}

  {activeTab === "info" && (

    <div
      className="
      bg-white
      border
      rounded-xl
      p-5
      "
    >
      <p className="text-slate-700">
        {product.infoPenting}
      </p>
    </div>

  )}

  {activeTab === "ulasan" && (

    <div className="space-y-4">

      {product.ulasan?.map(
        (item, index) => (

          <div
            key={index}
            className="
            bg-white
            border
            rounded-xl
            p-5
            "
          >
            <div
              className="
              flex
              justify-between
              mb-2
              "
            >
              <h4 className="font-bold">
                {item.nama}
              </h4>

              <span
                className="
                text-sm
                text-slate-400
                "
              >
                {item.tanggal}
              </span>
            </div>

            <p className="text-slate-600">
              {item.komentar}
            </p>

          </div>

        )
      )}

    </div>

  )}

</div>

         </div>

{/* SIDEBAR PEMBELIAN */}

<div
  className="
  bg-white
  rounded-3xl
  p-6
  border
  shadow-sm
  h-fit
  sticky
  top-24
  "
>
  <div
  className="
  bg-indigo-600
  text-white
  rounded-xl
  p-4
  mb-5
  "
>
  <p className="font-bold">
    Flash Sale
  </p>

  <p className="text-sm opacity-90">
    Berakhir Dalam 12:18:00
  </p>
</div>

 <h3 className="font-black text-xl">
  Atur jumlah dan catatan
</h3>

<p
  className="
  text-sm
  text-slate-500
  mt-2
  "
>
  Stok tersedia: {product.stock} pcs
</p>
  <div
    className="
    flex
    items-center
    gap-4
    mt-5
    "
  >
    <button
  onClick={() =>
    quantity > 1 &&
    setQuantity(quantity - 1)
  }
  className="
  w-10
  h-10
  border
  rounded-lg
  hover:bg-slate-100
  "
>
  -
</button>

    <span className="font-bold text-lg">
  {quantity}
</span>

    <button
  onClick={() => {
    if (
      quantity < product.stock
    ) {
      setQuantity(quantity + 1);
    }
  }}
  className="
  w-10
  h-10
  border
  rounded-lg
  hover:bg-slate-100
  "
>
  +
</button>
  </div>

  <div className="mt-8">

    <p className="text-slate-500">
      Subtotal
    </p>

    <h2 className="text-3xl font-black">
      Rp {(product.price * quantity)
  .toLocaleString("id-ID")}
    </h2>

  </div>

  <button
    onClick={handleCart}
    className="
    w-full
    h-14
    rounded-xl
    bg-indigo-600
    text-white
    font-bold
    mt-6
    "
  >
    + Keranjang
  </button>

 <button
  onClick={handleBuyNow}
  className="
  w-full
  h-14
  rounded-xl
  border-2
  border-indigo-600
  text-indigo-600
  font-bold
  mt-3
  "
>
  Beli Langsung
</button>

<div
  className="
  mt-6
  grid
  grid-cols-4
  gap-3
  "
>

  <button
    onClick={handleChat}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-sm
    text-slate-600
    hover:text-indigo-600
    "
  >
    <MessageCircle size={20} />
    <span>Chat</span>
  </button>

  <button
    onClick={handleWishlist}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-sm
    text-slate-600
    hover:text-red-500
    "
  >
    <Heart size={20} />
    <span>Wishlist</span>
  </button>

  <button
    onClick={handleReport}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-sm
    text-slate-600
    hover:text-orange-500
    "
  >
    <Flag size={20} />
    <span>Report</span>
  </button>

  <button
    onClick={handleShare}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-sm
    text-slate-600
    hover:text-green-600
    "
  >
    <Share2 size={20} />
    <span>Share</span>
  </button>

</div>

</div>

</div>

{/* PRODUK TOKO INI */}

<div className="mt-16">

  <div className="flex items-center justify-between mb-6">

    <h2
      className="
      text-3xl
      font-black
      text-slate-900
      "
    >
      Produk Lain Dari Toko Ini
    </h2>

    <button
      onClick={() =>
        navigate(`/`)
      }
      className="
      text-indigo-600
      font-bold
      hover:underline
      "
    >
      Lihat Semua
    </button>

  </div>

  <div
    className="
    grid
    grid-cols-2
    md:grid-cols-3
    lg:grid-cols-5
    gap-5
    "
  >

    {produkTokoSama.map((item) => (

      <div
        key={item.id}
       onClick={() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  navigate(
    `/product-detail/${item.id}`
  );
}}
        className="
        bg-white
        rounded-3xl
        overflow-hidden
        border
        shadow-sm
        cursor-pointer
        hover:-translate-y-1
        transition
        "
      >

        <img
          src={item.image}
          alt={item.name}
          className="
          w-full
          h-52
          object-cover
          "
        />

        <div className="p-4">

          <h3
            className="
            font-black
            line-clamp-2
            min-h-[50px]
            "
          >
            {item.name}
          </h3>

          <p
            className="
            text-2xl
            font-black
            mt-2
            "
          >
            Rp{" "}
            {item.price.toLocaleString(
              "id-ID"
            )}
          </p>

          <div
            className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
            mt-2
            "
          >

            <Star
              size={15}
              className="
              fill-yellow-400
              text-yellow-400
              "
            />

            {item.rating}

            <span>•</span>

            {item.sold} Terjual

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

      </main>
{authModal && (
  <div
    className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
    "
  >
    <div
      onClick={() => setAuthModal(null)}
      className="
        absolute
        inset-0
        bg-black/60
        backdrop-blur-sm
      "
    />

    <div className="relative z-10">
      {authModal === "login" && (
        <Login
          setAuthModal={setAuthModal}
        />
      )}

      {authModal === "register" && (
        <Register
          setAuthModal={setAuthModal}
        />
      )}

      {authModal === "forgot" && (
        <ForgotPassword
          setAuthModal={setAuthModal}
        />
      )}
    </div>
  </div>
)}

<Footer />
    </div>
  );
}

export default ProductDetail;