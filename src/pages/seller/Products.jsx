import {
  Search,
  Bell,
  Trash2,
  Pencil,
  ChevronDown,
  Download,
  Plus,
  Star,
  X,
  Upload,
} from "lucide-react";

import { useMemo, useState, useEffect } from "react";
import SellerLayout from "../../layouts/SellerLayout";
import { useNavigate } from "react-router-dom";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

const isValidImageUrl = (url) => {
  return url && typeof url === "string" && url.trim().length > 0;
};

function ProductsSeller() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  // 🔥 PERBAIKAN: Gunakan id_pengguna
  const userId = currentUser?.id_pengguna || currentUser?.id;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCategory, setShowCategory] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [storeId, setStoreId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  // Fetch store and products
  useEffect(() => {
    const fetchData = async () => {
      // 🔥 PERBAIKAN: Cek userId
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const storeRes = await api.get(`/toko/user/${userId}`);
        const store = storeRes.data.data;
        setStoreId(store.id_toko);

        const productsRes = await api.get(`/produk/toko/${store.id_toko}`);
        setProducts(productsRes.data.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]); // 🔥 PERBAIKAN: Dependency userId

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (search) {
      data = data.filter((item) =>
        item.nama_produk.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (selectedCategory !== "Semua Kategori") {
      data = data.filter(
        (item) =>
          item.kategori?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }
    if (selectedSort === "Harga Termahal") {
      data.sort((a, b) => Number(b.harga) - Number(a.harga));
    }
    if (selectedSort === "Harga Termurah") {
      data.sort((a, b) => Number(a.harga) - Number(b.harga));
    }
    if (selectedSort === "Stok Sedikit") {
      data.sort((a, b) => Number(a.stok) - Number(b.stok));
    }
    return data;
  }, [products, search, selectedCategory, selectedSort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk?")) return;
    try {
      await api.delete(`/produk/${id}`);
      setProducts(products.filter((p) => p.id_produk !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  const openEdit = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.nama_produk,
      category: product.kategori || "",
      price: product.harga,
      stock: product.stok,
      image: product.url_gambar || "",
      description: product.deskripsi || "",
    });
    setShowEditProduct(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/produk/${selectedProduct.id_produk}`, {
        nama_produk: productForm.name,
        id_kategori: null,
        harga: Number(productForm.price),
        stok: Number(productForm.stock),
        url_gambar: productForm.image,
        deskripsi: productForm.description,
      });
      // Refresh products
      const productsRes = await api.get(`/produk/toko/${storeId}`);
      setProducts(productsRes.data.data.data || []);
      setShowEditProduct(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.message || "Gagal update produk");
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        {/* EDIT MODAL */}
        {showEditProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[620px] bg-white rounded-[36px] overflow-hidden shadow-2xl">
              <div className="p-7 border-b border-slate-100 flex justify-between">
                <div>
                  <h2 className="text-[34px] font-black uppercase text-[#111827]">
                    Update Produk
                  </h2>
                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                    Lengkapi informasi produk
                  </p>
                </div>
                <button
                  onClick={() => setShowEditProduct(false)}
                  className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-7 grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Harga
                  </label>
                  <input
                    type="number"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Kategori
                  </label>
                  <select
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Rumah Tangga">Rumah Tangga</option>
                    <option value="Olahraga">Olahraga</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Gambar URL
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 rounded-2xl border border-slate-200 px-4 mt-2 outline-none"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                  />
                  {isValidImageUrl(productForm.image) && (
                    <img
                      src={productForm.image}
                      alt=""
                      className="w-24 h-24 rounded-2xl object-cover border mt-4"
                    />
                  )}
                </div>
                <div className="col-span-2 flex gap-4 mt-3">
                  <button
                    onClick={() => setShowEditProduct(false)}
                    className="flex-1 h-12 rounded-2xl bg-slate-100 font-black text-slate-600"
                  >
                    BATAL
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-black"
                  >
                    SIMPAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#111827]">
              Manajemen Produk
            </h1>
            <p className="text-[11px] font-black tracking-[2px] uppercase text-slate-400 mt-2">
              Kelola {products.length} produk
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-6 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm mb-5">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 h-14 rounded-2xl bg-[#f8fafc] border border-slate-200 px-5 flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk Anda..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowCategory(!showCategory)}
                  className="h-14 px-6 rounded-2xl bg-white border border-slate-200 text-[12px] font-black text-slate-700 flex items-center gap-3"
                >
                  {selectedCategory} <ChevronDown size={18} />
                </button>
                {showCategory && (
                  <div className="absolute top-16 left-0 w-[185px] bg-white border border-slate-200 rounded-none shadow-xl z-50 overflow-hidden">
                    {[
                      "Semua Kategori",
                      "Elektronik",
                      "Fashion",
                      "Rumah Tangga",
                      "Olahraga",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedCategory(item);
                          setShowCategory(false);
                        }}
                        className={`w-full px-6 py-3 text-left text-sm ${selectedCategory === item ? "bg-blue-600 text-white" : "hover:bg-slate-50"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="h-14 px-6 rounded-2xl bg-white border border-slate-200 text-[12px] font-black text-slate-700 flex items-center gap-3"
                >
                  {selectedSort} <ChevronDown size={18} />
                </button>
                {showSort && (
                  <div className="absolute top-16 left-0 w-[190px] bg-white border border-slate-200 rounded-none shadow-xl z-50 overflow-hidden">
                    {[
                      "Terbaru",
                      "Harga Termahal",
                      "Harga Termurah",
                      "Stok Sedikit",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedSort(item);
                          setShowSort(false);
                        }}
                        className={`w-full px-6 py-3 text-left text-sm ${selectedSort === item ? "bg-blue-600 text-white" : "hover:bg-slate-50"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-[30px] font-black text-[#111827]">
              Daftar Produk
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                  <th className="px-6 py-5">Produk</th>
                  <th className="px-6 py-5">Kategori</th>
                  <th className="px-6 py-5">Harga</th>
                  <th className="px-6 py-5">Stok</th>
                  <th className="px-6 py-5">Rating</th>
                  <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr
                    key={item.id_produk}
                    className="border-t border-slate-100 hover:bg-slate-50 duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        {isValidImageUrl(item.url_gambar) && (
                          <img
                            src={item.url_gambar}
                            alt={item.nama_produk}
                            className="w-14 h-14 rounded-2xl object-cover border"
                          />
                        )}
                        <div>
                          <h3 className="text-[13px] font-black uppercase text-slate-900 max-w-[260px]">
                            {item.nama_produk}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-bold mt-1">
                            ID : {item.id_produk}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[9px] font-black">
                        {item.kategori || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[15px] font-medium text-slate-900">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-5 text-[13px] font-bold text-slate-600">
                      {item.stok} Unit
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-orange-400 font-black text-sm">
                        <Star size={14} fill="currentColor" />{" "}
                        {item.rata_rating || 0}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 duration-300 flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_produk)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 duration-300 flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default ProductsSeller;
