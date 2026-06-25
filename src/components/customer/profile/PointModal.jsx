import { X, Trophy, Coins, Clock3, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../../api/api";

function PointModal({
  show,
  onClose,
  points,
  history: initialHistory,
  redeemVoucher,
}) {
  const [globalVouchers, setGlobalVouchers] = useState([]);
  const [history, setHistory] = useState(initialHistory || []);
  const [loading, setLoading] = useState(false);
  const [redeemingVoucherId, setRedeemingVoucherId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ================= FETCH VOUCHERS =================
  useEffect(() => {
    const fetchVouchers = async () => {
      if (!show) return;
      try {
        const response = await api.get("/voucher");
        setGlobalVouchers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, [show]);

  // ================= FETCH HISTORY =================
  useEffect(() => {
    const fetchHistory = async () => {
      if (!show || !currentUser?.id_pengguna) return;
      try {
        const response = await api.get(
          `/loyalty/history/${currentUser.id_pengguna}`,
        );
        setHistory(response.data.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [show, currentUser?.id_pengguna]);

  // ================= 🔥 REDEEM VOUCHER =================
  const handleRedeem = async (voucher) => {
    // Cek poin cukup
    if (points < voucher.pointCost) {
      setErrorMessage(
        `Poin tidak cukup. Butuh ${voucher.pointCost} poin, kamu punya ${points} poin.`,
      );
      return;
    }

    setRedeemingVoucherId(voucher.id_voucher);
    setErrorMessage("");

    try {
      const userId = currentUser?.id_pengguna || currentUser?.id;

      // 🔥 Panggil API redeem
      const response = await api.put("/loyalty/points/redeem", {
        id_pengguna: userId,
        poin_dipakai: voucher.pointCost,
      });

      console.log("✅ Redeem response:", response.data);

      // 🔥 Refresh points via callback
      if (redeemVoucher) {
        await redeemVoucher(voucher);
      }

      // 🔥 Refresh history
      const historyRes = await api.get(`/loyalty/history/${userId}`);
      setHistory(historyRes.data.data || []);

      // 🔥 Refresh global vouchers
      const voucherRes = await api.get("/voucher");
      setGlobalVouchers(voucherRes.data.data || []);

      setErrorMessage("✅ Voucher berhasil ditukar!");
      setTimeout(() => setErrorMessage(""), 3000);
    } catch (error) {
      console.error("❌ Error redeeming voucher:", error);
      console.error("❌ Error response:", error.response?.data);

      // 🔥 Tampilkan pesan error yang lebih jelas
      const errorMsg = error.response?.data?.message || "Gagal menukar voucher";
      if (
        errorMsg.includes("poin tidak mencukupi") ||
        errorMsg.includes("Poin tidak mencukupi")
      ) {
        setErrorMessage(`Poin tidak cukup untuk menukar voucher ini.`);
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setRedeemingVoucherId(null);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-50 w-full max-w-3xl rounded-3xl overflow-hidden h-[80vh] flex flex-col">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Trophy size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-black text-lg text-slate-800">
                Koin & Loyalitas
              </h2>
              <p className="text-xs text-slate-400">
                Kumpulkan poin untuk voucher
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* POINT CARD */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute right-5 top-5 opacity-10">
              <Coins size={120} />
            </div>
            <p className="text-sm uppercase">Total Poin Saat Ini</p>
            <h1 className="text-5xl font-black mt-2">
              {points.toLocaleString()}
            </h1>
            <p className="mt-3 text-sm opacity-90">
              Belanja lebih banyak untuk mendapatkan poin tambahan.
            </p>
          </div>

          {/* VOUCHER */}
          <h3 className="font-black text-slate-700 mt-8 mb-4">
            Tukarkan Poin Dengan Voucher
          </h3>

          {errorMessage && (
            <div
              className={`mb-4 rounded-2xl p-4 text-sm ${
                errorMessage.includes("berhasil") || errorMessage.includes("✅")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {errorMessage}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            {globalVouchers.length === 0 ? (
              <div className="col-span-3 text-center py-10 text-slate-400">
                <p className="font-semibold">Belum ada voucher tersedia</p>
                <p className="text-sm mt-1">
                  Kumpulkan poin dan cek kembali nanti
                </p>
              </div>
            ) : (
              globalVouchers.map((voucher) => {
                const isRedeeming = redeemingVoucherId === voucher.id_voucher;
                const canRedeem = points >= voucher.pointCost;

                return (
                  <div
                    key={voucher.id_voucher}
                    className="bg-white rounded-3xl border p-5 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={voucher.image || "https://via.placeholder.com/300"}
                      alt={voucher.kode}
                      className="w-full h-36 rounded-2xl object-cover mb-4"
                    />
                    <h4 className="font-black text-slate-800">
                      {voucher.kode}
                    </h4>
                    <p className="text-sm text-slate-500 min-h-[50px]">
                      {voucher.tipe_diskon === "persen"
                        ? `Diskon ${voucher.nilai_diskon}%`
                        : `Potongan Rp ${Number(voucher.nilai_diskon).toLocaleString("id-ID")}`}
                    </p>
                    <div className="text-orange-500 font-bold mt-2">
                      {voucher.pointCost} Poin
                    </div>
                    <button
                      onClick={() => handleRedeem(voucher)}
                      disabled={!canRedeem || isRedeeming}
                      className={`w-full h-11 rounded-xl mt-4 text-sm font-bold transition ${
                        isRedeeming
                          ? "bg-blue-400 text-white cursor-wait"
                          : canRedeem
                            ? "bg-slate-900 text-white hover:bg-black"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {isRedeeming
                        ? "MEMPROSES..."
                        : canRedeem
                          ? "TUKARKAN"
                          : `BUTUH ${voucher.pointCost - points} POIN LAGI`}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* HISTORY */}
          <h3 className="font-black text-slate-700 mt-10 mb-4">
            Riwayat Aktivitas Poin
          </h3>
          <div className="bg-white rounded-3xl overflow-hidden border">
            {history.length > 0 ? (
              history.map((item, index) => (
                <div
                  key={item.id_loyalty || index}
                  className="px-6 py-5 border-b last:border-b-0 flex justify-between items-center"
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.poin > 0 ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {item.poin > 0 ? (
                        <Plus size={18} className="text-green-600" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.sumber === "pembelian"
                          ? "🛒 Pembelian Produk"
                          : item.sumber === "redeem"
                            ? "🎁 Redeem Voucher"
                            : item.sumber === "topup"
                              ? "💰 Topup Saldo"
                              : item.sumber || "Aktivitas"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock3 size={12} />
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "-"}
                      </div>
                      {item.id_referensi && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Referensi: #{item.id_referensi}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`font-bold ${item.poin > 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {item.poin > 0 ? `+${item.poin}` : item.poin}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400">
                Belum ada riwayat poin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PointModal;
