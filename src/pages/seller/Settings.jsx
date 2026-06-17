import {
  Bell,
  Lock,
  User,
  Store,
  ShieldCheck,
  Save,
  Image,
  ChevronRight,
  Award,
  Wallet,
  Gift,
  ArrowLeft,
  MapPin,
  Pencil,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useState } from "react";
import ModalNotifications from "../../components/seller/ModalNotifications";
import { notifications as defaultNotifications } from "../../data/notifications";
function SettingsSeller() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en",
  );
  const [showNotif, setShowNotif] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const sellerNotifications =
    JSON.parse(localStorage.getItem(`sellerNotifications_${currentUser.id}`)) ??
    defaultNotifications.filter((notif) => notif.sellerId === currentUser?.id);

  return (
    <SellerLayout>
      <div className="w-full min-h-screen bg-[#f6f8fc] p-8">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="
              text-[25px]
              font-black
              uppercase
              text-slate-900
              leading-none
            "
            >
              Pengaturan
            </h1>

            <p
              className="
              text-slate-400
              text-sm
              mt-2
              uppercase
              tracking-[2px]
              font-black
            "
            >
              Kelola profil toko anda
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div
              className="
      h-12
      w-[280px]
      rounded-2xl
      bg-white
      border
      border-slate-200
      px-4
      flex
      items-center
      gap-3
      shadow-sm
    "
            >
              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                className="
        bg-transparent
        outline-none
        w-full
        text-sm
        font-semibold
        placeholder:text-slate-400
      "
              />
            </div>

            {/* NOTIFICATION */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="
        relative
        w-12
        h-12
        rounded-2xl
        bg-white
        border
        border-slate-200
        flex
        items-center
        justify-center
        shadow-sm
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
          font-bold
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

            {/* ADD PRODUCT */}
            <button
              className="
      h-12
      px-6
      rounded-2xl
      bg-blue-600
      text-white
      font-black
      text-sm
      shadow-lg
      hover:bg-blue-700
      duration-300
    "
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 space-y-6">
          {/* HERO CARD */}
          <div
            className="
      bg-white
      rounded-[32px]
      border
      border-slate-200
      p-8
      shadow-sm
      flex
      items-center
      justify-between
    "
          >
            <div>
              <h2 className="text-3xl font-black text-slate-900">Pengaturan</h2>

              <p
                className="
          text-slate-400
          uppercase
          tracking-[2px]
          text-sm
          font-bold
          mt-2
        "
              >
                Atur bahasa preferensi, sistem notifikasi, logo aplikasi dan
                konfigurasi keamanan
              </p>
            </div>

            <button
              className="
        h-12
        px-6
        rounded-2xl
        border
        border-blue-500
        text-blue-600
        font-black
        text-sm
      "
            >
              ACTIVE SETTINGS
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-6">
            {/* BAHASA */}
            <div
              className="
        bg-white
        rounded-[30px]
        border
        border-slate-200
        p-8
        shadow-sm
      "
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="
            w-12
            h-12
            rounded-2xl
            bg-blue-100
            flex
            items-center
            justify-center
          "
                >
                  🌐
                </div>

                <div>
                  <h3 className="font-black text-xl">Pilihan Bahasa</h3>

                  <p className="text-slate-400 text-xs uppercase font-bold">
                    Pilih bahasa interface platform
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setLanguage("id");
                    localStorage.setItem("language", "id");
                  }}
                  className={`
      w-full
      h-14
      rounded-2xl
      px-5
      text-left
      font-bold
      transition-all
      ${
        language === "id"
          ? "border-2 border-blue-500 text-blue-600"
          : "border border-slate-200"
      }
    `}
                >
                  Bahasa Indonesia
                </button>

                <button
                  onClick={() => {
                    setLanguage("en");
                    localStorage.setItem("language", "en");
                  }}
                  className={`
      w-full
      h-14
      rounded-2xl
      px-5
      text-left
      font-bold
      flex
      items-center
      justify-between
      transition-all
      ${
        language === "en"
          ? "border-2 border-blue-500 text-blue-600"
          : "border border-slate-200"
      }
    `}
                >
                  English
                  {language === "en" && <span>✓</span>}
                </button>
              </div>
            </div>

            {/* LOGO */}
            <div
              className="
        bg-white
        rounded-[30px]
        border
        border-slate-200
        p-8
        shadow-sm
      "
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="
            w-12
            h-12
            rounded-2xl
            bg-pink-100
            flex
            items-center
            justify-center
          "
                >
                  <Image size={20} className="text-pink-500" />
                </div>

                <div>
                  <h3 className="font-black text-xl">
                    Logo Aplikasi & Branding
                  </h3>

                  <p className="text-slate-400 text-xs uppercase font-bold">
                    Ubah visual brand utama
                  </p>
                </div>
              </div>

              <label
                className="
          text-xs
          font-black
          uppercase
          text-slate-500
        "
              >
                URL Logo Baru
              </label>

              <input
                type="text"
                className="
          w-full
          mt-2
          h-14
          rounded-2xl
          border
          border-slate-200
          px-4
          outline-none
        "
                placeholder="Masukkan URL logo"
              />

              <p className="text-xs text-slate-400 mt-3">
                Logo akan diperbarui setelah direfresh.
              </p>
            </div>

            {/* NOTIFIKASI */}
            <div
              className="
        bg-white
        rounded-[30px]
        border
        border-slate-200
        p-8
        shadow-sm
      "
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="
            w-12
            h-12
            rounded-2xl
            bg-green-100
            flex
            items-center
            justify-center
          "
                >
                  <Bell size={20} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-black text-xl">
                    Notifikasi Saluran Toko
                  </h3>

                  <p className="text-slate-400 text-xs uppercase font-bold">
                    Atur saluran pesan otomatis
                  </p>
                </div>
              </div>

              <div className="space-y-7">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black">Notifikasi Order Masuk</h4>

                    <p className="text-sm text-slate-400">
                      Dapatkan alert saat order masuk
                    </p>
                  </div>

                  <input type="checkbox" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black">Notifikasi Ulasan</h4>

                    <p className="text-sm text-slate-400">
                      Saat pembeli memberi review
                    </p>
                  </div>

                  <input type="checkbox" defaultChecked />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black">Stok Menipis</h4>

                    <p className="text-sm text-slate-400">
                      Alert saat stok hampir habis
                    </p>
                  </div>

                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>

            {/* KEAMANAN */}
            <div
              className="
        bg-white
        rounded-[30px]
        border
        border-slate-200
        p-8
        shadow-sm
      "
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="
            w-12
            h-12
            rounded-2xl
            bg-orange-100
            flex
            items-center
            justify-center
          "
                >
                  <ShieldCheck size={20} className="text-orange-500" />
                </div>

                <div>
                  <h3 className="font-black text-xl">
                    Sistem Kredensial Keamanan
                  </h3>

                  <p className="text-slate-400 text-xs uppercase font-bold">
                    Konfigurasi keamanan akun
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black">Verifikasi Dua Langkah</h4>

                    <p className="text-sm text-slate-400">
                      Aktifkan autentikasi 2FA
                    </p>
                  </div>

                  <input type="checkbox" />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-black">Enkripsi Data Saldo</h4>

                    <p className="text-sm text-slate-400">
                      Lindungi saldo dengan SHA-256
                    </p>
                  </div>

                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default SettingsSeller;
