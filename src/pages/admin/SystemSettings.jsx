import { Search, Bell, ShieldCheck, ShoppingCart, User } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalNotfications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

// STATIC - karena belum ada API untuk chat count
const CHAT_COUNT = 5;

function SystemSettings() {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifikasi");
        const data = (response.data.data || []).map((n) => ({
          ...n,
          read: n.sudah_dibaca || false,
          time: n.created_at
            ? new Date(n.created_at).toLocaleString()
            : "Baru saja",
          message: n.pesan || n.judul,
        }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [articles, setArticles] = useState([
    {
      id: "FAQ-001",
      tag: "PENJUAL",
      title: "Cara mendaftar akun penjual baru",
      description:
        "Masuk ke menu akun, lalu ketuk tombol 'Buka Toko'. Isi formulir legalitas nama toko, detail alamat pengiriman, dan rekening bank Anda.",
    },
    {
      id: "FAQ-002",
      tag: "PEMBELI",
      title: "Metode pembayaran resmi di BelanjaIn",
      description:
        "Belanjain mendukung pembayaran kartu kredit, virtual account bank transfer, saldo Dompet BelanjIn, serta pembayaran instan QRIS.",
    },
    {
      id: "FAQ-003",
      tag: "PENJUAL",
      title: "Sistem pencairan saldo penghasilan",
      description:
        "Penjual dapat mencairkan dana setelah status transaksi selesai oleh pembeli. Proses pencairan memakan waktu maksimal 1x24 jam kerja.",
    },
  ]);

  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleDescription, setNewArticleDescription] = useState("");
  const [newArticleTag, setNewArticleTag] = useState("PENJUAL");

  const handleSave = () => {
    alert("Pengaturan berhasil disimpan!");
  };

  const handleAddArticle = () => {
    if (!newArticleTitle.trim() || !newArticleDescription.trim()) return;
    const newArticle = {
      id: `FAQ-${String(articles.length + 1).padStart(3, "0")}`,
      tag: newArticleTag,
      title: newArticleTitle,
      description: newArticleDescription,
    };
    setArticles([newArticle, ...articles]);
    setNewArticleTitle("");
    setNewArticleDescription("");
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[46px] font-black text-[#071437] leading-none">
            System Settings
          </h1>
          <p className="text-[#64748B] text-[17px] font-semibold mt-3">
            Atur informasi platform, kebijakan, dan konfigurasi utama BelanjaIn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 shadow-sm h-11 w-[280px] rounded-2xl px-3 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari pengaturan..."
              className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
            />
          </div>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(true)}
              className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
            >
              <Bell size={16} className="text-slate-600" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </button>
            <ModalNotfications
              open={showNotif}
              onClose={() => setShowNotif(false)}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm">
              <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                Identitas Platform
              </h2>
              <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                Logo dan aset visual utama BelanjaIn
              </p>
              <div className="mt-8 bg-[#F8FAFC] border border-[#EEF2F7] rounded-[28px] p-6 flex items-center gap-5">
                <div className="w-[82px] h-[82px] rounded-[24px] bg-white border border-[#EEF2F7] flex items-center justify-center shadow-sm">
                  <ShoppingCart size={44} className="text-[#FF9800]" />
                </div>
                <div>
                  <p className="text-[#2563FF] text-sm font-black uppercase tracking-wide">
                    Preview Logo
                  </p>
                  <p className="text-[#64748B] text-sm mt-2 font-semibold break-all">
                    URL: https://cdn-icons-png.flaticon.com/512/3643/3643914.png
                  </p>
                </div>
              </div>
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

            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm">
              <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                Kontak & Perusahaan
              </h2>
              <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                Informasi resmi layanan pelanggan
              </p>
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

          <div>
            <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm h-full flex flex-col">
              <div>
                <h2 className="text-[30px] font-black text-[#071437] uppercase leading-none">
                  Tentang & Syarat Pengguna
                </h2>
                <p className="text-[#94A3B8] font-black uppercase tracking-wide mt-3 text-sm">
                  Teks legal yang ditayangkan di platform
                </p>
              </div>
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
              <div className="mt-auto pt-10 flex justify-end">
                <button
                  onClick={handleSave}
                  className="h-[70px] px-10 rounded-[24px] bg-[#2563FF] text-white font-black text-[16px] tracking-wide flex items-center gap-4 shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <ShieldCheck size={22} /> SIMPAN PENGATURAN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-[38px] border border-[#E7ECF3] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[28px] font-black text-[#071437]">
                PUSAT BANTUAN TERINTEGRASI (CS & FAQ)
              </h2>
              <p className="text-[#94A3B8] text-sm font-black uppercase tracking-wider mt-2">
                Konfigurasi FAQ dan bantuan pelanggan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-4">
              <h3 className="font-black text-[#071437] mb-5">
                SALURAN KONTAK DUKUNGAN
              </h3>
              <div className="space-y-5">
                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[2px] text-slate-500 mb-3">
                    EMAIL LAYANAN PELANGGAN
                  </p>
                  <p className="text-sm text-[#071437] font-semibold">
                    support@belanjain.com
                  </p>
                </div>
                <div className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[2px] text-slate-500 mb-3">
                    WHATSAPP BUSINESS / HOTLINE
                  </p>
                  <p className="text-sm text-[#071437] font-semibold">
                    +62 821-2233-4455
                  </p>
                </div>
                <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[2px] text-slate-500 mb-3">
                    INTEGRASI PENGGUNA
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-[20px] bg-[#F8FAFC] px-4 py-4">
                      <span className="text-sm text-[#64748B]">
                        SESI BANTUAN PENJUAL:
                      </span>
                      <span className="font-black">1 AKTIF</span>
                    </div>
                    <div className="flex items-center justify-between rounded-[20px] bg-[#F8FAFC] px-4 py-4">
                      <span className="text-sm text-[#64748B]">
                        SESI BANTUAN PEMBELI:
                      </span>
                      <span className="font-black">2 AKTIF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-black text-[#071437] mb-2">
                    DAFTAR FAQ & ARTIKEL BANTUAN
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Kelola tutorial yang diterbitkan untuk pembeli & penjual.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/chat-seller")}
                  className="h-[58px] px-6 rounded-[18px] bg-[#EEF4FF] text-[#2563FF] font-black hover:bg-[#e0ecff] transition"
                >
                  BUKA SESI CHAT PELAYANAN ({CHAT_COUNT})
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-[24px] border border-[#E7ECF3] bg-[#F8FAFC] p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-[11px] font-black uppercase tracking-[2px] text-[#2563FF] bg-white rounded-full px-3 py-1">
                        {article.tag}
                      </span>
                      <span className="text-xs text-[#64748B] font-semibold">
                        {article.id}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-[#071437] mb-3">
                      {article.title}
                    </h4>
                    <p className="text-sm text-[#475569] leading-7">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-[#E7ECF3] bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                  <input
                    value={newArticleTitle}
                    onChange={(e) => setNewArticleTitle(e.target.value)}
                    placeholder="Judul Artikel FAQ..."
                    className="h-[64px] rounded-[20px] border border-[#E2E8F0] px-5 outline-none text-sm text-[#071437]"
                  />
                  <select
                    value={newArticleTag}
                    onChange={(e) => setNewArticleTag(e.target.value)}
                    className="h-[64px] rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-sm text-[#071437] outline-none"
                  >
                    <option value="PENJUAL">Penjual</option>
                    <option value="PEMBELI">Pembeli</option>
                  </select>
                </div>
                <textarea
                  value={newArticleDescription}
                  onChange={(e) => setNewArticleDescription(e.target.value)}
                  placeholder="Ketik konten penjelasan FAQ di sini..."
                  rows={4}
                  className="mt-4 w-full rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 text-sm text-[#071437] outline-none resize-none"
                />
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleAddArticle}
                    className="h-[64px] px-8 rounded-[20px] bg-[#071437] text-white font-black hover:bg-[#0b1144] transition"
                  >
                    TAMBAH FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SystemSettings;
