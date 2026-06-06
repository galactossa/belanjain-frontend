import { useState, useRef } from "react";

import Navbar from "../components/home/Navbar";
import HeroBanner from "../components/home/HeroBanner";
import SidebarFilter from "../components/home/SidebarFilter";
import CategorySection from "../components/home/CategorySection";
import ProductGrid from "../components/home/ProductGrid";
import ShoppingMode from "../components/home/ShoppingMode";
import RekomendasiSpesial from "../components/home/RekomendasiSpesial";
import Footer from "../components/home/Footer";


/* ================= AUTH MODAL ================= */
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

function HomePage() {

  // ================= SEARCH =================
  const [search, setSearch] = useState("");

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
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000000,
    brands: [],
    ratings: [],
  });

  // ================= AUTH MODAL =================
  const [
    authModal,
    setAuthModal,
  ] = useState(null);

  /*
    null
    login
    register
    forgot
  */

  const handleSearch = () => {

    const el =
      document.getElementById("products");

    if (el) {

      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
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
      <Navbar
        search={search}
        setSearch={setSearch}
        setAuthModal={setAuthModal}
        onSearch={handleSearch}
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

        {/* ================= HERO ================= */}
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

        {/* ================= CONTENT ================= */}
        <div
          className="
            grid
            grid-cols-[260px_1fr]
            gap-6
            mt-6
            items-start
          "
        >

          {/* ================= SIDEBAR ================= */}
          <div
            className="
              sticky
              top-5
              h-fit
              flex
              flex-col
              gap-5
            "
          >

            <SidebarFilter
              filters={filters}
              setFilters={setFilters}
            />

          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="w-full">

            {/* ================= CATEGORY ================= */}
            <CategorySection
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
            />

            {/* ================= SHOPPING MODE ================= */}
            <div
              id="shopping-mode"
              className="mt-5"
            >

              <ShoppingMode
                shoppingMode={shoppingMode}
                setShoppingMode={
                  setShoppingMode
                }
              />

            </div>

            {/* ================= PRODUCT GRID ================= */}
            <div
              id="products"
              ref={productRef}
              className="mt-5"
            >

              <ProductGrid
                selectedCategory={
                  selectedCategory
                }
                shoppingMode={
                  shoppingMode
                }
                filters={filters}
                search={search}
                setAuthModal={
                  setAuthModal
                }
                isCustomer={false}
              />

            </div>

          </div>

        </div>

        {/* ================= REKOMENDASI FULL WIDTH ================= */}
        <div className="mt-12 w-full">

          <RekomendasiSpesial
            shoppingMode={shoppingMode}
            setAuthModal={
              setAuthModal
            }
          />

        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-14">

          <Footer />

        </div>

      </main>

      {/* ================= AUTH MODAL ================= */}
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

          {/* OVERLAY */}
          <div
            onClick={() =>
              setAuthModal(null)
            }
            className="
              absolute
              inset-0
              bg-black/60
              backdrop-blur-sm
            "
          />

          {/* CONTENT */}
          <div className="relative z-10">

            {/* LOGIN */}
            {authModal === "login" && (

              <Login
                setAuthModal={
                  setAuthModal
                }
              />

            )}

            {/* REGISTER */}
            {authModal === "register" && (

              <Register
                setAuthModal={
                  setAuthModal
                }
              />

            )}

            {/* FORGOT PASSWORD */}
            {authModal === "forgot" && (

              <ForgotPassword
                setAuthModal={
                  setAuthModal
                }
              />

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default HomePage;