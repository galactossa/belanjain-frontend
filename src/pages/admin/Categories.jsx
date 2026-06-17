import { Search, Bell, Plus, Trash2, Layers3, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifikasi");
        const data = (response.data.data || []).map((n) => ({
          ...n,
          read: n.sudah_dibaca || false,
          time: n.created_at
            ? new Date(n.created_at).toLocaleString()
            : "Baru saja",
          message: n.pesan || n.judul,
        }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/kategori");
        setCategories(response.data.data || []);
        setFilteredCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const result = categories.filter((item) =>
      item.nama_kategori?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredCategories(result);
  }, [search, categories]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await api.post("/kategori", { nama_kategori: newCategory });
      const response = await api.get("/kategori");
      setCategories(response.data.data || []);
      setFilteredCategories(response.data.data || []);
      setNewCategory("");
      setShowAdd(false);
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.response?.data?.message || "Gagal menambah kategori");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await api.delete(`/kategori/${selectedCategory.id_kategori}`);
      const response = await api.get("/kategori");
      setCategories(response.data.data || []);
      setFilteredCategories(response.data.data || []);
      setShowDelete(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Gagal menghapus kategori");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
              <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563FF] flex items-center justify-center">
                    <Layers3 size={28} className="text-white" />
                  </div>
                  <h1 className="text-[24px] font-black text-slate-900 uppercase">
                    Tambah Kategori
                  </h1>
                </div>
                <button
                  onClick={() => setShowAdd(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={32} />
                </button>
              </div>
              <div className="p-10">
                <p className="text-slate-400 text-sm font-black tracking-wider uppercase mb-3">
                  Nama Kategori
                </p>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Contoh : Elektronik"
                  className="w-full h-[58px] rounded-2xl border-2 border-[#2563FF] px-6 outline-none font-semibold text-slate-700"
                />
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

        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] p-10 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Trash2 size={34} />
                </div>
              </div>
              <div className="text-center mt-6">
                <h2 className="text-[38px] leading-none font-black text-slate-900">
                  Hapus Kategori
                </h2>
                <p className="text-slate-500 font-bold mt-4 text-[17px]">
                  Apakah Anda yakin ingin menghapus kategori ini?
                </p>
              </div>
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

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between mt-1">
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
              <Plus size={18} /> TAMBAH KATEGORI
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

        <div className="grid grid-cols-3 gap-5 mt-8">
          {filteredCategories.map((item) => (
            <div
              key={item.id_kategori}
              className="bg-white border border-[#E7ECF3] rounded-[24px] px-4 py-4 flex items-center justify-between shadow-sm hover:shadow-md duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-3xl bg-[#F4F7FC] flex items-center justify-center">
                  <Layers3 size={24} className="text-[#2563FF]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-[#0F172A] leading-snug">
                    {item.nama_kategori}
                  </h2>
                  <p className="text-[#64748B] font-black tracking-[1px] uppercase mt-1 text-[11px]">
                    Produk Terkait
                  </p>
                </div>
              </div>
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
