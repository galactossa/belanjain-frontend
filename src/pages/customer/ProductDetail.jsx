import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  MessageCircle,
  Minus,
  Plus,
  Flag,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/home/Footer";;
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import { products } from "../../data/products";
import { sellers } from "../../data/sellers";
function ProductDetail() {
  const [isFollowing, setIsFollowing] =
  useState(false);
  const handleShare = async () => {
  const link = window.location.href;

  if (navigator.share) {
    await navigator.share({
      title: product.name,
      text: product.description,
      url: link,
    });
  } else {
    navigator.clipboard.writeText(link);

    alert("Link produk berhasil disalin");
  }
};
  const [qty, setQty] = useState(1);
  
  const { id } = useParams();
  const product = products.find(
  (item) => item.id === Number(id)
);
  const navigate = useNavigate();
  const seller = sellers.find(
  (item) => item.name === product?.store
);
  const [showReport, setShowReport] =
  useState(false);

const [reportText, setReportText] =
  useState("");
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [search, setSearch] = useState("");

  const [wishlistItems, setWishlistItems] =
    useState(
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || []
    );

  const [cartItems, setCartItems] =
    useState(
      JSON.parse(
        localStorage.getItem("cart")
      ) || []
    );

  const [showWishlist, setShowWishlist] =
    useState(false);

  const [showCart, setShowCart] =
    useState(false);

  const [activeTab, setActiveTab] =
  useState("deskripsi");

 if (!product) {
  return (
    <div className="text-center py-20">
      Produk tidak ditemukan
    </div>
  );
}

const totalStoreProducts =
  products.filter(
    (item) =>
      item.store === product.store
  ).length;

  const wishlistCount =
    wishlistItems.length;

  const cartCount =
    cartItems.length;

 const handleCart = () => {
  const oldCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const updatedCart = [
    ...oldCart,
    {
      ...product,
      quantity: qty,
    },
  ];

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );

  setCartItems(updatedCart);
  setShowCart(true);
};

 const handleWishlist = () => {
  const oldWishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

  const isExist = oldWishlist.find(
    (item) => item.id === product.id
  );

  if (isExist) {
    setShowWishlist(true);
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

  setWishlistItems(updatedWishlist);
  setShowWishlist(true);
};
  const subtotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        item.price *
          (item.quantity || 1),
      0
    );

  const serviceFee = 2000;

  const total =
    subtotal + serviceFee;

  return (
    <>
      <CustomerNavbar
        search={search}
        setSearch={setSearch}
        wishlistCount={
          wishlistCount
        }
        cartCount={cartCount}
        setShowWishlist={
          setShowWishlist
        }
        setShowCart={
          setShowCart
        }
        onSearch={() => {}}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 text-sm mb-10">
  <Link
    to="/customer"
    className="text-slate-400 hover:text-blue-600 transition"
  >
    Beranda
  </Link>

  <p>/</p>


          <p className="text-slate-400">
            Pencarian
          </p>

          <p>/</p>

          <p className="font-bold text-slate-800">
            {product.name}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">

          {/* IMAGE */}
             <div className="col-span-12 lg:col-span-4">
            <div className="bg-[#f8f8f8] rounded-[30px] p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[430px] object-contain"
              />
              <div className="flex gap-3 mt-4">
  {[1,2,3,4].map((item) => (
    <div
      key={item}
      className="
      w-20
      h-20
      border
      rounded-xl
      overflow-hidden
      cursor-pointer
      "
    >
      <img
        src={product.image}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  ))}
</div>
            </div>
          </div>
          

          {/* DETAIL */}
            <div className="col-span-12 lg:col-span-5">

         

            <h1 className="text-[34px] font-black text-slate-900">
              {product.name}
            </h1>

            <div className="flex items-center gap-5 mt-5 flex-wrap">

              <div className="flex items-center gap-2">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="font-semibold text-slate-700">
                  {product.rating}
                </span>
              </div>

              <span className="text-slate-500">
                {product.sold} Terjual
              </span>

              <span className="text-slate-500">
                Stock {product.stock}
              </span>
              
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                Trust Score: {product.trust}%
              </span>

            </div>

          <div className="mt-6">

  <h2
    className="
    text-[56px]
    font-black
    text-black
    leading-none
    "
  >
    Rp {product.price.toLocaleString("id-ID")}
  </h2>

  <div className="flex items-center gap-3 mt-2">

    <span
      className="
      bg-red-100
      text-red-500
      px-2
      py-1
      rounded
      text-xs
      font-bold
      "
    >
      17%
    </span>

    <span
      className="
      text-slate-400
      line-through
      "
    >
      Rp {(product.price * 1.2).toLocaleString("id-ID")}
    </span>

  </div>

</div>
            

            {/* Flash Sale Banner - matching screenshot */}
            <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-bold text-sm">Flash Sale: Rp {product.price.toLocaleString("id-ID")}</span>
              <span className="text-xs">• Stok Flash Sale: {product.stock}</span>
            </div>

            <div className="mt-10 border-t pt-6">

  <div className="flex items-center justify-between">

    <div className="flex items-center gap-4">

      <div
 className="
 w-16
 h-16
 rounded-full
 bg-purple-600
 text-white
 flex
 items-center
 justify-center
 font-bold
 text-xl
 "
>
  {product.store
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")}
</div>

      <div>

        <Link
  to={`/customer/store/${seller?.id}`}
  className="font-bold text-lg hover:text-blue-600"
>
  {product.store}
</Link>
        <div className="flex items-center gap-2 text-sm">

          <Star
            size={14}
            className="
            fill-yellow-400
            text-yellow-400
            "
          />

          <span>{product.rating}</span>
          <span className="text-slate-400">
            (3rb rating)
          </span>

          <span className="text-slate-400">
            • {totalStoreProducts} Produk
          </span>

        </div>

      </div>

    </div>

    <button
  onClick={() =>
    setIsFollowing(!isFollowing)
  }
  className={`
    px-6
    py-2
    rounded-xl
    font-semibold
    transition-all
    ${
      isFollowing
        ? "bg-slate-100 text-slate-700 border border-slate-300"
        : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
    }
  `}
>
  {isFollowing
    ? "Following"
    : "Follow"}
</button>

  </div>

</div>

        <div className="flex gap-8">

  <button
    onClick={() =>
      setActiveTab("deskripsi")
    }
    className={`pb-3 font-semibold ${
      activeTab === "deskripsi"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
  >
    Deskripsi Produk
  </button>

  <button
    onClick={() =>
      setActiveTab("info")
    }
    className={`pb-3 font-semibold ${
      activeTab === "info"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
  >
    Info Penting
  </button>

  <button
    onClick={() =>
      setActiveTab("ulasan")
    }
    className={`pb-3 font-semibold ${
      activeTab === "ulasan"
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-slate-500"
    }`}
  >
    Ulasan ({product.ulasan.length})
  </button>

</div>
<div className="mt-8">

  {activeTab === "deskripsi" && (
    <div className="text-slate-600 leading-8">

      <div className="grid grid-cols-[140px_auto] gap-y-2">

        <span>Kategori</span>
        <span>: {product.category}</span>

        <span>Stok</span>
        <span>: {product.stock}</span>

        <span>Terjual</span>
        <span>: {product.sold}</span>

      </div>

      <p className="mt-8">
        {product.description}
      </p>

    </div>
  )}

  {activeTab === "info" && (
    <div className="bg-slate-50 rounded-2xl p-5">

      <h3 className="font-bold text-lg mb-3">
        Info Penting
      </h3>

      <p className="text-slate-600">
        {product.infoPenting}
      </p>

    </div>
  )}

  {activeTab === "ulasan" && (
    <div className="space-y-4">

      {product.ulasan.map(
        (review, index) => (
          <div
            key={index}
            className="
            border
            border-slate-200
            rounded-2xl
            p-5
            "
          >

            <div className="flex justify-between">

              <h4 className="font-bold">
                {review.nama}
              </h4>

              <span className="text-sm text-slate-400">
                {review.tanggal}
              </span>

            </div>

            <p className="mt-3 text-slate-600">
              {review.komentar}
            </p>

          </div>
        )
      )}

    </div>
  )}

</div>

          </div>
          <div className="col-span-12 lg:col-span-3">

  <div
 className="
 bg-white
 border
 border-slate-200
 rounded-[24px]
 sticky
 top-24
 overflow-hidden
 shadow-sm
 "
>
   <div className="flex justify-between items-center">

  <span>⚡ Flash Sale</span>

  <div className="flex gap-1">

    <div className="bg-white text-blue-600 px-2 rounded">
      12
    </div>

    <div className="bg-white text-blue-600 px-2 rounded">
      17
    </div>

    <div className="bg-white text-blue-600 px-2 rounded">
      45
    </div>

  </div>

</div>

    <div className="p-5">

      <h3 className="font-bold">
        Atur jumlah dan catatan
      </h3>

      <div
        className="
        flex
        items-center
        justify-between
        mt-4
        "
      >

        <div className="flex items-center border rounded-lg">

          <button
            onClick={() =>
              qty > 1 &&
              setQty(qty - 1)
            }
            className="px-3 py-2"
          >
            -
          </button>

          <span className="px-4">
            {qty}
          </span>

          <button
            onClick={() =>
              setQty(qty + 1)
            }
            className="px-3 py-2"
          >
            +
          </button>

        </div>

        <span className="text-sm">
          Stok : {product.stock}
        </span>

      </div>

      <div className="mt-8">
        <p className="text-right text-slate-400 line-through text-sm">
 Rp {(product.price * 1.2).toLocaleString("id-ID")}
</p>
        <p className="text-sm text-slate-500">
          Subtotal
        </p>

        <h2
          className="
          text-3xl
          font-black
          "
        >
          Rp{" "}
          {(
            product.price *
            qty
          ).toLocaleString("id-ID")}
        </h2>

      </div>

      <button
        onClick={handleCart}
        className="
        w-full
        h-14
        bg-blue-600
        text-white
        rounded-xl
        mt-6
        font-bold
        "
      >
        + Keranjang
      </button>

      <button
  onClick={() => {
    const checkoutItem = [
      {
        ...product,
        quantity: qty,
      },
    ];

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify(checkoutItem)
    );

    navigate("/customer/checkout");
  }}
  className="
  w-full
  h-14
  border
  border-blue-600
  text-blue-600
  rounded-xl
  mt-3
  font-bold
  hover:bg-blue-600
  hover:text-white
  transition
  "
>
  Beli Langsung
</button>
     <div
  className="
  grid
  grid-cols-4
  gap-2
  mt-6
  text-xs
  "
>

  {/* CHAT */}
  <button
    onClick={() =>
      navigate("/customer/chat")
    }
    className="
    flex
    flex-col
    items-center
    gap-1
    text-slate-600
    hover:text-blue-600
    "
  >
    <MessageCircle size={18} />
    <span>Chat</span>
  </button>

  {/* WISHLIST */}
  <button
    onClick={handleWishlist}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-slate-600
    hover:text-pink-600
    "
  >
    <Heart size={18} />
    <span>Wishlist</span>
  </button>

  {/* LAPOR */}
  <button
    onClick={() =>
      setShowReport(true)
    }
    className="
    flex
    flex-col
    items-center
    gap-1
    text-slate-600
    hover:text-red-600
    "
  >
    <Flag size={18} />
    <span>Lapor</span>
  </button>

  {/* SHARE */}
  <button
    onClick={handleShare}
    className="
    flex
    flex-col
    items-center
    gap-1
    text-slate-600
    hover:text-emerald-600
    "
  >
    <Share2 size={18} />
    <span>Share</span>
  </button>

</div>

    </div>

  </div>

</div>

        </div>
      </div>

      {/* WISHLIST DRAWER - unchanged logic, only visual improvements */}
      {showWishlist && (
  <>
    <div
      onClick={() => setShowWishlist(false)}
      className="fixed inset-0 bg-black/40 z-[998]"
    />

    <div
      className="
        fixed top-0 right-0
        w-[420px] max-w-[90vw] h-screen
        bg-white shadow-2xl
        z-[999] p-6 overflow-y-auto
      "
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800">
          Wishlist
        </h2>

        <button
          onClick={() => setShowWishlist(false)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        >
          ✕
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <Heart
              size={55}
              className="text-slate-300"
            />
          </div>

          <h3 className="text-3xl font-black text-slate-800">
            WISHLIST KOSONG
          </h3>

          <p className="text-slate-500 mt-4">
            Simpan produk favoritmu
            untuk dibeli nanti.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="
                border border-slate-200 rounded-3xl
                p-3 flex gap-3
              "
            >
              <img
                src={item.image}
                alt={item.name}
                className="
                  w-24 h-24
                  rounded-2xl
                  object-cover
                "
              />

              <div className="flex-1">
                <h3 className="font-black line-clamp-2 text-slate-800">
                  {item.name}
                </h3>

                <p className="text-blue-600 font-black mt-2">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>

                <button
                  onClick={() => {
                    const updated =
                      wishlistItems.filter(
                        (wishlistItem) =>
                          wishlistItem.id !== item.id
                      );

                    setWishlistItems(updated);

                    localStorage.setItem(
                      "wishlist",
                      JSON.stringify(updated)
                    );
                  }}
                  className="
                    mt-4
                    w-full h-11
                    rounded-xl
                    bg-red-50
                    text-red-500
                    font-bold
                    hover:bg-red-100
                    transition
                  "
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
)}

      {/* CART DRAWER - unchanged logic, only visual improvements */}
      {showCart && (
  <>
    <div
      onClick={() => setShowCart(false)}
      className="fixed inset-0 bg-black/40 z-[998]"
    />

    <div
      className="
        fixed top-0 right-0
        w-[420px] max-w-[90vw] h-screen
        bg-white shadow-2xl
        z-[999] p-6 overflow-y-auto
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Keranjang
          </h2>

          <p className="text-slate-400 text-sm font-bold mt-1">
            {cartItems.length} ITEM
          </p>
        </div>

        <button
          onClick={() => setShowCart(false)}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        >
          ✕
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="h-[75vh] flex flex-col items-center justify-center text-center">
          <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center mb-8">
            <ShoppingCart
              size={50}
              className="text-slate-300"
            />
          </div>

          <h3 className="text-3xl font-black text-slate-800">
            KERANJANG KOSONG
          </h3>

          <p className="text-slate-500 mt-4">
            Tambahkan produk favoritmu
            ke keranjang untuk checkout.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="
                  border border-slate-200 rounded-3xl
                  p-3 flex gap-3
                "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-24 h-24
                    rounded-2xl
                    object-cover
                  "
                />

                <div className="flex-1">
                  <h3 className="font-black line-clamp-2 text-slate-800">
                    {item.name}
                  </h3>

                  <p className="text-blue-600 font-black mt-2">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>

                  <p className="text-sm text-slate-500">
                    Qty: {item.quantity || 1}
                  </p>

                  <button
                    onClick={() => {
                      const updated =
                        cartItems.filter(
                          (cartItem) =>
                            cartItem.id !== item.id
                        );

                      setCartItems(updated);

                      localStorage.setItem(
                        "cart",
                        JSON.stringify(updated)
                      );
                    }}
                    className="
                      mt-4
                      w-full h-11
                      rounded-xl
                      bg-red-50
                      text-red-500
                      font-bold
                      hover:bg-red-100
                      transition
                    "
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex justify-between mb-3">
              <span className="text-slate-600">Subtotal</span>

              <span className="font-black text-slate-800">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-slate-600">Biaya Layanan</span>

              <span className="font-black text-slate-800">
                Rp {serviceFee.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center mb-6 pt-3 border-t border-slate-200">
              <span className="text-2xl font-black text-slate-800">
                TOTAL
              </span>

              <span className="text-3xl font-black text-blue-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={() =>
                navigate("/customer/checkout")
              }
              className="
                w-full h-14
                rounded-2xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-black
                flex items-center
                justify-center
                gap-3
                transition
              "
            >
              Lanjut ke Pembayaran

              <ArrowRight size={22} />
            </button>
          </div>
        </>
      )}
    </div>
  </>
)}
{/* PRODUK SERUPA */}
<div className="max-w-7xl mx-auto px-6 pb-20">

  <div className="flex items-center justify-between mb-8">

    <h2 className="text-3xl font-black">
      Rekomendasi Untukmu
    </h2>

    <button
      onClick={() => navigate("/customer")}
      className="
        text-blue-600
        font-bold
        uppercase
        tracking-wider
        hover:underline
      "
    >
      LIHAT SEMUA
    </button>

  </div>
  

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

    {products
      .filter(
        (item) =>
          item.category === product.category &&
          item.id !== product.id
      )
      .slice(0, 5)
      .map((item) => (

        <div
          key={item.id}
          onClick={() =>
            navigate(
  `/customer/product-detail/${item.id}`
)
          }
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            overflow-hidden
            cursor-pointer
            hover:shadow-xl
            duration-300
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
                text-blue-600
                font-black
                mt-3
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
                justify-between
                mt-3
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

                {item.rating}

              </div>

              <span className="text-slate-400">
                {item.sold} Terjual
              </span>

            </div>

          </div>

        </div>

      ))}

  </div>
  {showReport && (
  <>
    <div
      onClick={() =>
        setShowReport(false)
      }
      className="
      fixed
      inset-0
      bg-black/50
      z-[999]
      "
    />

    <div
      className="
      fixed
      top-1/2
      left-1/2
      -translate-x-1/2
      -translate-y-1/2
      bg-white
      w-[500px]
      max-w-[95vw]
      rounded-[30px]
      shadow-2xl
      z-[1000]
      overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
        flex
        justify-between
        items-center
        px-8
        py-6
        border-b
        "
      >
        <h2
          className="
          text-3xl
          font-black
          "
        >
          LAPORKAN PRODUK
        </h2>

        <button
          onClick={() =>
            setShowReport(false)
          }
          className="
          text-slate-400
          text-3xl
          "
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-8">

        <p
          className="
          text-slate-500
          mb-6
          "
        >
          Bantu kami menjaga
          komunitas tetap aman.
          Berikan alasan mengapa
          Anda melaporkan produk ini.
        </p>

        <label
          className="
          block
          text-sm
          font-bold
          text-slate-600
          mb-2
          "
        >
          LAPORKAN PRODUK
        </label>

        <textarea
          value={reportText}
          onChange={(e) =>
            setReportText(
              e.target.value
            )
          }
          rows={5}
          placeholder="Contoh: Produk palsu, deskripsi menyesatkan, atau konten tidak pantas."
          className="
          w-full
          border
          rounded-2xl
          p-4
          resize-none
          bg-slate-50
          "
        />

        <button
          onClick={() => {
            alert(
              "Laporan berhasil dikirim"
            );

            setReportText("");

            setShowReport(false);
          }}
          className="
          w-full
          h-14
          bg-red-600
          hover:bg-red-700
          text-white
          rounded-2xl
          font-black
          mt-6
          "
        >
          KIRIM LAPORAN
        </button>

      </div>
    </div>
  </>
)}
  

</div>

<Footer />
    </>
  );
}

export default ProductDetail;