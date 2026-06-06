import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Heart,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import HeroBanner from "../../components/home/HeroBanner";
import SidebarFilter from "../../components/home/SidebarFilter";
import CategorySection from "../../components/home/CategorySection";
import ProductGrid from "../../components/home/ProductGrid";
import ShoppingMode from "../../components/home/ShoppingMode";
import RekomendasiSpesial from "../../components/home/RekomendasiSpesial";
import Footer from "../../components/home/Footer";
import LoginPopup from "../../components/home/LoginPopup";

function Home() {

  const navigate = useNavigate();

  // ================= SEARCH =================
  const [search, setSearch] =
    useState("");

  // ================= PRODUCT REF =================
  const productRef = useRef(null);

  // ================= CATEGORY =================
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Semua");

  // ================= SHOPPING MODE =================
  const [
    shoppingMode,
    setShoppingMode,
  ] = useState("PREMIUM");

  // ================= FILTER =================
  const [filters, setFilters] =
    useState({
      minPrice: 0,
      maxPrice: 50000000,
      brands: [],
      ratings: [],
    });

  // ================= LOGIN =================
  const [
    showLogin,
    setShowLogin,
  ] = useState(false);

  // ================= WISHLIST =================
  const [
    showWishlist,
    setShowWishlist,
  ] = useState(false);

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState([]);

  // ================= CART =================
  const [
    showCart,
    setShowCart,
  ] = useState(false);

  const [
    cartItems,
    setCartItems,
  ] = useState([]);

  // ================= TOTAL =================
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.price * (item.quantity || 1),
    0
  );

  const serviceFee = 2000;

  const total =
    subtotal + serviceFee;

  // ================= LOAD WISHLIST =================
  useEffect(() => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem("wishlist")
      ) || [];

    setWishlistItems(savedWishlist);

  }, []);

  // ================= LOAD CART =================
  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCartItems(savedCart);

  }, []);

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {

    if (productRef.current) {

      const topPosition =
        productRef.current.offsetTop - 120;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });

    }
  };

  return (

    <div
      className="
        bg-[#f5f7fb]
        w-full
        min-h-screen
        overflow-x-hidden
      "
    >

      {/* ================= NAVBAR ================= */}
      <CustomerNavbar
        search={search}
        setSearch={setSearch}
        setShowWishlist={
          setShowWishlist
        }
        setShowCart={
          setShowCart
        }
        onSearch={handleSearch}
        wishlistCount={
          wishlistItems.length
        }
        cartCount={
          cartItems.length
        }
      />

      {/* ================= MAIN ================= */}
      <main
        className="
          w-full
          max-w-[1920px]
          mx-auto
          px-5
          py-6
        "
      >

        {/* HERO */}
        <HeroBanner
  productRef={productRef}
  scrollToShoppingMode={() => {

    const section =
      document.getElementById(
        "shopping-mode"
      );

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  }}
/>

        {/* CONTENT */}
        <div
          className="
            grid
            grid-cols-[260px_1fr]
            gap-6
            mt-6
          "
        >

          {/* SIDEBAR */}
          <div
            className="
              h-fit
            "
          >

            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
            />

          </div>

          {/* RIGHT */}
          <div> 

            <CategorySection
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
            />

            <div 
             id="shopping-mode"
            className="mt-5 scroll-mt-32">
              <ShoppingMode
                shoppingMode={shoppingMode}
                setShoppingMode={
                  setShoppingMode
                }
              />

            </div>

            <section
              id="products"
              ref={productRef}
              className="mt-5 scroll-mt-32"
            >

              <ProductGrid
                selectedCategory={
                  selectedCategory
                }
                shoppingMode={shoppingMode}
                filters={filters}
                search={search}
                isCustomer={true}
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

        {/* FOOTER */}
        <div className="mt-14">

          <Footer />

        </div>

      </main>

      {/* ================= LOGIN POPUP ================= */}
      <LoginPopup
        show={showLogin}
        setShow={setShowLogin}
      />

      {/* ================= WISHLIST DRAWER ================= */}
      {showWishlist && (

        <>

          {/* OVERLAY */}
          <div
            onClick={() =>
              setShowWishlist(false)
            }
            className="
              fixed
              inset-0
              bg-black/40
              z-[998]
            "
          />

          {/* DRAWER */}
          <div
            className="
              fixed
              top-0
              right-0
              w-[420px]
              h-screen
              bg-white
              shadow-2xl
              z-[999]
              p-6
              overflow-y-auto
            "
          >

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-black">
                Wishlist
              </h2>

              <button
                onClick={() =>
                  setShowWishlist(false)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-100
                "
              >
                ✕
              </button>

            </div>

            {/* EMPTY */}
            {wishlistItems.length === 0 && (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-24
                  text-center
                "
              >

                <div
                  className="
                    w-28
                    h-28
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    mb-6
                  "
                >

                  <Heart
                    size={55}
                    className="text-slate-300"
                  />

                </div>

                <h3
                  className="
                    text-3xl
                    font-black
                  "
                >
                  WISHLIST KOSONG
                </h3>

                <p
                  className="
                    text-slate-500
                    mt-4
                    max-w-[280px]
                  "
                >
                  Simpan produk favoritmu
                  untuk dibeli nanti.
                </p>

                <button
                  onClick={() => {

                    setShowWishlist(false);

                    document
                      .getElementById("products")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",

                      });

                  }}
                  className="
                    mt-8
                    h-14
                    px-10
                    rounded-2xl
                    bg-blue-600
                    text-white
                    font-black
                  "
                >
                  Belanja Sekarang
                </button>

              </div>

            )}

            {/* LIST */}
            <div className="space-y-4">

              {wishlistItems.map((item) => (

                <div
                  key={item.id}
                  className="
                    border
                    rounded-3xl
                    p-3
                    flex
                    gap-3
                    bg-white
                  "
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-24
                      h-24
                      rounded-2xl
                      object-cover
                    "
                  />

                  <div className="flex-1">

                    <h3
                      className="
                        font-black
                        line-clamp-2
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        text-blue-600
                        font-black
                        mt-2
                      "
                    >
                      Rp{" "}
                      {item.price.toLocaleString(
                        "id-ID"
                      )}
                    </p>

                    <div className="flex gap-2 mt-4">

                      {/* TAMBAH CART */}
                      <button
                        onClick={() => {

                          const oldCart =
                            JSON.parse(
                              localStorage.getItem("cart")
                            ) || [];

                          const isExist =
                            oldCart.find(
                              (cartItem) =>
                                cartItem.id === item.id
                            );

                          let updatedCart =
                            oldCart;

                          if (!isExist) {

                            updatedCart = [
                              ...oldCart,
                              item,
                            ];

                            localStorage.setItem(
                              "cart",
                              JSON.stringify(updatedCart)
                            );

                            setCartItems(updatedCart);
                          }

                          const updatedWishlist =
                            wishlistItems.filter(
                              (wishlistItem) =>
                                wishlistItem.id !== item.id
                            );

                          setWishlistItems(
                            updatedWishlist
                          );

                          localStorage.setItem(
                            "wishlist",
                            JSON.stringify(updatedWishlist)
                          );

                        }}
                        className="
                          flex-1
                          h-11
                          rounded-xl
                          bg-blue-600
                          text-white
                          font-bold
                        "
                      >
                        Keranjang
                      </button>

                      {/* HAPUS */}
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
                          w-11
                          h-11
                          rounded-xl
                          bg-red-50
                          text-red-500
                        "
                      >
                        ✕
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </>

      )}

      {/* ================= CART DRAWER ================= */}
      {showCart && (

        <>

          {/* OVERLAY */}
          <div
            onClick={() =>
              setShowCart(false)
            }
            className="
              fixed
              inset-0
              bg-black/40
              z-[998]
            "
          />

          {/* DRAWER */}
          <div
            className="
              fixed
              top-0
              right-0
              w-[420px]
              h-screen
              bg-white
              shadow-2xl
              z-[999]
              p-6
              overflow-y-auto
            "
          >

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-black">
                  Keranjang
                </h2>

                <p className="text-slate-400 text-sm font-bold mt-1">
                  {cartItems.length} ITEM
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCart(false)
                }
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-100
                "
              >
                ✕
              </button>

            </div>

            {/* EMPTY */}
            {cartItems.length === 0 && (

              <div
                className="
                  h-[75vh]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >

                <div
                  className="
                    w-28
                    h-28
                    rounded-full
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    mb-8
                  "
                >

                  <ShoppingCart
                    size={50}
                    className="text-slate-300"
                  />

                </div>

                <h3
                  className="
                    text-3xl
                    font-black
                  "
                >
                  KERANJANG KOSONG
                </h3>

                <p
                  className="
                    text-slate-500
                    mt-4
                    max-w-[300px]
                  "
                >
                  Tambahkan produk favoritmu
                  ke keranjang untuk checkout.
                </p>

                <button
                  onClick={() => {

                    setShowCart(false);

                    document
                      .getElementById("products")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });

                  }}
                  className="
                    mt-8
                    px-10
                    h-14
                    rounded-2xl
                    bg-blue-600
                    text-white
                    font-black
                  "
                >
                  Belanja Sekarang
                </button>

              </div>

            )}

            {/* LIST */}
            <div className="space-y-4">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="
                    border
                    rounded-3xl
                    p-3
                    flex
                    gap-3
                    bg-white
                  "
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-24
                      h-24
                      rounded-2xl
                      object-cover
                    "
                  />

                  <div className="flex-1">

                    <h3
                      className="
                        font-black
                        line-clamp-2
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        text-blue-600
                        font-black
                        mt-2
                      "
                    >
                      Rp{" "}
                      {item.price.toLocaleString(
                        "id-ID"
                      )}
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
                        w-full
                        h-11
                        rounded-xl
                        bg-red-50
                        text-red-500
                        font-bold
                      "
                    >
                      Hapus
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            {cartItems.length > 0 && (

              <div
                className="
                  mt-8
                  border-t
                  pt-6
                "
              >

                <div className="flex justify-between mb-3">

                  <span className="text-slate-500 font-semibold">
                    Subtotal
                  </span>

                  <span className="font-black">
                    Rp{" "}
                    {subtotal.toLocaleString("id-ID")}
                  </span>

                </div>

                <div className="flex justify-between mb-5">

                  <span className="text-slate-500 font-semibold">
                    Biaya Layanan
                  </span>

                  <span className="font-black">
                    Rp{" "}
                    {serviceFee.toLocaleString("id-ID")}
                  </span>

                </div>

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-6
                  "
                >

                  <span
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    TOTAL
                  </span>

                  <span
                    className="
                      text-3xl
                      font-black
                      text-blue-600
                    "
                  >
                    Rp{" "}
                    {total.toLocaleString("id-ID")}
                  </span>

                </div>

                <button
                  onClick={() => {

                    setShowCart(false);

                    navigate("/customer/checkout");

                  }}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-black
                    text-lg
                    shadow-xl
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-3
                  "
                >

                  Lanjut ke Pembayaran

                  <ArrowRight size={22} />

                </button>

              </div>

            )}

          </div>

        </>

      )}

    </div>
  );
}

export default Home;