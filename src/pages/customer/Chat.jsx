import {
  Search,
  SendHorizonal,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";

import CustomerLayout from "../../layouts/CustomerLayout";

function Chat() {
  const chats = [
    {
      id: 1,
      name: "Toko Hamid Jaya",
      message: "Produk ready kak",
      active: true,
    },
    {
      id: 2,
      name: "Electro Store",
      message: "Pesanan sedang dikirim",
      active: false,
    },
    {
      id: 3,
      name: "Fashion Style",
      message: "Terima kasih sudah order",
      active: false,
    },
  ];

  return (
    <CustomerLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <p className="text-blue-600 uppercase tracking-[4px] font-black">
            Chat
          </p>

          <h1 className="text-5xl font-black mt-3">
            Obrolan Penjual
          </h1>

        </div>

        {/* CHAT CONTAINER */}
        <div className="bg-white rounded-[35px] border shadow-sm overflow-hidden h-[750px] flex">

          {/* ================= LEFT ================= */}
          <div className="w-[360px] border-r flex flex-col">

            {/* SEARCH */}
            <div className="p-5 border-b">

              <div className="bg-slate-100 h-14 rounded-2xl px-4 flex items-center">

                <Search
                  size={18}
                  className="text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Cari chat..."
                  className="bg-transparent outline-none w-full px-3"
                />

              </div>

            </div>

            {/* LIST */}
            <div className="flex-1 overflow-auto">

              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`px-5 py-5 border-b cursor-pointer duration-300 ${
                    chat.active
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    {/* AVATAR */}
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl">

                      {chat.name.charAt(0)}

                    </div>

                    {/* TEXT */}
                    <div className="flex-1">

                      <h2 className="font-black text-slate-900">
                        {chat.name}
                      </h2>

                      <p className="text-slate-400 text-sm mt-1 line-clamp-1">
                        {chat.message}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex-1 flex flex-col">

            {/* TOP */}
            <div className="h-24 border-b px-8 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl">

                  T

                </div>

                <div>

                  <h2 className="text-xl font-black">
                    Toko Hamid Jaya
                  </h2>

                  <p className="text-emerald-500 font-semibold">
                    Online
                  </p>

                </div>

              </div>

              {/* ACTION */}
              <div className="flex items-center gap-4">

                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                  <Phone size={20} />

                </button>

                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                  <Video size={20} />

                </button>

                <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">

                  <MoreVertical size={20} />

                </button>

              </div>

            </div>

            {/* CHAT BODY */}
            <div className="flex-1 p-8 overflow-auto bg-[#f8fafc]">

              {/* SELLER */}
              <div className="flex mb-6">

                <div className="bg-white shadow-sm rounded-[24px] rounded-tl-none px-6 py-4 max-w-[400px]">

                  <p className="text-slate-700">
                    Halo kak, ada yang bisa dibantu?
                  </p>

                </div>

              </div>

              {/* CUSTOMER */}
              <div className="flex justify-end mb-6">

                <div className="bg-blue-600 text-white rounded-[24px] rounded-br-none px-6 py-4 max-w-[400px]">

                  <p>
                    Apakah produk masih tersedia?
                  </p>

                </div>

              </div>

              {/* SELLER */}
              <div className="flex mb-6">

                <div className="bg-white shadow-sm rounded-[24px] rounded-tl-none px-6 py-4 max-w-[400px]">

                  <p className="text-slate-700">
                    Ready kak, bisa langsung checkout ya.
                  </p>

                </div>

              </div>

            </div>

            {/* INPUT */}
            <div className="p-6 border-t bg-white">

              <div className="flex items-center gap-4">

                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  className="flex-1 h-14 bg-slate-100 rounded-2xl px-6 outline-none"
                />

                <button className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 duration-300">

                  <SendHorizonal size={22} />

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </CustomerLayout>
  );
}

export default Chat;