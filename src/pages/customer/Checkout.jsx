// ================= src/pages/customer/Checkout.jsx =================
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  TicketPercent,
  ShieldCheck,
  X,
} from "lucide-react";
import api from "../../api/api";
import PaymentModal from "./PaymentModal";

function Checkout() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const verifyTimerRef = useRef(null);
  const [selectedShipping, setSelectedShipping] = useState("Reguler");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [recipientName, setRecipientName] = useState(
    currentUser?.shippingName || currentUser?.name || "",
  );
  const [recipientPhone, setRecipientPhone] = useState(
    currentUser?.shippingPhone || currentUser?.phone || "",
  );
  const [address, setAddress] = useState(
    currentUser?.shippingAddress ||
      currentUser?.alamat ||
      "Jl. Teknologi No. 42, Jakarta Selatan",
  );
  const [products, setProducts] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // ================= CEK DIRECT CHECKOUT DI AWAL =================
  const getInitialProducts = () => {
    const directItem = localStorage.getItem("directCheckoutItem");
    if (directItem) {
      try {
        const parsed = JSON.parse(directItem);
        if (parsed && parsed.is_direct_checkout) {
          localStorage.removeItem("directCheckoutItem");
          return [
            {
              id_produk: parsed.id_produk,
              nama_produk: parsed.nama_produk,
              harga_produk: parsed.harga,
              url_gambar: parsed.url_gambar,
              jumlah: parsed.jumlah || 1,
            },
          ];
        }
      } catch (e) {
        console.error("Error parsing direct checkout item:", e);
      }
    }
    return null;
  };

  // ================= FETCH CART / DIRECT CHECKOUT =================
  useEffect(() => {
    if (!currentUser?.id_pengguna) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      try {
        const directItem = localStorage.getItem("directCheckoutItem");
        if (directItem) {
          try {
            const parsed = JSON.parse(directItem);
            if (parsed && parsed.is_direct_checkout) {
              setProducts([
                {
                  id_produk: parsed.id_produk,
                  nama_produk: parsed.nama_produk,
                  harga_produk: parsed.harga,
                  url_gambar: parsed.url_gambar,
                  jumlah: parsed.jumlah || 1,
                },
              ]);
              localStorage.removeItem("directCheckoutItem");
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error parsing direct checkout item:", e);
          }
        }

        const response = await api.get(
          `/keranjang/pengguna/${currentUser.id_pengguna}`,
        );
        setProducts(response.data.data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [currentUser?.id_pengguna]);

  // ================= FETCH ADDRESSES =================
  useEffect(() => {
    if (!currentUser?.id_pengguna) return;
    const fetchAddresses = async () => {
      try {
        const response = await api.get(
          `/alamat/pengguna/${currentUser.id_pengguna}`,
        );
        setAddresses(response.data.data || []);
        const primary = response.data.data.find((a) => a.utama);
        if (primary) {
          setSelectedAddressId(primary.id_alamat);
          setRecipientName(primary.nama_penerima);
          setRecipientPhone(primary.telepon);
          setAddress(primary.alamat);
        } else if (response.data.data.length > 0) {
          setSelectedAddressId(response.data.data[0].id_alamat);
          setRecipientName(response.data.data[0].nama_penerima);
          setRecipientPhone(response.data.data[0].telepon);
          setAddress(response.data.data[0].alamat);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [currentUser?.id_pengguna]);

  // ================= FETCH VOUCHERS =================
  useEffect(() => {
    if (!currentUser?.id_pengguna) return;
    const fetchVouchers = async () => {
      try {
        const response = await api.get("/voucher");
        setMyVouchers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, [currentUser?.id_pengguna]);

  // ================= FETCH PAYMENT METHODS =================
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!currentUser?.id_pengguna) return;
      setLoadingPayment(true);
      try {
        const response = await api.get("/payment/methods");
        console.log("🔍 Payment methods response:", response.data);

        let methods = [];

        if (response.data?.data?.data) {
          methods = response.data.data.data;
        } else if (response.data?.data) {
          methods = response.data.data;
        } else if (Array.isArray(response.data)) {
          methods = response.data;
        }

        console.log("🔍 Methods after parsing:", methods);

        const formattedMethods = methods.map((method) => ({
          id: method.bank_code || method.payment_type || method.id,
          name: method.display_name || method.name || method.bank_code,
          type: method.payment_type || method.type || "bank_transfer",
          channel_code: method.bank_code || method.channel_code || method.id,
          logo_url: method.logo_url || null,
          min_amount: method.min_amount || 0,
          max_amount: method.max_amount || 0,
        }));

        console.log("🔍 Formatted methods:", formattedMethods);

        setPaymentMethods(formattedMethods);
        if (formattedMethods.length > 0) {
          setSelectedPayment(formattedMethods[0].id);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        setPaymentMethods([
          {
            id: "bca_va",
            name: "BCA Virtual Account",
            type: "bank_transfer",
            channel_code: "BCA",
          },
          {
            id: "mandiri_va",
            name: "Mandiri Virtual Account",
            type: "bank_transfer",
            channel_code: "MANDIRI",
          },
          {
            id: "bni_va",
            name: "BNI Virtual Account",
            type: "bank_transfer",
            channel_code: "BNI",
          },
          { id: "qris", name: "QRIS", type: "qris", channel_code: "QRIS" },
        ]);
        setSelectedPayment("bca_va");
      } finally {
        setLoadingPayment(false);
      }
    };
    fetchPaymentMethods();
  }, [currentUser?.id_pengguna]);

  useEffect(() => {
    return () => {
      if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
    };
  }, []);

  // ================= PERHITUNGAN =================
  const subtotal = products.reduce(
    (total, item) =>
      total + Number(item.harga_produk || 0) * Number(item.jumlah || 1),
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
    const minPurchase = Number(voucher.minimal_belanja || 0);
    if (subtotal < minPurchase) return 0;
    if (voucher.tipe_diskon === "persen") {
      return Math.floor((subtotal * Number(voucher.nilai_diskon || 0)) / 100);
    }
    return Number(voucher.nilai_diskon || 0);
  };

  const discount = getVoucherDiscount(activeVoucher);
  const total = Number(subtotal) + Number(shippingPrice) - Number(discount);

  const applyVoucher = (voucher) => {
    setActiveVoucher(voucher);
    setVoucherCode(voucher.kode);
  };

  const removeVoucher = () => {
    setActiveVoucher(null);
    setVoucherCode("");
  };

  // ================= HANDLE BAYAR (SIMULASI) =================
  const handleBayarSekarang = async () => {
    console.log("🔍 handleBayarSekarang called");

    if (isVerifying || creatingPayment) {
      console.log("⏳ Already processing, skipping...");
      return;
    }

    if (!selectedAddressId) {
      alert("Pilih alamat pengiriman terlebih dahulu");
      return;
    }

    setCreatingPayment(true);
    setIsVerifying(true);

    try {
      // 1. Buat pesanan di database
      console.log("📡 Creating order...");
      const orderPayload = {
        id_pengguna: currentUser.id_pengguna,
        id_alamat: selectedAddressId,
        id_voucher: activeVoucher?.id_voucher || null,
        metode_pembayaran: selectedPayment,
      };

      const orderResponse = await api.post("/pesanan", orderPayload);
      console.log("✅ Order created:", orderResponse.data);

      const order = orderResponse.data.data;
      const newOrderId = order.id_pesanan;
      setOrderId(newOrderId);

      // 2. Tampilkan modal pembayaran (SIMULASI)
      console.log("📡 Showing payment modal...");
      setShowPaymentModal(true);

      // 3. Reset state
      setIsVerifying(false);
      setCreatingPayment(false);
    } catch (error) {
      console.error("❌ Checkout error:", error);
      alert(
        error.response?.data?.message || "Checkout gagal, silakan coba lagi",
      );
      setIsVerifying(false);
      setCreatingPayment(false);
    }
  };

  // ================= HANDLE PAYMENT SUCCESS =================
  const handlePaymentSuccess = async () => {
    console.log("✅ Payment success, clearing cart...");
    try {
      await api.delete(`/keranjang/pengguna/${currentUser.id_pengguna}/clear`);
      localStorage.removeItem("directCheckoutItem");
      console.log("✅ Cart cleared");
    } catch (error) {
      console.warn("Clear cart error:", error);
    }
  };

  const closePaymentModal = () => {
    console.log("🔍 Closing payment modal");
    setShowPaymentModal(false);
    setPaymentData(null);
    setIsVerifying(false);
    if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current);
  };

  const handleApplyVoucher = () => {
    const found = myVouchers.find(
      (v) => v.kode.toLowerCase() === voucherCode.toLowerCase(),
    );
    if (!found) {
      alert("Voucher tidak ditemukan");
      return;
    }
    const minPurchase = Number(found.minimal_belanja || 0);
    if (subtotal < minPurchase) {
      alert(
        `Minimal belanja Rp ${minPurchase.toLocaleString("id-ID")} untuk voucher ini`,
      );
      return;
    }
    setActiveVoucher(found);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-slate-400">
            Keranjang Kosong
          </h1>
          <p className="text-slate-500 mt-2">
            Belum ada produk di keranjang Anda
          </p>
          <button
            onClick={() => navigate("/customer")}
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700"
          >
            Belanja Sekarang
          </button>
        </div>
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
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
            {/* ADDRESS SELECTION */}
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
                      Pilih alamat pengiriman
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/customer/profile")}
                  className="text-blue-600 font-black text-sm"
                >
                  + Tambah
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                  <p className="text-slate-500">
                    Belum ada alamat. Tambah alamat dulu!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id_alamat}
                      onClick={() => {
                        setSelectedAddressId(addr.id_alamat);
                        setRecipientName(addr.nama_penerima);
                        setRecipientPhone(addr.telepon);
                        setAddress(addr.alamat);
                      }}
                      className={`border rounded-2xl p-4 cursor-pointer transition ${
                        selectedAddressId === addr.id_alamat
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold">{addr.nama_penerima}</h3>
                          <p className="text-sm text-slate-500">
                            {addr.telepon}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {addr.alamat}, {addr.kota}
                          </p>
                        </div>
                        {addr.utama && (
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                            UTAMA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SHIPPING OPTIONS */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Truck size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pilihan Pengiriman
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: "Reguler", price: "Rp 15.000", est: "2-4 Hari" },
                  { name: "Next Day", price: "Rp 35.000", est: "1 Hari" },
                  { name: "Cargo", price: "Rp 50.000", est: "5-7 Hari" },
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
                    <p className="text-[10px] uppercase text-slate-400 font-bold mt-1">
                      {item.est}
                    </p>
                    <p className="text-blue-600 font-bold text-sm mt-2">
                      {item.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Metode Pembayaran
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {loadingPayment
                      ? "Memuat metode..."
                      : `${paymentMethods.length} metode tersedia`}
                  </p>
                </div>
              </div>

              {loadingPayment ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>Tidak ada metode pembayaran tersedia</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const isSelected =
                      selectedPayment === method.id ||
                      selectedPayment === method.channel_code;
                    return (
                      <button
                        key={method.id || method.channel_code || method.name}
                        onClick={() => {
                          setSelectedPayment(method.id || method.channel_code);
                          console.log("✅ Selected payment:", method);
                        }}
                        className={`rounded-2xl border-2 p-3 flex items-center gap-3 duration-300 ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {method.logo_url ? (
                            <img
                              src={method.logo_url}
                              alt={method.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <CreditCard size={18} />
                          )}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-bold text-sm text-slate-900">
                            {method.name}
                          </h3>
                          <p className="text-[10px] text-slate-400">
                            {method.type === "va"
                              ? "Virtual Account"
                              : method.type === "qris"
                                ? "QRIS Payment"
                                : method.type || "Payment"}
                          </p>
                          {method.min_amount > 0 && (
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              Min. Rp{" "}
                              {method.min_amount.toLocaleString("id-ID")}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VOUCHER */}
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
                  </div>
                </div>
                {activeVoucher && (
                  <button
                    onClick={removeVoucher}
                    className="px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold"
                  >
                    Lepas
                  </button>
                )}
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
                  Voucher {activeVoucher.kode} dipasang! Hemat Rp{" "}
                  {discount.toLocaleString("id-ID")}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {myVouchers.length > 0 ? (
                  myVouchers.slice(0, 3).map((voucher) => (
                    <div
                      key={voucher.id_voucher}
                      className={`rounded-2xl border-2 overflow-hidden duration-300 ${
                        activeVoucher?.id_voucher === voucher.id_voucher
                          ? "border-blue-500"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex">
                        <div className="w-24 bg-blue-600 text-white flex flex-col items-center justify-center relative">
                          <TicketPercent size={20} />
                          <p className="font-bold text-[9px] uppercase">
                            Voucher
                          </p>
                        </div>
                        <div className="flex-1 p-3 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              {voucher.kode}
                            </h3>
                            <p className="text-slate-400 text-xs">
                              Min. Belanja Rp{" "}
                              {Number(
                                voucher.minimal_belanja || 0,
                              ).toLocaleString("id-ID")}
                            </p>
                          </div>
                          {activeVoucher?.id_voucher === voucher.id_voucher ? (
                            <div className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-black">
                              Terpasang
                            </div>
                          ) : (
                            <button
                              onClick={() => applyVoucher(voucher)}
                              className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-black hover:bg-blue-700"
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
                    Tidak ada voucher tersedia.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
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
              <button
                onClick={handleBayarSekarang}
                disabled={isVerifying || creatingPayment || !selectedAddressId}
                className={`w-full h-12 rounded-2xl text-white font-bold text-base mt-4 shadow-xl duration-300 ${
                  isVerifying || creatingPayment || !selectedAddressId
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {(isVerifying || creatingPayment) && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  <span>
                    {isVerifying || creatingPayment
                      ? "Memproses..."
                      : "Bayar Sekarang"}
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

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        orderId={orderId || "..."}
        totalAmount={total}
        paymentMethod={selectedPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default Checkout;
