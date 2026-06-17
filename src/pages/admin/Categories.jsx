/* ================= IMPORT ================= */
import { Search, Bell, Plus, Trash2, Layers3, X } from "lucide-react";

import { useState, useRef, useEffect } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import { categoryData } from "../../data/categoryData";
import { products } from "../../data/products";
import { notifications as defaultNotifications } from "../../data/notifications";

function Categories() {
  /* ================= CATEGORY ================= */
  const [categories, setCategories] = useState(() =>
    categoryData.map((c) => ({
      ...c,
      total: products.filter((p) => p.category === c.name).length,
    })),
  );

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  const [filteredCategories, setFilteredCategories] = useState(categories);

  /* ================= ADD MODAL ================= */
  const [showAdd, setShowAdd] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  /* ================= DELETE MODAL ================= */
  const [showDelete, setShowDelete] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((item) => ({
        ...item,
        read: false,
        time: "Baru saja",
      })),
  );

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    const result = categories.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredCategories(result);
  }, [search, categories]);

  /* ================= NOTIF FUNCTION ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  /* ================= ADD CATEGORY ================= */
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const newData = {
      id: Date.now(),
      name: newCategory.toUpperCase(),
      total: 0,
    };

    setCategories([...categories, newData]);

    setNotifications([
      {
        id: Date.now(),
        role: "admin",
        message: `Kategori "${newCategory}" berhasil ditambahkan`,
        time: "Baru saja",
        read: false,
      },
      ...notifications,
    ]);

    setNewCategory("");
    setShowAdd(false);
  };

  /* ================= DELETE CATEGORY ================= */
  const handleDeleteCategory = () => {
    setCategories(categories.filter((item) => item.id !== selectedCategory.id));

    setShowDelete(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {/* ================= ADD MODAL ================= */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BLUR */}
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />

            {/* BOX */}
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
              {/* TOP */}
              <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563FF] flex items-center justify-center">
                    <Layers3 size={28} className="text-white" />
                  </div>

                  <h1 className="text-[24px] font-black text-slate-900 uppercase">
                    Tambah Kategori
                  </h1>
                </div>

                {/* CLOSE */}
                <button
                  onClick={() => setShowAdd(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={32} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-10">
                {/* LABEL */}
                <p className="text-slate-400 text-sm font-black tracking-wider uppercase mb-3">
                  Nama Kategori
                </p>

                {/* INPUT */}
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Contoh : Elektronik"
                  className="w-full h-[58px] rounded-2xl border-2 border-[#2563FF] px-6 outline-none font-semibold text-slate-700"
                />

                {/* BUTTON */}
                <button
                  onClick={handleAddCategory}
                  className="w-full h-[60px] rounded-2xl bg-[#2563FF] hover:bg-[#1E4FE0] duration-300 text-white font-black tracking-[2px] shadow-[0_15px_35px_rgba(37,99,255,0.35)] mt-10"
                >
                  SIMPAN KATEGORI
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= DELETE MODAL ================= */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BLUR */}
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />

            {/* BOX */}
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] p-10 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
              {/* ICON */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Trash2 size={34} />
                </div>
              </div>

              {/* TEXT */}
              <div className="text-center mt-6">
                <h2 className="text-[38px] leading-none font-black text-slate-900">
                  Hapus Kategori
                </h2>

                <p className="text-slate-500 font-bold mt-4 text-[17px]">
                  Apakah Anda yakin ingin menghapus kategori ini?
                </p>
              </div>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => setShowDelete(false)}
                  className="h-[60px] rounded-2xl bg-slate-100 text-slate-500 font-black text-lg hover:bg-slate-200 duration-300"
                >
                  BATAL
                </button>

                <button
                  onClick={handleDeleteCategory}
                  className="h-[60px] rounded-2xl bg-[#ff004f] text-white font-black text-lg shadow-[0_10px_25px_rgba(255,0,79,0.35)] hover:scale-[1.03] duration-300"
                >
                  HAPUS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between mt-1">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Kategori Produk
            </h1>

            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Atur & modifikasi pilihan kategori produk pada platform BelanjaIn.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <button
              onClick={() => setShowAdd(true)}
              className="h-11 px-4 rounded-2xl bg-[#2563FF] hover:bg-[#1E4FE0] duration-300 shadow-sm flex items-center gap-2 text-white font-black text-sm"
            >
              <Plus size={18} />
              TAMBAH KATEGORI
            </button>

            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari kategori..."
                className="bg-transparent outline-none w-full h-full px-2 text-slate-700 text-sm"
              />
            </div>

            <div className="relative self-start" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>

              {showNotif && (
                <ModalNotfications
                  open={showNotif}
                  onClose={() => setShowNotif(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================= CATEGORY GRID ================= */}
        <div className="grid grid-cols-3 gap-5 mt-8">
          {filteredCategories.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E7ECF3] rounded-[24px] px-4 py-4 flex items-center justify-between shadow-sm hover:shadow-md duration-300"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                {/* ICON */}
                <div className="w-14 h-14 rounded-3xl bg-[#F4F7FC] flex items-center justify-center">
                  <Layers3 size={24} className="text-[#2563FF]" />
                </div>

                {/* TEXT */}
                <div>
                  <h2 className="text-[20px] font-black text-[#0F172A] leading-snug">
                    {item.name}
                  </h2>

                  <p className="text-[#64748B] font-black tracking-[1px] uppercase mt-1 text-[11px]">
                    {item.total} Produk Terkait
                  </p>
                </div>
              </div>

              {/* DELETE */}
              <button
                onClick={() => {
                  setSelectedCategory(item);

                  setShowDelete(true);
                }}
                className="w-9 h-9 rounded-xl hover:bg-red-50 flex items-center justify-center duration-300 group"
              >
                <Trash2
                  size={18}
                  className="text-slate-400 group-hover:text-red-500 duration-300"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Categories;
