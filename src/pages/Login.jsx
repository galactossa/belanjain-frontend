import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  ShoppingBag,
  Store,
  Lock,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
} from "lucide-react";
import logo from "../assets/logo.jpeg";

function Login({ setAuthModal }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("pembeli");
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= LOGIN =================
  const handleLogin = async () => {
    setLoginError("");

    if (!email || !password) {
      setLoginError("Lengkapi data login");
      return;
    }

    setLoadingLogin(true);

    try {
      const response = await api.post("/pengguna/login", {
        email,
        password,
      });

      const { token, pengguna } = response.data.data;

      // Simpan token & user
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(pengguna));

      setLoginSuccess(true);

      // Trigger event untuk navbar
      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        setLoadingLogin(false);
        setLoginSuccess(false);
        setAuthModal(null);

        // Redirect berdasarkan role
        if (pengguna.role === "admin") {
          navigate("/admin");
        } else if (pengguna.role === "penjual") {
          navigate("/seller");
        } else {
          navigate("/customer");
        }
      }, 1500);
    } catch (error) {
      setLoadingLogin(false);
      setLoginError(error.response?.data?.message || "Login gagal");
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    // Redirect ke backend Google OAuth
    window.location.href = `${
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"
    }/auth/google`;
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
py-5
"
    >
      {/* ================= GOOGLE SUCCESS ================= */}
      {googleSuccess && (
        <div
          className="
          fixed
          top-6
          right-6
          z-[999]
          bg-white
          border
          border-green-200
          rounded-2xl
          shadow-2xl
          px-5
          py-4
          flex
          items-center
          gap-3
          animate-bounce
        "
        >
          <CheckCircle2 size={22} className="text-green-500" />

          <div>
            <h3 className="text-sm font-black text-slate-800">
              Login Berhasil
            </h3>

            <p className="text-xs text-slate-500">
              Berhasil masuk menggunakan Google
            </p>
          </div>
        </div>
      )}

      {/* ================= LOGIN CARD ================= */}
      <div
        className="
        relative
        z-10
        w-full
        max-w-[860px]
        min-h-[560px]
        rounded-[28px]
        overflow-hidden
        bg-white
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        grid
        md:grid-cols-[45%_55%]
      "
      >
        {/* ================= LEFT ================= */}
        <div
          className="
hidden
md:flex
relative
bg-gradient-to-br
from-[#08142e]
via-[#071a45]
to-[#020817]
px-10
py-12
flex-col
justify-center
"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <img src={logo} alt="BelanjIn Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-black text-white">
                Belanja
                <span className="text-blue-300">In</span>
              </h1>
            </div>

            <div className="mt-14">
              <h2
                className="
text-white
text-[48px]
leading-[58px]
font-black
tracking-[-1px]
"
              >
                Mulai
                <br />
                Petualangan
                <br />
                Belanjamu
              </h2>

              <p
                className="
mt-6
text-[15px]
leading-[30px]
text-slate-300
max-w-[320px]
"
              >
                Gabung dengan jutaan pengguna lainnya dan nikmati promo
                eksklusif setiap hari.
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="
          relative
          bg-white
          px-10
          py-9
          flex
          flex-col
          justify-center
        "
        >
          <button
            onClick={() => setAuthModal(null)}
            className="
              absolute
              top-6
              right-6
              w-9
              h-9
              rounded-xl
              bg-slate-100
              hover:bg-slate-200
              flex
              items-center
              justify-center
              duration-300
            "
          >
            <X size={18} />
          </button>

          <h1
            className="
            text-[40px]
            font-black
            text-slate-900
            tracking-[-1px]
          "
          >
            Selamat Datang
          </h1>

          <p className="mt-2 text-sm text-slate-500">Masuk sebagai {role}</p>

          <div
            className="
            mt-7
            bg-slate-100
            rounded-2xl
            p-1
            flex
            gap-2
          "
          >
            <button
              onClick={() => setRole("pembeli")}
              className={`
                flex-1
                h-12
                rounded-xl
                text-sm
                font-bold
                flex
                items-center
                justify-center
                gap-2
                duration-300
                ${
                  role === "pembeli"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-slate-500"
                }
              `}
            >
              <ShoppingBag size={16} />
              Pembeli
            </button>

            <button
              onClick={() => setRole("penjual")}
              className={`
                flex-1
                h-12
                rounded-xl
                text-sm
                font-bold
                flex
                items-center
                justify-center
                gap-2
                duration-300
                ${
                  role === "penjual"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-slate-500"
                }
              `}
            >
              <Store size={16} />
              Penjual
            </button>
          </div>

          <div className="mt-8">
            <label className="text-sm font-bold text-slate-700">
              {role === "penjual" ? "Masukkan email" : "Email / Username"}
            </label>

            <div
              className="
              mt-2
              h-14
              rounded-2xl
              bg-slate-100
              border
              border-slate-200
              px-4
              flex
              items-center
            "
            >
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "penjual"
                    ? "Masukkan email"
                    : "Masukkan email atau username"
                }
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                "
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">
                Kata Sandi
              </label>

              <button
                onClick={() => setAuthModal("forgot")}
                className="
                  text-xs
                  font-bold
                  text-blue-600
                "
              >
                Lupa password?
              </button>
            </div>

            <div
              className="
              mt-2
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
              <Lock size={18} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-slate-400" />
                ) : (
                  <Eye size={18} className="text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loadingLogin}
            className={`
              w-full
              h-14
              rounded-2xl
              text-white
              font-bold
              mt-8
              shadow-lg
              duration-300
              ${loadingLogin ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            {loadingLogin ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Memuat {role === "pembeli" ? "pembeli" : "penjual"}...
              </span>
            ) : (
              `Masuk sebagai ${role}`
            )}
          </button>

          {loginError && (
            <p className="mt-3 text-sm text-red-500 font-semibold">
              {loginError}
            </p>
          )}

          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 h-[1px] bg-slate-200" />
            <span className="text-xs text-slate-400">ATAU</span>
            <div className="flex-1 h-[1px] bg-slate-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-slate-200
              mt-6
              flex
              items-center
              justify-center
              gap-3
              hover:bg-slate-50
              duration-300
            "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />

            <span className="text-sm font-semibold text-slate-700">
              Lanjutkan dengan Google
            </span>
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?
            <button
              onClick={() => setAuthModal("register")}
              className="
                text-blue-600
                font-bold
                ml-1
              "
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
