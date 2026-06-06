import {
  Bell,
  Lock,
  User,
  Store,
  ShieldCheck,
  Save,
  Image,
  ChevronRight,
  Award,
  Wallet,
  Gift,
  ArrowLeft,
  MapPin,
  Pencil,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";

function SettingsSeller() {

  return (

    <SellerLayout>

      <div className="w-full min-h-screen bg-[#f6f8fc] p-8">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-8">

          <div>

            <h1
              className="
              text-[42px]
              font-black
              uppercase
              text-slate-900
              leading-none
            "
            >

              Pengaturan

            </h1>

            <p
              className="
              text-slate-400
              text-sm
              mt-2
              uppercase
              tracking-[2px]
              font-black
            "
            >

              Kelola profil toko anda

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            <div
              className="
              h-12
              w-[280px]
              rounded-2xl
              bg-white
              border
              border-slate-200
              px-4
              flex
              items-center
              gap-3
              shadow-sm
            "
            >

              <input
                type="text"
                placeholder="Cari pengaturan..."
                className="
                bg-transparent
                outline-none
                w-full
                text-sm
                font-semibold
                placeholder:text-slate-400
              "
              />

            </div>

            <button
              className="
              h-12
              px-6
              rounded-2xl
              bg-blue-600
              text-white
              font-black
              text-sm
              shadow-lg
              hover:bg-blue-700
              duration-300
              flex
              items-center
              gap-2
            "
            >

              <Save size={18} />

              SIMPAN

            </button>

          </div>

        </div>

        {/* TOP BAR */}
        <div
          className="
          bg-white
          rounded-[30px]
          border
          border-slate-200
          px-7
          py-5
          flex
          items-center
          justify-between
          shadow-sm
        "
        >

          <div className="flex items-center gap-4">

            <button
              className="
              w-11
              h-11
              rounded-2xl
              bg-slate-100
              flex
              items-center
              justify-center
            "
            >

              <ArrowLeft size={18} />

            </button>

            <div>

              <h2 className="text-2xl font-black text-slate-900">

                Profil Saya

              </h2>

              <p className="text-slate-400 text-sm mt-1">

                Kelola informasi akun seller

              </p>

            </div>

          </div>

          <div
            className="
            bg-slate-100
            rounded-2xl
            p-1
            flex
            items-center
            gap-1
          "
          >

            <button
              className="
              h-10
              px-5
              rounded-xl
              bg-white
              text-blue-600
              font-black
              text-sm
              shadow-sm
            "
            >

              Profil Saya

            </button>

            <button
              className="
              h-10
              px-5
              rounded-xl
              text-slate-500
              font-black
              text-sm
            "
            >

              Pengaturan

            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div className="flex justify-center mt-8">

          <div className="w-full max-w-[980px]">

            {/* PROFILE CARD */}
            <div
              className="
              bg-white
              rounded-[34px]
              border
              border-slate-200
              p-7
              shadow-sm
            "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                  <div
                    className="
                    w-24
                    h-24
                    rounded-[28px]
                    bg-blue-600
                    text-white
                    text-4xl
                    font-black
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                  >

                    T

                  </div>

                  <div>

                    <div className="flex items-center gap-3">

                      <h2
                        className="
                        text-[34px]
                        font-black
                        text-slate-900
                      "
                      >

                        Toko Hamid Jaya

                      </h2>

                      <div
                        className="
                        px-4
                        py-1
                        rounded-full
                        bg-orange-100
                        text-orange-500
                        text-[11px]
                        font-black
                        tracking-[1px]
                        uppercase
                        flex
                        items-center
                        gap-1
                      "
                      >

                        <Award size={12} />

                        Gold Member

                      </div>

                    </div>

                    <p className="text-slate-400 mt-2 font-semibold">

                      seller@example.com

                    </p>

                  </div>

                </div>

                <button
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-slate-100
                  hover:bg-slate-200
                  duration-300
                  flex
                  items-center
                  justify-center
                "
                >

                  <Pencil
                    size={18}
                    className="text-slate-500"
                  />

                </button>

              </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-5 mt-5">

              <div
                className="
                bg-white
                rounded-[28px]
                border
                border-slate-200
                p-6
                shadow-sm
                flex
                flex-col
                items-center
                justify-center
              "
              >

                <div
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-orange-100
                  text-orange-500
                  flex
                  items-center
                  justify-center
                "
                >

                  <Award size={22} />

                </div>

                <p
                  className="
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  font-black
                  text-slate-400
                  mt-5
                "
                >

                  Poin Saya

                </p>

                <h2 className="text-3xl font-black mt-2">

                  1.250

                </h2>

              </div>

              <div
                className="
                bg-white
                rounded-[28px]
                border
                border-slate-200
                p-6
                shadow-sm
                flex
                flex-col
                items-center
                justify-center
              "
              >

                <div
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
                  flex
                  items-center
                  justify-center
                "
                >

                  <Gift size={22} />

                </div>

                <p
                  className="
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  font-black
                  text-slate-400
                  mt-5
                "
                >

                  Voucher

                </p>

                <h2 className="text-3xl font-black mt-2">

                  12

                </h2>

              </div>

              <div
                className="
                bg-white
                rounded-[28px]
                border
                border-slate-200
                p-6
                shadow-sm
                flex
                flex-col
                items-center
                justify-center
              "
              >

                <div
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-indigo-100
                  text-indigo-600
                  flex
                  items-center
                  justify-center
                "
                >

                  <Wallet size={22} />

                </div>

                <p
                  className="
                  text-[11px]
                  uppercase
                  tracking-[2px]
                  font-black
                  text-slate-400
                  mt-5
                "
                >

                  Saldo

                </p>

                <h2 className="text-3xl font-black mt-2">

                  Rp 250.000

                </h2>

              </div>

            </div>

            {/* LEVEL */}
            <div
              className="
              bg-white
              rounded-[32px]
              border
              border-slate-200
              p-7
              shadow-sm
              mt-5
            "
            >

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-black text-slate-900">

                  Progress Level

                </h2>

                <span
                  className="
                  text-sm
                  font-black
                  text-blue-600
                "
                >

                  Kejar Platinum

                </span>

              </div>

              <div
                className="
                w-full
                h-4
                rounded-full
                bg-slate-200
                overflow-hidden
                mt-7
              "
              >

                <div
                  className="
                  h-full
                  w-[65%]
                  rounded-full
                  bg-blue-600
                "
                ></div>

              </div>

              <div
                className="
                flex
                items-center
                justify-between
                mt-4
                text-[11px]
                uppercase
                tracking-[2px]
                font-black
                text-slate-400
              "
              >

                <span>Gold</span>

                <span>1.250 / 2.000 Poin Saya</span>

                <span>Platinum</span>

              </div>

            </div>

            {/* IDENTITAS */}
            <div
              className="
              bg-white
              rounded-[32px]
              border
              border-slate-200
              p-7
              shadow-sm
              mt-5
            "
            >

              <h2 className="text-2xl font-black text-slate-900">

                Informasi Identitas

              </h2>

              <div className="grid grid-cols-2 gap-5 mt-7">

                <div
                  className="
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                "
                >

                  <p
                    className="
                    text-[11px]
                    uppercase
                    tracking-[2px]
                    font-black
                    text-slate-400
                  "
                  >

                    Username

                  </p>

                  <h3
                    className="
                    text-xl
                    font-black
                    text-slate-900
                    mt-3
                  "
                  >

                    seller

                  </h3>

                </div>

                <div
                  className="
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                "
                >

                  <p
                    className="
                    text-[11px]
                    uppercase
                    tracking-[2px]
                    font-black
                    text-slate-400
                  "
                  >

                    Terdaftar Sejak

                  </p>

                  <h3
                    className="
                    text-xl
                    font-black
                    text-slate-900
                    mt-3
                  "
                  >

                    Januari 2024

                  </h3>

                </div>

              </div>

              {/* ADDRESS */}
              <button
                className="
                mt-5
                w-full
                h-16
                rounded-2xl
                bg-blue-50
                border
                border-blue-100
                px-5
                flex
                items-center
                justify-between
                hover:bg-blue-100
                duration-300
              "
              >

                <div className="flex items-center gap-3">

                  <MapPin
                    size={18}
                    className="text-blue-600"
                  />

                  <span
                    className="
                    font-black
                    text-blue-600
                  "
                  >

                    Kelola Daftar Alamat

                  </span>

                </div>

                <ChevronRight
                  size={18}
                  className="text-blue-600"
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </SellerLayout>
  );
}

export default SettingsSeller;