import { X } from "lucide-react";

function LoginPopup({
  show,
  setShow,
}) {

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-5">

      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-8 shadow-2xl relative">

        {/* CLOSE */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"
        >

          <X size={18} />

        </button>

        <h2 className="text-3xl font-black text-center">
          Login Dulu
        </h2>

        <p className="text-slate-500 text-center mt-3">

          Anda harus login untuk menambahkan produk ke wishlist.

        </p>

        <button className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black mt-8 hover:bg-blue-700 duration-300">

          Login Sekarang

        </button>

      </div>

    </div>
  );
}

export default LoginPopup;