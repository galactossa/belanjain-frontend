import { Search, Bell, Star, X, Pencil, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // ================= STATE UNTUK EDIT =================
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    nama_produk: "",
    harga: "",
    stok: "",
    deskripsi: "",
    url_gambar: "",
    id_kategori: "",
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fetch categories for edit modal
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/kategori");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/produk?limit=100");
        const productsData = response.data.data.data || [];
        setProducts(
          productsData.map((p) => ({
            ...p,
            status: p.aktif ? "AKTIF" : "DITAHAN",
          })),
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

  const filteredProducts = products.filter((item) =>
    item.nama_produk?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = async (id) => {
    const product = products.find((p) => p.id_produk === id);
    if (!product) return;

    try {
      await api.put(`/produk/${id}`, { aktif: !product.aktif });
      setProducts(
        products.map((p) =>
          p.id_produk === id
            ? { ...p, status: p.aktif ? "DITAHAN" : "AKTIF", aktif: !p.aktif }
            : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling product status:", error);
      alert(error.response?.data?.message || "Gagal mengubah status produk");
    }
  };

  // ================= 🔥 FUNGSI EDIT =================
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      nama_produk: product.nama_produk || "",
      harga: product.harga || "",
      stok: product.stok || "",
      deskripsi: product.deskripsi || "",
      url_gambar: product.url_gambar || "",
      id_kategori: product.id_kategori || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editingProduct) return;

    // Validasi
    if (!editForm.nama_produk || !editForm.harga) {
      alert("Nama produk dan harga wajib diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        nama_produk: editForm.nama_produk,
        harga: Number(editForm.harga),
        stok: Number(editForm.stok) || 0,
        deskripsi: editForm.deskripsi || "",
        url_gambar: editForm.url_gambar || "",
        id_kategori: editForm.id_kategori || null,
      };

      await api.put(`/produk/${editingProduct.id_produk}`, payload);

      // Refresh data
      const response = await api.get("/produk?limit=100");
      const productsData = response.data.data.data || [];
      setProducts(
        productsData.map((p) => ({
          ...p,
          status: p.aktif ? "AKTIF" : "DITAHAN",
        })),
      );

      setShowEditModal(false);
      setEditingProduct(null);
      alert("✅ Produk berhasil diupdate!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Gagal mengupdate produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
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
      <div className="min-h-screen bg-[#f6f8fc] p-8">
        {/* ================= MODAL EDIT ================= */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
            <div className="w-[600px] bg-white rounded-[38px] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <Pencil size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Edit Produk
                    </h2>
                    <p className="text-xs text-slate-400">
                      ID: {editingProduct.id_produk}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-5">
                {/* NAMA PRODUK */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={editForm.nama_produk}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nama_produk: e.target.value })
                    }
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                    placeholder="Nama produk"
                  />
                </div>

                {/* HARGA & STOK */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                      Harga *
                    </label>
                    <input
                      type="number"
                      value={editForm.harga}
                      onChange={(e) =>
                        setEditForm({ ...editForm, harga: e.target.value })
                      }
                      className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={editForm.stok}
                      onChange={(e) =>
                        setEditForm({ ...editForm, stok: e.target.value })
                      }
                      className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* KATEGORI */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Kategori
                  </label>
                  <select
                    value={editForm.id_kategori}
                    onChange={(e) =>
                      setEditForm({ ...editForm, id_kategori: e.target.value })
                    }
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id_kategori} value={cat.id_kategori}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GAMBAR URL */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    value={editForm.url_gambar}
                    onChange={(e) =>
                      setEditForm({ ...editForm, url_gambar: e.target.value })
                    }
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-blue-600"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {isValidImageUrl(editForm.url_gambar) && (
                    <img
                      src={editForm.url_gambar}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border mt-3"
                    />
                  )}
                </div>

                {/* DESKRIPSI */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.deskripsi}
                    onChange={(e) =>
                      setEditForm({ ...editForm, deskripsi: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-blue-600 resize-none"
                    placeholder="Deskripsi produk..."
                  />
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="h-12 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition"
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={isSubmitting}
                    className={`h-12 rounded-2xl text-white font-black shadow-lg transition ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Semua Produk
            </h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Monitoring semua produk yang diunggah oleh berbagai penjual di
              platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[240px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
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

        {/* ================= TABEL ================= */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm mt-10 overflow-hidden">
          <div className="grid grid-cols-[2.8fr_1.1fr_1.1fr_0.8fr_0.7fr_0.9fr_1.2fr] px-6 py-4 bg-slate-50 text-[12px] font-black tracking-[1px] text-slate-500 uppercase">
            <p>Produk</p>
            <p>Kategori</p>
            <p>Harga</p>
            <p>Stok</p>
            <p>Rating</p>
            <p>Status</p>
            <p className="text-center">Aksi</p>
          </div>

          {filteredProducts.map((item) => (
            <div
              key={item.id_produk}
              className="grid grid-cols-[2.8fr_1.1fr_1.1fr_0.8fr_0.7fr_0.9fr_1.2fr] items-center px-6 py-4 border-b last:border-b-0 hover:bg-slate-50 duration-300"
            >
              {/* PRODUK */}
              <div className="flex items-center gap-4">
                {isValidImageUrl(item.url_gambar) && (
                  <img
                    src={item.url_gambar}
                    alt={item.nama_produk}
                    className="w-14 h-14 rounded-2xl object-cover border"
                  />
                )}
                <div>
                  <h3 className="font-black text-slate-900 text-[15px] uppercase leading-none break-words max-w-[220px] whitespace-normal">
                    {item.nama_produk}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2">
                    ID: {item.id_produk}
                  </p>
                </div>
              </div>

              {/* KATEGORI */}
              <div>
                <p className="font-black tracking-[2px] text-slate-600 text-sm uppercase break-words max-w-[140px] whitespace-normal">
                  {item.kategori || "-"}
                </p>
              </div>

              {/* HARGA */}
              <div>
                <p className="font-black text-slate-900">
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                </p>
              </div>

              {/* STOK */}
              <div>
                <p className="font-semibold text-slate-500">{item.stok} unit</p>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-2">
                <Star size={14} className="fill-orange-400 text-orange-400" />
                <p className="font-black text-orange-500">
                  {item.rata_rating || 0}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-[1px] ${
                    item.status === "AKTIF"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* ================= 🔥 AKSI ================= */}
              <div className="flex items-center justify-center gap-2">
                {/* 🔥 TOMBOL EDIT */}
                <button
                  onClick={() => openEditModal(item)}
                  className="bg-blue-50 text-blue-600 px-4 h-9 rounded-xl font-black tracking-[1px] hover:bg-blue-100 duration-300 text-xs flex items-center gap-1.5"
                >
                  <Pencil size={14} />
                  Edit
                </button>

                {/* 🔥 TOMBOL TAHAN / AKTIFKAN */}
                {item.status === "AKTIF" ? (
                  <button
                    onClick={() => toggleStatus(item.id_produk)}
                    className="bg-red-50 text-red-500 px-4 h-9 rounded-xl font-black tracking-[1px] hover:bg-red-100 duration-300 text-xs"
                  >
                    TAHAN
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(item.id_produk)}
                    className="bg-emerald-100 text-emerald-600 px-4 h-9 rounded-xl font-black tracking-[1px] hover:bg-emerald-200 duration-300 text-xs"
                  >
                    AKTIFKAN
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Products;
