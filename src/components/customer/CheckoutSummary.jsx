import { ShieldCheck } from "lucide-react";

function CheckoutSummary({
  subtotal = 0,
  shippingPrice = 0,
  discount = 0,
  total = 0,
  activeVoucher,
  voucherCode,
  onRemoveVoucher,
  onCheckout,
  onCancel,
}) {
  return (
    <div className="bg-white rounded-[35px] border border-slate-200 p-8 shadow-sm sticky top-8">
      <h2 className="text-3xl font-black mb-8 text-slate-900">
        Total Pembayaran
      </h2>

      <div className="flex flex-col gap-5 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Subtotal</p>
          <h3 className="font-black text-slate-900">
            Rp {subtotal.toLocaleString("id-ID")}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-500">Biaya Pengiriman</p>
          <h3 className="font-black text-slate-900">
            Rp {shippingPrice.toLocaleString("id-ID")}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-semibold text-blue-600">Diskon Voucher</p>
          <h3 className="font-black text-blue-600">
            -Rp {discount.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-2xl font-black text-slate-900">Total</h2>
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
              type="button"
              onClick={onRemoveVoucher}
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
        type="button"
        onClick={onCheckout}
        className="w-full h-16 rounded-3xl bg-blue-600 text-white font-black text-xl mt-8 hover:bg-blue-700 duration-300 shadow-xl"
      >
        Bayar Sekarang
      </button>

      <div className="flex items-center justify-center gap-3 mt-6 text-slate-400">
        <ShieldCheck size={18} />
        <p className="font-semibold text-sm">Pembayaran Aman & Terjamin</p>
      </div>
    </div>
  );
}

export default CheckoutSummary;
