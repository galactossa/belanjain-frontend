import {
  Search,
  Bell,
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  ImagePlus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotifications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const fileInputRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const [form, setForm] = useState({
    kode: "",
    title: "",
    deskripsi: "",
    tipe_diskon: "persen",
    nilai_diskon: "",
    pointCost: "",
    minimal_belanja: "",
    expiredAt: "",
    image: "",
  });

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
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/voucher");
        setVouchers(response.data.data || []);
        setFilteredVouchers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
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

  useEffect(() => {
    const result = vouchers.filter(
      (item) =>
        (item.kode || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.title || "").toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredVouchers(result);
  }, [search, vouchers]);

  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      kode: "",
      title: "",
      deskripsi: "",
      tipe_diskon: "persen",
      nilai_diskon: "",
      pointCost: "",
      minimal_belanja: "",
      expiredAt: "",
      image: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setSelectedId(item.id_voucher);
    setForm({
      kode: item.kode || "",
      title: item.title || "",
      deskripsi: item.deskripsi || "",
      tipe_diskon: item.tipe_diskon || "persen",
      nilai_diskon: item.nilai_diskon || "",
      pointCost: item.pointCost || "",
      minimal_belanja: item.minimal_belanja || "",
      expiredAt: item.berlaku_sampai || "",
      image: item.image || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        kode: form.kode.toUpperCase(),
        tipe_diskon: form.tipe_diskon,
        nilai_diskon: Number(form.nilai_diskon),
        minimal_belanja: Number(form.minimal_belanja) || 0,
        berlaku_dari: new Date().toISOString().split("T")[0],
        berlaku_sampai: form.expiredAt,
      };

      if (isEdit) {
        await api.put(`/voucher/${selectedId}`, payload);
      } else {
        await api.post("/voucher", payload);
      }

      const response = await api.get("/voucher");
      setVouchers(response.data.data || []);
      setFilteredVouchers(response.data.data || []);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving voucher:", error);
      alert(error.response?.data?.message || "Gagal menyimpan voucher");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/voucher/${deleteId}`);
      const response = await api.get("/voucher");
      setVouchers(response.data.data || []);
      setFilteredVouchers(response.data.data || []);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert(error.response?.data?.message || "Gagal menghapus voucher");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
            <div className="w-[620px] bg-white rounded-[42px] shadow-2xl relative z-10 overflow-hidden">
              <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <Tag size={26} />
                  </div>
                  <h2 className="text-[28px] font-black text-slate-900 uppercase">
                    {isEdit ? "EDIT VOUCHER" : "BUAT VOUCHER"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-7 overflow-y-auto max-h-[70vh]">
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    KODE VOUCHER
                  </p>
                  <input
                    type="text"
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    placeholder="CONTOH : HEMAT10"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    TIPE DISKON
                  </p>
                  <select
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                    value={form.tipe_diskon}
                    onChange={(e) =>
                      setForm({ ...form, tipe_diskon: e.target.value })
                    }
                  >
                    <option value="persen">Persentase (%)</option>
                    <option value="nominal">Potongan Harga (Rp)</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    NILAI DISKON
                  </p>
                  <input
                    type="number"
                    value={form.nilai_diskon}
                    onChange={(e) =>
                      setForm({ ...form, nilai_diskon: e.target.value })
                    }
                    placeholder="0"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    MIN. PEMBELIAN (RP)
                  </p>
                  <input
                    type="number"
                    value={form.minimal_belanja}
                    onChange={(e) =>
                      setForm({ ...form, minimal_belanja: e.target.value })
                    }
                    placeholder="0"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    TANGGAL KADALUARSA
                  </p>
                  <input
                    type="date"
                    value={form.expiredAt}
                    onChange={(e) =>
                      setForm({ ...form, expiredAt: e.target.value })
                    }
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full h-16 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] duration-300 text-white font-black tracking-[2px] shadow-xl shadow-blue-200"
                >
                  SIMPAN VOUCHER
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] p-10 shadow-2xl text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={38} className="text-red-500" />
              </div>
              <h2 className="mt-7 text-[38px] font-black text-[#0F172A] leading-none">
                Hapus Voucher
              </h2>
              <p className="mt-5 text-[18px] text-slate-500 font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus voucher ini?
              </p>
              <div className="flex gap-5 mt-10">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-16 rounded-[20px] bg-slate-100 hover:bg-slate-200 duration-300 text-slate-500 font-black tracking-[2px]"
                >
                  BATAL
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 h-16 rounded-[20px] bg-[#FF004D] hover:bg-[#e00045] duration-300 text-white font-black tracking-[2px] shadow-xl shadow-pink-200"
                >
                  HAPUS
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Vouchers
            </h1>
            <p className="text-[#64748B] mt-3 text-[13px] font-semibold">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] duration-300 text-white h-11 px-4 rounded-2xl font-black tracking-wide flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} /> TAMBAH VOUCHER
            </button>
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[280px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari voucher..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>
              {showNotif && (
                <ModalNotifications
                  open={showNotif}
                  onClose={() => setShowNotif(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-10">
          {filteredVouchers.map((item) => (
            <div
              key={item.id_voucher}
              className="bg-white border border-[#E2E8F0] rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg duration-300 flex"
            >
              <div className="relative w-[180px] h-[180px] overflow-hidden">
                <img
                  src={item.image || "https://via.placeholder.com/180"}
                  alt={item.kode}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">
                  GLOBAL
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-[20px] font-black text-[#0F172A] uppercase leading-tight">
                    {item.kode}
                  </h2>
                  <p className="mt-2 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    {item.tipe_diskon === "persen"
                      ? `Diskon ${item.nilai_diskon}%`
                      : `Potongan Rp ${Number(item.nilai_diskon).toLocaleString("id-ID")}`}
                  </p>
                  <p className="mt-2 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    Min. Belanja Rp{" "}
                    {Number(item.minimal_belanja || 0).toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    Berlaku s/d {item.berlaku_sampai || "-"}
                  </p>
                </div>
                <div className="border-t border-[#E2E8F0] mt-4 pt-3 flex justify-end gap-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-2 text-[#64748B] hover:text-blue-600 duration-300 font-black uppercase tracking-wide text-[12px]"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item.id_voucher);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center gap-2 text-[#64748B] hover:text-red-500 duration-300 font-black uppercase tracking-wide text-[12px]"
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Vouchers;
