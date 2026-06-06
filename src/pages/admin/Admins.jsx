/* ================= IMPORT ================= */
import {
  Search,
  Bell,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  Mail,
  Lock,
} from "lucide-react";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import AdminLayout from "../../layouts/AdminLayout";

function AdminManagement() {

  /* ================= DATA ================= */
  const [admins, setAdmins] =
    useState([
      {
        id: 1,
        name: "ADMIN BELANJAIN",
        email:
          "belanjain@gmail.com",
        password: "12345678",
      },
      {
        id: 2,
        name: "ADMIN 1",
        email: "admin1@gmail.com",
        password: "12345678",
      },
    ]);

  /* ================= SEARCH ================= */
  const [search, setSearch] =
    useState("");

  const [
    filteredAdmins,
    setFilteredAdmins,
  ] = useState(admins);

  /* ================= MODAL ================= */
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
    name: "",
    email: "",
    password: "",
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
          'Admin "ADMIN 1" berhasil ditambahkan',
        time: "Baru saja",
        read: false,
      },
      {
        id: 2,
        title:
          'Admin "ADMIN BELANJAIN" berhasil diperbarui',
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
      admins.filter(
        (item) =>
          item.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredAdmins(result);

  }, [search, admins]);

  /* ================= NOTIF ================= */
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

  /* ================= OPEN ADD ================= */
  const openAddModal = () => {

    setIsEdit(false);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setShowModal(true);

  };

  /* ================= OPEN EDIT ================= */
  const openEditModal = (item) => {

    setIsEdit(true);

    setSelectedId(item.id);

    setForm({
      name: item.name,
      email: item.email,
      password: item.password,
    });

    setShowModal(true);

  };

  /* ================= SAVE ================= */
  const handleSave = () => {

    if (isEdit) {

      setAdmins(
        admins.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                ...form,
              }
            : item
        )
      );

      setNotifications([
        {
          id: Date.now(),
          title: `Admin "${form.name}" berhasil diperbarui`,
          time: "Baru saja",
          read: false,
        },
        ...notifications,
      ]);

    } else {

      const newAdmin = {
        id: Date.now(),
        ...form,
      };

      setAdmins([
        ...admins,
        newAdmin,
      ]);

      setNotifications([
        {
          id: Date.now(),
          title: `Admin "${form.name}" berhasil ditambahkan`,
          time: "Baru saja",
          read: false,
        },
        ...notifications,
      ]);

    }

    setShowModal(false);

  };

  /* ================= DELETE ================= */
  const openDeleteModal = (id) => {

    setDeleteId(id);

    setShowDeleteModal(true);

  };

  const handleDelete = () => {

    setAdmins(
      admins.filter(
        (item) =>
          item.id !== deleteId
      )
    );

    setShowDeleteModal(false);

  };

  return (
    <AdminLayout>

      <div className="min-h-screen bg-[#f6f8fc] p-8 relative">

        {/* ================= ADD & EDIT MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />

            {/* BOX */}
            <div className="w-[520px] bg-white rounded-[38px] shadow-2xl relative z-10 overflow-hidden">

              {/* HEADER */}
              <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-[#2563FF] flex items-center justify-center text-white">

                    <ShieldCheck
                      size={22}
                    />

                  </div>

                  <h2 className="text-[28px] font-black text-[#071437] uppercase">

                    {isEdit
                      ? "Edit Admin Pusat"
                      : "Tambah Admin Pusat"}

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
              <div className="p-7 space-y-7">

                {/* EMAIL */}
                <div>

                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">

                    Alamat E-Mail

                  </p>

                  <div className="h-14 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">

                    <Mail
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      type="text"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email:
                            e.target.value,
                        })
                      }
                      placeholder="Admin@belanjain.com"
                      className="w-full h-full outline-none font-bold text-slate-700"
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">

                    Kata Sandi

                  </p>

                  <div className="h-14 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">

                    <Lock
                      size={18}
                      className="text-slate-400"
                    />

                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password:
                            e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full h-full outline-none font-bold text-slate-700"
                    />

                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={handleSave}
                  className="w-full h-16 rounded-2xl bg-[#2563FF] hover:bg-[#1E4ED8] duration-300 text-white font-black tracking-[2px] shadow-xl"
                >

                  SIMPAN ADMIN BARU

                </button>

              </div>

            </div>

          </div>
        )}

        {/* ================= DELETE MODAL ================= */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[7px]" />

            {/* BOX */}
            <div className="w-[480px] bg-white rounded-[38px] p-10 relative z-10 shadow-2xl">

              {/* ICON */}
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">

                <Trash2
                  size={34}
                  className="text-[#FF004F]"
                />

              </div>

              {/* TITLE */}
              <h2 className="text-[36px] font-black text-[#071437] text-center mt-7">

                Hapus Admin

              </h2>

              {/* DESC */}
              <p className="text-center text-[#64748B] text-lg font-semibold mt-3">

                Apakah Anda yakin ingin
                menghapus admin ini?

              </p>

              {/* BUTTON */}
              <div className="grid grid-cols-2 gap-5 mt-10">

                {/* CANCEL */}
                <button
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  className="h-16 rounded-2xl bg-[#F1F5F9] hover:bg-slate-200 duration-300 text-[#64748B] font-black tracking-[2px]"
                >

                  BATAL

                </button>

                {/* DELETE */}
                <button
                  onClick={handleDelete}
                  className="h-16 rounded-2xl bg-[#FF004F] hover:bg-[#E60045] duration-300 text-white font-black tracking-[2px] shadow-xl shadow-pink-200"
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

            <h1 className="text-[42px] leading-none font-black text-[#071437]">

              Admins

            </h1>

            <p className="text-[#5E6278] mt-3 text-[20px]">

              Kelola sistem dan pantau aktivitas platform BelanjaIn.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <div className="bg-[#F1F5F9] border border-[#E2E8F0] h-14 w-[320px] rounded-2xl px-5 flex items-center">

              <Search
                size={18}
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
                placeholder="cari admin..."
                className="w-full h-full bg-transparent outline-none px-3 text-slate-600"
              />

            </div>

            {/* NOTIFICATION */}
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
                className="relative w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
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

              {/* NOTIF DROPDOWN */}
              {showNotif && (
                <div className="absolute top-20 right-0 w-[400px] bg-white rounded-[30px] border border-slate-200 shadow-2xl overflow-hidden z-50">

                  {/* HEADER */}
                  <div className="px-6 py-5 border-b border-slate-100">

                    <h2 className="text-xl font-black text-slate-900">

                      Notifikasi

                    </h2>

                  </div>

                  {/* BODY */}
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
        <div className="flex justify-end mt-12">

          <button
            onClick={openAddModal}
            className="bg-[#2563FF] hover:bg-[#1E4ED8] duration-300 text-white h-16 px-8 rounded-2xl font-black tracking-wide flex items-center gap-3 shadow-xl"
          >

            <Plus size={22} />

            TAMBAH ADMIN PUSAT

          </button>

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm mt-10 overflow-hidden">

          {/* HEADER */}
          <div className="grid grid-cols-[1.5fr_1fr_0.5fr] px-10 py-7 border-b border-[#E2E8F0] font-black text-[#071437] bg-white uppercase text-sm tracking-wide">

            <p>Admin</p>

            <p>Email</p>

            <p className="text-center">

              Aksi

            </p>

          </div>

          {/* BODY */}
          {filteredAdmins.map(
            (item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.5fr_1fr_0.5fr] items-center px-10 py-8 border-b border-[#EEF2F7] hover:bg-slate-50 duration-300"
              >

                {/* ADMIN */}
                <div className="flex items-center gap-5">

                  {/* AVATAR */}
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#2563FF] font-black text-xl flex items-center justify-center">

                    A

                  </div>

                  {/* INFO */}
                  <div>

                    <h3 className="font-black uppercase text-[#071437] text-lg">

                      {item.name}

                    </h3>

                  </div>

                </div>

                {/* EMAIL */}
                <div>

                  <p className="uppercase tracking-wide text-[#94A3B8] font-black">

                    {item.email}

                  </p>

                </div>

                {/* ACTION */}
                <div className="flex items-center justify-center gap-5">

                  {/* EDIT */}
                  <button
                    onClick={() =>
                      openEditModal(
                        item
                      )
                    }
                    className="text-slate-300 hover:text-blue-600 duration-300"
                  >

                    <Pencil
                      size={20}
                    />

                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() =>
                      openDeleteModal(
                        item.id
                      )
                    }
                    className="text-slate-300 hover:text-red-500 duration-300"
                  >

                    <Trash2
                      size={20}
                    />

                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminManagement;