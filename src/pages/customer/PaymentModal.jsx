import { X, Copy, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../api/api";

function PaymentModal({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  paymentMethod,
  onPaymentSuccess,
}) {
  // ================= 🔥 HOOKS HARUS DIPANGGIL SEBELUM CONDITIONAL RETURN =================
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [countdown, setCountdown] = useState(3600);
  const [loading, setLoading] = useState(false);

  // ================= SIMULASI VA NUMBER =================
  const vaNumber = `8888${String(orderId || Date.now()).padStart(12, "0")}`;

  // ================= COUNTDOWN TIMER =================
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // ================= 🔥 CONDITIONAL RETURN HARUS DI BAWAH HOOKS =================
  if (!isOpen) return null;

  // ================= SIMULASI CEK STATUS PEMBAYARAN =================
  const checkPaymentStatus = async () => {
    if (loading) return;
    setLoading(true);

    const isSuccess = Math.random() < 0.8;

    setTimeout(async () => {
      if (isSuccess) {
        setPaymentStatus("paid");

        // 🔥 PAKAI ENDPOINT BARU: /payment-status
        try {
          const response = await api.put(`/pesanan/${orderId}/payment-status`, {
            status: "diproses",
          });
          console.log("✅ Order status updated:", response.data);
        } catch (error) {
          console.error(
            "❌ Failed to update order status:",
            error.response?.data || error.message,
          );
        }

        alert("✅ Pembayaran berhasil dikonfirmasi!");
        setTimeout(() => {
          onClose();
          if (onPaymentSuccess) onPaymentSuccess();
          window.location.href = "/customer/orders";
        }, 1500);
      } else {
        alert("⏳ Pembayaran masih diproses. Coba lagi nanti.");
        setLoading(false);
      }
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getStatusDisplay = () => {
    if (paymentStatus === "paid") {
      return {
        icon: <CheckCircle size={48} className="text-green-500" />,
        title: "Pembayaran Berhasil!",
        desc: "Pesanan Anda telah dikonfirmasi.",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    }
    if (paymentStatus === "expired") {
      return {
        icon: <AlertCircle size={48} className="text-red-500" />,
        title: "Pembayaran Kadaluarsa!",
        desc: "Silakan buat pesanan baru.",
        color: "text-red-600",
        bg: "bg-red-50",
      };
    }
    return {
      icon: <Clock size={48} className="text-yellow-500" />,
      title: "Menunggu Pembayaran",
      desc: "Silakan selesaikan pembayaran sebelum waktu habis.",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Detail Pembayaran
            </h2>
            <p className="text-sm text-slate-500 mt-1">Pesanan #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* STATUS */}
        <div className={`p-6 ${statusDisplay.bg}`}>
          <div className="flex items-center gap-4">
            {statusDisplay.icon}
            <div>
              <h3 className={`font-black text-lg ${statusDisplay.color}`}>
                {statusDisplay.title}
              </h3>
              <p className="text-sm text-slate-600">{statusDisplay.desc}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5">
          {/* TOTAL */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
            <span className="font-bold text-slate-600">Total Pembayaran</span>
            <span className="text-3xl font-black text-blue-600">
              Rp {Number(totalAmount).toLocaleString("id-ID")}
            </span>
          </div>

          {/* TIME LEFT */}
          {paymentStatus === "pending" && (
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <p className="text-sm text-slate-600">Sisa Waktu Pembayaran</p>
              <p className="text-3xl font-black text-blue-600 mt-1">
                {formatTime(countdown)}
              </p>
            </div>
          )}

          {/* VA NUMBER - SIMULASI */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Nomor Virtual Account (Simulasi)
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-widest">
                {vaNumber}
              </span>
              <button
                onClick={() => copyToClipboard(vaNumber)}
                className="px-4 py-2 rounded-xl bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 flex items-center gap-2"
              >
                {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                {copied ? "Tersalin!" : "Salin"}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Transfer ke VA atas nama <strong>BelanjaIn</strong>
            </p>
            <p className="text-xs text-yellow-500 mt-1">
              ⚠️ Mode simulasi - tidak ada transaksi nyata
            </p>
          </div>

          {/* CHECK STATUS BUTTON */}
          {paymentStatus === "pending" && (
            <button
              onClick={checkPaymentStatus}
              disabled={loading}
              className="w-full h-12 rounded-2xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
              ) : (
                "Cek Status Pembayaran"
              )}
            </button>
          )}

          {/* CLOSE BUTTON */}
          {paymentStatus === "paid" || paymentStatus === "expired" ? (
            <button
              onClick={() => {
                onClose();
                if (paymentStatus === "paid" && onPaymentSuccess) {
                  onPaymentSuccess();
                }
                if (paymentStatus === "paid") {
                  window.location.href = "/customer/orders";
                }
              }}
              className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
            >
              {paymentStatus === "paid" ? "Lihat Pesanan" : "Kembali"}
            </button>
          ) : (
            <p className="text-center text-xs text-slate-400">
              Jangan tutup halaman ini sebelum pembayaran selesai.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
