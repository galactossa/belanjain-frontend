import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Upload } from "lucide-react";
import SellerLayout from "../../layouts/SellerLayout";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

function AddProduct() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.id_pengguna || currentUser?.id;
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    city: "",
  });

  // ================= 🔥 FETCH KATEGORI =================
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

  // ================= FETCH STORE =================
  useEffect(() => {
    const fetchStore = async () => {
      if (!userId) {
        alert("User tidak ditemukan. Silakan login ulang.");
        navigate("/");
        return;
      }
      try {
        const response = await api.get(`/toko/user/${userId}`);
        setStoreId(response.data.data.id_toko);
      } catch (error) {
        console.error("Error fetching store:", error);
        if (error.response?.status === 404) {
          alert("Anda belum memiliki toko. Silakan buka toko terlebih dahulu.");
          navigate("/customer/profile");
        }
      }
    };
    fetchStore();
  }, [userId, navigate]);

  // ================= 🔥 HANDLE SAVE PRODUK =================
  const handleSave = async () => {
    if (!productForm.name || !productForm.price) {
      alert("Lengkapi data produk terlebih dahulu");
      return;
    }

    if (!storeId) {
      alert("Toko tidak ditemukan. Silakan buka toko terlebih dahulu.");
      return;
    }

    // 🔥 Dapatkan id_kategori dari nama kategori yang dipilih
    let kategoriId = null;
    if (productForm.category) {
      const found = categories.find(
        (cat) =>
          cat.nama_kategori.toLowerCase() ===
          productForm.category.toLowerCase(),
      );
      if (found) {
        kategoriId = found.id_kategori;
      }
    }

    setLoading(true);
    try {
      await api.post("/produk", {
        id_toko: storeId,
        nama_produk: productForm.name,
        id_kategori: kategoriId, // 🔥 KIRIM ID, BUKAN NULL!
        deskripsi: productForm.description,
        harga: Number(productForm.price),
        stok: Number(productForm.stock) || 0,
        url_gambar: productForm.image,
      });

      alert("✅ Produk berhasil ditambahkan!");
      navigate("/seller/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.message || "Gagal menambahkan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#0f172a] leading-none">
              Tambah Produk
            </h1>
            <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
              Lengkapi informasi produk yang akan dijual
            </p>
          </div>
          <button
            onClick={() => navigate("/seller/products")}
            className="h-11 px-6 rounded-2xl bg-slate-200 font-black text-sm"
          >
            KEMBALI
          </button>
        </div>

        <div className="max-w-[950px] mx-auto bg-white rounded-[40px] border border-slate-200 shadow-sm p-8">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {/* NAMA PRODUK */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Nama Produk *
              </label>
              <input
                type="text"
                placeholder="Contoh: Asus ROG Zephyrus"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* 🔥 KATEGORI - DROPDOWN DARI API */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Kategori *
              </label>
              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({ ...productForm, category: e.target.value })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 font-semibold outline-none"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id_kategori} value={cat.nama_kategori}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* HARGA */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Harga Jual *
              </label>
              <input
                type="number"
                placeholder="0"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({ ...productForm, price: e.target.value })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* STOK */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Stok Awal *
              </label>
              <input
                type="number"
                placeholder="Contoh: 50"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({ ...productForm, stock: e.target.value })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* FOTO URL */}
            <div className="col-span-2">
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Foto Produk URL
              </label>
              <input
                type="text"
                value={productForm.image}
                onChange={(e) =>
                  setProductForm({ ...productForm, image: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none"
              />
              {productForm.image && (
                <img
                  src={productForm.image}
                  alt=""
                  className="w-28 h-28 rounded-2xl object-cover border mt-4"
                />
              )}
            </div>

            {/* DESKRIPSI */}
            <div className="col-span-2">
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Deskripsi Lengkap *
              </label>
              <textarea
                rows={5}
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                placeholder="Jelaskan spesifikasi produk..."
                className="w-full mt-2 rounded-[24px] border border-slate-200 bg-[#f8fafc] p-5 outline-none"
              />
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full h-[58px] mt-8 rounded-[20px] text-white font-black uppercase tracking-[2px] shadow-lg ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "MEMPROSES..." : "TERBITKAN PRODUK SEKARANG"}
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

export default AddProduct;
