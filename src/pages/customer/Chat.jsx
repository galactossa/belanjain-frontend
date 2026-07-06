// src/pages/customer/Chat.jsx - FULL DENGAN COMPLAINT BANNER DI DALAM CHAT

import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
  ArrowLeft,
  MessageCircle,
  Package,
  AlertTriangle,
  X,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import {
  connectSocket,
  getSocket,
  disconnectSocket,
} from "../../untils/socket";

function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const userId = currentUser?.id_pengguna || currentUser?.id;

  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeComplaint, setActiveComplaint] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔥 CEK APAKAH ADA KOMPLAIN DARI LOCALSTORAGE
  useEffect(() => {
    const complaintData = localStorage.getItem("activeComplaint");
    console.log("🔍 Raw complaintData from localStorage:", complaintData);
    if (complaintData) {
      try {
        const parsed = JSON.parse(complaintData);
        console.log("✅ Parsed complaint:", parsed);
        console.log("✅ id_pelapor:", parsed.id_pelapor);
        console.log("✅ userId:", userId);
        setActiveComplaint(parsed);
      } catch (e) {
        console.error("Error parsing complaint data:", e);
      }
    }
  }, [userId]);

  const clearComplaint = () => {
    setActiveComplaint(null);
    localStorage.removeItem("activeComplaint");
  };

  // 🔥 FUNGSI UNTUK GET NAMA TOKO (FALLBACK)
  const getDisplayName = async (userId, role) => {
    if (role === "penjual") {
      try {
        const res = await api.get(`/toko/user/${userId}`);
        if (res.data.data?.nama_toko) {
          return res.data.data.nama_toko;
        }
      } catch (e) {
        console.warn("Gagal ambil nama toko, pakai nama user:", e);
      }
    }
    // Fallback: ambil nama user
    try {
      const res = await api.get(`/pengguna/${userId}`);
      return res.data.data?.nama || "User";
    } catch (e) {
      return "User";
    }
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/chat/rooms/${userId}`);
        let rooms = response.data.data || [];

        // 🔥 PERBAIKAN: Format ulang nama untuk penjual
        const formattedRooms = await Promise.all(
          rooms.map(async (room) => {
            let displayName = room.other_user_name;
            if (room.other_user_role === "penjual") {
              try {
                const tokoRes = await api.get(
                  `/toko/user/${room.other_user_id}`,
                );
                if (tokoRes.data.data?.nama_toko) {
                  displayName = tokoRes.data.data.nama_toko;
                }
              } catch (e) {
                // Tetap pakai nama user
              }
            }
            return {
              ...room,
              other_user_name: displayName,
            };
          }),
        );

        setChatRooms(formattedRooms);

        if (id) {
          const room = formattedRooms.find(
            (r) => r.other_user_id === parseInt(id),
          );
          if (room) {
            setActiveChat(room);
            const messagesRes = await api.get(
              `/chat/history/${userId}/${room.other_user_id}`,
            );
            setMessages(messagesRes.data.data.data || []);
          } else {
            // 🔥 BUAT ROOM BARU DARI ID
            try {
              const userRes = await api.get(`/pengguna/${id}`);
              const userData = userRes.data.data;
              let displayName = userData.nama || "User";

              // Cek apakah user ini penjual, ambil nama toko
              if (userData.role === "penjual") {
                try {
                  const tokoRes = await api.get(`/toko/user/${id}`);
                  if (tokoRes.data.data?.nama_toko) {
                    displayName = tokoRes.data.data.nama_toko;
                  }
                } catch (e) {}
              }

              setActiveChat({
                other_user_id: parseInt(id),
                other_user_name: displayName,
                other_user_role: userData.role,
                other_user_avatar: userData.url_foto,
                last_message: "Mulai percakapan",
                unread_count: 0,
              });
              setMessages([]);
            } catch (userError) {
              console.error("Error fetching user:", userError);
            }
          }
        } else if (formattedRooms.length > 0) {
          setActiveChat(formattedRooms[0]);
          const messagesRes = await api.get(
            `/chat/history/${userId}/${formattedRooms[0].other_user_id}`,
          );
          setMessages(messagesRes.data.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, [userId, id]);

  // Load messages when active chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat || !userId) return;
      try {
        const response = await api.get(
          `/chat/history/${userId}/${activeChat.other_user_id}`,
        );
        setMessages(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [activeChat, userId]);

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
        (message.sender_id === activeChat?.other_user_id &&
          message.receiver_id === userId) ||
        (message.sender_id === userId &&
          message.receiver_id === activeChat?.other_user_id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
      refreshChatRooms();
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
  }, [currentUser, activeChat, userId]);

  const refreshChatRooms = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/chat/rooms/${userId}`);
      let rooms = response.data.data || [];
      // Format ulang nama
      const formattedRooms = await Promise.all(
        rooms.map(async (room) => {
          let displayName = room.other_user_name;
          if (room.other_user_role === "penjual") {
            try {
              const tokoRes = await api.get(`/toko/user/${room.other_user_id}`);
              if (tokoRes.data.data?.nama_toko) {
                displayName = tokoRes.data.data.nama_toko;
              }
            } catch (e) {}
          }
          return { ...room, other_user_name: displayName };
        }),
      );
      setChatRooms(formattedRooms);
    } catch (error) {
      console.error("Error refreshing chat rooms:", error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat || !userId) return;

    const messageData = {
      sender_id: userId,
      receiver_id: activeChat.other_user_id,
      message: newMessage.trim(),
      sender_name: currentUser?.nama || "User",
      sender_role: currentUser?.role || "customer",
    };

    socketRef.current?.emit("send-message", messageData);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8]">
      <div className="h-screen w-full flex bg-white overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="px-6 py-8 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/customer")}
                  className="w-12 h-12 rounded-full bg-white border shadow-sm flex items-center justify-center"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-[32px] font-black text-slate-900">Pesan</h1>
              </div>
              <button>
                <MoreVertical size={22} className="text-slate-400" />
              </button>
            </div>

            <div className="mt-6 h-14 rounded-2xl bg-[#F3F5F9] px-5 flex items-center">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                className="bg-transparent outline-none px-4 flex-1 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <MessageCircle size={48} className="mb-4" />
                <p className="font-semibold">Belum ada percakapan</p>
                <p className="text-sm">Mulai chat dengan penjual</p>
              </div>
            ) : (
              chatRooms.map((room) => {
                const isActive =
                  activeChat?.other_user_id === room.other_user_id;
                const isOnline = onlineUsers.includes(room.other_user_id);

                return (
                  <div
                    key={room.other_user_id}
                    onClick={() => {
                      setActiveChat(room);
                      setMessages([]);
                      navigate(`/customer/chat/${room.other_user_id}`);
                    }}
                    className={`mx-3 mt-3 p-4 rounded-[28px] cursor-pointer transition ${
                      isActive
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#5B3DF5] text-white shadow-xl"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center text-2xl font-black text-slate-600">
                          {room.other_user_name?.charAt(0) || "U"}
                        </div>
                        {isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-black truncate">
                            {room.other_user_name}
                          </h3>
                          <span
                            className={`text-[11px] font-bold ${isActive ? "text-white/80" : "text-slate-400"}`}
                          >
                            {room.last_message_time
                              ? formatTime(room.last_message_time)
                              : ""}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p
                            className={`text-sm truncate ${isActive ? "text-white/80" : "text-slate-500"}`}
                          >
                            {room.last_message || "Mulai percakapan"}
                          </p>
                          {room.unread_count > 0 && (
                            <span
                              className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                                isActive
                                  ? "bg-white text-indigo-600"
                                  : "bg-emerald-100 text-emerald-600"
                              }`}
                            >
                              {room.unread_count} baru
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT PANEL */}
        {!activeChat ? (
          <div className="flex-1 bg-[#F5F6F8] flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-[40px] bg-white mx-auto shadow-sm flex items-center justify-center">
                <MessageCircle size={70} className="text-indigo-600" />
              </div>
              <h2 className="text-5xl font-black mt-8">Pesan Anda</h2>
              <p className="mt-5 text-slate-500 text-lg max-w-xl">
                Pilih percakapan dari sidebar untuk mulai berkirim pesan dengan
                pembeli atau penjual secara instan.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="h-[105px] bg-white border-b px-7 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center text-2xl font-black text-slate-600">
                    {activeChat.other_user_name?.charAt(0) || "U"}
                  </div>
                  {onlineUsers.includes(activeChat.other_user_id) && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {activeChat.other_user_name}
                  </h2>
                  <p className="text-xs font-black tracking-[2px] text-emerald-600">
                    {onlineUsers.includes(activeChat.other_user_id)
                      ? "ONLINE"
                      : "OFFLINE"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Phone size={18} />
                </button>
                <button className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Video size={18} />
                </button>
                <button className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* 🔥 KOMPLAIN ACTIVE - TAMPILKAN DI DALAM CHAT PANEL (TANPA KONDISI) */}
            {activeComplaint && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mx-4 mt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-red-300 flex-shrink-0">
                      <img
                        src={
                          activeComplaint.produk?.url_gambar ||
                          "https://via.placeholder.com/80"
                        }
                        alt={activeComplaint.produk?.nama_produk || "Produk"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-xs font-bold text-red-600 uppercase">
                          Komplain Produk
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {activeComplaint.produk?.nama_produk || "Produk"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span>
                          ID: #{activeComplaint.produk?.id_produk || "-"}
                        </span>
                        <span>•</span>
                        <span>
                          Harga: Rp{" "}
                          {Number(
                            activeComplaint.produk?.harga || 0,
                          ).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 bg-white/70 p-2 rounded-lg">
                        <span className="font-semibold">Alasan Komplain:</span>{" "}
                        {activeComplaint.alasan || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearComplaint}
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto bg-[#F5F6F8] p-8">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>Belum ada pesan. Mulai percakapan!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-10">
                    <div className="px-5 py-2 bg-white rounded-full text-xs font-bold tracking-[2px] text-slate-500 shadow-sm">
                      {messages.length > 0 && messages[0]?.created_at
                        ? formatDate(messages[0].created_at)
                        : "HARI INI"}
                    </div>
                  </div>
                  {messages.map((msg, index) => {
                    const isSender = msg.sender_id === userId;
                    return (
                      <div
                        key={msg.id || index}
                        className={`flex mb-6 ${isSender ? "justify-end" : ""}`}
                      >
                        <div
                          className={`max-w-[520px] px-6 py-4 rounded-[24px] ${
                            isSender
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-slate-700 rounded-tl-none shadow-sm"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span
                            className={`block mt-2 text-xs ${isSender ? "text-blue-100" : "text-slate-400"}`}
                          >
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="h-[95px] border-t bg-white px-8 flex items-center">
              <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-2">
                <Paperclip size={18} />
              </button>
              <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mr-4">
                <ImageIcon size={18} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="flex-1 h-14 bg-[#F3F5F9] rounded-full px-6 outline-none"
              />
              <button className="ml-4 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Smile size={18} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`ml-3 w-14 h-14 rounded-2xl flex items-center justify-center ${
                  newMessage.trim()
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
