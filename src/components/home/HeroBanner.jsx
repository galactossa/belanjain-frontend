import { useEffect, useState } from "react";

function HeroBanner({
  productRef,
  scrollToShoppingMode,
}) {

  // ================= SLIDES =================
  const slides = [
    {
      id: 1,
      title: "Diskon Hingga",
      highlight: "90%",
      subtitle: "Hari Ini!",
      desc:
        "Temukan produk terbaik dengan harga spesial hanya hari ini.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      badge: "PROMO RAMADAN",
      bg: "from-blue-700 to-blue-500",
    },

    {
      id: 2,
      title: "Flash Sale",
      highlight: "Elektronik",
      subtitle: "Terbaru",
      desc:
        "Belanja gadget premium dengan promo super hemat.",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      badge: "FLASH SALE",
      bg: "from-purple-700 to-indigo-500",
    },

    {
      id: 3,
      title: "Fashion",
      highlight: "Trend 2026",
      subtitle: "Mulai 99RB",
      desc:
        "Upgrade style kamu dengan produk fashion terbaru.",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      badge: "FASHION WEEK",
      bg: "from-pink-600 to-rose-500",
    },
  ];

  // ================= ACTIVE SLIDE =================
  const [activeSlide, setActiveSlide] =
    useState(0);

  // ================= AUTO SLIDE =================
  useEffect(() => {

    const interval = setInterval(() => {

      setActiveSlide((prev) =>
        prev === slides.length - 1
          ? 0
          : prev + 1
      );

    }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // ================= SCROLL PRODUCT =================
  const handleScrollProduct = () => {

    if (productRef?.current) {

      const topPosition =
        productRef.current.offsetTop - 120;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });

    }
  };

  return (

    <section
      className={`
        bg-gradient-to-r
        ${slides[activeSlide].bg}
        rounded-[36px]
        overflow-hidden
        px-14
        py-14
        duration-500
      `}
    >

      <div className="grid lg:grid-cols-2 items-center gap-10">

        {/* ================= LEFT ================= */}
        <div className="text-white">

          {/* BADGE */}
          <div
            className="
              bg-red-500
              px-4
              py-2
              rounded-full
              text-xs
              font-bold
              inline-block
            "
          >

            {slides[activeSlide].badge}

          </div>

          {/* TITLE */}
          <h1
            className="
              text-6xl
              xl:text-7xl
              font-black
              leading-none
              mt-6
            "
          >

            {slides[activeSlide].title}

            <br />

            <span className="text-yellow-300">

              {slides[activeSlide].highlight}

            </span>

            <br />

            {slides[activeSlide].subtitle}

          </h1>

          {/* DESC */}
          <p
            className="
              text-blue-100
              text-lg
              mt-7
              leading-relaxed
              max-w-xl
            "
          >

            {slides[activeSlide].desc}

          </p>

          {/* BUTTON */}
          <div className="flex gap-4 mt-10 flex-wrap">

            {/* BELANJA */}
            <button
              onClick={
                handleScrollProduct
              }
              className="
                bg-white
                text-blue-600
                px-8
                h-14
                rounded-2xl
                font-bold
                hover:scale-105
                duration-300
              "
            >

              Belanja Sekarang

            </button>

            {/* PROMO */}
            <button
              onClick={
                scrollToShoppingMode
              }
              className="
                bg-white/20
                text-white
                px-8
                h-14
                rounded-2xl
                font-bold
                backdrop-blur-lg
                hover:bg-white/30
                duration-300
              "
            >

              Lihat Promo

            </button>

          </div>

          {/* DOTS */}
          <div className="flex gap-3 mt-10">

            {slides.map(
              (slide, index) => (

                <button
                  key={slide.id}
                  onClick={() =>
                    setActiveSlide(index)
                  }
                  className={`
                    h-3
                    rounded-full
                    duration-300
                    ${
                      activeSlide ===
                      index
                        ? "w-10 bg-white"
                        : "w-3 bg-white/40"
                    }
                  `}
                />

              )
            )}

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="
            hidden
            lg:flex
            justify-end
          "
        >

          <img
            src={
              slides[activeSlide].image
            }
            alt=""
            className="
              w-[420px]
              h-[420px]
              object-cover
              rounded-3xl
              shadow-2xl
              duration-500
            "
          />

        </div>

      </div>

    </section>
  );
}

export default HeroBanner;