import { useState } from "react";

import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  X,
} from "lucide-react";

function ForgotPassword({
  setAuthModal,
}) {

  const [email, setEmail] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  // ================= SEND RESET =================
  const handleReset = () => {

    if (!email) {
      alert("Masukkan email terlebih dahulu");
      return;
    }

    setSuccess(true);

    setTimeout(() => {

      setSuccess(false);

    }, 3000);
  };

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        px-4
      "
    >

      {/* ================= SUCCESS ================= */}
      {success && (

        <div
          className="
            fixed
            top-6
            right-6
            z-[99999]
            bg-white
            border
            border-green-200
            shadow-2xl
            rounded-2xl
            px-5
            py-4
            flex
            items-center
            gap-3
            animate-bounce
          "
        >

          <CheckCircle2
            className="text-green-500"
            size={24}
          />

          <div>

            <h3 className="font-black text-slate-800 text-sm">

              Link Berhasil Dikirim

            </h3>

            <p className="text-xs text-slate-500">

              Silahkan cek email kamu

            </p>

          </div>

        </div>

      )}

      {/* ================= CARD ================= */}
      <div
        className="
          relative
          w-full
          max-w-xl
          bg-white
          rounded-[30px]
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
          overflow-hidden
        "
      >

        {/* TOP */}
        <div
          className="
            bg-gradient-to-r
            from-blue-600
            to-blue-800
            px-10
            py-10
            text-white
            relative
          "
        >

          {/* CLOSE */}
          <button
            onClick={() =>
              setAuthModal(null)
            }
            className="
              absolute
              top-5
              right-5
              w-10
              h-10
              rounded-xl
              bg-white/20
              hover:bg-white/30
              duration-300
              flex
              items-center
              justify-center
            "
          >

            <X size={18} />

          </button>

          <h1 className="text-4xl font-black">

            Forgot Password

          </h1>

          <p className="mt-4 text-blue-100 leading-relaxed">

            Masukkan email akunmu dan kami akan
            mengirim link reset password.

          </p>

        </div>

        {/* BODY */}
        <div className="px-10 py-10">

          {/* EMAIL */}
          <div>

            <label className="text-sm font-bold text-slate-700">

              Email

            </label>

            <div
              className="
                mt-3
                h-14
                rounded-2xl
                bg-slate-100
                border
                border-slate-200
                px-4
                flex
                items-center
                gap-3
              "
            >

              <Mail
                size={18}
                className="text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Masukkan email"
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                "
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleReset}
            className="
              w-full
              h-14
              rounded-2xl
              bg-blue-600
              hover:bg-blue-700
              duration-300
              text-white
              font-bold
              text-sm
              mt-8
              shadow-lg
            "
          >

            Kirim Link Reset

          </button>

          {/* BACK */}
          <button
            onClick={() =>
              setAuthModal("login")
            }
            className="
              mt-7
              w-full
              flex
              items-center
              justify-center
              gap-2
              text-blue-600
              font-bold
              text-sm
            "
          >

            <ArrowLeft size={16} />

            Kembali ke Login

          </button>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;