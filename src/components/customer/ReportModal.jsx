// src/components/customer/ReportModal.jsx
import { X, AlertTriangle, Send, Image, XCircle } from "lucide-react";
import { useState, useRef } from "react";
import api from "../../api/api";

function ReportModal({ isOpen, onClose, product, onSuccess }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!isOpen || !product) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 5) {
      alert("Maksimal 5 file");
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError("Pilih alasan laporan");
      return;
    }
    if (!details.trim() || details.trim().length < 10) {
      setError("Tuliskan detail keluhan minimal 10 karakter");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        id_pelapor: currentUser.id_pengguna,
        tipe_target: "produk",
        id_target: product.id_produk,
        alasan: `${reason} - ${details.trim()}`,
      };

      await api.post("/laporan", payload);

      setSuccess(
        "✅ Laporan berhasil dikirim! Seller akan segera menindaklanjuti.",
      );
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      setError(error.response?.data?.message || "Gagal mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasons = [
    {
      value: "tidak_sesuai",
      label: "Produk tidak sesuai dengan foto/deskripsi",
    },
    { value: "rusak", label: "Produk rusak/pecah saat pengiriman" },
    { value: "kurang", label: "Jumlah barang kurang dari pesanan" },
    { value: "palsu", label: "Produk diduga palsu/tidak original" },
    { value: "kadaluarsa", label: "Produk kadaluarsa/tidak layak pakai" },
    { value: "penjual", label: "Masalah dengan penjual (respon lambat, dll)" },
    { value: "lainnya", label: "Lainnya" },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Laporkan Produk
              </h2>
              <p className="text-xs text-slate-400">
                Bantu kami menjaga komunitas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* PRODUCT INFO */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <img
            src={product.url_gambar || "https://via.placeholder.com/60"}
            alt={product.nama_produk}
            className="w-16 h-16 rounded-xl object-cover border"
          />
          <div>
            <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
              {product.nama_produk}
            </h3>
            <p className="text-xs text-slate-500">ID: #{product.id_produk}</p>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5 max-h-[400px] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* ALASAN */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Alasan Laporan *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-red-500"
            >
              <option value="">Pilih alasan</option>
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* DETAIL */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Detail Keluhan *
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ceritakan secara detail apa yang terjadi..."
              className="w-full rounded-xl border border-slate-200 p-4 resize-none outline-none focus:border-red-500"
            />
            <p className="text-xs text-slate-400 mt-1">Minimal 10 karakter</p>
          </div>

          {/* UPLOAD BUKTI */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Bukti Pendukung (Opsional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-300 transition"
            >
              <Image size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                Klik untuk upload gambar
              </p>
              <p className="text-xs text-slate-400">Maksimal 5 file</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative bg-slate-100 rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <span className="text-xs font-medium truncate max-w-[100px]">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition"
          >
            BATAL
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 h-12 rounded-xl text-white font-black transition ${
              isSubmitting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                MENGIRIM...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send size={16} /> KIRIM LAPORAN
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
