import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  TicketPercent,
  ShieldCheck,
  Copy,
  X,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const verifyTimerRef = useRef(null);
  const [selectedShipping, setSelectedShipping] = useState("Reguler");
  const [selectedPayment, setSelectedPayment] = useState("BCA Virtual Account");
  const [voucherCode, setVoucherCode] = useState("");
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [recipientName, setRecipientName] = useState(
    currentUser?.shippingName || currentUser?.name || "",
  );
  const [recipientPhone, setRecipientPhone] = useState(
    currentUser?.shippingPhone ||
      currentUser?.phone ||
      currentUser?.phoneNumber ||
      "",
  );
  const [address, setAddress] = useState(
    currentUser?.shippingAddress ||
      currentUser?.alamat ||
      currentUser?.address ||
      "Jl. Teknologi No. 42, Jakarta Selatan, DKI Jakarta 12345",
  );
  const [products, setProducts] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const cart =
      JSON.parse(localStorage.getItem(`cart_${currentUser.id}`) || "[]") || [];
    setProducts(cart);
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const ownedVouchers =
      JSON.parse(localStorage.getItem(`myVoucher_${currentUser.id}`) || "[]") ||
      [];
    setMyVouchers(ownedVouchers);
  }, [currentUser?.id]);

  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, []);

  const subtotal = products.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 1),
    0,
  );

  const shippingPrice =
    selectedShipping === "Cargo"
      ? 50000
      : selectedShipping === "Next Day"
        ? 35000
        : 15000;

  const getVoucherDiscount = (voucher) => {
    if (!voucher) return 0;

    const minPurchase = Number(voucher.minPurchase || 0);
    if (subtotal < minPurchase) return 0;

    if (voucher.discountAmount) {
      return Number(voucher.discountAmount || 0);
    }

    if (voucher.discountPercent) {
      return Math.floor(
        (subtotal * Number(voucher.discountPercent || 0)) / 100,
      );
    }

    return 0;
  };

  const discount = getVoucherDiscount(activeVoucher);
  const total = Number(subtotal) + Number(shippingPrice) - Number(discount);

  const paymentMethods = [
    "BCA Virtual Account",
    "Mandiri Virtual Account",
    "BNI Virtual Account",
    "GoPay",
    "OVO Cash",
    "Dana",
    "Kartu Kredit",
    "BelanjaIn Paylater",
  ];

  const applyVoucher = (voucher) => {
    setActiveVoucher(voucher);
    setVoucherCode(voucher.code);
  };

  const removeVoucher = () => {
    setActiveVoucher(null);
    setVoucherCode("");
  };

  const handleBayarSekarang = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    verifyTimerRef.current = setTimeout(() => {
      setIsVerifying(false);
      setShowPaymentModal(true);
    }, 1600);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setIsVerifying(false);
    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
  };

  const handleApplyVoucher = () => {
    const found = myVouchers.find(
      (v) => v.code.toLowerCase() === voucherCode.toLowerCase(),
    );

    if (!found) {
      alert("Voucher tidak ditemukan");
      return;
    }

    const minPurchase = Number(found.minPurchase || 0);
    if (subtotal < minPurchase) {
      alert(
        `Minimal belanja Rp ${minPurchase.toLocaleString("id-ID")} untuk voucher ini`,
      );
      return;
    }

    setActiveVoucher(found);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <h1 className="text-3xl font-bold text-slate-400">Cart kosong</h1>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7fb] min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/customer")}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
            >
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
            <div>
              <p className="text-blue-600 uppercase tracking-[2px] font-bold text-xs">
                Checkout
              </p>
              <h1 className="text-3xl font-bold mt-2 text-slate-900">
                Selesaikan Pesanan
              </h1>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-[2px]">
            <ShieldCheck size={18} />
            Dilindungi Escrow
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <MapPin size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Alamat Pengiriman
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                      Pastikan alamat sudah benar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressEdit((prev) => !prev)}
                  className="text-blue-600 font-black text-sm"
                >
                  {showAddressEdit ? "Batal" : "Ubah Alamat"}
                </button>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
                {showAddressEdit ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Nama Penerima
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Nomor HP
                      </label>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Alamat Lengkap
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none resize-none"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updatedUser = {
                          ...currentUser,
                          shippingName: recipientName,
                          shippingPhone: recipientPhone,
                          shippingAddress: address,
                          alamat: address,
                          address,
                        };
                        localStorage.setItem(
                          "currentUser",
                          JSON.stringify(updatedUser),
                        );
                        setShowAddressEdit(false);
                      }}
                      className="mt-2 px-4 py-2 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 duration-300"
                    >
                      Simpan Alamat
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {recipientName || "Nama Penerima"}
                    </h3>
                    <p className="text-slate-500 mt-1 text-sm">
                      {recipientPhone || "081234567890"}
                    </p>
                    <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                      {address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Truck size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pilihan Pengiriman
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Pilih layanan pengiriman
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    name: "Reguler",
                    price: "Rp 15.000",
                    est: "Estimasi 2 - 4 Hari",
                  },
                  {
                    name: "Next Day",
                    price: "Rp 35.000",
                    est: "Estimasi 1 Hari",
                  },
                  {
                    name: "Cargo",
                    price: "Rp 50.000",
                    est: "Estimasi 5 - 7 Hari",
                  },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSelectedShipping(item.name)}
                    className={`rounded-2xl border-2 p-3 text-left duration-300 ${
                      selectedShipping === item.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <h3 className="font-bold text-base text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[1px] text-slate-400 font-bold mt-1">
                      {item.est}
                    </p>
                    <p className="text-blue-600 font-bold text-sm mt-2">
                      {item.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Metode Pembayaran
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Pilih pembayaran favorit Anda
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedPayment(method)}
                    className={`rounded-2xl border-2 p-3 flex items-center gap-3 duration-300 ${
                      selectedPayment === method
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        selectedPayment === method
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <CreditCard size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-sm text-slate-900">
                        {method}
                      </h3>
                      <p className="text-[9px] uppercase tracking-[1px] text-slate-400 font-bold mt-1">
                        Pembayaran Aman
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <TicketPercent size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Voucher & Promo
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                      Pilih promo terbaik
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeVoucher}
                  className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold"
                >
                  Lepas
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Kode promo"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 px-3 bg-slate-50 text-sm outline-none"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 duration-300"
                >
                  Pakai
                </button>
              </div>

              {activeVoucher && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-green-600 text-xs font-bold mb-3">
                  Voucher {activeVoucher.code} dipasang!
                </div>
              )}

              <div className="flex flex-col gap-3">
                {myVouchers.length > 0 ? (
                  myVouchers.map((voucher) => (
                    <div
                      key={`${voucher.id}-${voucher.code}`}
                      className={`rounded-2xl border-2 overflow-hidden duration-300 ${
                        activeVoucher?.id === voucher.id
                          ? "border-blue-500"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex">
                        <div className="w-24 bg-blue-600 text-white flex flex-col items-center justify-center relative">
                          <TicketPercent size={20} />
                          <p className="font-bold text-[9px] uppercase tracking-[1px] mt-1">
                            Voucher
                          </p>
                          <div className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white" />
                          <div className="absolute -right-3 bottom-8 w-6 h-6 rounded-full bg-white" />
                        </div>
                        <div className="flex-1 p-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 text-sm">
                                {voucher.code}
                              </h3>
                              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-[8px] font-bold uppercase tracking-[1px]">
                                Official
                              </span>
                            </div>
                            <p className="font-black text-lg text-slate-900">
                              {voucher.title}
                            </p>
                            <p className="text-slate-500 text-sm mt-2">
                              {voucher.desc}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              Berlaku s/d {voucher.exp}
                            </p>
                          </div>
                          {activeVoucher?.id === voucher.id ? (
                            <div className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-black uppercase tracking-[2px]">
                              Terpasang
                            </div>
                          ) : (
                            <button
                              onClick={() => applyVoucher(voucher)}
                              className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-[2px] hover:bg-blue-700 duration-300"
                            >
                              Pakai
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 p-4 text-center text-slate-500 text-sm">
                    Tidak ada voucher tersimpan. Silakan redeem di profile.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Ringkasan Pesanan
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[1px]">
                  {products.length} Produk
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-slate-200 rounded-2xl p-3 hover:border-blue-300 duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          <p className="text-[8px] uppercase tracking-[1px] text-blue-600 font-bold">
                            Official Store
                          </p>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 max-w-xs line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                            Qty {item.qty || 1}
                          </div>
                          <p className="text-slate-400 text-xs font-semibold">
                            Rp {Number(item.price || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-[9px] uppercase tracking-[1px] font-bold mb-1">
                        Total
                      </p>
                      <h2 className="text-lg font-bold text-slate-900">
                        Rp{" "}
                        {(
                          Number(item.qty || 1) * Number(item.price || 0)
                        ).toLocaleString("id-ID")}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">
                Total Pembayaran
              </h2>
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-500 text-sm">
                    Subtotal
                  </p>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-500 text-sm">
                    Biaya Pengiriman
                  </p>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Rp {shippingPrice.toLocaleString("id-ID")}
                  </h3>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-blue-600 text-sm">
                      Diskon Voucher
                    </p>
                    <h3 className="font-bold text-blue-600 text-sm">
                      -Rp {discount.toLocaleString("id-ID")}
                    </h3>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <h2 className="text-lg font-bold text-slate-900">Total</h2>
                <h1 className="text-2xl font-bold text-blue-600">
                  Rp {total.toLocaleString("id-ID")}
                </h1>
              </div>
              {!activeVoucher ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <TicketPercent size={14} className="text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs">
                        TIDAK ADA VOUCHER
                      </p>
                      <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">
                        Gunakan voucher hemat kami untuk mengurangi total.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-emerald-700 uppercase tracking-[1px] text-[9px]">
                        Voucher Terpasang
                      </p>
                      <p className="text-emerald-700 text-[10px] mt-1 font-semibold line-clamp-2">
                        Hemat Rp {discount.toLocaleString("id-ID")} dengan{" "}
                        {activeVoucher.code}!
                      </p>
                    </div>
                    <button
                      onClick={removeVoucher}
                      className="rounded-full bg-white border border-emerald-200 px-2 py-1 text-emerald-700 font-bold text-[9px] flex-shrink-0"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={handleBayarSekarang}
                disabled={isVerifying}
                className={`w-full h-12 rounded-2xl text-white font-bold text-base mt-4 shadow-xl duration-300 ${isVerifying ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isVerifying && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  <span>
                    {isVerifying ? "Memverifikasi..." : "Bayar Sekarang"}
                  </span>
                </div>
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
                <ShieldCheck size={14} />
                <p className="font-semibold text-xs">
                  Pembayaran Aman & Terjamin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold uppercase tracking-[1px] w-fit mb-2">
                  Belanjain Escrow
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedPayment}
                </h2>
              </div>
              <button
                onClick={closePaymentModal}
                className="text-slate-400 hover:text-red-500 duration-300"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400">
                    Nomor Virtual Account
                  </p>
                  <button className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                    <Copy size={12} /> Salin
                  </button>
                </div>
                <h1 className="text-2xl font-bold tracking-[2px] text-slate-900 break-all">
                  80012081234567890
                </h1>
              </div>

              <div className="bg-slate-50 border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] uppercase tracking-[1px] font-bold text-slate-400">
                    Jumlah Harus Dibayar
                  </p>
                  <button className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                    <Copy size={12} /> Salin
                  </button>
                </div>
                <h1 className="text-xl font-bold text-blue-600">
                  Rp {Number(total || 0).toLocaleString("id-ID")}
                </h1>
              </div>

              <div className="bg-slate-50 border rounded-2xl p-4">
                <h3 className="font-bold text-blue-600 uppercase tracking-[1px] text-xs mb-3">
                  Langkah Pembayaran
                </h3>
                <div className="flex flex-col gap-2 text-slate-600 text-xs font-semibold leading-relaxed">
                  <p>1. Buka aplikasi mobile banking.</p>
                  <p>2. Pilih menu transfer virtual account.</p>
                  <p>3. Tempel nomor VA yang disalin.</p>
                  <p>4. Pastikan nominal pembayaran benar.</p>
                  <p>5. Masukkan PIN untuk selesai.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  const currentUser =
                    JSON.parse(localStorage.getItem("currentUser")) || {};
                  const orderData = {
                    id: Date.now(),
                    userId: currentUser.id,
                    userName: currentUser.name,
                    userEmail: currentUser.email,
                    products,
                    sellerId: products[0]?.sellerId,
                    subtotal,
                    shippingPrice,
                    discount,
                    total,
                    shippingName: recipientName,
                    shippingPhone: recipientPhone,
                    shippingAddress: address,
                    address,
                    paymentMethod: selectedPayment,
                    shippingMethod: selectedShipping,
                    status: "Menunggu Pembayaran",
                    date: new Date().toISOString(),
                  };

                  const orderKey = `orders_${currentUser.id}`;
                  const allOrders =
                    JSON.parse(localStorage.getItem(orderKey) || "[]") || [];
                  localStorage.setItem(
                    orderKey,
                    JSON.stringify([...allOrders, orderData]),
                  );

                  const earnedPoints = Math.floor(total / 10000);
                  const currentPoints =
                    Number(localStorage.getItem(`points_${currentUser.id}`)) ||
                    currentUser?.points ||
                    1250;
                  const newPoints = currentPoints + earnedPoints;
                  if (currentUser.id) {
                    localStorage.setItem(`points_${currentUser.id}`, newPoints);
                  }

                  const pointHistory =
                    JSON.parse(
                      localStorage.getItem(`pointHistory_${currentUser.id}`) ||
                        "[]",
                    ) || [];
                  pointHistory.unshift({
                    title: "Belanja Berhasil",
                    point: `+${earnedPoints}`,
                    type: "plus",
                    date: new Date().toLocaleDateString("id-ID"),
                  });
                  localStorage.setItem(
                    `pointHistory_${currentUser.id}`,
                    JSON.stringify(pointHistory),
                  );

                  if (currentUser.id) {
                    localStorage.setItem(
                      "currentUser",
                      JSON.stringify({ ...currentUser, points: newPoints }),
                    );
                  }

                  localStorage.removeItem(`cart_${currentUser.id}`);
                  setProducts([]);
                  setShowPaymentModal(false);
                  navigate("/customer/orders");
                }}
                className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-xl hover:bg-blue-700 duration-300"
              >
                Selesai & Konfirmasi
              </button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-24 h-12 rounded-2xl bg-slate-100 text-slate-500 font-bold text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
