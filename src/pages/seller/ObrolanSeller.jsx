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
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import ModalNotifications from "../../components/seller/ModalNotifications";
import api from "../../api/api";
import { connectSocket } from "../../untils/socket";

function ObrolanSeller() {
  const navigate = useNavigate();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id_pengguna || currentUser?.id;

  // Fetch chat rooms from API
  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/chat/rooms/${userId}`);
        const rooms = response.data.data || [];
        setChats(rooms);
        if (rooms.length > 0) {
          setSelectedChat(rooms[0]);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, [userId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat || !userId) return;
      try {
        const response = await api.get(
          `/chat/history/${userId}/${selectedChat.other_user_id}`,
        );
        setMessages(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedChat, userId]);

  // Socket.io setup
  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(currentUser);
    socketRef.current = socket;

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("new-message", (message) => {
      if (
        (message.sender_id === selectedChat?.other_user_id &&
          message.receiver_id === userId) ||
        (message.sender_id === userId &&
          message.receiver_id === selectedChat?.other_user_id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("message-sent", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message-error", (error) => {
      console.error("Chat error:", error);
      alert(error.error || "Gagal mengirim pesan");
    });

    return () => {
      socket.off("online-users");
      socket.off("new-message");
      socket.off("message-sent");
      socket.off("message-error");
    };
  }, [currentUser, selectedChat, userId]);

  // Send message
  const handleSend = () => {
    if (!message.trim() || !selectedChat || !userId) return;

    const messageData = {
      sender_id: userId,
      receiver_id: selectedChat.other_user_id,
      message: message.trim(),
      sender_name: currentUser?.nama || "Seller",
      sender_role: currentUser?.role || "penjual",
    };

    socketRef.current?.emit("send-message", messageData);
    setMessage("");
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/notifikasi/pengguna/${userId}`);
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  const filteredChats = chats.filter((chat) =>
    chat.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="h-screen overflow-hidden bg-[#f4f5f7] p-4">
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
                placeholder="Cari percakapan..."
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

        <div className="bg-white border border-slate-200 rounded-[10px] overflow-hidden flex h-[calc(100vh-110px)]">
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
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <User size={48} className="mb-4" />
                  <p className="font-semibold">Belum ada percakapan</p>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isActive =
                    selectedChat?.other_user_id === chat.other_user_id;
                  const isOnline = onlineUsers.includes(chat.other_user_id);
                  return (
                    <div
                      key={chat.other_user_id}
                      onClick={() => setSelectedChat(chat)}
                      className={`relative rounded-[20px] px-4 py-4 mb-2 cursor-pointer duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center font-black text-slate-600">
                            {chat.other_user_name?.charAt(0) || "U"}
                          </div>
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`text-[14px] font-black ${isActive ? "text-white" : "text-slate-900"}`}
                            >
                              {chat.other_user_name}
                            </h3>
                            <p
                              className={`text-[9px] font-black tracking-wide ${isActive ? "text-white/70" : "text-slate-400"}`}
                            >
                              {chat.last_message_time
                                ? new Date(
                                    chat.last_message_time,
                                  ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </p>
                          </div>
                          <p
                            className={`mt-2 text-[11px] font-semibold line-clamp-1 ${isActive ? "text-white" : "text-slate-500"}`}
                          >
                            {chat.last_message || "Mulai percakapan"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white">
            {!selectedChat ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageCircle size={48} className="mx-auto mb-4" />
                  <p className="font-semibold">
                    Pilih percakapan untuk mulai chatting
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="h-[72px] border-b border-slate-200 px-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                        {selectedChat.other_user_name?.charAt(0) || "U"}
                      </div>
                      {onlineUsers.includes(selectedChat.other_user_id) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-black text-[18px] text-slate-900">
                        {selectedChat.other_user_name}
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-wide text-emerald-500">
                        {onlineUsers.includes(selectedChat.other_user_id)
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <button>
                    <MoreVertical size={18} className="text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 bg-[#f7f8fa] px-6 py-6 relative overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <p>Belum ada pesan. Mulai percakapan!</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-10">
                        <div className="px-4 py-1 rounded-full bg-white border text-[10px] font-black tracking-[2px] text-slate-400">
                          HARI INI
                        </div>
                      </div>
                      {messages.map((msg, index) => {
                        const isSeller = msg.sender_id === userId;
                        return (
                          <div
                            key={msg.id || index}
                            className={`mb-4 flex ${isSeller ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`px-5 py-4 rounded-[18px] max-w-[350px] ${
                                isSeller
                                  ? "bg-blue-600 rounded-br-md text-white"
                                  : "bg-white rounded-bl-md border border-slate-100 text-slate-900"
                              }`}
                            >
                              <p className="font-medium">{msg.message}</p>
                              <p
                                className={`text-[10px] mt-1 ${isSeller ? "text-blue-100" : "text-slate-400"}`}
                              >
                                {msg.created_at
                                  ? new Date(msg.created_at).toLocaleTimeString(
                                      "id-ID",
                                      { hour: "2-digit", minute: "2-digit" },
                                    )
                                  : ""}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="h-[66px] border-t border-slate-200 bg-white px-5 flex items-center gap-4">
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
              </>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export default ObrolanSeller;
