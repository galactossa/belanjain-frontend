/* ================= IMPORT ================= */
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
import { notifications as defaultNotifications } from "../../data/notifications";
import { vouchers as vouchersData } from "../../data/vouchers";

function Vouchers() {
  /* ================= DATA ================= */
  const [vouchers, setVouchers] = useState(() => {
    const stored = localStorage.getItem("vouchers_global");

    return stored ? JSON.parse(stored) : vouchersData;
  });

  const saveVouchers = (updated) => {
    setVouchers(updated);
    localStorage.setItem("vouchers_global", JSON.stringify(updated));
  };

  // Validate image URL
  const isValidImageUrl = (url) => {
    return url && typeof url === "string" && url.trim().length > 0;
  };

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  const [filteredVouchers, setFilteredVouchers] = useState(vouchers);

  /* ================= FORM MODAL ================= */
  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  /* ================= DELETE MODAL ================= */
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    code: "",
    title: "",
    desc: "",
    discountType: "percent",
    discount: "",
    pointCost: "",
    minimum: "",
    expiredAt: "",
    image: "",
  });

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((notif) => ({
        ...notif,
        time: notif.time || "Baru saja",
        read: false,
        message: notif.message || notif.title,
      })),
  );

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    const result = vouchers.filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.desc || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredVouchers(result);
  }, [search, vouchers]);

  /* ================= NOTIFICATION ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif,
      ),
    );
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  /* ================= ADD ================= */
  const openAddModal = () => {
    setIsEdit(false);

    setForm({
      code: "",
      title: "",
      desc: "",
      discountType: "percent",
      discount: "",
      pointCost: "",
      minimum: "",
      expiredAt: "",
      image: "",
    });

    setShowModal(true);
  };

  /* ================= EDIT ================= */
  const openEditModal = (item) => {
    setIsEdit(true);

    setSelectedId(item.id);

    setForm({
      code: item.code,
      title: item.title || "",
      desc: item.desc || "",
      discountType: item.discountPercent ? "percent" : "amount",
      discount: item.discountPercent || item.discountAmount || "",
      pointCost: item.pointCost || "",
      minimum: item.minPurchase || "",
      expiredAt: item.expiredAt || item.exp || "",
      image: item.image || "",
    });

    setShowModal(true);
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    const notification = {
      id: Date.now(),
      message: `Voucher "${form.code.toUpperCase()}" berhasil ${isEdit ? "diperbarui" : "dibuat"}`,
      time: "Baru saja",
      read: false,
    };

    if (isEdit) {
      const updated = vouchers.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              code: form.code.toUpperCase(),
              title: form.title || form.code,
              desc: form.desc,
              pointCost: Number(form.pointCost || 0),
              minPurchase: Number(form.minimum || 0),
              expiredAt: form.expiredAt,
              exp: form.expiredAt,
              image: form.image,
              discountPercent:
                form.discountType === "percent"
                  ? Number(form.discount || 0)
                  : undefined,
              discountAmount:
                form.discountType === "amount"
                  ? Number(form.discount || 0)
                  : undefined,
            }
          : item,
      );

      saveVouchers(updated);
      setNotifications((prev) => [notification, ...prev]);
    } else {
      const newVoucher = {
        id: Date.now(),
        code: form.code.toUpperCase(),
        title: form.title || form.code,
        desc: form.desc,
        pointCost: Number(form.pointCost || 0),
        minPurchase: Number(form.minimum || 0),
        expiredAt: form.expiredAt,
        exp: form.expiredAt,
        image: form.image,
        discountPercent:
          form.discountType === "percent"
            ? Number(form.discount || 0)
            : undefined,
        discountAmount:
          form.discountType === "amount"
            ? Number(form.discount || 0)
            : undefined,
      };

      saveVouchers([...vouchers, newVoucher]);
      setNotifications((prev) => [notification, ...prev]);
    }

    setShowModal(false);
  };

  /* ================= OPEN DELETE ================= */
  const openDeleteModal = (id) => {
    setDeleteId(id);

    setShowDeleteModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = () => {
    saveVouchers(vouchers.filter((item) => item.id !== deleteId));

    setShowDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">
        {/* ================= FORM MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />

            {/* BOX */}
            <div className="w-[620px] bg-white rounded-[42px] shadow-2xl relative z-10 overflow-hidden">
              {/* HEADER */}
              <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                    <Tag size={26} />
                  </div>

                  <h2 className="text-[28px] font-black text-slate-900 uppercase">
                    {isEdit ? "EDIT VOUCHER" : "BUAT VOUCHER GLOBAL"}
                  </h2>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-8 space-y-7 overflow-y-auto max-h-[70vh]">
                {/* CODE */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    KODE VOUCHER
                  </p>

                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        code: e.target.value,
                      })
                    }
                    placeholder="CONTOH : HEMAT10"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>

                {/* TITLE */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    JUDUL VOUCHER
                  </p>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="Contoh : Diskon Belanja 10%"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    DESKRIPSI VOUCHER
                  </p>

                  <textarea
                    value={form.desc}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        desc: e.target.value,
                      })
                    }
                    placeholder="Contoh : Potongan langsung untuk pembelian minimal 200 ribu"
                    className="w-full min-h-[100px] rounded-2xl border border-slate-200 px-5 py-4 outline-none font-medium resize-none"
                  />
                </div>

                {/* DISCOUNT */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                      TIPE DISKON
                    </p>

                    <select
                      className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                      value={form.discountType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discountType: e.target.value,
                        })
                      }
                    >
                      <option value="percent">Persentase (%)</option>
                      <option value="amount">Potongan Harga</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                      NILAI
                    </p>

                    <input
                      type="text"
                      value={form.discount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          discount: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                    />
                  </div>
                </div>

                {/* MINIMUM */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    MIN.PEMBELIAN (RP)
                  </p>

                  <input
                    type="text"
                    value={form.minimum}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minimum: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>

                {/* DATE */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    TANGGAL KADALUARSA
                  </p>

                  <input
                    type="date"
                    value={form.expiredAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expiredAt: e.target.value,
                      })
                    }
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    UNGGAH GAMBAR POSTER PROMO / BANNER
                  </p>

                  <div className="border-2 border-dashed border-slate-200 rounded-[26px] p-8 text-center">
                    <ImagePlus size={42} className="mx-auto text-slate-400" />

                    <p className="mt-4 text-blue-600 font-black text-sm">
                      PILIH FILE GAMBAR
                    </p>

                    <p className="text-slate-400 text-xs font-bold mt-1">
                      PNG, JPG ATAU GIF HINGGA 5MB
                    </p>

                    <button
                      type="button"
                      onClick={openImagePicker}
                      className="mt-5 w-full h-14 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50"
                    >
                      Buka Folder dan Pilih Gambar
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image: e.target.value,
                        })
                      }
                      placeholder="Contoh: https://images.unsplash.com/..."
                      className="w-full mt-5 h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                    />

                    {isValidImageUrl(form.image) && (
                      <img
                        src={form.image}
                        alt="preview voucher"
                        className="mx-auto mt-5 w-full max-h-48 object-cover rounded-3xl"
                      />
                    )}
                  </div>
                </div>

                {/* BUTTON */}
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

        {/* ================= DELETE MODAL ================= */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />

            {/* BOX */}
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] p-10 shadow-2xl text-center">
              {/* ICON */}
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={38} className="text-red-500" />
              </div>

              {/* TITLE */}
              <h2 className="mt-7 text-[38px] font-black text-[#0F172A] leading-none">
                Hapus Voucher
              </h2>

              {/* DESC */}
              <p className="mt-5 text-[18px] text-slate-500 font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus voucher ini?
              </p>

              {/* BUTTON */}
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

        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between">
          {/* LEFT */}
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Vouchers
            </h1>

            <p className="text-[#64748B] mt-3 text-[13px] font-semibold">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] duration-300 text-white h-11 px-4 rounded-2xl font-black tracking-wide flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              TAMBAH VOUCHER
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

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 gap-8 mt-10">
          {filteredVouchers.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E2E8F0] rounded-[28px] overflow-hidden shadow-sm hover:shadow-lg duration-300 flex"
            >
              {/* IMAGE */}
              <div className="relative w-[180px] h-[180px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.code}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">
                  GLOBAL
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-black text-[#0F172A] uppercase leading-tight">
                      {item.code}
                    </h2>
                  </div>

                  <h3 className="mt-3 text-[#2563EB] text-[16px] font-black tracking-wide uppercase">
                    {item.title ||
                      (item.discountPercent
                        ? `Diskon ${item.discountPercent}%`
                        : item.discountAmount
                          ? `Potongan Rp ${item.discountAmount.toLocaleString("id-ID")}`
                          : "")}
                  </h3>

                  <p className="mt-2 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    {item.desc || "Voucher global untuk pelanggan"}
                  </p>

                  <p className="mt-2 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    Min. Belanja Rp{" "}
                    {Number(item.minPurchase || 0).toLocaleString("id-ID")}
                  </p>

                  <p className="mt-1 text-[#64748B] text-[13px] font-semibold tracking-wide">
                    Berlaku s/d {item.expiredAt || item.exp || "-"}
                  </p>
                </div>

                {/* ACTION */}
                <div className="border-t border-[#E2E8F0] mt-4 pt-3 flex justify-end gap-4">
                  {/* EDIT */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-2 text-[#64748B] hover:text-blue-600 duration-300 font-black uppercase tracking-wide text-[12px]"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => openDeleteModal(item.id)}
                    className="flex items-center gap-2 text-[#64748B] hover:text-red-500 duration-300 font-black uppercase tracking-wide text-[12px]"
                  >
                    <Trash2 size={14} />
                    Hapus
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
