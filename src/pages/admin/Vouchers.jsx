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

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function Vouchers() {

  /* ================= DATA ================= */
  const [vouchers, setVouchers] =
    useState([
      {
        id: 1,
        code: "HEMAT10",
        discount: "DISKON 10%",
        minimum:
          "MIN. BELANJA: RP 50,000",
        expired: "EXP: 2026-12-31",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
      },
      {
        id: 2,
        code: "PROMO50K",
        discount:
          "POTONGAN RP 50,000",
        minimum:
          "MIN. BELANJA: RP 200,000",
        expired: "EXP: 2026-12-31",
        image:
          "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200",
      },
    ]);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  const [
    filteredVouchers,
    setFilteredVouchers,
  ] = useState(vouchers);

  /* ================= FORM MODAL ================= */
  const [showModal, setShowModal] =
    useState(false);

  const [isEdit, setIsEdit] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  /* ================= DELETE MODAL ================= */
  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    code: "",
    discount: "",
    minimum: "",
    expired: "",
    image: "",
  });

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'Voucher "HEMAT10" berhasil dibuat',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Voucher "PROMO50K" berhasil diperbarui',
        time: "5 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(
      event
    ) {

      if (
        notifRef.current &&
        !notifRef.current.contains(
          event.target
        )
      ) {
        setShowNotif(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {

    const result =
      vouchers.filter((item) =>
        item.code
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredVouchers(result);

  }, [search, vouchers]);

  /* ================= NOTIFICATION ================= */
  const unreadCount =
    notifications.filter(
      (notif) => !notif.read
    ).length;

  const markAsRead = (id) => {

    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif
      )
    );

  };

  const deleteNotif = (id) => {

    setNotifications(
      notifications.filter(
        (notif) =>
          notif.id !== id
      )
    );

  };

  /* ================= ADD ================= */
  const openAddModal = () => {

    setIsEdit(false);

    setForm({
      code: "",
      discount: "",
      minimum: "",
      expired: "",
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
      discount: item.discount,
      minimum: item.minimum,
      expired: item.expired,
      image: item.image,
    });

    setShowModal(true);

  };

  /* ================= SAVE ================= */
  const handleSave = () => {

    if (isEdit) {

      setVouchers(
        vouchers.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

    } else {

      const newVoucher = {
        id: Date.now(),
        ...form,
      };

      setVouchers([
        ...vouchers,
        newVoucher,
      ]);

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

    setVouchers(
      vouchers.filter(
        (item) =>
          item.id !== deleteId
      )
    );

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

                    {isEdit
                      ? "EDIT VOUCHER"
                      : "BUAT VOUCHER GLOBAL"}

                  </h2>

                </div>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-slate-400 hover:text-red-500 duration-300"
                >

                  <X size={24} />

                </button>

              </div>

              {/* BODY */}
              <div className="p-8 space-y-7">

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
                        code:
                          e.target.value,
                      })
                    }
                    placeholder="CONTOH : HEMAT10"
                    className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                  />

                </div>

                {/* DISCOUNT */}
                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">

                      TIPE DISKON

                    </p>

                    <select className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold">

                      <option>
                        Persentase (%)
                      </option>

                      <option>
                        Potongan Harga
                      </option>

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
                          discount:
                            e.target.value,
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
                        minimum:
                          e.target.value,
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
                    value={form.expired.replace(
                      "EXP: ",
                      ""
                    )}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expired: `EXP: ${e.target.value}`,
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

                    <ImagePlus
                      size={42}
                      className="mx-auto text-slate-400"
                    />

                    <p className="mt-4 text-blue-600 font-black text-sm">

                      PILIH FILE GAMBAR

                    </p>

                    <p className="text-slate-400 text-xs font-bold mt-1">

                      PNG, JPG ATAU GIF HINGGA 5MB

                    </p>

                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          image:
                            e.target.value,
                        })
                      }
                      placeholder="Contoh: https://images.unsplash.com/..."
                      className="w-full mt-5 h-14 rounded-2xl border border-slate-200 px-5 outline-none font-bold"
                    />

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

                <Trash2
                  size={38}
                  className="text-red-500"
                />

              </div>

              {/* TITLE */}
              <h2 className="mt-7 text-[38px] font-black text-[#0F172A] leading-none">

                Hapus Voucher

              </h2>

              {/* DESC */}
              <p className="mt-5 text-[18px] text-slate-500 font-semibold leading-relaxed">

                Apakah Anda yakin ingin
                menghapus voucher ini?

              </p>

              {/* BUTTON */}
              <div className="flex gap-5 mt-10">

                <button
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
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

            <h1 className="text-[48px] font-black text-[#0F172A] leading-none">

              Vouchers

            </h1>

            <p className="text-[#64748B] mt-3 text-[20px] font-semibold">

              Kelola sistem dan pantau aktivitas platform BelanjaIn.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <div className="bg-[#F1F5F9] border border-[#E2E8F0] h-14 w-[320px] rounded-2xl px-5 flex items-center">

              <Search
                size={20}
                className="text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="cari voucher..."
                className="w-full h-full bg-transparent outline-none px-3 text-slate-600 font-medium"
              />

            </div>

            {/* NOTIF */}
            <div
              className="relative"
              ref={notifRef}
            >

              <button
                onClick={() =>
                  setShowNotif(
                    !showNotif
                  )
                }
                className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 duration-300 relative"
              >

                <Bell
                  size={20}
                  className="text-slate-500"
                />

                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center">

                    {unreadCount}

                  </div>
                )}

              </button>

              {/* DROPDOWN */}
              {showNotif && (
                <div className="absolute top-20 right-0 w-[400px] bg-white rounded-[30px] border border-slate-200 shadow-2xl overflow-hidden z-50">

                  <div className="px-6 py-5 border-b border-slate-100">

                    <h2 className="text-xl font-black text-slate-900">

                      Notifikasi

                    </h2>

                  </div>

                  <div className="max-h-[380px] overflow-y-auto">

                    {notifications.map(
                      (notif) => (
                        <div
                          key={notif.id}
                          className={`px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 ${
                            !notif.read
                              ? "bg-blue-50/40"
                              : ""
                          }`}
                        >

                          <div
                            onClick={() =>
                              markAsRead(
                                notif.id
                              )
                            }
                            className="cursor-pointer"
                          >

                            <p className="font-bold text-slate-700">

                              {
                                notif.title
                              }

                            </p>

                            <p className="text-sm text-slate-400 mt-2">

                              {
                                notif.time
                              }

                            </p>

                          </div>

                          <button
                            onClick={() =>
                              deleteNotif(
                                notif.id
                              )
                            }
                            className="text-slate-300 hover:text-red-500 duration-300"
                          >

                            <Trash2
                              size={17}
                            />

                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ================= BUTTON ================= */}
        <div className="flex justify-end mt-10">

          <button
            onClick={openAddModal}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] duration-300 text-white h-16 px-10 rounded-[20px] font-black tracking-wide flex items-center gap-4 shadow-xl shadow-blue-200"
          >

            <Plus size={22} />

            BUAT VOUCHER GLOBAL

          </button>

        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-2 gap-8 mt-10">

          {filteredVouchers.map(
            (item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E2E8F0] rounded-[38px] overflow-hidden shadow-sm hover:shadow-lg duration-300 flex"
              >

                {/* IMAGE */}
                <div className="relative w-[240px] h-[250px] overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.code}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-5 left-5 bg-[#2563EB] text-white text-[12px] font-black px-4 py-1 rounded-full tracking-wider">

                    GLOBAL

                  </div>

                </div>

                {/* CONTENT */}
                <div className="flex-1 p-8 flex flex-col justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <h2 className="text-[36px] font-black text-[#0F172A] uppercase leading-none">

                        {item.code}

                      </h2>

                    </div>

                    <h3 className="mt-5 text-[#2563EB] text-[30px] font-black tracking-wide uppercase">

                      {
                        item.discount
                      }

                    </h3>

                    <p className="mt-4 text-[#94A3B8] text-[18px] font-black uppercase tracking-wide">

                      {
                        item.minimum
                      }

                    </p>

                    <p className="mt-2 text-[#94A3B8] text-[18px] font-black uppercase tracking-wide">

                      {
                        item.expired
                      }

                    </p>

                  </div>

                  {/* ACTION */}
                  <div className="border-t border-[#E2E8F0] mt-8 pt-6 flex justify-end gap-8">

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        openEditModal(
                          item
                        )
                      }
                      className="flex items-center gap-2 text-[#94A3B8] hover:text-blue-600 duration-300 font-black uppercase tracking-wide"
                    >

                      <Pencil
                        size={18}
                      />

                      Edit

                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        openDeleteModal(
                          item.id
                        )
                      }
                      className="flex items-center gap-2 text-[#94A3B8] hover:text-red-500 duration-300 font-black uppercase tracking-wide"
                    >

                      <Trash2
                        size={18}
                      />

                      Hapus

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default Vouchers;