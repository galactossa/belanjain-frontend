import { useState, useEffect } from "react";
import {
  Camera,
  Trash2,
  Save,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";

function StoreProfile() {
  const [banner, setBanner] = useState("");
  const [logo, setLogo] = useState("");

  const [storeData, setStoreData] =
    useState({
      storeName: "Toko Hamid Jaya",
      category: "Elektronik",

      description:
        "Penyedia produk e-commerce lokal berkualitas tinggi terpilih.",

      policy:
        "Garansi resmi 1 tahun. Pelayanan prima, packing aman, pengiriman jam 15:00 WIB.",

      address:
        "Jl. Sudirman No.123, Jakarta Pusat",

      owner: "Toko Hamid Jaya",

      email:
        "seller@example.com",
    });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(
        "storeProfile"
      )
    );

    if (saved) {
      setStoreData(saved);
      setBanner(saved.banner || "");
      setLogo(saved.logo || "");
    }
  }, []);

  const handleBannerUpload = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (
      event
    ) => {
      setBanner(
        event.target.result
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  const handleLogoUpload = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (
      event
    ) => {
      setLogo(
        event.target.result
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  const saveProfile = () => {
    localStorage.setItem(
      "storeProfile",
      JSON.stringify({
        ...storeData,
        banner,
        logo,
      })
    );

    alert(
      "Profil berhasil disimpan"
    );
  };

  return (
    <SellerLayout>
      <div className="min-h-screen bg-[#f5f7fb] p-6">

        {/* COVER */}
        <div className="max-w-6xl mx-auto bg-white rounded-[35px] overflow-hidden border border-slate-200 shadow-sm">

          <div className="relative h-[300px] group">

            <img
              src={
                banner ||
                "https://images.unsplash.com/photo-1556740749-887f6717d7e4"
              }
              alt=""
              className="w-full h-full object-cover"
            />

            <div
              className="
              absolute
              inset-0
              bg-black/30
              opacity-0
              group-hover:opacity-100
              transition-all
              duration-300
            "
            />

            {/* BUTTON BANNER */}
            <div
              className="
              absolute
              bottom-5
              right-5
              flex
              gap-3
              z-20
            "
            >
              <label
                className="
                h-11
                px-5
                rounded-xl
                bg-white
                flex
                items-center
                font-bold
                cursor-pointer
                shadow
              "
              >
                Ganti Banner

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={
                    handleBannerUpload
                  }
                />
              </label>

              {banner && (
                <button
                  onClick={() =>
                    setBanner("")
                  }
                  className="
                    h-11
                    px-5
                    rounded-xl
                    bg-red-500
                    text-white
                    font-bold
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Trash2
                    size={16}
                  />
                  Hapus
                </button>
              )}
            </div>
          </div>

          {/* PROFILE */}
          <div className="px-8 pb-8 relative">

            <div
              className="
              relative
              w-fit
              -mt-16
              group
            "
            >
              <img
                src={
                  logo ||
                  "https://ui-avatars.com/api/?name=Toko"
                }
                alt=""
                className="
                  w-32
                  h-32
                  rounded-3xl
                  object-cover
                  border-[5px]
                  border-white
                  bg-white
                  shadow-lg
                "
              />

              {/* HOVER CAMERA */}
              <label
                className="
                absolute
                inset-0
                rounded-3xl
                bg-black/60
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-300
                cursor-pointer
                flex
                items-center
                justify-center
              "
              >
                <div className="flex flex-col items-center text-white">
                  <Camera
                    size={26}
                  />

                  <span
                    className="
                    text-xs
                    font-bold
                    mt-1
                  "
                  >
                    Ubah Foto
                  </span>
                </div>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={
                    handleLogoUpload
                  }
                />
              </label>

              {logo && (
                <button
                  onClick={() =>
                    setLogo("")
                  }
                  className="
                    absolute
                    -top-2
                    -right-2
                    w-8
                    h-8
                    rounded-full
                    bg-red-500
                    text-white
                    font-bold
                    shadow
                  "
                >
                  ×
                </button>
              )}
            </div>

            <div className="mt-4">
              <h1
                className="
                text-3xl
                font-black
                text-slate-900
              "
              >
                {
                  storeData.storeName
                }
              </h1>

              <p
                className="
                text-blue-600
                font-bold
                uppercase
                mt-1
              "
              >
                {
                  storeData.category
                }
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="
          max-w-6xl
          mx-auto
          grid
          lg:grid-cols-3
          gap-6
          mt-8
        "
        >

          {/* LEFT */}
          <div
            className="
            lg:col-span-2
            bg-white
            p-7
            rounded-[35px]
            border
            border-slate-200
            shadow-sm
          "
          >
            <h2
              className="
              text-[28px]
              font-black
            "
            >
              Detail Profil Toko
            </h2>

            <p
              className="
              mt-2
              text-[11px]
              uppercase
              tracking-[3px]
              font-bold
              text-slate-400
            "
            >
              Kelola informasi publik dan data branding toko anda
            </p>

            <div className="space-y-6 mt-8">

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Nama Toko *
                </label>

                <input
                  type="text"
                  value={
                    storeData.storeName
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      storeName:
                        e.target
                          .value,
                    })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Kategori Utama *
                </label>

                <input
                  type="text"
                  value={
                    storeData.category
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      category:
                        e.target
                          .value,
                    })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Deskripsi Ringkas Toko
                </label>

                <textarea
                  rows={4}
                  value={
                    storeData.description
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      description:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 p-5"
                />
              </div>

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Kebijakan Toko
                </label>

                <textarea
                  rows={3}
                  value={
                    storeData.policy
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      policy:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 p-5"
                />
              </div>

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Alamat Asal Pengiriman *
                </label>

                <input
                  type="text"
                  value={
                    storeData.address
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      address:
                        e.target
                          .value,
                    })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <button
                onClick={
                  saveProfile
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-black
                  tracking-wider
                  shadow-lg
                "
              >
                SIMPAN PROFIL TOKO & BRANDING
              </button>

            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
            bg-white
            p-7
            rounded-[35px]
            border
            border-slate-200
            shadow-sm
            h-fit
          "
          >
            <h2 className="text-[28px] font-black">
              Kepemilikan Pribadi
            </h2>

            <p
              className="
              mt-2
              text-[11px]
              uppercase
              tracking-[3px]
              font-bold
              text-slate-400
            "
            >
              Ubah nama dan email pemilik akun merchant
            </p>

            <div className="space-y-6 mt-8">

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Nama Pemilik *
                </label>

                <input
                  type="text"
                  value={
                    storeData.owner
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      owner:
                        e.target
                          .value,
                    })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Email Pemilik *
                </label>

                <input
                  type="email"
                  value={
                    storeData.email
                  }
                  onChange={(e) =>
                    setStoreData({
                      ...storeData,
                      email:
                        e.target
                          .value,
                    })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>

              <button
                onClick={
                  saveProfile
                }
                className="
                  w-full
                  h-14
                  rounded-2xl
                  bg-slate-100
                  font-black
                "
              >
                SIMPAN PROFIL PRIBADI
              </button>

            </div>
          </div>

        </div>
      </div>
    </SellerLayout>
  );
}

export default StoreProfile;