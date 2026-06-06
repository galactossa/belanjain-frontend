import {
  User,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  Store,
  X,
  ShoppingBag,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";

function Register({ setAuthModal }) {
  // ================= ROLE =================
  const [role, setRole] =
    useState("pembeli");

  // ================= SUCCESS =================
  const [success, setSuccess] =
    useState(false);

  // ================= PASSWORD =================
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  // ================= CATEGORY =================
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    showCategory,
    setShowCategory,
  ] = useState(false);

  // ================= FORM =================
  const [formData, setFormData] =
    useState({
      nama: "",
      alamat: "",
      phone: "",
      email: "",
      toko: "",
      password: "",
    });

  const categories = [
    "Elektronik",
    "Fashion",
    "Makanan & Minuman",
    "Kesehatan",
    "Lainnya",
  ];

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= REGISTER =================
  const handleRegister = (e) => {
    e.preventDefault();

    const {
      nama,
      alamat,
      phone,
      email,
      toko,
      password,
    } = formData;

    if (
      !nama ||
      !alamat ||
      !phone ||
      !email ||
      !password
    ) {
      alert("Semua form wajib diisi!");
      return;
    }

    if (
      role === "penjual" &&
      (!toko ||
        !selectedCategory)
    ) {
      alert(
        "Lengkapi data toko!"
      );
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...formData,
        role,
        category:
          selectedCategory,
      })
    );

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);

      setAuthModal("login");
    }, 2000);
  };

  // ================= GOOGLE =================
  const handleGoogleRegister = () => {
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);

      setAuthModal(null);
    }, 2000);
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
          <CheckCircle2
            className="text-green-500"
            size={22}
          />

          <div>
            <h3 className="text-sm font-black text-slate-800">
              Register Berhasil
            </h3>

            <p className="text-xs text-slate-500">
              Akun berhasil dibuat
            </p>
          </div>
        </div>
      )}

      {/* ================= CARD ================= */}
      <div
        className="
          relative
          w-full
          max-w-[1120px]
          h-[92vh]
          bg-white
          rounded-[34px]
          overflow-hidden
          shadow-[0_25px_80px_rgba(0,0,0,0.35)]
          grid
          md:grid-cols-[48%_52%]
        "
      >
        {/* ================= LEFT ================= */}
        <div
          className="
            hidden
            md:flex
            flex-col
            justify-center
            bg-gradient-to-br
            from-[#081028]
            via-[#071739]
            to-[#020617]
            px-16
            py-16
            text-white
          "
        >
          {/* LOGO */}
          <div className="flex items-center gap-4">

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-white
                flex
                items-center
                justify-center
              "
            >
              <ShoppingBag
                size={28}
                className="text-blue-600"
              />
            </div>

            <h1 className="text-4xl font-black">
              Belanja
              <span className="text-blue-400">
                In
              </span>
            </h1>

          </div>

          {/* TITLE */}
          <div className="mt-16">

            <h2
              className="
                text-[76px]
                leading-[82px]
                font-black
                tracking-[-2px]
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
                mt-10
                text-[26px]
                leading-[46px]
                text-slate-300
                max-w-[520px]
                font-medium
              "
            >
              Gabung dengan jutaan pengguna lainnya
              dan nikmati promo eksklusif setiap hari

            </p>

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div
          className="
            relative
            bg-white
            overflow-y-auto
          "
        >
          {/* CONTENT */}
          <div
            className="
              px-10
              md:px-14
              py-10
              min-h-full
            "
          >
            {/* CLOSE */}
            <button
              onClick={() =>
                setAuthModal(null)
              }
              className="
                absolute
                top-8
                right-8
                text-slate-400
                hover:text-black
                duration-300
              "
            >
              <ArrowLeft size={30} />
            </button>

            {/* TITLE */}
            <h1
              className="
                text-[58px]
                leading-tight
                font-black
                text-slate-900
              "
            >
              Bergabung
              <br />
              Sekarang
            </h1>

            <p
              className="
                text-[22px]
                text-slate-500
                mt-3
                leading-9
              "
            >
              Daftar sebagai{" "}
              {role === "pembeli"
                ? "Pembeli"
                : "Penjual"}{" "}
              untuk mulai berbelanja
            </p>

            {/* ROLE */}
            <div
              className="
                mt-10
                bg-slate-100
                rounded-[24px]
                p-2
                flex
                gap-3
              "
            >
              {/* PEMBELI */}
              <button
                type="button"
                onClick={() =>
                  setRole("pembeli")
                }
                className={`flex-1 h-16 rounded-2xl text-lg font-bold duration-300 ${
                  role === "pembeli"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-slate-500"
                }`}
              >
                Pembeli
              </button>

              {/* PENJUAL */}
              <button
                type="button"
                onClick={() =>
                  setRole("penjual")
                }
                className={`flex-1 h-16 rounded-2xl text-lg font-bold duration-300 ${
                  role === "penjual"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-slate-500"
                }`}
              >
                Penjual
              </button>
            </div>

            {/* ALERT */}
            {role === "penjual" && (
              <div
                className="
                  mt-6
                  bg-emerald-50
                  border
                  border-emerald-200
                  rounded-2xl
                  p-5
                  text-[16px]
                  text-emerald-700
                  leading-8
                  font-medium
                "
              >
                💡 Pengingat: Pendaftar harus sudah memiliki akun pembeli terlebih dahulu untuk membuka toko.
              </div>
            )}

            {/* ================= FORM ================= */}
            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-7"
            >
              {/* NAMA */}
              <div>
                <label
                  className="
                    text-[18px]
                    font-bold
                    text-slate-700
                  "
                >
                  Nama Lengkap
                </label>

                <div
                  className="
                    mt-3
                    h-16
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <User
                    size={22}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="nama"
                    value={
                      formData.nama
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Contoh: John Doe"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-[17px]
                    "
                  />
                </div>
              </div>

              {/* ALAMAT */}
              <div>
                <label
                  className="
                    text-[18px]
                    font-bold
                    text-slate-700
                  "
                >
                  Alamat Lengkap
                </label>

                <div
                  className="
                    mt-3
                    h-16
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <MapPin
                    size={22}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="alamat"
                    value={
                      formData.alamat
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Jl. Raya No. 123, Jakarta"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-[17px]
                    "
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  className="
                    text-[18px]
                    font-bold
                    text-slate-700
                  "
                >
                  No Handphone
                </label>

                <div
                  className="
                    mt-3
                    h-16
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <Phone
                    size={22}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="081234567890"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-[17px]
                    "
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  className="
                    text-[18px]
                    font-bold
                    text-slate-700
                  "
                >
                  Email
                </label>

                <div
                  className="
                    mt-3
                    h-16
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <Mail
                    size={22}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="nama@email.com"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-[17px]
                    "
                  />
                </div>
              </div>

              {/* TOKO */}
              {role ===
                "penjual" && (
                <>
                  <div>
                    <label
                      className="
                        text-[18px]
                        font-bold
                        text-slate-700
                      "
                    >
                      Nama Toko
                    </label>

                    <div
                      className="
                        mt-3
                        h-16
                        rounded-2xl
                        bg-slate-100
                        border
                        border-slate-200
                        px-5
                        flex
                        items-center
                        gap-4
                      "
                    >
                      <Store
                        size={22}
                        className="text-slate-400"
                      />

                      <input
                        type="text"
                        name="toko"
                        value={
                          formData.toko
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Contoh: Toko Berkah Jaya"
                        className="
                          w-full
                          bg-transparent
                          outline-none
                          text-[17px]
                        "
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="relative">
                    <label
                      className="
                        text-[18px]
                        font-bold
                        text-slate-700
                      "
                    >
                      Kategori Bisnis
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowCategory(
                          !showCategory
                        )
                      }
                      className="
                        mt-3
                        w-full
                        h-16
                        rounded-2xl
                        bg-slate-100
                        border
                        border-slate-200
                        px-5
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <div className="flex items-center gap-4">

                        <Store
                          size={22}
                          className="text-slate-400"
                        />

                        <span
                          className={`
                            text-[17px]
                            ${
                              selectedCategory
                                ? "text-slate-700"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {selectedCategory ||
                            "Pilih Kategori"}
                        </span>

                      </div>

                      <ChevronDown
                        size={22}
                        className="text-slate-400"
                      />
                    </button>

                    {/* DROPDOWN */}
                    {showCategory && (
                      <div
                        className="
                          absolute
                          top-[110px]
                          left-0
                          w-full
                          bg-white
                          border
                          border-slate-200
                          rounded-2xl
                          shadow-2xl
                          overflow-hidden
                          z-50
                        "
                      >
                        {categories.map(
                          (
                            item,
                            index
                          ) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(
                                  item
                                );

                                setShowCategory(
                                  false
                                );
                              }}
                              className="
                                w-full
                                px-6
                                h-16
                                text-left
                                text-[17px]
                                hover:bg-blue-50
                                duration-200
                              "
                            >
                              {item}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* PASSWORD */}
              <div>
                <label
                  className="
                    text-[18px]
                    font-bold
                    text-slate-700
                  "
                >
                  Kata Sandi
                </label>

                <div
                  className="
                    mt-3
                    h-16
                    rounded-2xl
                    bg-slate-100
                    border
                    border-slate-200
                    px-5
                    flex
                    items-center
                    gap-4
                  "
                >
                  <LockKeyhole
                    size={22}
                    className="text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="••••••••"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-[17px]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={22}
                        className="text-slate-400"
                      />
                    ) : (
                      <Eye
                        size={22}
                        className="text-slate-400"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  duration-300
                  text-white
                  text-[20px]
                  font-bold
                  shadow-xl
                  mt-2
                "
              >
                {role === "pembeli"
                  ? "Daftar sebagai Pembeli"
                  : "Daftar sebagai Penjual"}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-5 my-8">

              <div className="flex-1 h-[1px] bg-slate-200" />

              <span className="text-slate-400 text-sm font-semibold">

                ATAU

              </span>

              <div className="flex-1 h-[1px] bg-slate-200" />

            </div>

            {/* GOOGLE */}
            <button
              onClick={
                handleGoogleRegister
              }
              className="
                w-full
                h-16
                rounded-2xl
                border
                border-slate-200
                flex
                items-center
                justify-center
                gap-4
                hover:bg-slate-50
                duration-300
              "
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                alt="google"
                className="w-6 h-6"
              />

              <span
                className="
                  text-[18px]
                  font-semibold
                  text-slate-700
                "
              >
                Lanjutkan dengan Google
              </span>
            </button>

            {/* LOGIN */}
            <p
              className="
                text-center
                text-[17px]
                text-slate-500
                mt-8
              "
            >
              Sudah punya akun?

              <button
                onClick={() =>
                  setAuthModal("login")
                }
                className="
                  text-blue-600
                  font-bold
                  ml-2
                "
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;