import {
  Grid2x2,
  Monitor,
  Shirt,
  Sofa,
  Dumbbell,
  Sparkles,
  Car,
  HeartPulse,
  BookOpen,
  Utensils,
  Baby,
  X,
  RotateCcw,
} from "lucide-react";

import { useState } from "react";

function CategorySection({
  selectedCategory,
  setSelectedCategory,
}) {
  const [showAll, setShowAll] =
    useState(false);

  const categories = [
    {
      icon: <Grid2x2 size={28} />,
      name: "Semua",
      color: "bg-slate-100",
    },

    {
      icon: <Monitor size={28} />,
      name: "Elektronik",
      color: "bg-blue-100",
    },

    {
      icon: <Shirt size={28} />,
      name: "Fashion",
      color: "bg-pink-100",
    },

    {
      icon: <Sofa size={28} />,
      name: "Rumah Tangga",
      color: "bg-orange-100",
    },

    {
      icon: <Dumbbell size={28} />,
      name: "Olahraga",
      color: "bg-cyan-100",
    },

    {
      icon: <Sparkles size={28} />,
      name: "Kecantikan",
      color: "bg-purple-100",
    },

    {
      icon: <Car size={28} />,
      name: "Otomotif",
      color: "bg-slate-100",
    },

    {
      icon: <HeartPulse size={28} />,
      name: "Kesehatan",
      color: "bg-red-100",
    },

    {
      icon: <BookOpen size={28} />,
      name: "Buku",
      color: "bg-yellow-100",
    },

    {
      icon: <Utensils size={28} />,
      name: "Makanan",
      color: "bg-lime-100",
    },

    {
      icon: <Baby size={28} />,
      name: "Mainan",
      color: "bg-cyan-100",
    },
  ];

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-7">

        <h2 className="text-[36px] font-black">
          Kategori
        </h2>

        <div className="flex items-center gap-5">

          {/* RESET */}
          <button
            onClick={() => {
              setSelectedCategory(
                "Semua"
              );

              setShowAll(false);
            }}
            className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 duration-300"
          >

            <RotateCcw size={18} />

            Reset

          </button>

          {/* LIHAT SEMUA */}
          <button
            onClick={() =>
              setShowAll(true)
            }
            className="text-blue-600 font-bold hover:text-blue-700 duration-300"
          >
            Lihat Semua
          </button>

        </div>

      </div>

      {/* CATEGORY */}
      <div className="grid grid-cols-7 gap-5">

        {categories
          .slice(0, 6)
          .map((item, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedCategory(
                  item.name
                )
              }
              className={`w-full h-[145px] rounded-[24px] border flex flex-col items-center justify-center gap-3 cursor-pointer duration-300 hover:scale-105 ${
                selectedCategory ===
                item.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                  : "bg-white hover:shadow-lg"
              }`}
            >

              {/* ICON */}
              <div
                className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center ${
                  selectedCategory ===
                  item.name
                    ? "bg-white/10"
                    : item.color
                }`}
              >
                {item.icon}
              </div>

              {/* TEXT */}
              <p className="font-black text-[15px] text-center leading-tight px-2">
                {item.name}
              </p>

            </div>
          ))}

        {/* MORE */}
        <div
          onClick={() =>
            setShowAll(true)
          }
          className="w-full h-[145px] rounded-[24px] border bg-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg duration-300"
        >

          <div className="w-[54px] h-[54px] rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-500">
            ...
          </div>

          <p className="font-black text-[15px] uppercase">
            Lainnya
          </p>

        </div>

      </div>

      {/* MODAL */}
      {showAll && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-y-auto px-4 py-10">

          {/* WRAPPER */}
          <div className="min-h-full flex items-start justify-center">

            {/* BOX */}
            <div className="w-full max-w-[700px] bg-[#f8f9fc] rounded-[30px] overflow-hidden shadow-2xl">

              {/* HEADER */}
              <div className="px-7 py-6 border-b bg-white flex items-start justify-between">

                <div>

                  <h2 className="text-[30px] font-black">
                    Kategori
                  </h2>

                  <p className="uppercase tracking-[3px] text-slate-400 font-bold text-xs mt-2">
                    Pilih kategori belanja
                  </p>

                </div>

                {/* CLOSE */}
                <button
                  onClick={() =>
                    setShowAll(false)
                  }
                  className="w-12 h-12 rounded-2xl border bg-[#f8f9fc] flex items-center justify-center text-slate-500 hover:bg-slate-100 duration-300"
                >

                  <X size={24} />

                </button>

              </div>

              {/* BODY */}
              <div className="p-6 grid grid-cols-3 gap-5 max-h-[420px] overflow-y-auto">

                {categories.map(
                  (item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedCategory(
                          item.name
                        );

                        setShowAll(false);
                      }}
                      className={`h-[125px] rounded-[22px] border flex flex-col items-center justify-center gap-4 cursor-pointer duration-300 hover:scale-105 ${
                        selectedCategory ===
                        item.name
                          ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                          : "bg-white hover:shadow-lg"
                      }`}
                    >

                      {/* ICON */}
                      <div
                        className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center ${
                          selectedCategory ===
                          item.name
                            ? "bg-white/10"
                            : item.color
                        }`}
                      >
                        {item.icon}
                      </div>

                      {/* TEXT */}
                      <p className="font-black text-[14px] text-center leading-tight px-2">
                        {item.name}
                      </p>

                    </div>
                  )
                )}

              </div>

              {/* FOOTER */}
              <div className="p-6 border-t bg-white">

                <button
                  onClick={() => {
                    setSelectedCategory(
                      "Semua"
                    );

                    setShowAll(false);
                  }}
                  className="w-full h-[58px] rounded-[18px] border bg-[#f8f9fc] font-black tracking-[2px] text-slate-600 hover:bg-slate-100 duration-300"
                >
                  LIHAT SEMUA PRODUK
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default CategorySection;