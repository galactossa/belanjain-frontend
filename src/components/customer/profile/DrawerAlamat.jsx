import { X, ArrowLeft, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../api/api";

function DrawerAlamat({ show, onClose }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [alamat, setAlamat] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    label: "",
    penerima: "",
    telepon: "",
    alamat: "",
    kota: "",
    kode_pos: "",
    utama: false,
  });
  const [editId, setEditId] = useState(null);

  // Load addresses
  useEffect(() => {
    if (!show || !currentUser?.id_pengguna) return;
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/alamat/pengguna/${currentUser.id_pengguna}`,
        );
        setAlamat(response.data.data || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [show, currentUser?.id_pengguna]);

  const resetForm = () => {
    setForm({
      label: "",
      penerima: "",
      telepon: "",
      alamat: "",
      kota: "",
      kode_pos: "",
      utama: false,
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.id_pengguna) {
      alert("Login dulu");
      return;
    }

    if (!form.penerima || !form.telepon || !form.alamat || !form.kota) {
      alert("Nama penerima, telepon, alamat, dan kota wajib diisi");
      return;
    }

    try {
      const payload = {
        id_pengguna: currentUser.id_pengguna,
        nama_penerima: form.penerima,
        telepon: form.telepon,
        alamat: form.alamat,
        kota: form.kota,
        kode_pos: form.kode_pos || "",
        label: form.label || "Rumah",
        utama: form.utama || false,
      };

      if (editId) {
        await api.put(`/alamat/${editId}`, payload);
      } else {
        await api.post("/alamat", payload);
      }

      const response = await api.get(
        `/alamat/pengguna/${currentUser.id_pengguna}`,
      );
      setAlamat(response.data.data || []);
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert(error.response?.data?.message || "Gagal menyimpan alamat");
    }
  };

  const editAlamat = (item) => {
    setEditId(item.id_alamat);
    setForm({
      label: item.label || "Rumah",
      penerima: item.nama_penerima,
      telepon: item.telepon,
      alamat: item.alamat,
      kota: item.kota || "",
      kode_pos: item.kode_pos || "",
      utama: item.utama || false,
    });
    setShowForm(true);
  };

  const hapusAlamat = async (id) => {
    if (!window.confirm("Yakin ingin menghapus alamat ini?")) return;
    try {
      await api.delete(`/alamat/${id}`);
      const response = await api.get(
        `/alamat/pengguna/${currentUser.id_pengguna}`,
      );
      setAlamat(response.data.data || []);
    } catch (error) {
      console.error("Error deleting address:", error);
      alert(error.response?.data?.message || "Gagal menghapus alamat");
    }
  };

  if (!show) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-[99]" />
      <div className="fixed top-0 right-0 h-screen w-full max-w-xl bg-slate-50 z-[100] flex flex-col">
        <div className="h-20 bg-white border-b px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose}>
              <ArrowLeft />
            </button>
            <h2 className="text-3xl font-black">Daftar Alamat</h2>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg"
          >
            <Plus />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            </div>
          ) : alamat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center">
                <MapPin size={50} className="text-slate-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-600">
                Belum ada alamat tersimpan
              </h3>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-blue-600 font-bold"
              >
                Tambah Alamat Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {alamat.map((item) => (
                <div
                  key={item.id_alamat}
                  className="bg-white rounded-3xl border p-6 shadow-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <h3 className="font-black text-xl">
                          {item.label || "Rumah"}
                        </h3>
                        {item.utama && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                            UTAMA
                          </span>
                        )}
                      </div>
                      <p className="font-bold mt-3">{item.nama_penerima}</p>
                      <p className="text-slate-500">{item.telepon}</p>
                      <p className="mt-3 text-slate-600">{item.alamat}</p>
                      <p className="text-slate-500 text-sm">{item.kota}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editAlamat(item)}
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => hapusAlamat(item.id_alamat)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-5">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl bg-white rounded-[40px] p-8"
            >
              <div className="flex justify-between mb-8">
                <h2 className="text-4xl font-black">
                  {editId ? "Edit Alamat" : "Tambah Alamat"}
                </h2>
                <button type="button" onClick={() => setShowForm(false)}>
                  <X />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Label (Rumah / Kantor)"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="h-14 rounded-2xl border px-4"
                />
                <input
                  required
                  placeholder="Nama Lengkap"
                  value={form.penerima}
                  onChange={(e) =>
                    setForm({ ...form, penerima: e.target.value })
                  }
                  className="h-14 rounded-2xl border px-4"
                />
              </div>
              <input
                required
                placeholder="0812xxxxxx"
                value={form.telepon}
                onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                className="w-full mt-4 h-14 rounded-2xl border px-4"
              />
              <textarea
                required
                rows={3}
                placeholder="Alamat Lengkap"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                className="w-full mt-4 rounded-2xl border p-4"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  required
                  placeholder="Kota"
                  value={form.kota}
                  onChange={(e) => setForm({ ...form, kota: e.target.value })}
                  className="h-14 rounded-2xl border px-4"
                />
                <input
                  placeholder="Kode Pos"
                  value={form.kode_pos}
                  onChange={(e) =>
                    setForm({ ...form, kode_pos: e.target.value })
                  }
                  className="h-14 rounded-2xl border px-4"
                />
              </div>
              <label className="flex items-center gap-3 mt-5">
                <input
                  type="checkbox"
                  checked={form.utama}
                  onChange={(e) =>
                    setForm({ ...form, utama: e.target.checked })
                  }
                />
                Jadikan Alamat Utama
              </label>
              <button
                type="submit"
                className="mt-6 w-full h-14 rounded-2xl bg-blue-600 text-white font-black"
              >
                Simpan Alamat
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default DrawerAlamat;
