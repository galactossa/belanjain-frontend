import React, { useState, useRef } from "react";

export default function ComplaintModal({ show, onClose, order, onSubmit }) {
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [solution, setSolution] = useState("refund");
  const [files, setFiles] = useState([]);
  const fileRef = useRef();

  if (!show || !order) return null;

  const productOptions = order.products || [];

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).slice(0, 5);
    setFiles((prev) => [...prev, ...arr]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = () => {
    if (!reason) {
      alert("Pilih alasan komplain terlebih dahulu");
      return;
    }
    if (!details.trim()) {
      alert("Tuliskan detail keluhan Anda");
      return;
    }

    // 🔥 AMBIL ID PRODUK PERTAMA
    const productId = productOptions.length > 0 ? productOptions[0].id : 1;

    const payload = {
      orderId: order.id,
      order: order,
      productId: productId,
      reason: reason,
      details: details,
      solution: solution,
      files: files.map((f) => f.name),
      date: new Date().toISOString(),
    };

    if (onSubmit) onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-[92%] max-w-2xl p-6 shadow-lg z-10 max-h-[90vh] overflow-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-pink-600">
              AJUKAN KOMPLAIN PESANAN
            </h3>
            <p className="text-sm text-slate-400">
              Sampaikan kendala pesanan anda secara lengkap
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-2">
              PILIH PRODUK BERMASALAH
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="radio"
                  checked={selectedProduct === "all"}
                  onChange={() => setSelectedProduct("all")}
                />
                <div className="text-sm">Semua Produk (Satu Pesanan Utuh)</div>
              </label>
              {productOptions.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <input
                    type="radio"
                    checked={selectedProduct === String(p.id)}
                    onChange={() => setSelectedProduct(String(p.id))}
                  />
                  <div className="text-sm flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <div>{p.name}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold mb-2">
              ALASAN KOMPLAIN
            </div>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Pilih alasan komplain</option>
              <option value="produk_rusak">
                Barang Rusak / Pecah saat pengiriman
              </option>
              <option value="salah_produk">Produk tidak sesuai pesanan</option>
              <option value="kurang">Kuantitas kurang</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold mb-2">
              PENJELASAN DETAIL KENDALA
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="w-full p-3 border rounded-lg"
              placeholder="Tuliskan secara jelas kendala produk, kondisi barang saat diterima, atau kronologis paket..."
            />
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold mb-2">
              SOLUSI YANG ANDA HARAPKAN
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSolution("refund")}
                className={`flex-1 p-3 rounded-lg border ${
                  solution === "refund"
                    ? "bg-pink-50 border-pink-400 text-pink-600"
                    : "bg-white"
                }`}
              >
                REFUND DANA
              </button>
              <button
                onClick={() => setSolution("exchange")}
                className={`flex-1 p-3 rounded-lg border ${
                  solution === "exchange"
                    ? "bg-pink-50 border-pink-400 text-pink-600"
                    : "bg-white"
                }`}
              >
                TUKAR BARANG BARU
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold mb-2">
              UNGGAH BUKTI KERUSAKAN (GAMBAR)
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-dashed border-2 border-slate-200 rounded-lg p-6 text-center"
            >
              <div className="text-sm text-slate-500">
                Drag & drop gambar bukti di sini, atau
              </div>
              <div className="mt-3">
                <button
                  onClick={() => fileRef.current.click()}
                  className="px-4 py-2 bg-white border rounded"
                >
                  Pilih File Manual
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {files.map((f, idx) => (
                  <div key={idx} className="p-2 border rounded text-sm">
                    {f.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md border">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-md bg-pink-600 text-white"
            >
              Kirim Laporan Komplain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
