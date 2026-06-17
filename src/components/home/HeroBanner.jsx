import { useEffect, useState } from "react";

function HeroBanner({ productRef, scrollToShoppingMode }) {
  // ================= SLIDES =================
  const slides = [
    {
      id: 1,
      title: "Diskon Hingga",
      highlight: "90%",
      subtitle: "Hari Ini!",
      desc: "Temukan produk terbaik dengan harga spesial hanya hari ini.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      badge: "PROMO RAMADAN",
      bg: "from-blue-700 to-blue-500",
    },

    {
      id: 2,
      title: "Flash Sale",
      highlight: "Elektronik",
      subtitle: "Terbaru",
      desc: "Belanja gadget premium dengan promo super hemat.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      badge: "FLASH SALE",
      bg: "from-purple-700 to-indigo-500",
    },

    {
      id: 3,
      title: "Fashion",
      highlight: "Trend 2026",
      subtitle: "Mulai 99RB",
      desc: "Upgrade style kamu dengan produk fashion terbaru.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      badge: "FASHION WEEK",
      bg: "from-pink-600 to-rose-500",
    },
  ];

  // ================= ACTIVE SLIDE =================
  const [activeSlide, setActiveSlide] = useState(0);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= SCROLL PRODUCT =================
  const handleScrollProduct = () => {
    if (productRef?.current) {
      const topPosition = productRef.current.offsetTop - 120;

      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="
relative
h-[320px]
rounded-[32px]
overflow-hidden
shadow-xl
"
    >
      {/* BACKGROUND IMAGE */}
      <img
        src={slides[activeSlide].image}
        alt=""
        className="
absolute
inset-0
w-full
h-full
object-cover
duration-500
"
      />

      {/* OVERLAY */}
      <div
        className="
absolute
inset-0
bg-gradient-to-r
from-black/70
via-black/40
to-transparent
"
      />

      {/* CONTENT */}
      <div
        className="
relative
z-10
h-full
flex
items-center
px-20
"
      >
        <div className="max-w-[600px] text-white">
          {/* BADGE */}
          <div
            className="
inline-block
bg-pink-500
px-5
py-2
rounded-full
font-bold
text-sm
"
          >
            {slides[activeSlide].badge}
          </div>

          {/* TITLE */}
          <h1
            className="
mt-4
text-4xl
font-black
leading-none
"
          >
            {slides[activeSlide].title}

            <br />

            <span className="text-white">{slides[activeSlide].highlight}</span>

            <br />

            {slides[activeSlide].subtitle}
          </h1>

          {/* DESC */}
          <p
            className="
mt-3
text-lg
leading-relaxed
text-slate-200
"
          >
            {slides[activeSlide].desc}
          </p>

          {/* BUTTON */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleScrollProduct}
              className="
bg-white
text-blue-600
px-8
h-12
rounded-3xl
font-black
text-sm
"
            >
              Belanja Sekarang
            </button>

            <button
              onClick={scrollToShoppingMode}
              className="
bg-white/20
backdrop-blur
border
border-white/20
px-8
h-12
rounded-3xl
font-black
text-sm
"
            >
              Lihat Promo
            </button>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div
        className="
absolute
bottom-8
left-1/2
-translate-x-1/2
flex
gap-3
z-20
"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setActiveSlide(index)}
            className={`
h-3
rounded-full
duration-300
${activeSlide === index ? "w-10 bg-white" : "w-3 bg-white/50"}
`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
