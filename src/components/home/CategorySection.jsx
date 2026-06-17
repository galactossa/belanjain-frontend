// ================= src/components/home/CategorySection.jsx =================
import { X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/api";

// Static icon mapping (karena icon dari Lucide React tidak bisa di-serialize)
const IconMap = {
  Grid2x2: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),
  Monitor: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  Shirt: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9l3-3 1 5 2-2 2 2 1-5 3 3v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
    </svg>
  ),
  Sofa: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  ),
  Dumbbell: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8v8m16-8v8M6 8h12M6 8a2 2 0 012-2h8a2 2 0 012 2m-4 0v8"
      />
    </svg>
  ),
  Sparkles: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Car: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h8m-8 0l-2 4m2-4h8m0 0l2 4m-10 0h8m-8 0a2 2 0 01-2-2v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2m-8 0h8m-8 0v4m8-4v4"
      />
    </svg>
  ),
  HeartPulse: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 0v4m0-4h4m-4 0H8m2-6a9 9 0 11-9 9 9 9 0 019-9z"
      />
    </svg>
  ),
  BookOpen: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  Utensils: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3l2 2m0 0l2-2m-2 2v12m0 0l-2 2m2-2l2 2m-4-8h4m-4 4h4m7-14l2 2m0 0l-2 2m2-2V5m0 4h4"
      />
    </svg>
  ),
  Baby: (props) => (
    <svg
      {...props}
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8" r="3" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11v5m0 0l-3-3m3 3l3-3m-6 8h6"
      />
    </svg>
  ),
};

function CategorySection({ selectedCategory, setSelectedCategory }) {
  const [showAll, setShowAll] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/kategori");
        const data = response.data.data || [];
        const categoryIcons = {
          Elektronik: "Monitor",
          Fashion: "Shirt",
          "Rumah Tangga": "Sofa",
          Olahraga: "Dumbbell",
          Kecantikan: "Sparkles",
          Otomotif: "Car",
          Kesehatan: "HeartPulse",
          Buku: "BookOpen",
          Makanan: "Utensils",
          Mainan: "Baby",
        };
        const colorMap = {
          Elektronik: "bg-blue-100",
          Fashion: "bg-pink-100",
          "Rumah Tangga": "bg-orange-100",
          Olahraga: "bg-cyan-100",
          Kecantikan: "bg-purple-100",
          Otomotif: "bg-slate-100",
          Kesehatan: "bg-red-100",
          Buku: "bg-yellow-100",
          Makanan: "bg-lime-100",
          Mainan: "bg-cyan-100",
        };
        setCategories([
          { id: 1, name: "Semua", icon: "Grid2x2", color: "bg-slate-100" },
          ...data.map((cat) => ({
            id: cat.id_kategori,
            name: cat.nama_kategori,
            icon: categoryIcons[cat.nama_kategori] || "Grid2x2",
            color: colorMap[cat.nama_kategori] || "bg-slate-100",
          })),
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback: kategori default
        setCategories([
          { id: 1, name: "Semua", icon: "Grid2x2", color: "bg-slate-100" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-7 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-full h-[145px] rounded-[24px] bg-slate-200 animate-pulse"
          ></div>
        ))}
        <div className="w-full h-[145px] rounded-[24px] bg-slate-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      {/* CATEGORY */}
      <div className="grid grid-cols-7 gap-5">
        {categories.slice(0, 6).map((item) => {
          const IconComponent = IconMap[item.icon] || IconMap.Grid2x2;
          return (
            <div
              key={item.id}
              onClick={() => {
                console.log("🔍 Category clicked:", item.name);
                setSelectedCategory(item.name);
              }}
              className={`w-full h-[145px] rounded-[24px] border flex flex-col items-center justify-center gap-3 cursor-pointer duration-300 hover:scale-105 ${
                selectedCategory === item.name
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div
                className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center ${
                  selectedCategory === item.name ? "bg-white/10" : item.color
                }`}
              >
                <IconComponent size={28} />
              </div>
              <p className="font-black text-[15px] text-center leading-tight px-2">
                {item.name}
              </p>
            </div>
          );
        })}

        {/* MORE */}
        <div
          onClick={() => setShowAll(true)}
          className="w-full h-[145px] rounded-[24px] border bg-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-lg duration-300"
        >
          <div className="w-[54px] h-[54px] rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-500">
            ...
          </div>
          <p className="font-black text-[15px] uppercase">Lainnya</p>
        </div>
      </div>

      {/* MODAL */}
      {showAll && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 overflow-y-auto px-4 py-10">
          <div className="min-h-full flex items-start justify-center">
            <div className="w-full max-w-[700px] bg-[#f8f9fc] rounded-[30px] overflow-hidden shadow-2xl">
              {/* HEADER */}
              <div className="px-7 py-6 border-b bg-white flex items-start justify-between">
                <div>
                  <h2 className="text-[30px] font-black">Kategori</h2>
                  <p className="uppercase tracking-[3px] text-slate-400 font-bold text-xs mt-2">
                    Pilih kategori belanja
                  </p>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="w-12 h-12 rounded-2xl border bg-[#f8f9fc] flex items-center justify-center text-slate-500 hover:bg-slate-100 duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6 grid grid-cols-3 gap-5 max-h-[420px] overflow-y-auto">
                {categories.map((item) => {
                  const IconComponent = IconMap[item.icon] || IconMap.Grid2x2;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        console.log(
                          "🔍 Category clicked from modal:",
                          item.name,
                        );
                        setSelectedCategory(item.name);
                        setShowAll(false);
                      }}
                      className={`h-[125px] rounded-[22px] border flex flex-col items-center justify-center gap-4 cursor-pointer duration-300 hover:scale-105 ${
                        selectedCategory === item.name
                          ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                          : "bg-white hover:shadow-lg"
                      }`}
                    >
                      <div
                        className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center ${
                          selectedCategory === item.name
                            ? "bg-white/10"
                            : item.color
                        }`}
                      >
                        <IconComponent size={28} />
                      </div>
                      <p className="font-black text-[14px] text-center leading-tight px-2">
                        {item.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t bg-white">
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");
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
