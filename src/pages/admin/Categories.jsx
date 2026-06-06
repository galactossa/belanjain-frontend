/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  Plus,
  Trash2,
  Layers3,
  X,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function Categories() {

  /* ================= CATEGORY ================= */
  const [categories, setCategories] =
    useState([
      {
        id: 1,
        name: "ELEKTRONIK",
        total: 120,
      },
      {
        id: 2,
        name: "FASHION",
        total: 85,
      },
      {
        id: 3,
        name: "LAPTOP",
        total: 45,
      },
      {
        id: 4,
        name: "AUDIO",
        total: 30,
      },
    ]);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  const [filteredCategories, setFilteredCategories] =
    useState(categories);

  /* ================= ADD MODAL ================= */
  const [showAdd, setShowAdd] =
    useState(false);

  const [newCategory, setNewCategory] =
    useState("");

  /* ================= DELETE MODAL ================= */
  const [showDelete, setShowDelete] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] =
    useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title:
          'Kategori "ELEKTRONIK" berhasil ditambahkan',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Produk baru ditambahkan ke kategori FASHION',
        time: "5 menit lalu",
        read: false,
      },
      {
        id: 3,
        title:
          'Kategori AUDIO berhasil diperbarui',
        time: "20 menit lalu",
        read: false,
      },
    ]);

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {

    function handleClickOutside(event) {

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

    const result = categories.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

    setFilteredCategories(result);

  }, [search, categories]);

  /* ================= NOTIF FUNCTION ================= */
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

  const markAllRead = () => {

    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        read: true,
      }))
    );

  };

  /* ================= ADD CATEGORY ================= */
  const handleAddCategory = () => {

    if (!newCategory.trim()) return;

    const newData = {
      id: Date.now(),
      name: newCategory.toUpperCase(),
      total: 0,
    };

    setCategories([
      ...categories,
      newData,
    ]);

    setNotifications([
      {
        id: Date.now(),
        title: `Kategori "${newCategory}" berhasil ditambahkan`,
        time: "Baru saja",
        read: false,
      },
      ...notifications,
    ]);

    setNewCategory("");
    setShowAdd(false);

  };

  /* ================= DELETE CATEGORY ================= */
  const handleDeleteCategory = () => {

    setCategories(
      categories.filter(
        (item) =>
          item.id !==
          selectedCategory.id
      )
    );

    setShowDelete(false);

  };

  return (
    <AdminLayout>

      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">

        {/* ================= ADD MODAL ================= */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BLUR */}
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />

            {/* BOX */}
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] overflow-hidden shadow-[0_25px_80px_rgba(15,23,42,0.25)]">

              {/* TOP */}
              <div className="px-10 py-8 flex items-center justify-between border-b border-slate-100">

                <div className="flex items-center gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-[#2563FF] flex items-center justify-center">

                    <Layers3
                      size={28}
                      className="text-white"
                    />

                  </div>

                  <h1 className="text-[24px] font-black text-slate-900 uppercase">

                    Tambah Kategori

                  </h1>

                </div>

                {/* CLOSE */}
                <button
                  onClick={() =>
                    setShowAdd(false)
                  }
                  className="text-slate-400 hover:text-red-500 duration-300"
                >

                  <X size={32} />

                </button>

              </div>

              {/* BODY */}
              <div className="p-10">

                {/* LABEL */}
                <p className="text-slate-400 text-sm font-black tracking-wider uppercase mb-3">

                  Nama Kategori

                </p>

                {/* INPUT */}
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(
                      e.target.value
                    )
                  }
                  placeholder="Contoh : Elektronik"
                  className="w-full h-[58px] rounded-2xl border-2 border-[#2563FF] px-6 outline-none font-semibold text-slate-700"
                />

                {/* BUTTON */}
                <button
                  onClick={
                    handleAddCategory
                  }
                  className="w-full h-[60px] rounded-2xl bg-[#2563FF] hover:bg-[#1E4FE0] duration-300 text-white font-black tracking-[2px] shadow-[0_15px_35px_rgba(37,99,255,0.35)] mt-10"
                >

                  SIMPAN KATEGORI

                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= DELETE MODAL ================= */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BLUR */}
            <div className="absolute inset-0 bg-[#0f172a]/50 backdrop-blur-[8px]" />

            {/* BOX */}
            <div className="relative z-10 w-[480px] bg-white rounded-[40px] p-10 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">

              {/* ICON */}
              <div className="flex justify-center">

                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">

                  <Trash2 size={34} />

                </div>

              </div>

              {/* TEXT */}
              <div className="text-center mt-6">

                <h2 className="text-[38px] leading-none font-black text-slate-900">

                  Hapus Kategori

                </h2>

                <p className="text-slate-500 font-bold mt-4 text-[17px]">

                  Apakah Anda yakin ingin
                  menghapus kategori ini?

                </p>

              </div>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-4 mt-10">

                <button
                  onClick={() =>
                    setShowDelete(false)
                  }
                  className="h-[60px] rounded-2xl bg-slate-100 text-slate-500 font-black text-lg hover:bg-slate-200 duration-300"
                >

                  BATAL

                </button>

                <button
                  onClick={
                    handleDeleteCategory
                  }
                  className="h-[60px] rounded-2xl bg-[#ff004f] text-white font-black text-lg shadow-[0_10px_25px_rgba(255,0,79,0.35)] hover:scale-[1.03] duration-300"
                >

                  HAPUS

                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= TOP RIGHT ================= */}
        <div className="flex justify-end items-center gap-4">

          {/* SEARCH */}
          <div className="w-[320px] h-[58px] bg-[#F5F7FB] border border-[#E4E8F0] rounded-2xl px-5 flex items-center">

            <Search
              size={20}
              className="text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="cari kategori..."
              className="bg-transparent outline-none w-full h-full px-4 text-slate-600"
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
              className="w-[58px] h-[58px] rounded-2xl border border-[#E4E8F0] bg-[#F5F7FB] flex items-center justify-center hover:bg-slate-100 duration-300 relative"
            >

              <Bell
                size={21}
                className="text-slate-600"
              />

              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-pink-500 text-white text-[11px] font-black flex items-center justify-center">

                  {unreadCount}

                </div>
              )}

            </button>

            {/* ================= DROPDOWN ================= */}
            {showNotif && (
              <div className="absolute top-20 right-0 w-[420px] bg-white border border-slate-200 rounded-[30px] shadow-2xl overflow-hidden z-50">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

                  <div>

                    <h2 className="font-black text-slate-900 text-xl">

                      Notifikasi

                    </h2>

                    <p className="text-slate-400 text-sm mt-1">

                      {unreadCount} belum dibaca

                    </p>

                  </div>

                  <button
                    onClick={
                      markAllRead
                    }
                    className="text-blue-600 text-sm font-black hover:underline"
                  >

                    Tandai dibaca

                  </button>

                </div>

                {/* BODY */}
                <div className="max-h-[420px] overflow-y-auto">

                  {notifications.length ===
                  0 ? (
                    <div className="py-16 text-center text-slate-400 font-bold">

                      Tidak ada notifikasi

                    </div>
                  ) : (
                    notifications.map(
                      (notif) => (
                        <div
                          key={notif.id}
                          className={`px-6 py-5 border-b border-slate-100 hover:bg-slate-50 duration-300 ${
                            !notif.read
                              ? "bg-blue-50/40"
                              : ""
                          }`}
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div
                              onClick={() =>
                                markAsRead(
                                  notif.id
                                )
                              }
                              className="cursor-pointer flex-1"
                            >

                              <p className="font-bold text-slate-700 leading-relaxed">

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

                            {/* DELETE */}
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

                        </div>
                      )
                    )
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between mt-14">

          {/* LEFT */}
          <div>

            <h1 className="text-[52px] leading-none font-black text-[#0F172A]">

              Kategori Produk

            </h1>

            <p className="text-[#64748B] text-lg mt-4 font-medium">

              Atur & modifikasi pilihan kategori produk pada platform BelanjaIn.

            </p>

          </div>

          {/* BUTTON */}
          <button
            onClick={() =>
              setShowAdd(true)
            }
            className="h-[60px] px-8 rounded-2xl bg-[#2563FF] hover:bg-[#1E4FE0] duration-300 shadow-xl flex items-center gap-4 text-white font-black tracking-wide"
          >

            <Plus size={22} />

            TAMBAH KATEGORI BARU

          </button>

        </div>

        {/* ================= CATEGORY GRID ================= */}
        <div className="grid grid-cols-3 gap-8 mt-14">

          {filteredCategories.map(
            (item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E7ECF3] rounded-[34px] px-8 py-7 flex items-center justify-between shadow-sm hover:shadow-md duration-300"
              >

                {/* LEFT */}
                <div className="flex items-center gap-5">

                  {/* ICON */}
                  <div className="w-[74px] h-[74px] rounded-3xl bg-[#F4F7FC] flex items-center justify-center">

                    <Layers3
                      size={34}
                      className="text-[#2563FF]"
                    />

                  </div>

                  {/* TEXT */}
                  <div>

                    <h2 className="text-[30px] font-black text-[#0F172A] leading-none">

                      {item.name}

                    </h2>

                    <p className="text-[#94A3B8] font-black tracking-wider uppercase mt-3 text-sm">

                      {
                        item.total
                      }{" "}
                      Produk Terkait

                    </p>

                  </div>

                </div>

                {/* DELETE */}
                <button
                  onClick={() => {

                    setSelectedCategory(
                      item
                    );

                    setShowDelete(
                      true
                    );

                  }}
                  className="w-11 h-11 rounded-xl hover:bg-red-50 flex items-center justify-center duration-300 group"
                >

                  <Trash2
                    size={19}
                    className="text-slate-400 group-hover:text-red-500 duration-300"
                  />

                </button>

              </div>
            )
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default Categories;