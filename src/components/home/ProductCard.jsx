import {
  ShoppingCart,
  Heart,
  MapPin,
  Eye,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ProductCard({
  item,
  viewMode = "grid",
  isCustomer = false,
  setShowWishlist,
  setWishlistItems,
  setCartItems,
  setShowCart,
  setAuthModal,
}) {
  const navigate = useNavigate();

  // Validate image URL
  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const wishlistKey = currentUser ? `wishlist_${currentUser.id}` : "wishlist";

  const cartKey = currentUser ? `cart_${currentUser.id}` : "cart";

  /* =========================
     FORMAT PRICE
  ========================= */
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  /* =========================
     DETAIL
  ========================= */
  const handleDetail = () => {
    navigate(
      isCustomer
        ? `/customer/product-detail/${item.id}`
        : `/product-detail/${item.id}`,
    );
  };

  /* =========================
     WISHLIST
  ========================= */
  const handleWishlist = () => {
    /* JIKA SUDAH LOGIN */
    if (isCustomer) {
      const oldWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

      const isExist = oldWishlist.find(
        (wishlistItem) => wishlistItem.id === item.id,
      );

      if (!isExist) {
        const updatedWishlist = [...oldWishlist, item];

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        if (setWishlistItems) {
          setWishlistItems(updatedWishlist);
        }
      }

      if (setShowWishlist) {
        setShowWishlist(true);
      }

      return;
    }

    /* BELUM LOGIN */
    if (setAuthModal) {
      setAuthModal("login");
      return;
    }

    navigate("/login");
  };

  /* =========================
     CART
  ========================= */
  const handleCart = () => {
    /* JIKA SUDAH LOGIN */
    if (isCustomer) {
      const oldCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const isExist = oldCart.find((cartItem) => cartItem.id === item.id);

      let updatedCart = [];

      /* JIKA SUDAH ADA */
      if (isExist) {
        updatedCart = oldCart.map((cartItem) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              qty: (cartItem.qty || 1) + 1,
            };
          }

          return cartItem;
        });
      } else {
        updatedCart = [
          ...oldCart,
          {
            ...item,
            qty: 1,
          },
        ];
      }

      /* SAVE LOCAL */
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      /* UPDATE STATE */
      if (setCartItems) {
        setCartItems(updatedCart);
      }

      /* OPEN DRAWER */
      if (setShowCart) {
        setShowCart(true);
      }

      return;
    }

    /* BELUM LOGIN */
    if (setAuthModal) {
      setAuthModal("login");
      return;
    }

    navigate("/login");
  };

  return (
    <div
      className={`
        group
        bg-white
        rounded-[22px]
        overflow-hidden
        border
        border-slate-200
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        duration-300
        h-full
        min-w-0
        ${
          viewMode === "grid"
            ? "flex flex-col"
            : "flex flex-col md:flex-row md:items-center p-4 gap-5"
        }
      `}
    >
      {/* IMAGE */}
      <div
        className={`
          relative
          overflow-hidden
          shrink-0
          ${viewMode === "grid" ? "w-full" : "w-full md:w-[180px]"}
        `}
      >
        {/* IMAGE */}
        {isValidImageUrl(item.image) && (
          <img
            src={item.image}
            alt={item.name}
            onClick={handleDetail}
            className={`
              object-cover
              cursor-pointer
              transition-transform
              duration-500
              group-hover:scale-105
              ${
                viewMode === "grid"
                  ? "w-full h-[170px]"
                  : "w-full md:w-[180px] h-[220px] md:h-[180px] rounded-2xl"
              }
            `}
          />
        )}

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-black/0
            group-hover:bg-black/10
            duration-300
          "
        />

        {/* BADGES */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          {/* LEFT */}
          <div className="flex gap-2 flex-wrap">
            {item.mode === "PREMIUM" && (
              <span
                className="
                  px-3
                  py-1
                  rounded-lg
                  text-[10px]
                  font-black
                  text-white
                  shadow
                  whitespace-nowrap
                  bg-purple-600
                "
              >
                PREMIUM
              </span>
            )}

            {item.mode === "FLASH" && (
              <span
                className="
                  px-3
                  py-1
                  rounded-lg
                  text-[10px]
                  font-black
                  text-white
                  shadow
                  whitespace-nowrap
                  bg-orange-500
                "
              >
                FLASH SALE
              </span>
            )}

            {item.mode === "HEMAT" && (
              <span
                className="
                  px-3
                  py-1
                  rounded-lg
                  text-[10px]
                  font-black
                  text-white
                  shadow
                  whitespace-nowrap
                  bg-green-600
                "
              >
                HEMAT
              </span>
            )}
          </div>

          {/* RIGHT */}
          <span
            className="
              px-3
              py-1
              rounded-lg
              bg-white
              text-purple-600
              text-[10px]
              font-black
              shadow
              flex
              items-center
              gap-1
              whitespace-nowrap
            "
          >
            <Sparkles size={10} />
            TERBAIK
          </span>
        </div>

        {/* ACTION BUTTON */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            gap-3
            opacity-0
            group-hover:opacity-100
            duration-300
            z-10
          "
        >
          {/* DETAIL */}
          <button
            onClick={handleDetail}
            className="
              w-14
              h-14
              rounded-2xl
              bg-white
              flex
              items-center
              justify-center
              shadow-lg
              hover:scale-110
              duration-300
            "
          >
            <Eye size={22} className="text-slate-700" />
          </button>

          {/* WISHLIST */}
          <button
            onClick={handleWishlist}
            className="
              w-14
              h-14
              rounded-2xl
              bg-white
              flex
              items-center
              justify-center
              shadow-md
              hover:scale-105
              duration-300
            "
          >
            <Heart
              size={22}
              className="
                text-slate-600
                hover:text-red-500
                duration-300
              "
              strokeWidth={2.2}
            />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1 w-full min-w-0">
        {/* CATEGORY */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className="
              text-[10px]
              uppercase
              font-black
              tracking-[1px]
              text-blue-600
              whitespace-nowrap
            "
          >
            {item.category}
          </span>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1 min-w-0">
            <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>

            <span
              className="
                text-[11px]
                uppercase
                font-black
                tracking-[1px]
                text-slate-700
                truncate
              "
            >
              {item.store}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h3
          onClick={handleDetail}
          className={`
            font-black
            text-slate-900
            leading-tight
            mt-4
            line-clamp-2
            group-hover:text-blue-600
            duration-300
            break-words
            cursor-pointer
            ${viewMode === "grid" ? "text-[13px] min-h-[48px]" : "text-[14px]"}
          `}
        >
          {item.name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-[15px] ${
                star <= Math.round(item.rating)
                  ? "text-yellow-400"
                  : "text-slate-300"
              }`}
            >
              ★
            </span>
          ))}

          <span className="text-sm font-bold text-slate-700 ml-1">
            {item.rating}
          </span>
        </div>

        {/* INFO */}
        <div className="flex flex-wrap items-center justify-between mt-5 gap-3">
          <div
            className="
              px-3
              py-2
              rounded-xl
              bg-blue-50
              text-blue-600
              text-[11px]
              font-black
              flex
              items-center
              gap-1
              whitespace-nowrap
            "
          >
            <ShieldCheck size={13} />
            {item.trust} TRUST
          </div>

          <div
            className="
              flex
              items-center
              gap-1
              text-slate-400
              text-[11px]
              font-bold
              uppercase
              min-w-0
            "
          >
            <MapPin size={13} className="shrink-0" />

            <span className="truncate">{item.city}</span>
          </div>
        </div>

        {/* PRICE */}
        <div
          className="
            mt-auto
            pt-6
            flex
            items-center
            justify-between
            gap-3
          "
        >
          {/* PRICE */}
          <div className="flex-1 min-w-0">
            <h4
              className={`
                font-black
                text-slate-900
                leading-none
                tracking-[-0.5px]
                truncate
                ${viewMode === "grid" ? "text-[18px]" : "text-[24px]"}
              `}
            >
              {formatPrice(item.price)}
            </h4>
          </div>

          {/* CART */}
          <button
            onClick={handleCart}
            className="
              w-12
              h-12
              rounded-2xl
              bg-slate-100
              text-slate-400
              flex
              items-center
              justify-center
              shrink-0
              hover:bg-blue-600
              hover:text-white
              duration-300
            "
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
