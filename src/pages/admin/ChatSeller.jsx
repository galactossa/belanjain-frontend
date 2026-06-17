import { Search, Bell, Zap, X, Trash2 } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import ModalNotifications from "../../components/admin/ModalNotfications";
import { notifications as defaultNotifications } from "../../data/notifications";
import { chats as defaultChats } from "../../data/chat";
import { sellers } from "../../data/sellers";
import { users } from "../../data/users";

function ChatSeller() {
  const navigate = useNavigate();

  /* ================= SEARCH ================= */
  const [search, setSearch] = useState("");

  /* ================= NOTIFICATION ================= */
  const [showNotif, setShowNotif] = useState(false);

  const notifRef = useRef();

  const [notifications, setNotifications] = useState(() =>
    defaultNotifications
      .filter((item) => item.role === "admin")
      .map((notif) => ({
        ...notif,
        time: notif.time || "Baru saja",
        read: false,
        message: notif.message || notif.title,
      })),
  );

  /* ================= CHAT ================= */
  const [chats, setChats] = useState(() =>
    defaultChats
      .filter((chat) => chat.type === "report")
      .map((chat) => {
        let name = "Unknown";
        let avatar = "?";

        if (chat.customerId) {
          const customer = users.find((item) => item.id === chat.customerId);
          name = customer?.name || `Customer ${chat.customerId}`;
          avatar = customer?.name?.[0] || "C";
        } else if (chat.sellerId) {
          const seller = sellers.find((item) => item.id === chat.sellerId);
          name = seller?.name || `Seller ${chat.sellerId}`;
          avatar = seller?.name?.[0] || "S";
        }

        const lastMessage = chat.messages[chat.messages.length - 1];

        return {
          ...chat,
          name: name,
          message: lastMessage?.text || "",
          date: lastMessage?.time || "",
          status: lastMessage?.adminId ? "SUDAH DIBACA" : "BELUM DIBACA",
          avatar: avatar,
          report: "Report",
        };
      }),
  );

  /* ================= ACTIVE CHAT ================= */
  const [activeChat, setActiveChat] = useState(chats[0]);

  /* ================= INPUT ================= */
  const [inputMessage, setInputMessage] = useState("");

  /* ================= FILTER ================= */
  const filteredChats = chats.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= SEND CHAT ================= */
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      sender: "ADMIN",
      text: inputMessage,
      time: "Baru saja",
    };

    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
          }
        : chat,
    );

    setChats(updatedChats);

    const updatedActive = updatedChats.find(
      (chat) => chat.id === activeChat.id,
    );

    setActiveChat(updatedActive);

    setInputMessage("");
  };

  /* ================= CLOSE NOTIF ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= NOTIF ================= */
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? {
              ...notif,
              read: true,
            }
          : notif,
      ),
    );
  };

  const deleteNotif = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  /* ================= CLOSE SESSION ================= */
  const handleCloseSession = () => {
    const updatedChats = chats.filter((item) => item.id !== activeChat.id);

    setChats(updatedChats);

    if (updatedChats.length > 0) {
      setActiveChat(updatedChats[0]);
    } else {
      setActiveChat(null);
    }
  };
  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* ================= TOPBAR ================= */}
        <div className="flex items-center justify-between mb-7">
          {/* LEFT */}
          <div>
            <h1 className="text-[42px] font-black text-[#071437] leading-none">
              Chat Seller
            </h1>

            <p className="text-[#64748B] text-lg font-semibold mt-3">
              Komunikasi langsung dengan seller platform BelanjaIn.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
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

            {/* NOTIFICATION */}
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

        {/* ================= CHAT CONTAINER ================= */}
        <div className="h-[calc(100vh-220px)] bg-white rounded-[42px] border border-[#E7ECF3] overflow-hidden shadow-sm flex">
          {/* ================= SIDEBAR ================= */}
          <div className="w-[430px] border-r border-[#EEF2F7] bg-[#FCFCFD] flex flex-col">
            {/* TOP */}
            <div className="px-8 pt-8 pb-7 border-b border-[#EEF2F7]">
              <h2 className="text-[34px] font-black text-[#071437]">
                SESI CHAT
              </h2>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 mt-7">
                <div className="h-[90px] rounded-[24px] bg-[#F1F5F9] flex flex-col items-center justify-center">
                  <p className="text-xs font-black text-[#94A3B8] uppercase">
                    Masuk
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

            {/* CHAT LIST */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
              {filteredChats.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveChat(item)}
                  className={`rounded-[32px] border p-6 cursor-pointer transition-all ${
                    activeChat?.id === item.id
                      ? "bg-white border-[#E7ECF3] shadow-lg"
                      : "border-transparent hover:bg-white"
                  }`}
                >
                  <div className="flex gap-5">
                    {/* AVATAR */}
                    <div className="w-[68px] h-[68px] rounded-[24px] bg-[#2563FF] text-white flex items-center justify-center text-2xl font-black">
                      {item.avatar}
                    </div>

                    {/* CONTENT */}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex-1 flex flex-col">
            {!activeChat ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-[34px] font-black text-[#071437]">
                  PILIH DISKUSI
                </h2>

                <p className="text-[#94A3B8] text-center font-semibold mt-5">
                  Pilih user di sidebar untuk memulai percakapan.
                </p>

                <button
                  onClick={() => navigate("/admin/reports")}
                  className="mt-10 h-16 px-10 rounded-2xl bg-[#2563FF] text-white font-black tracking-wide shadow-xl"
                >
                  LIHAT LIST LAPORAN
                </button>
              </div>
            ) : (
              <>
                {/* HEADER */}
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
                        Laporan: {activeChat.report}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseSession}
                    className="h-[58px] px-8 rounded-[20px] border border-[#E5E7EB] text-[#94A3B8] font-black hover:bg-slate-50"
                  >
                    TUTUP SESI
                  </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto px-10 py-10 space-y-10">
                  {activeChat.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "ADMIN" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[800px] px-8 py-7 rounded-[34px] shadow-sm ${
                          msg.sender === "ADMIN"
                            ? "bg-[#2563FF] text-white rounded-br-md"
                            : "bg-white border border-[#EEF2F7] text-[#071437] rounded-tl-md"
                        }`}
                      >
                        <p className="text-[20px] font-semibold leading-relaxed">
                          {msg.text}
                        </p>

                        <p className="text-xs mt-4 opacity-70 font-black">
                          {msg.time}
                          {" • "}
                          {msg.sender}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* INPUT */}
                <div className="h-[120px] border-t border-[#EEF2F7] px-10 flex items-center gap-5">
                  <div className="flex-1 h-[70px] rounded-[24px] border border-[#DCE3EA] bg-white px-8 flex items-center shadow-sm">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="w-full bg-transparent outline-none text-[#071437]"
                    />
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
