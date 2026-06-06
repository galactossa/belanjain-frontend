import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  ShoppingBag,
  Heart,
  MessageCircle,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";

function Profile() {
  return (
    <CustomerLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <p className="text-blue-600 uppercase tracking-[4px] font-black">
            Profile
          </p>

          <h1 className="text-5xl font-black mt-3">
            Profil Saya
          </h1>

        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="col-span-4">

            {/* PROFILE CARD */}
            <div className="bg-white rounded-[35px] border shadow-sm p-8 text-center">

              {/* IMAGE */}
              <div className="relative w-fit mx-auto">

                <img
                  src="https://i.pravatar.cc/300"
                  alt="profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                />

                <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 duration-300">

                  <Camera size={20} />

                </button>

              </div>

              {/* NAME */}
              <h2 className="text-3xl font-black mt-6">
                Hamid Saputra
              </h2>

              <p className="text-slate-400 mt-2">
                Premium Customer
              </p>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 mt-10">

                {/* ORDERS */}
                <div className="bg-slate-50 rounded-3xl p-5">

                  <ShoppingBag
                    size={28}
                    className="mx-auto text-blue-600"
                  />

                  <h3 className="text-2xl font-black mt-3">
                    24
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Pesanan
                  </p>

                </div>

                {/* WISHLIST */}
                <div className="bg-slate-50 rounded-3xl p-5">

                  <Heart
                    size={28}
                    className="mx-auto text-red-500"
                  />

                  <h3 className="text-2xl font-black mt-3">
                    12
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Wishlist
                  </p>

                </div>

                {/* CHAT */}
                <div className="bg-slate-50 rounded-3xl p-5">

                  <MessageCircle
                    size={28}
                    className="mx-auto text-emerald-500"
                  />

                  <h3 className="text-2xl font-black mt-3">
                    8
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Chat
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-8 flex flex-col gap-8">

            {/* ACCOUNT */}
            <div className="bg-white rounded-[35px] border shadow-sm p-8">

              <h2 className="text-3xl font-black mb-8">
                Informasi Akun
              </h2>

              <div className="grid grid-cols-2 gap-6">

                {/* NAME */}
                <div>

                  <label className="font-bold text-slate-700 block mb-3">

                    Nama Lengkap

                  </label>

                  <div className="h-16 rounded-2xl border px-5 flex items-center gap-4">

                    <User
                      size={20}
                      className="text-slate-400"
                    />

                    <input
                      type="text"
                      defaultValue="Afryza Heryanto"
                      className="w-full outline-none"
                    />

                  </div>

                </div>

                {/* EMAIL */}
                <div>

                  <label className="font-bold text-slate-700 block mb-3">

                    Email

                  </label>

                  <div className="h-16 rounded-2xl border px-5 flex items-center gap-4">

                    <Mail
                      size={20}
                      className="text-slate-400"
                    />

                    <input
                      type="email"
                      defaultValue="afryza@gmail.com"
                      className="w-full outline-none"
                    />

                  </div>

                </div>

                {/* PHONE */}
                <div>

                  <label className="font-bold text-slate-700 block mb-3">

                    Nomor HP

                  </label>

                  <div className="h-16 rounded-2xl border px-5 flex items-center gap-4">

                    <Phone
                      size={20}
                      className="text-slate-400"
                    />

                    <input
                      type="text"
                      defaultValue="081234567890"
                      className="w-full outline-none"
                    />

                  </div>

                </div>

                {/* ADDRESS */}
                <div>

                  <label className="font-bold text-slate-700 block mb-3">

                    Alamat

                  </label>

                  <div className="h-16 rounded-2xl border px-5 flex items-center gap-4">

                    <MapPin
                      size={20}
                      className="text-slate-400"
                    />

                    <input
                      type="text"
                      defaultValue="Tangerang, Indonesia"
                      className="w-full outline-none"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* SECURITY */}
            <div className="bg-white rounded-[35px] border shadow-sm p-8">

              <h2 className="text-3xl font-black mb-8">
                Keamanan Akun
              </h2>

              <div className="flex flex-col gap-6">

                {/* PASSWORD */}
                <div>

                  <label className="font-bold text-slate-700 block mb-3">

                    Password

                  </label>

                  <div className="h-16 rounded-2xl border px-5 flex items-center gap-4">

                    <Lock
                      size={20}
                      className="text-slate-400"
                    />

                    <input
                      type="password"
                      defaultValue="123456789"
                      className="w-full outline-none"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-5">

              <button className="h-16 px-8 rounded-2xl border font-bold hover:bg-slate-100 duration-300">

                Batal

              </button>

              <button className="h-16 px-10 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 duration-300 shadow-xl">

                Simpan Perubahan

              </button>

            </div>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}

export default Profile;