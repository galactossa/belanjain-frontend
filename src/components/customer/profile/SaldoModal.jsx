import {
  CreditCard,
  Wallet,
  X,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../api/api";

function SaldoModal({ show, onClose, saldo, setSaldo }) {
  const [selectedAmount, setSelectedAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bca");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ================= FETCH SALDO & HISTORY =================
  useEffect(() => {
    if (!show || (!currentUser?.id_pengguna && !currentUser?.id)) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = currentUser?.id_pengguna || currentUser?.id;

        const saldoRes = await api.get(`/saldo/${userId}`);
        const saldoData = saldoRes.data.data;
        setSaldo(saldoData.saldo || 0);

        const historyRes = await api.get(`/saldo/history/${userId}`);
        const historyData = historyRes.data.data || [];

        setHistory(
          historyData.map((item) => ({
            id: item.id_saldo_history || item.id,
            title:
              item.deskripsi ||
              (item.jenis === "topup"
                ? "Topup Saldo"
                : item.jenis === "payment"
                  ? "Pembayaran Pesanan"
                  : item.jenis === "refund"
                    ? "Refund"
                    : item.jenis || "Transaksi"),
            amount: item.jumlah,
            formattedAmount:
              item.jumlah > 0
                ? `+Rp${Number(item.jumlah).toLocaleString("id-ID")}`
                : `-Rp${Math.abs(Number(item.jumlah)).toLocaleString("id-ID")}`,
            type: item.jumlah > 0 ? "plus" : "minus",
            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            status: item.status || "sukses",
          })),
        );
      } catch (error) {
        console.error("Error fetching saldo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, currentUser?.id_pengguna, currentUser?.id, setSaldo]);

  if (!show) return null;

  const nominalList = [50000, 100000, 200000, 500000];

  // ================= 🔥 TOPUP SALDO - SIMULASI (FALLBACK) =================
  const handleTopup = async () => {
    const amount = customAmount !== "" ? Number(customAmount) : selectedAmount;

    if (!amount || amount < 10000) {
      setErrorMessage("Minimal top up Rp10.000");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const userId = currentUser?.id_pengguna || currentUser?.id;

      // 🔥 LANGSUNG PAKAI ENDPOINT TOPUP (SIMULASI)
      const response = await api.post("/saldo/topup", {
        id_pengguna: userId,
        jumlah: amount,
        metode:
          paymentMethod === "bca"
            ? "BCA VA"
            : paymentMethod === "mandiri"
              ? "Mandiri VA"
              : "QRIS",
      });

      console.log("✅ Topup response:", response.data);

      const newSaldo = response.data.data.saldo;
      setSaldo(newSaldo);

      // Refresh history
      const historyRes = await api.get(`/saldo/history/${userId}`);
      const historyData = historyRes.data.data || [];
      setHistory(
        historyData.map((item) => ({
          id: item.id_saldo_history || item.id,
          title: item.deskripsi || "Topup Saldo",
          amount: item.jumlah,
          formattedAmount: `+Rp${Number(item.jumlah).toLocaleString("id-ID")}`,
          type: "plus",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "-",
          status: "sukses",
        })),
      );

      setSuccessMessage(
        `✅ Topup Rp${amount.toLocaleString("id-ID")} berhasil!`,
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("❌ Error topup:", error);
      console.error("❌ Error response:", error.response?.data);

      // 🔥 FALLBACK: Simulasi topup sukses walaupun API error
      if (
        error.response?.status === 503 ||
        error.message?.includes("unavailable")
      ) {
        // Simulasi topup sukses
        const newSaldo = (saldo || 0) + amount;
        setSaldo(newSaldo);

        // Tambah history lokal
        const newHistory = {
          title: "Topup Saldo (Simulasi)",
          amount: amount,
          formattedAmount: `+Rp${amount.toLocaleString("id-ID")}`,
          type: "plus",
          date: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sukses",
        };
        setHistory([newHistory, ...history]);

        setSuccessMessage(
          `✅ Topup Rp${amount.toLocaleString("id-ID")} berhasil! (Simulasi)`,
        );
        setTimeout(() => setSuccessMessage(""), 3000);

        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
        }, 1500);
        return;
      }

      const errorMsg = error.response?.data?.message || "Topup gagal";
      setErrorMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-50 w-full max-w-3xl h-[75vh] rounded-3xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CreditCard size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-black">Dompet Belanjain</h2>
              <p className="text-xs uppercase font-bold text-slate-400">
                Gunakan saldo untuk pembayaran
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* KIRI */}
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                    SALDO DOMPET SAYA
                  </span>
                  <h1 className="text-5xl font-black mt-4">
                    Rp {saldo.toLocaleString("id-ID")}
                  </h1>
                  <p className="mt-6 text-sm">Secure Belanjain Wallet</p>
                  <Wallet
                    size={120}
                    className="absolute right-5 top-5 opacity-10"
                  />
                </div>

                {/* RIWAYAT SALDO */}
                <h3 className="mt-6 mb-3 text-slate-500 font-black tracking-wider">
                  RIWAYAT SALDO
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div
                        key={item.id || Math.random()}
                        className="bg-white border rounded-2xl p-4 flex justify-between items-center hover:shadow-sm transition"
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              item.type === "plus"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {item.type === "plus" ? (
                              <ArrowUpRight
                                size={18}
                                className="text-green-600"
                              />
                            ) : (
                              <ArrowDownRight
                                size={18}
                                className="text-red-500"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-slate-400">
                                {item.date || "Baru"}
                              </p>
                              {item.status && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    item.status === "sukses" ||
                                    item.status === "success"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {item.status === "sukses" ||
                                  item.status === "success"
                                    ? "✅ SUKSES"
                                    : "⏳ PENDING"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`font-black text-lg ${item.type === "plus" ? "text-green-600" : "text-red-500"}`}
                        >
                          {item.formattedAmount || item.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl border p-6 text-center text-slate-400">
                      <div className="text-4xl mb-3">💰</div>
                      <p className="font-semibold">Belum ada riwayat saldo</p>
                      <p className="text-sm mt-1">
                        Mulai topup untuk melihat riwayat
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* KANAN - TOPUP */}
              <div className="bg-white rounded-3xl border p-6">
                <h3 className="text-xl font-black mb-6">
                  TOP UP DOMPET BELANJAIN
                </h3>

                {errorMessage && (
                  <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 rounded-2xl bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                <p className="text-xs font-bold text-slate-500 mb-3">
                  PILIH NOMINAL CEPAT
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {nominalList.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`h-12 rounded-xl border font-bold ${
                        selectedAmount === amount && !customAmount
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      Rp {amount.toLocaleString("id-ID")}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-slate-500 mt-6 mb-2">
                  ATAU NOMINAL CUSTOM
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value.replace(/\D/g, ""));
                    setSelectedAmount(null);
                  }}
                  placeholder="Minimal Rp10.000"
                  className="w-full h-12 border rounded-xl px-4 outline-none"
                />

                <p className="text-xs font-bold text-slate-500 mt-6 mb-3">
                  PILIH METODE PEMBAYARAN
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`w-full p-4 rounded-2xl border text-left ${
                      paymentMethod === "qris"
                        ? "border-blue-600 bg-blue-50"
                        : ""
                    }`}
                  >
                    <p className="font-bold">QRIS / QRIS GPN</p>
                    <p className="text-xs text-slate-400">
                      Scan QR Aman 24 Jam
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("bca")}
                    className={`w-full p-4 rounded-2xl border text-left ${
                      paymentMethod === "bca"
                        ? "border-blue-600 bg-blue-50"
                        : ""
                    }`}
                  >
                    <p className="font-bold">BCA Virtual Account</p>
                    <p className="text-xs text-slate-400">
                      Transfer Nomor VA BCA
                    </p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("mandiri")}
                    className={`w-full p-4 rounded-2xl border text-left ${
                      paymentMethod === "mandiri"
                        ? "border-blue-600 bg-blue-50"
                        : ""
                    }`}
                  >
                    <p className="font-bold">Mandiri Virtual Account</p>
                    <p className="text-xs text-slate-400">
                      Transfer Nomor VA Mandiri
                    </p>
                  </button>
                </div>

                <button
                  onClick={handleTopup}
                  disabled={isSubmitting}
                  className={`w-full h-14 mt-6 rounded-2xl text-white font-black transition-all duration-200 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-white animate-pulse" />
                      Memproses...
                    </span>
                  ) : (
                    "BAYAR SEKARANG"
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  ⚠️ Mode simulasi - pembayaran otomatis berhasil
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaldoModal;
