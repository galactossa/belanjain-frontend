import {
  Search,
  Bell,
  Zap,
  X,
  Trash2,
  Send,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  Smile,
  User,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ModalNotifications from "../../components/admin/ModalNotfications";
import api from "../../api/api";
import EmojiPicker from "emoji-picker-react";
import { connectSocket } from "../../untils/socket";

function ChatSeller() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef();
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = currentUser?.id_pengguna || currentUser?.id;
  const [showEmoji, setShowEmoji] = useState(false);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/chat/rooms/${userId}`);
        const rooms = response.data.data || [];
        console.log("📡 Chat rooms:", rooms);

        const formattedChats = rooms.map((room) => ({
          ...room,
          id: `CHAT-${room.other_user_id}`,
          name: room.other_user_name || "User",
          message: room.last_message || "Mulai percakapan",
          date: room.last_message_time
            ? new Date(room.last_message_time).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Baru saja",
          status: room.unread_count > 0 ? "BELUM DIBACA" : "SUDAH DIBACA",
          avatar: room.other_user_name?.charAt(0)?.toUpperCase() || "U",
          messages: [],
          unread_count: room.unread_count || 0,
        }));

        setChats(formattedChats);

        if (formattedChats.length > 0) {
          setActiveChat(formattedChats[0]);
          fetchMessages(formattedChats[0].other_user_id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [userId]);

  // Fetch messages for a specific chat
  const fetchMessages = async (otherUserId) => {
    if (!userId || !otherUserId) return;
    try {
      const response = await api.get(`/chat/history/${userId}/${otherUserId}`);
      const msgs = response.data.data.data || [];
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Socket.io setup
  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(currentUser);
    socketRef.current = socket;
    window.socket = socket;

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("new-message", (message) => {
      if (activeChat && message.sender_id === activeChat.other_user_id) {
        setMessages((prev) => [...prev, message]);
      }
      // Refresh chat list
      refreshChats();
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
  }, [userId, activeChat]);

  const refreshChats = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/chat/rooms/${userId}`);
      const rooms = response.data.data || [];
      setChats(
        rooms.map((room) => ({
          ...room,
          id: `CHAT-${room.other_user_id}`,
          name: room.other_user_name || "User",
          message: room.last_message || "Mulai percakapan",
          date: room.last_message_time
            ? new Date(room.last_message_time).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Baru saja",
          status: room.unread_count > 0 ? "BELUM DIBACA" : "SUDAH DIBACA",
          avatar: room.other_user_name?.charAt(0)?.toUpperCase() || "U",
          unread_count: room.unread_count || 0,
        })),
      );
    } catch (error) {
      console.error("Error refreshing chats:", error);
    }
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/notifikasi/pengguna/${userId}`);
        const data = (response.data.data || []).map((n) => ({
          ...n,
          read: n.sudah_dibaca || false,
          time: n.created_at
            ? new Date(n.created_at).toLocaleString()
            : "Baru saja",
          message: n.pesan || n.judul,
        }));
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  const filteredChats = chats.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat || !userId) return;

    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("send-message", {
        sender_id: userId,
        receiver_id: activeChat.other_user_id,
        message: inputMessage,
        sender_name: currentUser.nama || "Admin",
        sender_role: "admin",
      });
    }

    // Optimistic update
    const newMessage = {
      sender_id: userId,
      message: inputMessage,
      created_at: new Date().toISOString(),
      isAdmin: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-6">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-[42px] font-black text-[#071437] leading-none">
              Chat Seller
            </h1>
            <p className="text-[#64748B] text-lg font-semibold mt-3">
              Komunikasi langsung dengan seller platform BelanjaIn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 shadow-sm h-11 w-[280px] rounded-2xl px-3 flex items-center gap-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="cari chat..."
                className="w-full h-full bg-transparent outline-none px-2 text-slate-700 text-sm"
              />
            </div>
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 duration-300"
              >
                <Bell size={16} className="text-slate-600" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </button>
              {showNotif && (
                <ModalNotifications
                  open={showNotif}
                  onClose={() => setShowNotif(false)}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-220px)] bg-white rounded-[42px] border border-[#E7ECF3] overflow-hidden shadow-sm flex">
          <div className="w-[430px] border-r border-[#EEF2F7] bg-[#FCFCFD] flex flex-col">
            <div className="px-8 pt-8 pb-7 border-b border-[#EEF2F7]">
              <h2 className="text-[34px] font-black text-[#071437]">
                SESI CHAT
              </h2>
              <div className="grid grid-cols-3 gap-4 mt-7">
                <div className="h-[90px] rounded-[24px] bg-[#F1F5F9] flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-[#94A3B8] uppercase">
                    Total
                  </p>
                  <h3 className="text-[32px] font-black text-[#071437]">
                    {chats.length}
                  </h3>
                </div>
                <div className="h-[90px] rounded-[24px] bg-[#FDECEC] flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-red-500 uppercase">
                    Belum
                  </p>
                  <h3 className="text-[32px] font-black text-red-500">
                    {
                      chats.filter((item) => item.status === "BELUM DIBACA")
                        .length
                    }
                  </h3>
                </div>
                <div className="h-[90px] rounded-[24px] bg-[#EAF8EE] flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-green-500 uppercase">
                    Sudah
                  </p>
                  <h3 className="text-[32px] font-black text-green-500">
                    {
                      chats.filter((item) => item.status === "SUDAH DIBACA")
                        .length
                    }
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {filteredChats.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveChat(item);
                    fetchMessages(item.other_user_id);
                  }}
                  className={`rounded-[32px] border p-6 cursor-pointer transition-all ${
                    activeChat?.other_user_id === item.other_user_id
                      ? "bg-white border-[#E7ECF3] shadow-lg"
                      : "border-transparent hover:bg-white"
                  }`}
                >
                  <div className="flex gap-5">
                    <div className="w-[68px] h-[68px] rounded-[24px] bg-[#2563FF] text-white flex items-center justify-center text-2xl font-black">
                      {item.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[#071437] text-[18px] font-black uppercase">
                            {item.name}
                          </h3>
                          <p className="text-[#64748B] text-[15px] mt-2 font-semibold">
                            {item.message}
                          </p>
                        </div>
                        <p className="text-xs text-[#94A3B8] font-black">
                          {item.date}
                        </p>
                      </div>
                      {item.unread_count > 0 && (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {item.unread_count} baru
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {!activeChat ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-[34px] font-black text-[#071437]">
                  PILIH DISKUSI
                </h2>
                <p className="text-[#94A3B8] text-center font-semibold mt-5">
                  Pilih user di sidebar untuk memulai percakapan.
                </p>
              </div>
            ) : (
              <>
                <div className="h-[120px] border-b border-[#EEF2F7] px-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-[76px] h-[76px] rounded-[28px] bg-[#2563FF] text-white flex items-center justify-center text-[34px] font-black">
                      {activeChat.avatar}
                    </div>
                    <div>
                      <h2 className="text-[32px] font-black text-[#071437] uppercase">
                        {activeChat.name}
                      </h2>
                      <p className="text-[#2563FF] text-[15px] font-black uppercase mt-2">
                        {activeChat.status === "BELUM DIBACA"
                          ? "Baru"
                          : "Dibaca"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveChat(null);
                      setMessages([]);
                    }}
                    className="h-[58px] px-8 rounded-[20px] border border-[#E5E7EB] text-[#94A3B8] font-black hover:bg-slate-50"
                  >
                    TUTUP SESI
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10">
                  {messages.length > 0 ? (
                    messages.map((msg, index) => {
                      const isAdmin = msg.sender_id === userId;
                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[800px] px-8 py-7 rounded-[34px] shadow-sm ${
                              isAdmin
                                ? "bg-[#2563FF] text-white rounded-br-md"
                                : "bg-white border border-[#EEF2F7] text-[#071437] rounded-tl-md"
                            }`}
                          >
                            <p className="text-[20px] font-semibold leading-relaxed">
                              {msg.message}
                            </p>
                            <p className="text-xs mt-4 opacity-70 font-black">
                              {msg.created_at
                                ? new Date(msg.created_at).toLocaleTimeString(
                                    "id-ID",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )
                                : "Baru saja"}{" "}
                              • {isAdmin ? "Admin" : "Seller"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-slate-400 py-10">
                      Belum ada pesan. Mulai percakapan!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="h-[120px] border-t border-[#EEF2F7] px-10 flex items-center gap-5">
                  <div className="flex-1 h-[70px] rounded-[24px] border border-[#DCE3EA] bg-white px-8 flex items-center shadow-sm">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ketik pesan..."
                      className="w-full bg-transparent outline-none text-[#071437]"
                    />
                    <div className="relative">
                      <Smile
                        size={18}
                        className="text-slate-400 cursor-pointer ml-2"
                        onClick={() => setShowEmoji(!showEmoji)}
                      />
                      {showEmoji && (
                        <div className="absolute bottom-12 right-0 z-50">
                          <EmojiPicker
                            onEmojiClick={(emojiData) =>
                              setInputMessage((prev) => prev + emojiData.emoji)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="w-[70px] h-[70px] rounded-[24px] bg-[#2563FF] text-white flex items-center justify-center shadow-xl"
                  >
                    <Zap size={30} fill="white" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ChatSeller;
