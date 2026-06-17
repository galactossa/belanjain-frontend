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

import { useMemo, useState } from "react";
import SellerLayout from "../../layouts/SellerLayout";
import { products as allProducts } from "../../data/products";
import { useNavigate } from "react-router-dom";
import { notifications as defaultNotifications } from "../../data/notifications";
import ModalNotifications from "../../components/seller/ModalNotifications";
function ProductsSeller() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};

  const storageKey = `sellerProducts_${currentUser.id}`;

  const [products, setProducts] = useState(() => {
    const sellerKey = `sellerProducts_${currentUser.id}`;

    const savedProducts = JSON.parse(localStorage.getItem(sellerKey));

    if (savedProducts) {
      return savedProducts;
    }

    const initialProducts = allProducts.filter(
      (product) => product.sellerId === currentUser.id,
    );

    localStorage.setItem(sellerKey, JSON.stringify(initialProducts));

    return initialProducts;
  });

  const [search, setSearch] = useState("");

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem(`sellerNotifications_${currentUser.id}`),
    );

    return (
      saved ??
      defaultNotifications.filter((item) => item.sellerId === currentUser.id)
    );
  });
  console.log(notifications);
  console.log("currentUser", currentUser);
  console.log("storage key", `sellerNotifications_${currentUser.id}`);
  console.log("notif state", notifications.length);
  const [showEditProduct, setShowEditProduct] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "ELEKTRONIK",
    price: "",
    stock: "",
    image: "",
    rating: "4.8",
    file: null,
    description: "",
    brand: "",
  });
  const [showCategory, setShowCategory] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");

  const [selectedSort, setSelectedSort] = useState("Terbaru");

  const filteredProducts = useMemo(() => {
    let data = [...products];

    // SEARCH
    if (search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // CATEGORY
    if (selectedCategory !== "Semua Kategori") {
      data = data.filter(
        (item) => item.category === selectedCategory.toUpperCase(),
      );
    }

    // SORT
    const parsePrice = (price) => Number(String(price).replace(/\./g, ""));

    if (selectedSort === "Harga Termahal") {
      data.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    if (selectedSort === "Harga Termurah") {
      data.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    if (selectedSort === "Stok Sedikit") {
      data.sort((a, b) => Number(a.stock) - Number(b.stock));
    }
    console.log("SORT =", selectedSort);
    console.log(data);
    return data;
  }, [products, search, selectedCategory, selectedSort]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus produk?");

    if (confirmDelete) {
      const product = products.find((item) => item.id === id);
      const updated = products.filter((item) => item.id !== id);

      setProducts(updated);

      localStorage.setItem(storageKey, JSON.stringify(updated));
      const newNotif = {
        id: Date.now(),
        message: `Produk ${productForm.name} berhasil diperbarui`,
      };

      const updatedNotif = [newNotif, ...notifications];

      setNotifications(updatedNotif);

      localStorage.setItem(
        `sellerNotifications_${currentUser.id}`,
        JSON.stringify(updatedNotif),
      );
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      sellerId: currentUser.id,
      image:
        productForm.image ||
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      rating: 4.8,
      description: productForm.description,
      brand: productForm.brand,
    };

    const updatedProducts = [newProduct, ...products];

    setProducts(updatedProducts);

    localStorage.setItem(storageKey, JSON.stringify(updatedProducts));
    setShowAddProduct(false);

    setProductForm({
      name: "",
      category: "ELEKTRONIK",
      price: "",
      stock: "",
      image: "",
      rating: "4.8",
      file: null,
      description: "",
      brand: "",
    });
  };

  const openEdit = (product) => {
    setSelectedProduct(product);

    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      rating: product.rating,
      file: null,
      description: "Produk berkualitas premium dengan performa terbaik.",
      brand: "Apple",
    });

    setShowEditProduct(true);
  };

  const handleSaveEdit = () => {
    const updatedProducts = products.map((item) => {
      if (item.id === selectedProduct.id) {
        return {
          ...item,
          name: productForm.name,
          category: productForm.category,
          image: productForm.image,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          description: productForm.description,
          brand: productForm.brand,
        };
      }
      return item;
    });

    setProducts(updatedProducts);

    localStorage.setItem(storageKey, JSON.stringify(updatedProducts));

    const newNotif = {
      id: Date.now(),
      message: `Produk ${newProduct.name} berhasil ditambahkan`,
    };

    const updatedNotif = [newNotif, ...notifications];

    setNotifications(updatedNotif);

    localStorage.setItem(
      `sellerNotifications_${currentUser.id}`,
      JSON.stringify(updatedNotif),
    );

    setShowEditProduct(false);
  };

  const handleDownload = () => {
    const content = products
      .map((item) => `${item.name} | ${item.category} | ${item.price}`)
      .join("\n");

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "laporan-produk.txt";

    a.click();
  };

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        {/* EDIT PRODUCT */}
        {showEditProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[620px] bg-white rounded-[36px] overflow-hidden shadow-2xl">
              <div className="p-7 border-b border-slate-100 flex justify-between">
                <div>
                  <h2 className="text-[34px] font-black uppercase text-[#111827] leading-none">
                    Update Produk
                  </h2>

                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                    Lengkapi informasi produk anda
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
                      setProductForm({
                        ...productForm,
                        name: e.target.value,
                      })
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
                      setProductForm({
                        ...productForm,
                        price: e.target.value,
                      })
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
                    <option>ELEKTRONIK</option>
                    <option>LAPTOP</option>
                    <option>WEARABLE</option>
                    <option>AUDIO</option>
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
                      setProductForm({
                        ...productForm,
                        stock: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase tracking-[2px] font-black text-slate-500">
                    Gambar Produk
                  </label>

                  <div className="flex gap-3 mt-2">
                    <div className="flex-1 h-12 rounded-2xl border border-slate-200 px-4 flex items-center gap-3">
                      <Upload size={16} />

                      <input
                        type="text"
                        className="w-full bg-transparent outline-none"
                        value={productForm.image}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            image: e.target.value,
                          })
                        }
                      />
                    </div>

                    <label className="h-12 px-5 rounded-2xl border border-blue-200 text-blue-600 font-black text-sm flex items-center cursor-pointer">
                      PILIH FILE
                      <input
                        type="file"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (file) {
                            setProductForm({
                              ...productForm,
                              file,
                              image: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {productForm.image && (
                    <div className="relative w-fit mt-4">
                      <img
                        src={productForm.image}
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover border"
                      />

                      <button
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            image: "",
                            file: null,
                          })
                        }
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
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

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-[25px] font-black uppercase text-[#111827] leading-none">
              Manajemen Produk
            </h1>

            <p className="text-[11px] font-black tracking-[2px] uppercase text-slate-400 mt-2">
              Kelola {products.length} produk yang anda jual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SEARCH */}
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* NOTIF */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative"
              >
                <Bell size={18} className="text-slate-500" />

                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotif && (
                <ModalNotifications
                  notifications={notifications}
                  onReadAll={() => setShowNotif(false)}
                />
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-6 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* FILTER */}
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
                  {selectedCategory}

                  <ChevronDown size={18} />
                </button>

                {showCategory && (
                  <div className="absolute top-16 left-0 w-[185px] bg-white border border-slate-200 rounded-none shadow-xl z-50 overflow-hidden">
                    {[
                      "Semua Kategori",
                      "ELEKTRONIK",
                      "LAPTOP",
                      "WEARABLE",
                      "AUDIO",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSelectedCategory(item);
                          setShowCategory(false);
                        }}
                        className={`w-full px-6 py-3 text-left text-sm ${
                          selectedCategory === item
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-50"
                        }`}
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
                  {selectedSort}

                  <ChevronDown size={18} />
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
                        className={`w-full px-6 py-3 text-left text-sm ${
                          selectedSort === item
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleDownload}
                className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-500"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-100">
            <div>
              <h2 className="text-[30px] font-black text-[#111827]">
                Daftar Produk
              </h2>

              <p className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mt-1">
                Kelola {products.length} produk yang anda jual
              </p>
            </div>
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
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50 duration-300"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-2xl object-cover border"
                        />

                        <div>
                          <h3 className="text-[13px] font-black uppercase text-slate-900 max-w-[260px]">
                            {item.name}
                          </h3>

                          <p className="text-[11px] text-slate-400 font-bold mt-1">
                            ID : {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[9px] font-black">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-[15px] font-medium text-slate-900">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-5 text-[13px] font-bold text-slate-600">
                      {item.stock} Unit
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-orange-400 font-black text-sm">
                        <Star size={14} fill="currentColor" />

                        {item.rating}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        {/* EDIT */}
                        <button
                          onClick={() => openEdit(item)}
                          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 duration-300 flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(item.id)}
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
