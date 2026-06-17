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
import { useState, useRef, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotifications from "../../components/admin/ModalNotfications";
import api from "../../api/api";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const [form, setForm] = useState({ name: "", email: "", password: "" });

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
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin");
        setAdmins(response.data.data || []);
        setFilteredAdmins(response.data.data || []);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
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
    const result = admins.filter(
      (item) =>
        item.nama?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredAdmins(result);
  }, [search, admins]);

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setSelectedId(item.id_pengguna);
    setForm({ name: item.nama, email: item.email, password: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await api.put(`/admin/${selectedId}`, {
          nama: form.name,
          telepon: form.telepon || "",
        });
      } else {
        await api.post("/admin", {
          nama: form.name,
          email: form.email,
          password: form.password,
        });
      }

      const response = await api.get("/admin");
      setAdmins(response.data.data || []);
      setFilteredAdmins(response.data.data || []);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving admin:", error);
      alert(error.response?.data?.message || "Gagal menyimpan admin");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/${deleteId}`);
      const response = await api.get("/admin");
      setAdmins(response.data.data || []);
      setFilteredAdmins(response.data.data || []);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert(error.response?.data?.message || "Gagal menghapus admin");
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
            <div className="w-[520px] bg-white rounded-[38px] shadow-2xl relative z-10 overflow-hidden">
              <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563FF] flex items-center justify-center text-white">
                    <ShieldCheck size={22} />
                  </div>
                  <h2 className="text-[28px] font-black text-[#071437] uppercase">
                    {isEdit ? "Edit Admin" : "Tambah Admin"}
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-7 space-y-7">
                <div>
                  <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                    Nama Admin
                  </p>
                  <div className="h-14 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">
                    <ShieldCheck size={18} className="text-slate-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Nama Admin"
                      className="w-full h-full outline-none font-bold text-slate-700"
                    />
                  </div>
                </div>
                {!isEdit && (
                  <>
                    <div>
                      <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                        Email
                      </p>
                      <div className="h-14 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">
                        <Mail size={18} className="text-slate-400" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="admin@belanjain.com"
                          className="w-full h-full outline-none font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black tracking-[2px] text-slate-400 uppercase mb-3">
                        Password
                      </p>
                      <div className="h-14 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">
                        <Lock size={18} className="text-slate-400" />
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          placeholder="••••••••"
                          className="w-full h-full outline-none font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </>
                )}
                <button
                  onClick={handleSave}
                  className="w-full h-16 rounded-2xl bg-[#2563FF] hover:bg-[#1E4ED8] duration-300 text-white font-black tracking-[2px] shadow-xl"
                >
                  SIMPAN
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[7px]" />
            <div className="w-[480px] bg-white rounded-[38px] p-10 relative z-10 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={34} className="text-[#FF004F]" />
              </div>
              <h2 className="text-[36px] font-black text-[#071437] text-center mt-7">
                Hapus Admin
              </h2>
              <p className="text-center text-[#64748B] text-lg font-semibold mt-3">
                Apakah Anda yakin ingin menghapus admin ini?
              </p>
              <div className="grid grid-cols-2 gap-5 mt-10">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="h-16 rounded-2xl bg-[#F1F5F9] hover:bg-slate-200 duration-300 text-[#64748B] font-black tracking-[2px]"
                >
                  BATAL
                </button>
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

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] leading-tight font-black text-slate-900">
              Admins
            </h1>
            <p className="text-[#5E6278] mt-3 text-[13px]">
              Kelola sistem dan pantau aktivitas platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] duration-300 text-white h-11 px-4 rounded-2xl font-black tracking-wide flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} /> TAMBAH ADMIN
            </button>
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[280px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari admin..."
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

        <div className="bg-white rounded-[40px] border border-[#E7ECF3] shadow-sm mt-8 overflow-hidden">
          <div className="grid grid-cols-[0.5fr_1.5fr_1.5fr_0.8fr] px-10 py-6 border-b border-[#EEF2F7] bg-[#FCFDFE]">
            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase"></p>
            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              Admin
            </p>
            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase">
              Email
            </p>
            <p className="text-[#64748B] text-[12px] font-black tracking-[0.22em] uppercase text-center">
              Aksi
            </p>
          </div>

          {filteredAdmins.map((item) => (
            <div
              key={item.id_pengguna}
              className="grid grid-cols-[0.5fr_1.5fr_1.5fr_0.8fr] items-center gap-4 px-10 py-6 border-b border-[#EEF2F7] hover:bg-slate-50 duration-300"
            >
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#2563FF] font-black text-sm flex items-center justify-center">
                  {item.nama?.charAt(0)?.toUpperCase() || "A"}
                </div>
              </div>
              <div>
                <h3 className="font-black uppercase text-[#0F172A] text-sm tracking-tight">
                  {item.nama}
                </h3>
              </div>
              <div>
                <p className="text-[#64748B] text-sm font-semibold">
                  {item.email}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-[#64748B] hover:text-blue-600 duration-300"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(item.id_pengguna);
                    setShowDeleteModal(true);
                  }}
                  className="text-[#64748B] hover:text-red-500 duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminManagement;
