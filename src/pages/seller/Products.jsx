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

function ProductsSeller() {
  const navigate = useNavigate();
  const initialProducts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
      name: "MACBOOK AIR M2 - MIDNIGHT BLUE",
      category: "LAPTOP",
      price: "Rp 16,499,000",
      stock: "25 Unit",
      rating: "4.8",
    },

    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      name: "APPLE WATCH SERIES 9 GPS 45MM",
      category: "WEARABLE",
      price: "Rp 6,299,000",
      stock: "55 Unit",
      rating: "4.8",
    },

    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      name: "IPHONE 15 PRO MAX - 256GB TITANIUM",
      category: "ELEKTRONIK",
      price: "Rp 18,999,000",
      stock: "50 Unit",
      rating: "4.9",
    },
  ];

const [products, setProducts] = useState(() => {
  const savedProducts = JSON.parse(
    localStorage.getItem("sellerProducts")
  );

  if (savedProducts && savedProducts.length > 0) {
    return savedProducts;
  }

  return initialProducts;
});

  const [search, setSearch] = useState("");

  const [showNotif, setShowNotif] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);

  const [showEditProduct, setShowEditProduct] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const notifications = [
    "Produk berhasil ditambahkan",
    "Pesanan baru masuk",
    "Stock produk diperbarui",
  ];

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

const [selectedCategory, setSelectedCategory] =
  useState("Semua Kategori");

const [selectedSort, setSelectedSort] =
  useState("Terbaru");
  
const filteredProducts = useMemo(() => {
  let data = [...products];

  // SEARCH
  if (search) {
    data = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // CATEGORY
  if (selectedCategory !== "Semua Kategori") {
    data = data.filter(
      (item) =>
        item.category === selectedCategory.toUpperCase()
    );
  }

  // SORT
  if (selectedSort === "Harga Termahal") {
    data.sort(
      (a, b) =>
        Number(
          b.price.replace(/[^\d]/g, "")
        ) -
        Number(
          a.price.replace(/[^\d]/g, "")
        )
    );
  }

  if (selectedSort === "Harga Termurah") {
    data.sort(
      (a, b) =>
        Number(
          a.price.replace(/[^\d]/g, "")
        ) -
        Number(
          b.price.replace(/[^\d]/g, "")
        )
    );
  }

  if (selectedSort === "Stok Sedikit") {
    data.sort(
      (a, b) =>
        Number(
          a.stock.replace(/[^\d]/g, "")
        ) -
        Number(
          b.stock.replace(/[^\d]/g, "")
        )
    );
  }

  return data;
}, [
  products,
  search,
  selectedCategory,
  selectedSort,
]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus produk?"
    );

    if (confirmDelete) {
     const updated = products.filter((item) => item.id !== id);

setProducts(updated);

localStorage.setItem(
  "sellerProducts",
  JSON.stringify(updated)
);
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      image:
        productForm.image ||
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      name: productForm.name,
      category: productForm.category,
      price: `Rp ${Number(
        productForm.price
      ).toLocaleString("id-ID")}`,
      stock: `${productForm.stock} Unit`,
      rating: "4.8",
    };

   const updatedProducts = [newProduct, ...products];

setProducts(updatedProducts);

localStorage.setItem(
  "sellerProducts",
  JSON.stringify(updatedProducts)
);

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
      price: product.price.replace(/[^\d]/g, ""),
      stock: product.stock.replace(/[^\d]/g, ""),
      image: product.image,
      rating: product.rating,
      file: null,
      description:
        "Produk berkualitas premium dengan performa terbaik.",
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
          price: `Rp ${Number(
            productForm.price
          ).toLocaleString("id-ID")}`,
          stock: `${productForm.stock} Unit`,
        };
      }

      return item;
    });

    setProducts(updatedProducts);
    localStorage.setItem(
  "sellerProducts",
  JSON.stringify(updatedProducts)
);

    setShowEditProduct(false);
  };

  const handleDownload = () => {
    const content = products
      .map(
        (item) =>
          `${item.name} | ${item.category} | ${item.price}`
      )
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
        {/* ADD PRODUCT */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-[620px] bg-white rounded-[36px] overflow-hidden shadow-2xl">
              <div className="p-7 border-b border-slate-100 flex justify-between">
                <div>
                  <h2 className="text-[34px] font-black uppercase text-[#111827] leading-none">
                    Tambah Produk
                  </h2>

                  <p className="text-[10px] uppercase tracking-[2px] font-black text-slate-400 mt-2">
                    Lengkapi informasi produk anda
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProduct(false)}
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
                        placeholder="https://example.com/image.jpg"
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
                    <img
                      src={productForm.image}
                      alt=""
                      className="w-24 h-24 rounded-2xl object-cover border mt-4"
                    />
                  )}
                </div>

                <div className="col-span-2 flex gap-4 mt-3">
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 h-12 rounded-2xl bg-slate-100 font-black text-slate-600"
                  >
                    BATAL
                  </button>

                  <button
                    onClick={handleAddProduct}
                    className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-black"
                  >
                    TAMBAH PRODUK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
            <h1 className="text-[34px] font-black uppercase text-[#111827] leading-none">
              Manajemen Produk
            </h1>

            <p className="text-[11px] font-black tracking-[2px] uppercase text-slate-400 mt-2">
              Kelola {products.length} produk yang anda jual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SEARCH */}
            <div className="w-full sm:w-[320px] h-[46px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full bg-transparent outline-none text-sm text-slate-700"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* NOTIF */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotif(!showNotif)
                }
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative"
              >
                <Bell
                  size={18}
                  className="text-slate-500"
                />

                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-14 w-[300px] bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 z-50">
                  <h3 className="font-black text-slate-900">
                    Notifikasi
                  </h3>

                  <div className="mt-4 flex flex-col gap-3">
                    {notifications.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
  onClick={() =>
    navigate("/seller/add-product")
  }
  className="h-12 px-6 rounded-2xl bg-blue-600 text-white text-[12px] font-black shadow-lg flex items-center gap-2"
>
  <Plus size={16} />
  TAMBAH PRODUK
</button>
          </div>
        </div>

        {/* FILTER */}
        <div className="bg-white rounded-[30px] border border-slate-200 p-5 shadow-sm mb-5">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 h-14 rounded-2xl bg-[#f8fafc] border border-slate-200 px-5 flex items-center gap-3">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Cari produk Anda..."
                className="w-full bg-transparent outline-none text-sm"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
  <button
    onClick={() =>
      setShowCategory(!showCategory)
    }
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
    onClick={() =>
      setShowSort(!showSort)
    }
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

            <button
  onClick={() =>
    navigate("/seller/add-product")
  }
  className="h-12 px-6 rounded-2xl bg-blue-600 text-white text-[12px] font-black shadow-lg flex items-center gap-2"
>
  <Plus size={16} />
  TAMBAH PRODUK
</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[2px] text-slate-400">
                  <th className="px-6 py-5">
                    Produk
                  </th>

                  <th className="px-6 py-5">
                    Kategori
                  </th>

                  <th className="px-6 py-5">
                    Harga
                  </th>

                  <th className="px-6 py-5">
                    Stok
                  </th>

                  <th className="px-6 py-5">
                    Rating
                  </th>

                  <th className="px-6 py-5 text-center">
                    Aksi
                  </th>
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

                    <td className="px-6 py-5 text-[15px] font-black text-slate-900">
                      {item.price}
                    </td>

                    <td className="px-6 py-5 text-[13px] font-bold text-slate-600">
                      {item.stock}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-orange-400 font-black text-sm">
                        <Star
                          size={14}
                          fill="currentColor"
                        />

                        {item.rating}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        {/* EDIT */}
                        <button
                          onClick={() =>
                            openEdit(item)
                          }
                          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 duration-300 flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(item.id)
                          }
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