import {
  Search,
  Bell,
  ShieldCheck,
  ShoppingCart,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

function SystemSettings() {
  const navigate = useNavigate();

  const handleSave = () => {
    alert("Pengaturan berhasil disimpan!");
  };

  return (
    <AdminLayout>

      {/* ================= TOPBAR ================= */}
      <div className="flex items-center justify-between mb-8">

        {/* LEFT */}
        <div>

          <h1 className="text-[46px] font-black text-[#071437] leading-none">
            System Settings
          </h1>

          <p className="text-[#64748B] text-[17px] font-semibold mt-3">
            Atur informasi platform, kebijakan, dan konfigurasi utama BelanjaIn.
          </p>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          {/* SEARCH */}
          <div className="w-[360px] h-[64px] rounded-[22px] border border-[#E5E7EB] bg-white px-6 flex items-center gap-4 shadow-sm">

            <Search
              size={22}
              className="text-[#94A3B8]"
            />

            <input
              type="text"
              placeholder="Cari pengaturan..."
              className="bg-transparent outline-none w-full text-[#071437] placeholder:text-[#94A3B8] text-[15px] font-semibold"
            />

          </div>

          {/* NOTIFICATION */}
          <button
            onClick={() => navigate("/admin/notifications")}
            className="w-[64px] h-[64px] rounded-[22px] border border-[#E5E7EB] bg-white flex items-center justify-center shadow-sm relative hover:bg-slate-50 transition-all"
          >

            <Bell
              size={24}
              className="text-[#64748B]"
            />

            <div className="absolute top-4 right-4 w-3 h-3 bg-[#FF1744] rounded-full border-2 border-white"></div>

          </button>

        </div>

      </div>

      {/* ================= PAGE ================= */}
      <div className="w-full">

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 gap-8">

          {/* ================= LEFT ================= */}
          <div className="space-y-8">

            {/* IDENTITAS */}
            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm">

              <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                Identitas Platform
              </h2>

              <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                Logo dan aset visual utama BelanjaIn
              </p>

              {/* PREVIEW */}
              <div className="mt-8 bg-[#F8FAFC] border border-[#EEF2F7] rounded-[28px] p-6 flex items-center gap-5">

                {/* LOGO */}
                <div className="w-[82px] h-[82px] rounded-[24px] bg-white border border-[#EEF2F7] flex items-center justify-center shadow-sm">

                  <ShoppingCart
                    size={44}
                    className="text-[#FF9800]"
                  />

                </div>

                {/* INFO */}
                <div>

                  <p className="text-[#2563FF] text-sm font-black uppercase tracking-wide">
                    Preview Logo
                  </p>

                  <p className="text-[#64748B] text-sm mt-2 font-semibold break-all">
                    URL: https://cdn-icons-png.flaticon.com/512/3643/3643914.png
                  </p>

                </div>

              </div>

              {/* INPUT */}
              <div className="mt-8">

                <label className="text-[#94A3B8] text-sm font-black uppercase tracking-wide">
                  URL Logo BelanjaIn
                </label>

                <input
                  type="text"
                  defaultValue="https://cdn-icons-png.flaticon.com/512/3643/3643914.png"
                  className="w-full mt-4 h-[68px] rounded-[22px] border border-[#DCE3EA] bg-[#F8FAFC] px-6 outline-none text-[#071437] font-semibold focus:border-[#2563FF]"
                />

              </div>

            </div>

            {/* KONTAK */}
            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm">

              <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                Kontak & Perusahaan
              </h2>

              <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                Informasi resmi layanan pelanggan
              </p>

              {/* PHONE */}
              <div className="mt-8">

                <label className="text-[#94A3B8] text-sm font-black uppercase tracking-wide">
                  Nomor Telepon Layanan
                </label>

                <input
                  type="text"
                  defaultValue="+62 812-3456-7890"
                  className="w-full mt-4 h-[68px] rounded-[22px] border border-[#DCE3EA] bg-[#F8FAFC] px-6 outline-none text-[#071437] font-semibold focus:border-[#2563FF]"
                />

              </div>

              {/* ADDRESS */}
              <div className="mt-8">

                <label className="text-[#94A3B8] text-sm font-black uppercase tracking-wide">
                  Alamat Kantor Pusat
                </label>

                <textarea
                  rows={3}
                  defaultValue="Gedung BelanjaIn Lt. 5, Jl. Juanda Raya No. 45, Jakarta Pusat"
                  className="w-full mt-4 rounded-[22px] border border-[#DCE3EA] bg-[#F8FAFC] px-6 py-5 outline-none text-[#071437] font-semibold resize-none focus:border-[#2563FF]"
                />

              </div>

            </div>

          </div>

          {/* ================= RIGHT ================= */}
          <div>

            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm h-full flex flex-col">

              {/* TITLE */}
              <div>

                <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                  Tentang & Syarat Pengguna
                </h2>

                <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                  Teks legal yang ditayangkan di platform
                </p>

              </div>

              {/* DESC */}
              <div className="mt-8">

                <label className="text-[#94A3B8] text-sm font-black uppercase tracking-wide">
                  Deskripsi Platform (Tentang Kami)
                </label>

                <textarea
                  rows={5}
                  defaultValue="BelanjaIn adalah platform e-commerce multi-vendor terpercaya yang menghubungkan penjual lokal dengan pembeli nasional."
                  className="w-full mt-4 rounded-[24px] border border-[#DCE3EA] bg-[#F8FAFC] px-6 py-5 outline-none text-[#071437] font-semibold resize-none leading-relaxed focus:border-[#2563FF]"
                />

              </div>

              {/* POLICY */}
              <div className="mt-8">

                <label className="text-[#94A3B8] text-sm font-black uppercase tracking-wide">
                  Syarat & Kebijakan Privasi
                </label>

                <textarea
                  rows={7}
                  defaultValue="Syarat dan Ketentuan penggunaan platform BelanjaIn. Segala data transaksi terekam secara aman."
                  className="w-full mt-4 rounded-[24px] border border-[#DCE3EA] bg-[#F8FAFC] px-6 py-5 outline-none text-[#071437] font-semibold resize-none leading-relaxed focus:border-[#2563FF]"
                />

              </div>

              {/* BUTTON */}
              <div className="mt-auto pt-10 flex justify-end">

                <button
                  onClick={handleSave}
                  className="h-[70px] px-10 rounded-[24px] bg-[#2563FF] text-white font-black text-[16px] tracking-wide flex items-center gap-4 shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >

                  <ShieldCheck size={22} />

                  SIMPAN PENGATURAN

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default SystemSettings;