import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Truck,
  TicketPercent,
  ShieldCheck,
  Star,
  Copy,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";



function Checkout() {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("Reguler");
  const [selectedPayment, setSelectedPayment] = useState("BCA Virtual Account");
  const [rating, setRating] = useState(5);
  const [voucherCode, setVoucherCode] = useState("");
const [activeVoucher, setActiveVoucher] = useState(null);


const vouchers = [
  {
    id: 1,
    code: "HEMAT10",
    title: "Diskon 10% Seuasanya",
    desc: "Min. Belanja Rp 50.000",
    exp: "2026-12-31",
    discount: 10000,
  },
  {
    id: 2,
    code: "PROMO50K",
    title: "Potongan Belanja Rp 50.000",
    desc: "Min. Belanja Rp 200.000",
    exp: "2026-12-31",
    discount: 50000,
  },
];
 const [products, setProducts] = useState([]);

useEffect(() => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  setProducts(cart);
}, []);
 const subtotal = products.reduce(
  (total, item) =>
    total +
    Number(item.price || 0) *
    Number(item.qty || 1),
  0
);
  const shippingPrice =
    selectedShipping === "Cargo"
      ? 50000
      : selectedShipping === "Next Day"
      ? 35000
      : 15000;

  const discount = activeVoucher?.discount || 0;


const total =
  Number(subtotal) +
  Number(shippingPrice) -
  Number(discount);
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

const handleApplyVoucher = () => {
  const found = vouchers.find(
    (v) => v.code.toLowerCase() === voucherCode.toLowerCase()
  );

  if (found) {
    setActiveVoucher(found);
  } else {
    alert("Voucher tidak ditemukan");
  }
};

  if (products.length === 0) {
  return (
  <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
    <h1 className="text-3xl font-black text-slate-400">
      Cart kosong
    </h1>
  </div>
);
}

  return (
    
      <div className="bg-[#f5f7fb] min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-blue-600 uppercase tracking-[4px] font-black text-sm">
                Checkout
              </p>

              <h1 className="text-5xl font-black mt-3 text-slate-900">
                Selesaikan Pesanan
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-[2px]">
              <ShieldCheck size={18} />
              Dilindungi Escrow
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">
              {/* ADDRESS */}
              <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <MapPin size={28} className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-slate-900">
                        Alamat Pengiriman
                      </h2>

                      <p className="text-slate-400 text-sm mt-1">
                        Pastikan alamat sudah benar
                      </p>
                    </div>
                  </div>

                  <button className="text-blue-600 font-black text-sm">
                    Ubah Alamat
                  </button>
                </div>

                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                  <h3 className="font-black text-lg text-slate-900">
                    Hamid Saputra
                  </h3>

                  <p className="text-slate-500 mt-2">081234567890</p>

                  <p className="text-slate-500 mt-2 leading-relaxed">
                    Jl. Teknologi No. 42, Jakarta Selatan, DKI Jakarta 12345
                  </p>
                </div>
              </div>

              {/* SHIPPING */}
              <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Truck size={28} className="text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Pilihan Pengiriman
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                      Pilih layanan pengiriman
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      className={`rounded-3xl border-2 p-5 text-left duration-300 ${
                        selectedShipping === item.name
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <h3 className="font-black text-lg text-slate-900">
                        {item.name}
                      </h3>

                      <p className="text-[11px] uppercase tracking-[2px] text-slate-400 font-black mt-1">
                        {item.est}
                      </p>

                      <p className="text-blue-600 font-black mt-4">
                        {item.price}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <CreditCard size={28} className="text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Metode Pembayaran
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                      Pilih pembayaran favorit Anda
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => setSelectedPayment(method)}
                      className={`rounded-3xl border-2 p-5 flex items-center gap-4 duration-300 ${
                        selectedPayment === method
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          selectedPayment === method
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <CreditCard size={22} />
                      </div>

                      <div className="text-left">
                        <h3 className="font-black text-slate-900">
                          {method}
                        </h3>

                        <p className="text-[11px] uppercase tracking-[2px] text-slate-400 font-black mt-1">
                          Pembayaran Aman
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* VOUCHER */}
<div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
        <TicketPercent size={28} className="text-blue-600" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">
          Voucher & Promo Hemat
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Pilih promo terbaik untuk checkout Anda
        </p>
      </div>
    </div>

    <button
  onClick={removeVoucher}
  className="px-4 py-2 rounded-full bg-red-50 text-red-500 font-black text-xs"
>
  Lepas Voucher
</button>
  </div>

  {/* INPUT */}
  <div className="flex gap-3 mb-5">
    <input
      type="text"
      placeholder="Masukkan kode promo"
      value={voucherCode}
      onChange={(e) => setVoucherCode(e.target.value)}
      className="flex-1 h-14 rounded-2xl border border-slate-200 px-5 bg-slate-50 outline-none font-semibold"
    />

    <button
  onClick={handleApplyVoucher}
  className="px-8 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 duration-300"
>
  Pakai
</button>
  </div>

  {/* SUCCESS */}
 {activeVoucher && (
  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-600 font-black text-sm mb-6">
    Voucher {activeVoucher.code} berhasil dipasang!
  </div>
)}

  {/* LIST VOUCHER */}
  <div className="flex flex-col gap-4">
    {vouchers.map((voucher) => (
      <div
        key={voucher.id}
        className={`rounded-3xl border-2 overflow-hidden duration-300 ${
          activeVoucher?.id === voucher.id
            ? "border-blue-500"
            : "border-slate-200 hover:border-blue-300"
        }`}
      >
        <div className="flex">
          {/* LEFT */}
          <div className="w-32 bg-blue-600 text-white flex flex-col items-center justify-center relative">
            <TicketPercent size={28} />

            <p className="font-black text-xs uppercase tracking-[2px] mt-2">
              Voucher
            </p>

            <div className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white" />
            <div className="absolute -right-3 bottom-8 w-6 h-6 rounded-full bg-white" />
          </div>

          {/* RIGHT */}
          <div className="flex-1 p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-black text-slate-900">
                  {voucher.code}
                </h3>

                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[2px]">
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

            {voucher.active ? (
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
    ))}
  </div>
</div>

              {/* PRODUCTS */}
<div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm">
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-3xl font-black text-slate-900">
      Ringkasan Pesanan
    </h2>

    <p className="text-sm text-slate-400 font-black uppercase tracking-[2px]">
      {products.length} Produk
    </p>
  </div>

  <div className="flex flex-col gap-5">
    {products.map((item) => (
      <div
        key={item.id}
        className="flex items-center justify-between border border-slate-200 rounded-3xl p-5 hover:border-blue-300 duration-300"
      >
        <div className="flex items-center gap-5">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rounded-3xl object-cover"
          />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />

              <p className="text-[10px] uppercase tracking-[2px] text-blue-600 font-black">
                Official Store
              </p>
            </div>

            <h3 className="text-lg font-black text-slate-900 max-w-[420px] leading-snug">
              {item.name}
            </h3>

            <div className="flex items-center gap-3 mt-3">
              <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-black">
                Qty {item.qty || 1}
              </div>

              <p className="text-slate-400 text-sm font-semibold">
  Rp {Number(item.price || 0).toLocaleString("id-ID")}
</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-slate-400 text-xs uppercase tracking-[2px] font-black mb-2">
            Total
          </p>

          <h2 className="text-2xl font-black text-slate-900">
            Rp {(Number(item.qty || 1) * Number(item.price || 0)).toLocaleString("id-ID")}
          </h2>
        </div>
      </div>
    ))}
  </div>
</div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 xl:col-span-4">
              <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm sticky top-8">
                <h2 className="text-3xl font-black mb-8 text-slate-900">
                  Total Pembayaran
                </h2>

                <div className="flex flex-col gap-5 border-b border-slate-200 pb-6">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-500">
                      Subtotal
                    </p>

                    <h3 className="font-black text-slate-900">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-500">
                      Biaya Pengiriman
                    </p>

                    <h3 className="font-black text-slate-900">
                      Rp {shippingPrice.toLocaleString("id-ID")}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-blue-600">
                      Diskon Voucher
                    </p>

                    <h3 className="font-black text-blue-600">
                      -Rp {discount.toLocaleString("id-ID")}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <h2 className="text-2xl font-black text-slate-900">
                    Total
                  </h2>

                  <h1 className="text-4xl font-black text-blue-600">
                    Rp {total.toLocaleString("id-ID")}
                  </h1>
                </div>

              {discount > 0 && (
  <div className="bg-green-50 border border-green-200 rounded-3xl p-5 mt-6">
    <div className="flex items-center justify-between">
      <p className="font-black text-green-600 text-sm uppercase tracking-[2px]">
        Voucher Terpasang
      </p>

      <button
        onClick={() => {
          setDiscount(0);
          setVoucherCode("");
        }}
        className="text-red-500 font-black text-xs"
      >
        Batal
      </button>
    </div>

    <p className="text-green-600 text-sm mt-2 font-semibold">
      Kamu hemat Rp {discount.toLocaleString("id-ID")} dengan kode{" "}
      {voucherCode}!
    </p>
  </div>
)}

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full h-16 rounded-3xl bg-blue-600 text-white font-black text-xl mt-8 hover:bg-blue-700 duration-300 shadow-xl"
                >
                  Bayar Sekarang
                </button>

                <div className="flex items-center justify-center gap-3 mt-6 text-slate-400">
                  <ShieldCheck size={18} />

                  <p className="font-semibold text-sm">
                    Pembayaran Aman & Terjamin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT MODAL */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">
            <div className="w-full max-w-xl bg-white rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-[2px] w-fit mb-4">
                    Belanjain Escrow
                  </div>

                  <h2 className="text-3xl font-black text-slate-900">
                    {selectedPayment}
                  </h2>
                </div>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-red-500 duration-300"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-slate-50 border rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-[2px] font-black text-slate-400">
                      Nomor Virtual Account
                    </p>

                    <button className="flex items-center gap-2 text-blue-600 font-black text-sm">
                      <Copy size={16} /> Salin
                    </button>
                  </div>

                  <h1 className="text-3xl font-black tracking-[3px] text-slate-900">
                    80012081234567890
                  </h1>
                </div>

                <div className="bg-slate-50 border rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-[2px] font-black text-slate-400">
                      Jumlah Harus Dibayar
                    </p>

                    <button className="flex items-center gap-2 text-blue-600 font-black text-sm">
                      <Copy size={16} /> Salin
                    </button>
                  </div>

                  <h1 className="text-4xl font-black text-blue-600">
                    Rp {Number(total || 0).toLocaleString("id-ID")}
                  </h1>
                </div>

                <div className="bg-slate-50 border rounded-3xl p-5">
                  <h3 className="font-black text-blue-600 uppercase tracking-[2px] text-sm mb-4">
                    Langkah Cepat Pembayaran
                  </h3>

                  <div className="flex flex-col gap-3 text-slate-600 text-sm font-semibold leading-relaxed">
                    <p>1. Buka aplikasi mobile banking pilihan Anda.</p>
                    <p>2. Pilih menu transfer virtual account.</p>
                    <p>3. Tempel nomor VA yang telah disalin.</p>
                    <p>4. Pastikan nominal pembayaran sudah benar.</p>
                    <p>5. Masukkan PIN untuk menyelesaikan pembayaran.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
               <button
onClick={() => {

const orderData = {
products,
total,
status: "Menunggu Pembayaran",
date: new Date().toISOString(),
};

localStorage.setItem(
"orders",
JSON.stringify([
...(JSON.parse(localStorage.getItem("orders")) || []),
orderData,
])
);

localStorage.removeItem("cart");

setShowPaymentModal(false);

navigate("/customer/orders");

}}

className="flex-1 h-16 rounded-3xl bg-blue-600 text-white font-black text-lg shadow-xl hover:bg-blue-700 duration-300"
>
Selesai & Konfirmasi Bayar
</button>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-32 h-16 rounded-3xl bg-slate-100 text-slate-500 font-black text-lg"
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
