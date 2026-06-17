import { X, ArrowLeft, MapPin, Plus, Pencil, Trash2 } from "lucide-react";

import { useState, useEffect } from "react";

function DrawerAlamat({ show, onClose }) {
  const [alamat, setAlamat] = useState(
    () => JSON.parse(localStorage.getItem("alamatUser")) || [],
  );

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    label: "",
    penerima: "",
    telepon: "",
    alamat: "",
    utama: false,
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // Empty effect - initialization happens in useState
  }, []);

  const resetForm = () => {
    setForm({
      label: "",
      penerima: "",
      telepon: "",
      alamat: "",
      utama: false,
    });

    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let updated = [];

    if (editId) {
      updated = alamat.map((item) =>
        item.id === editId
          ? {
              ...item,
              ...form,
            }
          : item,
      );
    } else {
      updated = [
        ...alamat,
        {
          id: Date.now(),
          ...form,
        },
      ];
    }

    localStorage.setItem("alamatUser", JSON.stringify(updated));

    setAlamat(updated);

    resetForm();

    setShowForm(false);
  };

  const editAlamat = (item) => {
    setEditId(item.id);

    setForm({
      label: item.label,
      penerima: item.penerima,
      telepon: item.telepon,
      alamat: item.alamat,
      utama: item.utama,
    });

    setShowForm(true);
  };

  if (!show) return null;
  const hapusAlamat = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus alamat ini?");

    if (!confirmDelete) return;

    const updated = alamat.filter((item) => item.id !== id);

    setAlamat(updated);

    localStorage.setItem("alamatUser", JSON.stringify(updated));
  };
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/40
          z-[99]
        "
      />

      {/* DRAWER */}
      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          w-full
          max-w-xl
          bg-slate-50
          z-[100]
          flex
          flex-col
        "
      >
        {/* HEADER */}
        <div
          className="
            h-20
            bg-white
            border-b
            px-8
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-4">
            <button onClick={onClose}>
              <ArrowLeft />
            </button>

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Daftar Alamat
            </h2>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="
              w-12
              h-12
              rounded-2xl
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <Plus />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {alamat.length === 0 ? (
            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                "
              >
                <MapPin size={50} className="text-slate-300" />
              </div>

              <h3
                className="
                  mt-6
                  text-xl
                  font-bold
                  text-slate-600
                "
              >
                Belum ada alamat tersimpan
              </h3>

              <button
                onClick={() => setShowForm(true)}
                className="
                  mt-3
                  text-blue-600
                  font-bold
                "
              >
                Tambah Alamat Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {alamat.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-white
                    rounded-3xl
                    border
                    p-6
                    shadow-sm
                  "
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex gap-2 items-center">
                        <h3 className="font-black text-xl">{item.label}</h3>

                        {item.utama && (
                          <span
                            className="
                              px-3
                              py-1
                              rounded-full
                              bg-blue-100
                              text-blue-600
                              text-xs
                              font-bold
                            "
                          >
                            UTAMA
                          </span>
                        )}
                      </div>

                      <p className="font-bold mt-3">{item.penerima}</p>

                      <p className="text-slate-500">{item.telepon}</p>

                      <p className="mt-3 text-slate-600">{item.alamat}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editAlamat(item)}
                        className="
      w-10
      h-10
      rounded-xl
      bg-slate-100
      flex
      items-center
      justify-center
      hover:bg-slate-200
    "
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => hapusAlamat(item.id)}
                        className="
      w-10
      h-10
      rounded-xl
      bg-red-50
      text-red-500
      flex
      items-center
      justify-center
      hover:bg-red-100
    "
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

        {/* FORM MODAL */}
        {showForm && (
          <div
            className="
              fixed
              inset-0
              bg-black/50
              z-[110]
              flex
              items-center
              justify-center
              p-5
            "
          >
            <form
              onSubmit={handleSubmit}
              className="
                w-full
                max-w-xl
                bg-white
                rounded-[40px]
                p-8
              "
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
                  placeholder="Rumah / Kantor"
                  value={form.label}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      label: e.target.value,
                    })
                  }
                  className="
                    h-14
                    rounded-2xl
                    border
                    px-4
                  "
                />

                <input
                  required
                  placeholder="Nama Lengkap"
                  value={form.penerima}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      penerima: e.target.value,
                    })
                  }
                  className="
                    h-14
                    rounded-2xl
                    border
                    px-4
                  "
                />
              </div>

              <input
                required
                placeholder="0812xxxxxx"
                value={form.telepon}
                onChange={(e) =>
                  setForm({
                    ...form,
                    telepon: e.target.value,
                  })
                }
                className="
                  w-full
                  mt-4
                  h-14
                  rounded-2xl
                  border
                  px-4
                "
              />

              <textarea
                required
                rows={4}
                placeholder="Alamat Lengkap"
                value={form.alamat}
                onChange={(e) =>
                  setForm({
                    ...form,
                    alamat: e.target.value,
                  })
                }
                className="
                  w-full
                  mt-4
                  rounded-2xl
                  border
                  p-4
                "
              />

              <label
                className="
                  flex
                  items-center
                  gap-3
                  mt-5
                "
              >
                <input
                  type="checkbox"
                  checked={form.utama}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      utama: e.target.checked,
                    })
                  }
                />
                Jadikan Alamat Utama
              </label>

              <button
                type="submit"
                className="
                  mt-6
                  w-full
                  h-14
                  rounded-2xl
                  bg-blue-600
                  text-white
                  font-black
                "
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
