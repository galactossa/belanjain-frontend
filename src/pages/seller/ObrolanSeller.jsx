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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";

// DATA STATIC SEMENTARA (karena chat seller belum ada API backend)
// TODO: Nanti diintegrasi ke API setelah backend siap
const defaultChats = [
  {
    id: "CHAT-001",
    customerId: 1,
    sellerId: 3,
    messages: [
      {
        senderId: 1,
        text: "Halo kak, stok Oversize Streetwear masih ada?",
        time: "09:12",
      },
      { senderId: 3, text: "Halo kak, masih tersedia ya.", time: "09:14" },
      { senderId: 1, text: "Siap kak, saya checkout sekarang.", time: "09:15" },
    ],
  },
  {
    id: "CHAT-002",
    customerId: 6,
    sellerId: 3,
    messages: [
      { senderId: 6, text: "Cargo Pants ukuran L masih ready?", time: "11:20" },
      { senderId: 3, text: "Masih ready kak.", time: "11:22" },
    ],
  },
  {
    id: "CHAT-003",
    customerId: 1,
    sellerId: 4,
    messages: [
      { senderId: 1, text: "Kursinya perlu dirakit sendiri?", time: "13:10" },
      { senderId: 4, text: "Tidak kak, sudah siap pakai.", time: "13:12" },
    ],
  },
  {
    id: "CHAT-004",
    customerId: 6,
    sellerId: 5,
    messages: [
      { senderId: 6, text: "Smart Watch ini support Android?", time: "15:00" },
      { senderId: 5, text: "Support Android dan iOS kak.", time: "15:03" },
    ],
  },
];

const defaultUsers = [
  { id: 1, name: "User" },
  { id: 6, name: "User Kedua" },
];

function ObrolanSeller() {
  const navigate = useNavigate();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await api.get(
          `/notifikasi/pengguna/${currentUser.id}`,
        );
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [currentUser?.id]);

  const sellerChats = defaultChats.filter(
    (chat) => chat.sellerId === currentUser?.id,
  );
  const [chats, setChats] = useState(sellerChats);
  const [selectedChat, setSelectedChat] = useState(sellerChats[0]?.id || "");

  const selectedChatData = chats.find((chat) => chat.id === selectedChat);

  const getCustomer = (customerId) =>
    defaultUsers.find((user) => user.id === customerId) || {
      name: "Pelanggan",
    };

  const getLastMessage = (chat) =>
    chat.messages[chat.messages.length - 1] || {};

  const filteredChats = chats
    .map((chat) => {
      const customer = getCustomer(chat.customerId);
      const lastMessage = getLastMessage(chat);
      return {
        ...chat,
        name: customer.name,
        message: lastMessage?.text || "",
        time: lastMessage?.time || "",
        online: true,
      };
    })
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.message.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const handleSend = () => {
    if (!message.trim() || !selectedChatData) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              senderId: currentUser?.id,
              text: message,
              time: "Sekarang",
            },
          ],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setMessage("");
  };

  return (
    <SellerLayout>
      <div className="h-screen overflow-hidden bg-[#f4f5f7] p-4">
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] leading-none font-black uppercase text-slate-900">
              OBROLAN
            </h1>
            <p className="text-[10px] tracking-[2px] font-black uppercase text-slate-400 mt-1">
              Berinteraksi langsung dengan pembeli anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[320px] h-[44px] bg-white rounded-2xl border border-slate-200 px-4 flex items-center gap-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari pesanan atau produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent outline-none text-[12px] font-semibold"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm relative"
              >
                <Bell size={18} className="text-slate-500" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              {showNotif && (
                <ModalNotifications
                  notifications={notifications}
                  onReadAll={() => setShowNotif(false)}
                />
              )}
            </div>

            <button
              onClick={() => navigate("/seller/add-product")}
              className="h-11 px-5 rounded-2xl bg-blue-600 text-white font-black text-[12px] shadow-lg"
            >
              + PRODUK BARU
            </button>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[10px] overflow-hidden flex h-[calc(100vh-110px)]">
          {/* SIDEBAR */}
          <div className="w-[320px] border-r border-slate-200 bg-[#f8f8f8] flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/seller")}
                    className="w-8 h-8 rounded-full bg-white border flex items-center justify-center"
                  >
                    <ArrowLeft size={16} className="text-slate-500" />
                  </button>
                  <h2 className="font-black text-[18px] text-slate-900">
                    Pesan
                  </h2>
                </div>
                <button>
                  <MoreVertical size={16} className="text-slate-400" />
                </button>
              </div>
              <div className="mt-4 h-[44px] rounded-2xl bg-slate-100 px-4 flex items-center gap-3">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari percakapan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-[12px] w-full"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`relative rounded-[20px] px-4 py-4 mb-2 cursor-pointer duration-300 ${
                    selectedChat === chat.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          selectedChat === chat.id
                            ? "text-white"
                            : "text-slate-500"
                        }`}
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
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-[14px] font-black ${selectedChat === chat.id ? "text-white" : "text-slate-900"}`}
                        >
                          {chat.name}
                        </h3>
                        <p
                          className={`text-[9px] font-black tracking-wide ${selectedChat === chat.id ? "text-white/70" : "text-slate-400"}`}
                        >
                          {chat.time}
                        </p>
                      </div>
                      <p
                        className={`mt-2 text-[11px] font-semibold line-clamp-1 ${selectedChat === chat.id ? "text-white" : "text-slate-500"}`}
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
            <div className="h-[72px] border-b border-slate-200 px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                    {selectedChatData?.name?.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-black text-[18px] text-slate-900">
                    {chats.find((chat) => chat.id === selectedChat)?.name}
                  </h2>
                  <p
                    className={`text-[10px] font-black uppercase tracking-wide ${selectedChatData?.online ? "text-emerald-500" : "text-slate-400"}`}
                  >
                    {selectedChatData?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <button>
                <MoreVertical size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 bg-[#f7f8fa] px-6 py-6 relative overflow-y-auto">
              <div className="flex justify-center mb-10">
                <div className="px-4 py-1 rounded-full bg-white border text-[10px] font-black tracking-[2px] text-slate-400">
                  HARI INI
                </div>
              </div>
              {selectedChatData?.messages.map((msg, index) => {
                const isSeller = msg.senderId === currentUser?.id;
                const customer = getCustomer(selectedChatData.customerId);
                return (
                  <div
                    key={`${selectedChatData.id}-${index}`}
                    className={`mb-4 flex ${isSeller ? "justify-end" : "justify-start"}`}
                  >
                    <div>
                      <div
                        className={`px-5 py-4 rounded-[18px] max-w-[350px] ${
                          isSeller
                            ? "bg-blue-600 rounded-br-md text-white"
                            : "bg-white rounded-bl-md border border-slate-100 text-slate-900"
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
                            className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-blue-600 font-semibold"
                          >
                            📄 {msg.fileName}
                          </a>
                        ) : (
                          <p className="text-black font-medium">{msg.text}</p>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {isSeller ? "Anda" : customer.name}, {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              id="fileUpload"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file || !selectedChatData) return;
                const isImage = file.type.startsWith("image/");
                const updatedChats = chats.map((chat) => {
                  if (chat.id === selectedChat) {
                    return {
                      ...chat,
                      messages: [
                        ...chat.messages,
                        {
                          senderId: currentUser?.id,
                          image: isImage ? URL.createObjectURL(file) : null,
                          fileName: file.name,
                          fileUrl: URL.createObjectURL(file),
                          time: "Sekarang",
                        },
                      ],
                    };
                  }
                  return chat;
                });
                setChats(updatedChats);
              }}
            />

            <div className="h-[66px] border-t border-slate-200 bg-white px-5 flex items-center gap-4">
              <label
                htmlFor="fileUpload"
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <Paperclip size={18} className="text-slate-500" />
              </label>
              <label
                htmlFor="fileUpload"
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <ImageIcon size={18} className="text-slate-500" />
              </label>

              <div className="flex-1 h-12 rounded-2xl bg-slate-100 px-5 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                    onClick={() => setShowEmoji(!showEmoji)}
                  />
                  {showEmoji && (
                    <div className="absolute bottom-10 right-0 z-50">
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          setMessage((prev) => prev + emojiData.emoji)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSend}
                className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center"
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
