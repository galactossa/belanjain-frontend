import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Search, Bell } from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { notifications as defaultNotifications } from "../../data/notifications";

function AddProduct() {
  const [showNotif, setShowNotif] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const sellerNotifications =
    JSON.parse(localStorage.getItem(`sellerNotifications_${currentUser.id}`)) ||
    defaultNotifications.filter((notif) => notif.sellerId === currentUser?.id);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    city: "",
    mode: "PREMIUM",
  });

  const handleSave = () => {
    if (!productForm.name || !productForm.category || !productForm.price) {
      alert("Lengkapi data produk terlebih dahulu");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const sellerKey = `sellerProducts_${currentUser.id}`;

    const newProduct = {
      id: Date.now(),

      sellerId: currentUser.id,

      name: productForm.name,

      category: productForm.category,

      store: currentUser.storeName,

      city: productForm.city,

      mode: productForm.mode,

      price: Number(productForm.price),

      stock: Number(productForm.stock),

      rating: 4.8,

      trust: 95,

      sold: 0,

      brand: productForm.brand,

      image: productForm.image,

      description: productForm.description,

      infoPenting: "",

      ulasan: [],
    };

    const oldProducts = JSON.parse(localStorage.getItem(sellerKey)) || [];

    const updatedProducts = [newProduct, ...oldProducts];

    localStorage.setItem(sellerKey, JSON.stringify(updatedProducts));

    const notifKey = `sellerNotifications_${currentUser.id}`;
    const savedNotifications =
      JSON.parse(localStorage.getItem(notifKey)) ||
      defaultNotifications.filter((notif) => notif.sellerId === currentUser.id);

    const newNotification = {
      id: Date.now(),
      role: "seller",
      sellerId: currentUser.id,
      message: `Produk ${productForm.name} berhasil ditambahkan.`,
      time: "Baru saja",
    };

    localStorage.setItem(
      notifKey,
      JSON.stringify([newNotification, ...savedNotifications]),
    );

    navigate("/seller/products");
  };

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        {/* HEADER */}
        <div
          className="
    flex
    flex-col
    xl:flex-row
    xl:items-center
    xl:justify-between
    gap-5
    mb-8
  "
        >
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#0f172a] leading-none">
              Tambah Produk
            </h1>

            <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
              Lengkapi informasi produk yang akan dijual
            </p>
          </div>

          <div
            className="
    flex
    flex-wrap
    items-center
    gap-3
  "
          >
            <div
              className="
    w-full
    sm:w-[320px]
    h-12
    rounded-2xl
    border
    border-slate-200
    bg-white
    flex
    items-center
    gap-3
    px-4
    shadow-sm
  "
            >
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="
      w-11
      h-11
      rounded-2xl
      border
      border-slate-200
      bg-white
      flex
      items-center
      justify-center
      relative
    "
              >
                <Bell size={18} className="text-slate-500" />

                <span
                  className="
        absolute
        -top-1
        -right-1
        w-5
        h-5
        rounded-full
        bg-blue-600
        text-white
        text-[10px]
        font-black
        flex
        items-center
        justify-center
      "
                >
                  {sellerNotifications.length}
                </span>
              </button>

              {showNotif && (
                <ModalNotifications
                  notifications={sellerNotifications}
                  onReadAll={() => setShowNotif(false)}
                />
              )}
            </div>

            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-6 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* CARD */}
        <div
          className="
    max-w-[950px]
    mx-auto
    bg-white
    rounded-[40px]
    border
    border-slate-200
    shadow-sm
    p-8
  "
        >
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {/* NAMA */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Nama Produk *
              </label>

              <input
                type="text"
                placeholder="Contoh: Asus ROG Zephyrus G14"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                  })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* BRAND */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Merek / Brand
              </label>

              <input
                type="text"
                placeholder="Contoh: Asus, Apple"
                value={productForm.brand}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    brand: e.target.value,
                  })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Kategori *
              </label>

              <select
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    category: e.target.value,
                  })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 font-semibold outline-none"
              >
                <option value="">Pilih Kategori</option>

                <option>FASHION</option>

                <option>RUMAH TANGGA</option>

                <option>ELEKTRONIK</option>
              </select>
            </div>

            {/* HARGA */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                  Harga Jual *
                </label>

                <span className="text-[11px] text-emerald-500 font-black uppercase">
                  Profit Analyzer Active
                </span>
              </div>

              <input
                type="number"
                placeholder="0"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: e.target.value,
                  })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* STOCK */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Stok Awal *
              </label>

              <input
                type="number"
                placeholder="Contoh: 50"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    stock: e.target.value,
                  })
                }
                className="w-full h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 mt-2 outline-none font-semibold"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="text-[12px] uppercase tracking-[2px] font-black text-[#0f172a]">
                Foto Produk URL / Unggah File
              </label>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://images.unsplash.com/"
                  className="flex-1 h-[52px] rounded-[18px] border border-slate-200 bg-[#f8fafc] px-5 outline-none"
                />

                <label className="h-[52px] px-5 rounded-[18px] border border-blue-300 text-blue-600 font-black flex items-center cursor-pointer">
                  PILIH FILE
                  <input
                    hidden
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file) {
                        const url = URL.createObjectURL(file);

                        setPreview(url);

                        setProductForm({
                          ...productForm,
                          image: url,
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {(preview || productForm.image) && (
                <img
                  src={preview || productForm.image}
                  alt=""
                  className="w-28 h-28 rounded-2xl object-cover border mt-4"
                />
              )}
            </div>

            {/* PROFIT */}
            <div className="col-span-2 bg-blue-50 border border-blue-100 rounded-[30px] p-6">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600" />

                <h3 className="font-black uppercase text-blue-700 text-sm">
                  Rekomendasi Profit Maximum
                </h3>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Sistem menganalisis data pasar dan memberikan harga terbaik.
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setProductForm({
                      ...productForm,
                      price: "12000000",
                    })
                  }
                  className="px-5 h-11 rounded-xl border border-blue-500 text-blue-600 font-black"
                >
                  Rp 12.000.000
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setProductForm({
                      ...productForm,
                      price: "12500000",
                    })
                  }
                  className="px-5 h-11 rounded-xl border border-blue-500 text-blue-600 font-black"
                >
                  Rp 12.500.000
                </button>
              </div>
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

          <button
            onClick={handleSave}
            className="w-full h-[58px] mt-8 rounded-[20px] bg-blue-600 text-white font-black uppercase tracking-[2px] shadow-lg hover:bg-blue-700 duration-300"
          >
            Terbitkan Produk Sekarang
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}

export default AddProduct;
