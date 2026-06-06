import {
  BadgeDollarSign,
  ShieldCheck,
  Star,
  RotateCcw,
} from "lucide-react";

function SidebarFilter({
  filters,
  setFilters,
}) {

  /* =========================
     BRANDS
  ========================= */
  const brands = [
    "Apple",
    "Samsung",
    "Sony",
    "Logitech",
    "Nike",
    "Adidas",
  ];

  /* =========================
     RATINGS
  ========================= */
  const ratings = [5, 4, 3, 2, 1];

  /* =========================
     HANDLE BRAND
  ========================= */
  const handleBrandChange = (
    brand
  ) => {

    const alreadySelected =
      filters.brands.includes(
        brand
      );

    if (alreadySelected) {

      setFilters({
        ...filters,
        brands:
          filters.brands.filter(
            (item) =>
              item !== brand
          ),
      });

    } else {

      setFilters({
        ...filters,
        brands: [
          ...filters.brands,
          brand,
        ],
      });

    }
  };

  /* =========================
     HANDLE RATING
  ========================= */
  const handleRatingChange = (
    rating
  ) => {

    const alreadySelected =
      filters.ratings.includes(
        rating
      );

    if (alreadySelected) {

      setFilters({
        ...filters,
        ratings:
          filters.ratings.filter(
            (item) =>
              item !== rating
          ),
      });

    } else {

      setFilters({
        ...filters,
        ratings: [
          ...filters.ratings,
          rating,
        ],
      });

    }
  };

  /* =========================
     RESET FILTER
  ========================= */
  const handleReset = () => {

    setFilters({
      minPrice: 0,
      maxPrice: 50000000,
      brands: [],
      ratings: [],
    });

  };

  return (
    <div className="space-y-6">

      {/* ================= PRICE ================= */}
      <div
        className="
        bg-white
        rounded-[30px]
        p-6
        shadow-sm
        border
        border-slate-200
      "
      >

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-6">

          <BadgeDollarSign
            size={16}
            className="text-blue-600"
          />

          <h2
            className="
            font-black
            uppercase
            tracking-[1px]
            text-[15px]
          "
          >

            Harga

          </h2>

        </div>

        {/* INPUTS */}
        <div className="space-y-5">

          {/* MIN */}
          <div>

            <p
              className="
              text-[10px]
              uppercase
              tracking-[2px]
              text-slate-400
              font-black
              mb-2
            "
            >

              Minimum

            </p>

            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minPrice:
                    Number(
                      e.target.value
                    ),
                })
              }
              placeholder="Rp 0"
              className="
              w-full
              h-12
              rounded-2xl
              bg-slate-100
              border
              border-slate-200
              px-4
              outline-none
              text-sm
              font-bold
              focus:border-blue-500
            "
            />

          </div>

          {/* MAX */}
          <div>

            <p
              className="
              text-[10px]
              uppercase
              tracking-[2px]
              text-slate-400
              font-black
              mb-2
            "
            >

              Maksimum

            </p>

            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxPrice:
                    Number(
                      e.target.value
                    ),
                })
              }
              placeholder="Rp 5000000"
              className="
              w-full
              h-12
              rounded-2xl
              bg-slate-100
              border
              border-slate-200
              px-4
              outline-none
              text-sm
              font-bold
              focus:border-blue-500
            "
            />

          </div>

        </div>

      </div>

      {/* ================= BRAND ================= */}
      <div
        className="
        bg-white
        rounded-[30px]
        p-6
        shadow-sm
        border
        border-slate-200
      "
      >

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-6">

          <ShieldCheck
            size={16}
            className="text-blue-600"
          />

          <h2
            className="
            font-black
            uppercase
            tracking-[1px]
            text-[15px]
          "
          >

            Merek Populer

          </h2>

        </div>

        {/* LIST */}
        <div className="space-y-4">

          {brands.map((brand) => (

            <label
              key={brand}
              className="
              flex
              items-center
              gap-3
              cursor-pointer
              text-slate-700
              font-semibold
              text-sm
            "
            >

              <input
                type="checkbox"
                checked={filters.brands.includes(
                  brand
                )}
                onChange={() =>
                  handleBrandChange(
                    brand
                  )
                }
                className="
                w-4
                h-4
                accent-blue-600
              "
              />

              {brand}

            </label>

          ))}

        </div>

      </div>

      {/* ================= RATING ================= */}
      <div
        className="
        bg-white
        rounded-[30px]
        p-6
        shadow-sm
        border
        border-slate-200
      "
      >

        {/* TITLE */}
        <div className="flex items-center gap-2 mb-6">

          <Star
            size={16}
            className="text-blue-600"
          />

          <h2
            className="
            font-black
            uppercase
            tracking-[1px]
            text-[15px]
          "
          >

            Rating

          </h2>

        </div>

        {/* LIST */}
        <div className="space-y-4">

          {ratings.map((rating) => (

            <label
              key={rating}
              className="
              flex
              items-center
              gap-3
              cursor-pointer
            "
            >

              <input
                type="checkbox"
                checked={filters.ratings.includes(
                  rating
                )}
                onChange={() =>
                  handleRatingChange(
                    rating
                  )
                }
                className="
                w-4
                h-4
                accent-yellow-500
              "
              />

              {/* STARS */}
              <div className="flex items-center gap-[2px]">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <Star
                      key={star}
                      size={14}
                      fill={
                        star <= rating
                          ? "#facc15"
                          : "none"
                      }
                      className={
                        star <= rating
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }
                    />

                  )
                )}

              </div>

              <span
                className="
                text-[10px]
                font-black
                uppercase
                tracking-[1px]
                text-slate-400
              "
              >

                Ke Atas

              </span>

            </label>

          ))}

        </div>

      </div>

      {/* ================= RESET ================= */}
      <button
        onClick={handleReset}
        className="
        w-full
        h-14
        rounded-2xl
        bg-slate-100
        hover:bg-red-500
        hover:text-white
        duration-300
        font-black
        uppercase
        tracking-[1px]
        text-sm
        flex
        items-center
        justify-center
        gap-2
      "
      >

        <RotateCcw size={16} />

        Reset Filter

      </button>

    </div>
  );
}

export default SidebarFilter;