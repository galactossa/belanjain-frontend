import { X, Store, Upload } from "lucide-react";

import { useState } from "react";

function OpenStoreModal({ show, onClose }) {
  const [storeName, setStoreName] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [address, setAddress] = useState("");

  const [logo, setLogo] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleLogo = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!storeName || !category || !address) {
      alert("Lengkapi data toko terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    const storeData = {
      storeName,
      category,
      description,
      address,
      logo,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("sellerStore", JSON.stringify(storeData));

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        role: "seller",
        storeName,
        storeCategory: category,
        storeDescription: description,
        storeAddress: address,
        storeLogo: logo,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }

    setTimeout(() => {
      onClose();
      window.location.href = "/seller";
    }, 800);
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="
          fixed
          inset-0
          bg-black/50
          backdrop-blur-sm
          z-[200]
        "
      />

      {/* MODAL */}
      <div
        className="
          fixed
          inset-0
          z-[201]
          flex
          items-center
          justify-center
          p-4
        "
      >
        <div
          className="
    bg-white
    w-full
    max-w-xl
    h-[90vh]
    rounded-[40px]
    overflow-hidden
    shadow-2xl
    flex
    flex-col
  "
        >
          {/* HEADER */}
          <div className="p-8 pb-6">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Store size={24} className="text-blue-600" />
                </div>

                <div>
                  <h2
                    className="
                      text-3xl
                      font-black
                      text-slate-900
                    "
                  >
                    Formulir Buka Toko
                  </h2>

                  <p
                    className="
                      text-xs
                      tracking-wider
                      font-bold
                      text-slate-400
                      uppercase
                    "
                  >
                    Langkah Mendaftar Akun Penjual Baru
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                <X />
              </button>
            </div>
          </div>

          <div className="border-t" />

          {/* FORM */}
          <div
            className="
    flex-1
    overflow-y-auto
    p-8
    space-y-5
    scrollbar-thin
    scrollbar-thumb-slate-300
    scrollbar-track-transparent
  "
          >
            {/* NAMA TOKO */}
            <div>
              <label
                className="
                  text-xs
                  font-black
                  tracking-wider
                  uppercase
                  text-slate-500
                  block
                  mb-2
                "
              >
                Nama Toko *
              </label>

              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Contoh: Toko Hamid Jaya"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  px-5
                  outline-none
                "
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label
                className="
                  text-xs
                  font-black
                  tracking-wider
                  uppercase
                  text-slate-500
                  block
                  mb-2
                "
              >
                Kategori Utama *
              </label>

              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Elektronik"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  px-5
                "
              />
            </div>

            {/* DESKRIPSI */}
            <div>
              <label
                className="
                  text-xs
                  font-black
                  tracking-wider
                  uppercase
                  text-slate-500
                  block
                  mb-2
                "
              >
                Deskripsi Toko
              </label>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan tentang toko Anda secara singkat..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  p-4
                  resize-none
                "
              />
            </div>

            {/* ALAMAT */}
            <div>
              <label
                className="
                  text-xs
                  font-black
                  tracking-wider
                  uppercase
                  text-slate-500
                  block
                  mb-2
                "
              >
                Alamat Asal Pengiriman *
              </label>

              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Sudirman No.123, Jakarta"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-200
                  px-5
                "
              />
            </div>

            {/* LOGO */}
            <div>
              <label
                className="
                  text-xs
                  font-black
                  tracking-wider
                  uppercase
                  text-slate-500
                  block
                  mb-2
                "
              >
                Logo Toko
              </label>

              <label
                className="
                  border-2
                  border-dashed
                  border-slate-200
                  rounded-3xl
                  p-6
                  flex
                  items-center
                  gap-4
                  cursor-pointer
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    overflow-hidden
                    bg-gradient-to-br
                    from-pink-300
                    via-yellow-300
                    to-blue-400
                    flex
                    items-center
                    justify-center
                  "
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt=""
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  ) : (
                    <Upload size={22} className="text-white" />
                  )}
                </div>

                <div>
                  <p className="font-bold">Tarik logo kesini atau klik</p>

                  <p
                    className="
                      text-xs
                      text-slate-400
                    "
                  >
                    Direkomendasikan foto persegi rasio 1:1
                  </p>
                </div>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogo}
                />
              </label>
            </div>

            {/* BUTTON */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <button
                onClick={onClose}
                className="
                  h-14
                  rounded-2xl
                  bg-slate-100
                  font-black
                  text-slate-600
                "
              >
                BATAL
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={
                  `h-14 rounded-2xl text-white font-black shadow-lg transition-all duration-200 ` +
                  (isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700")
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-white animate-pulse" />
                    Memproses...
                  </span>
                ) : (
                  "AKTIFKAN TOKO"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OpenStoreModal;
