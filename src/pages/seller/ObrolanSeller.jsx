import {
  Search,
  Send,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  Smile,
  User,
  Bell,
} from "lucide-react";

import SellerLayout from "../../layouts/SellerLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
function ObrolanSeller() {
  const navigate = useNavigate();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedChat, setSelectedChat] = useState(1);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
   {
    id: 1,
    chatId: 1,
    sender: "customer",
    text: "Halo, apakah produk ini masih tersedia?",
    time: "09:45 PM",
  },

  {
    id: 2,
    chatId: 2,
    sender: "customer",
    text: "Kapan pesanan saya dikirim ya?",
    time: "10:00 PM",
  },

  {
    id: 3,
    chatId: 3,
    sender: "customer",
    text: "Terima kasih barang sudah sampai dengan aman!",
    time: "11:00 PM",
  },
]);

  const chats = [
    {
      id: 1,
      name: "Siti Aminah",
      message:
        "Halo, apakah produk ini masih tersedia?",
      time: "MAY 21",
      active: true,
      online: true,
    },

    {
      id: 2,
      name: "Budi Santoso",
      message:
        "Kapan pesanan saya dikirim ya?",
      time: "MAY 21",
      active: false,
      online: false,
    },

    {
      id: 3,
      name: "Andi Wijaya",
      message:
        "Terima kasih barang sudah sampai dengan aman!",
      time: "MAY 21",
      active: false,
      online: true,
    },
  ];
  const filteredChats = chats.filter(
    
  (chat) =>
    chat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    chat.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);
const handleSend = () => {
  if (!message.trim()) return;

  setMessages([
    ...messages,
    {
      id: Date.now(),
      chatId: selectedChat,
      sender: "seller",
      text: message,
      time: "Sekarang",
    },
  ]);

  setMessage("");
};
const selectedChatData = chats.find(
  (chat) => chat.id === selectedChat
);

  return (
    <SellerLayout>

      <div className="h-screen overflow-hidden bg-[#f4f5f7] p-4">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-5">

          {/* LEFT */}
          <div>

            <h1 className="text-[34px] leading-none font-black uppercase text-slate-900">

              OBROLAN

            </h1>

            <p className="text-[10px] tracking-[2px] font-black uppercase text-slate-400 mt-1">

              Berinteraksi langsung dengan pembeli anda.

            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="w-[320px] h-[44px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">

              <Search
                size={16}
                className="text-slate-400"
              />

              <input
  type="text"
  placeholder="Cari pesanan atau produk..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  className="w-full bg-transparent outline-none text-[12px] font-semibold"
/>

            </div>

            {/* NOTIF */}
            <button
  onClick={() => setShowNotif(!showNotif)}
  className="
    w-11
    h-11
    rounded-2xl
    bg-white
    border
    border-slate-200
    flex
    items-center
    justify-center
    shadow-sm
  "
>

              <Bell
                size={18}
                className="text-slate-500"
              />

            </button>
            {showNotif && (
  <div className="absolute right-0 top-14 w-72 bg-white border rounded-2xl shadow-lg p-4 z-50">
    <h3 className="font-bold mb-2">
      Notifikasi
    </h3>

    <p className="text-sm text-slate-500">
      Pesanan baru masuk
    </p>

    <p className="text-sm text-slate-500 mt-2">
      Chat baru dari pelanggan
    </p>
  </div>
)}

            {/* BUTTON */}
            <button
  onClick={() => navigate("/seller/add-product")}
  className="
    h-11
              px-5
              rounded-2xl
              bg-blue-600
              text-white
              font-black
              text-[12px]
              shadow-lg
            "
            >

              + PRODUK BARU

            </button>

          </div>

        </div>

        {/* CHAT CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[10px] overflow-hidden flex h-[calc(100vh-110px)]">

          {/* SIDEBAR */}
          <div className="w-[320px] border-r border-slate-200 bg-[#f8f8f8] flex flex-col">

            {/* TOP */}
            <div className="p-4 border-b border-slate-200">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                 <button
  onClick={() => navigate("/seller")}
  className="
    w-8
    h-8
    rounded-full
    bg-white
    border
    flex
    items-center
    justify-center
  "
>

                    <ArrowLeft
                      size={16}
                      className="text-slate-500"
                    />

                  </button>

                  <h2 className="font-black text-[18px] text-slate-900">

                    Pesan

                  </h2>

                </div>

                <button>

                  <MoreVertical
                    size={16}
                    className="text-slate-400"
                  />

                </button>

              </div>

              {/* SEARCH */}
              <div className="mt-4 h-[44px] rounded-2xl bg-slate-100 px-4 flex items-center gap-3">

                <Search
                  size={16}
                  className="text-slate-400"
                />

                <input
  type="text"
  placeholder="Cari percakapan..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  className="bg-transparent outline-none text-[12px] w-full"
/>

              </div>

            </div>

            {/* CHAT LIST */}
            <div className="flex-1 overflow-y-auto p-2">

              {filteredChats.map((chat) => (
                <div
               key={chat.id}
               onClick={() => setSelectedChat(chat.id)}
                  className={`
                    relative
                    rounded-[20px]
                    px-4
                    py-4
                    mb-2
                    cursor-pointer
                    duration-300
                    ${
                      selectedChat === chat.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "hover:bg-slate-100"
                    }
                  `}
                >

                  <div className="flex gap-3">

                    {/* AVATAR */}
                    <div className="relative">

                      <div
                        className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${
                          selectedChat === chat.id
    ? "text-white"
    : "text-slate-500"
                        }
                      `}
                      >

                        <User
                          size={20}
                          className={
  selectedChat === chat.id
    ? "text-white"
    : "text-slate-500"
}
                        />

                      </div>

                      {/* ONLINE */}
                      {chat.online && (
  <div
    className="
      absolute
      -bottom-1
      -right-1
      w-3
      h-3
      bg-emerald-400
      rounded-full
      border-2
      border-white
    "
  />
)}

                    </div>

                    {/* TEXT */}
                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                       <h3
  className={`
    text-[14px]
    font-black
    ${
      selectedChat === chat.id
        ? "text-white"
        : "text-slate-900"
    }
  `}
>

                          {chat.name}

                        </h3>

                       <p
       className={`
        text-[9px]
        font-black
        tracking-wide
        ${
          selectedChat === chat.id
            ? "text-white/70"
            : "text-slate-400"
        }
      `}
    >

                          {chat.time}

                        </p>

                      </div>

                      <p
                        className={`
                        mt-2
                        text-[11px]
                        font-semibold
                        line-clamp-1
                        ${
                          selectedChat === chat.id
    ? "text-white"
    : "text-slate-500"
                        }
                      `}
                      >

                        {chat.message}

                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>

          {/* CHAT AREA */}
          <div className="flex-1 flex flex-col bg-white">

            {/* CHAT HEADER */}
            <div className="h-[72px] border-b border-slate-200 px-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                {/* AVATAR */}
                <div className="relative">

                  <div
  className="
    w-11
    h-11
    rounded-2xl
    bg-indigo-100
    flex
    items-center
    justify-center
    font-black
    text-indigo-600
  "
>
  {selectedChatData?.name?.charAt(0)}
</div>

                  <div
                    className="
                    absolute
                    -bottom-1
                    -right-1
                    w-3
                    h-3
                    bg-emerald-400
                    rounded-full
                    border-2
                    border-white
                  "
                  ></div>

                </div>

                {/* NAME */}
                <div>

                  <h2 className="font-black text-[18px] text-slate-900">
  {
    chats.find(
      (chat) => chat.id === selectedChat
    )?.name
  }
</h2>

                  <p
  className={`text-[10px] font-black uppercase tracking-wide ${
    selectedChatData?.online
      ? "text-emerald-500"
      : "text-slate-400"
  }`}
>
  {selectedChatData?.online
    ? "Online"
    : "Offline"}
</p>

                </div>

              </div>

              <button>

                <MoreVertical
                  size={18}
                  className="text-slate-400"
                />

              </button>

            </div>

            {/* CHAT BODY */}
            <div className="flex-1 bg-[#f7f8fa] px-6 py-6 relative overflow-y-auto">

              {/* DATE */}
              <div className="flex justify-center mb-10">

                <div
                  className="
                  px-4
                  py-1
                  rounded-full
                  bg-white
                  border
                  text-[10px]
                  font-black
                  tracking-[2px]
                  text-slate-400
                "
                >

                  HARI INI

                </div>

              </div>
              {messages
  .filter((msg) => msg.chatId === selectedChat)
  .map((msg) => (
    <div
      key={msg.id}
      className={`mb-4 flex ${
        msg.sender === "seller"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div>
        <div
  className={`px-5 py-4 rounded-[18px] max-w-[350px]
  ${
    msg.sender === "seller"
      ? "bg-blue-600 rounded-br-md"
      : "bg-white rounded-bl-md border border-slate-100"
  }`}
>
{msg.image ? (
  <img
    src={msg.image}
    alt=""
    className="max-w-[220px] rounded-xl"
  />
) : msg.fileName ? (
  <a
    href={msg.fileUrl}
    target="_blank"
    rel="noreferrer"
    className="
      flex
      items-center
      gap-2
      bg-slate-100
      px-3
      py-2
      rounded-xl
      text-blue-600
      font-semibold
    "
  >
    📄 {msg.fileName}
  </a>
) : (
  <p className="text-black font-medium">
    {msg.text}
  </p>
)}
</div>

        <p className="text-[10px] text-slate-400 mt-2">
          {msg.time}
        </p>
      </div>
    </div>
))}

            </div>
<input
  type="file"
  accept="image/*,.pdf,.doc,.docx"
  id="fileUpload"
  hidden
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    const isImage =
      file.type.startsWith("image/");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        chatId: selectedChat,
        sender: "seller",

        image: isImage
          ? URL.createObjectURL(file)
          : null,

        fileName: file.name,
        fileUrl: URL.createObjectURL(file),

        time: "Sekarang",
      },
    ]);
  }}
/>
            {/* INPUT */}
            <div className="h-[66px] border-t border-slate-200 bg-white px-5 flex items-center gap-4">

             <label
  htmlFor="fileUpload"
  className="
    w-10
    h-10
    rounded-xl
    bg-slate-100
    flex
    items-center
    justify-center
    cursor-pointer
  "
>
  <Paperclip
    size={18}
    className="text-slate-500"
  />
</label>

              <label
 htmlFor="fileUpload"
  className="
    w-10
    h-10
    rounded-xl
    bg-slate-100
    flex
    items-center
    justify-center
    cursor-pointer
  "
>
  <ImageIcon
    size={18}
    className="text-slate-500"
  />
</label>

              {/* INPUT */}
              <div
                className="
                flex-1
                h-12
                rounded-2xl
                bg-slate-100
                px-5
                flex
                items-center
                gap-3
              "
              >

                <input
  type="text"
  placeholder="Ketik pesan..."
  value={message}
  onChange={(e) =>
    setMessage(e.target.value)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }}
  className="flex-1 bg-transparent outline-none text-[13px]"
/>

                <div className="relative">
  <Smile
    size={18}
    className="text-slate-400 cursor-pointer"
    onClick={() =>
      setShowEmoji(!showEmoji)
    }
  />

  {showEmoji && (
    <div className="absolute bottom-10 right-0 z-50">
      <EmojiPicker
        onEmojiClick={(emojiData) =>
          setMessage(
            (prev) =>
              prev + emojiData.emoji
          )
        }
      />
    </div>
  )}
</div>

              </div>

              {/* SEND */}
             <button
  onClick={handleSend}
  className="
    w-12
    h-12
    rounded-2xl
    bg-blue-600
    text-white
    flex
    items-center
    justify-center
  "
>
  <Send size={18} />
</button>

            </div>

          </div>

        </div>

      </div>

    </SellerLayout>
  );
}

export default ObrolanSeller;