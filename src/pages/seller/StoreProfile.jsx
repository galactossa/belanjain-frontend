// src/pages/seller/StoreProfile.jsx

import { useState, useEffect, useMemo } from "react";
import { Camera, Trash2, Save, Bell, Search } from "lucide-react";
import SellerLayout from "../../layouts/SellerLayout";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

function StoreProfile() {
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [store, setStore] = useState(null);
  const [banner, setBanner] = useState("");
  const [logo, setLogo] = useState("");
  const [storeData, setStoreData] = useState({
    storeName: "",
    category: "",
    description: "",
    policy: "",
    address: "",
    owner: "",
    email: "",
  });

  // ================= 🔥 PERBAIKAN: Ambil userId dengan benar =================
  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    setCurrentUser(user);
    return user;
  };

  useEffect(() => {
    const fetchStore = async () => {
      const user = getUser();

      // 🔥 Cek userId
      const userId = user?.id_pengguna || user?.id;

      if (!userId) {
        console.error("❌ User ID not found");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching store for user ID:", userId);

      try {
        // 🔥 Ambil data toko berdasarkan user ID
        const response = await api.get(`/toko/user/${userId}`);
        console.log("✅ Store data:", response.data);

        const storeData = response.data.data;
        setStore(storeData);
        setBanner(storeData.banner_toko || "");
        setLogo(storeData.logo_toko || "");

        // 🔥 Update currentUser dengan id_toko
        const updatedUser = {
          ...user,
          id_toko: storeData.id_toko,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        setStoreData({
          storeName: storeData.nama_toko || "",
          category: storeData.kategori || "",
          description: storeData.deskripsi || "",
          policy: storeData.kebijakan || "",
          address: storeData.alamat || "",
          owner: user.nama || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("❌ Error fetching store:", error);
        if (error.response?.status === 404) {
          alert("Anda belum memiliki toko. Silakan buka toko terlebih dahulu.");
        } else {
          alert(error.response?.data?.message || "Gagal mengambil data toko");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, []);

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("banner", file);

    try {
      const response = await api.post(
        `/toko/${store.id_toko}/upload-banner`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setBanner(response.data.data.banner_toko);
      alert("✅ Banner berhasil diupload!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert(error.response?.data?.message || "Gagal upload banner");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await api.post(
        `/toko/${store.id_toko}/upload-logo`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setLogo(response.data.data.logo_toko);
      alert("✅ Logo berhasil diupload!");
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert(error.response?.data?.message || "Gagal upload logo");
    }
  };

  // ================= 🔥 PERBAIKAN: Save Profile =================
  const saveProfile = async () => {
    if (!store?.id_toko) {
      alert("Toko tidak ditemukan. Silakan buka toko terlebih dahulu.");
      return;
    }

    try {
      // 🔥 Hanya kirim field yang diterima backend
      const payload = {
        nama_toko: storeData.storeName,
        deskripsi: storeData.description,
        // 🔥 Backend tidak menerima alamat, category, policy, owner, email
      };

      console.log("📡 Sending update payload:", payload);

      const response = await api.put(`/toko/${store.id_toko}`, payload);
      console.log("✅ Store updated:", response.data);

      alert("✅ Profil toko berhasil disimpan!");

      // Refresh data
      const refreshResponse = await api.get(
        `/toko/user/${currentUser.id_pengguna || currentUser.id}`,
      );
      const freshData = refreshResponse.data.data;
      setStore(freshData);
      setBanner(freshData.banner_toko || "");
      setLogo(freshData.logo_toko || "");
      setStoreData({
        storeName: freshData.nama_toko || "",
        category: freshData.kategori || "",
        description: freshData.deskripsi || "",
        policy: freshData.kebijakan || "",
        address: freshData.alamat || "",
        owner: currentUser?.nama || "",
        email: currentUser?.email || "",
      });
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      alert(error.response?.data?.message || "Gagal simpan profil");
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[25px] font-black uppercase text-slate-900 leading-none">
              Profil Toko
            </h1>
            <p className="text-xs uppercase tracking-[1.5px] font-black text-slate-400 mt-1.5">
              Kelola informasi toko anda
            </p>
          </div>
          <button
            onClick={saveProfile}
            className="h-11 px-6 rounded-2xl bg-blue-600 text-white font-black text-sm shadow-xl hover:bg-blue-700"
          >
            SIMPAN PERUBAHAN
          </button>
        </div>

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
            <div className="absolute bottom-5 right-5 flex gap-3 z-20">
              <label className="h-11 px-5 rounded-xl bg-white flex items-center font-bold cursor-pointer shadow">
                Ganti Banner
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
              </label>
              {banner && (
                <button
                  onClick={() => setBanner("")}
                  className="h-11 px-5 rounded-xl bg-red-500 text-white font-bold flex items-center gap-2"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              )}
            </div>
          </div>

          <div className="px-8 pb-8 relative">
            <div className="relative w-fit -mt-16 group">
              <img
                src={logo || "https://ui-avatars.com/api/?name=Toko"}
                alt=""
                className="w-32 h-32 rounded-3xl object-cover border-[5px] border-white bg-white shadow-lg"
              />
              <label className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 duration-300 cursor-pointer flex items-center justify-center">
                <div className="flex flex-col items-center text-white">
                  <Camera size={26} />
                  <span className="text-xs font-bold mt-1">Ubah Foto</span>
                </div>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-black text-slate-900">
                {storeData.storeName}
              </h1>
              <p className="text-blue-600 font-bold uppercase mt-1">
                {storeData.category || "Toko"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-7 rounded-[35px] border border-slate-200 shadow-sm">
            <h2 className="text-[22px] font-black">Detail Profil Toko</h2>
            <div className="space-y-6 mt-8">
              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Nama Toko *
                </label>
                <input
                  type="text"
                  value={storeData.storeName}
                  onChange={(e) =>
                    setStoreData({ ...storeData, storeName: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>
              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Deskripsi Toko
                </label>
                <textarea
                  rows={4}
                  value={storeData.description}
                  onChange={(e) =>
                    setStoreData({ ...storeData, description: e.target.value })
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
                  value={storeData.address}
                  onChange={(e) =>
                    setStoreData({ ...storeData, address: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
                <p className="text-xs text-slate-400 mt-2">
                  ⚠️ Alamat belum tersimpan di database. Akan ditambahkan nanti.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-[35px] border border-slate-200 shadow-sm">
            <h2 className="text-[22px] font-black">Kepemilikan Pribadi</h2>
            <div className="space-y-6 mt-8">
              <div>
                <label className="block mb-2 text-[11px] font-black uppercase tracking-[2px] text-slate-500">
                  Nama Pemilik *
                </label>
                <input
                  type="text"
                  value={storeData.owner}
                  onChange={(e) =>
                    setStoreData({ ...storeData, owner: e.target.value })
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
                  value={storeData.email}
                  onChange={(e) =>
                    setStoreData({ ...storeData, email: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl border border-slate-200 px-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default StoreProfile;
