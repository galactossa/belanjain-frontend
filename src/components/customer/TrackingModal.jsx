import React, { useState, useEffect } from "react";
import { X, Copy, Check, Truck } from "lucide-react";
import api from "../../api/api";

export default function TrackingModal({ show, onClose, order }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      if (!show || !order?.resi) return;

      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/ongkir/tracking/${order.resi}`);
        setTrackingData(response.data.data);
      } catch (error) {
        console.error("Error fetching tracking:", error);
        setError("Gagal mengambil data tracking. Gunakan data dummy.");
        // Fallback ke data dummy
        setTrackingData(generateDummyData(order));
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [show, order]);

  const generateDummyData = (order) => {
    const shippingName = order.shippingName || order.userName || "Penerima";
    return {
      waybill_id: order.resi || "JNE03",
      courier: order.courier || "JNE EXPRESS",
      status: "DELIVERED",
      history: [
        {
          title: "Paket Berhasil Diterima",
          desc: `Paket diterima oleh ${shippingName}`,
          date: new Date(),
        },
        {
          title: "Paket Tiba di Hub Tujuan",
          desc: "Paket telah tiba di pusat transit tujuan",
          date: new Date(),
        },
        {
          title: "Paket Diserahkan ke Kurir",
          desc: "Paket siap dikirim ke alamat tujuan",
          date: new Date(),
        },
        {
          title: "Pesanan Diproses Penjual",
          desc: "Penjual sedang mengemas produk",
          date: new Date(),
        },
      ],
    };
  };

  if (!show) return null;

  const data = trackingData || generateDummyData(order || {});
  const history = data.history || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white w-[90%] max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-y-auto">
        {/* HEADER */}
        <div className="border-b bg-white px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-wider text-lg">
                <Truck size={18} /> Lacak Pengiriman
              </h2>
              <p className="text-[10px] uppercase tracking-[2px] text-slate-400 mt-1">
                Status realtime kurir
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-yellow-700 text-sm">
              {error}
            </div>
          ) : (
            <>
              {/* CARD INFO */}
              <div className="border rounded-2xl bg-slate-50 p-5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                      Jasa Ekspedisi
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="bg-red-500 text-white px-3 py-1 rounded font-black text-[10px]">
                        {data.courier || "JNE"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                      No. Resi
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-sm">
                        {data.waybill_id || "-"}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(data.waybill_id || "")
                        }
                      >
                        <Copy size={15} className="text-slate-500" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[2px] font-bold text-slate-400">
                    Status
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-black ${data.status === "DELIVERED" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {data.status || "IN TRANSIT"}
                  </span>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-5">
                <h3 className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mb-5">
                  Progress Pengiriman
                </h3>
                <div className="relative flex justify-between">
                  <div className="absolute left-[10%] right-[10%] top-4 h-[2px] bg-slate-200" />
                  {["Diproses", "Pickup", "Kurir", "Selesai"].map((item) => (
                    <div
                      key={item}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check size={14} className="text-green-600" />
                      </div>
                      <span className="text-[10px] font-semibold mt-2">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* HISTORY */}
              <div className="mt-6">
                <h3 className="text-[11px] uppercase tracking-[2px] font-black text-slate-400 mb-4">
                  Histori Perjalanan
                </h3>
                <div className="space-y-6">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`relative rounded-full ${idx === 0 ? "w-4 h-4 bg-blue-600" : "w-3 h-3 bg-slate-300"}`}
                        />
                        {idx !== history.length - 1 && (
                          <div className="w-[2px] flex-1 bg-slate-200 mt-1" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800">
                          {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {item.desc}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(item.date).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t bg-white p-3">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Tutup Pelacakan
          </button>
        </div>
      </div>
    </div>
  );
}
