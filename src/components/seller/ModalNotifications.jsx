import { MessageCircle } from "lucide-react";

function ModalNotifications({
  notifications = [],
  title = "Notifikasi Masuk",
  onReadAll,
}) {
  return (
    <div
      className="
      absolute
      right-0
      top-14
      w-[360px]
      bg-white
      rounded-[28px]
      shadow-2xl
      border
      border-slate-200
      overflow-hidden
      z-50
    "
    >
      {/* HEADER */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h2 className="font-black text-[18px] text-slate-900">
          {title} ({notifications.length})
        </h2>

        <button
          onClick={onReadAll}
          className="
            text-[11px]
            font-black
            uppercase
            text-blue-600
            hover:text-blue-700
          "
        >
          Tandai Semua Dibaca
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-[350px] overflow-y-auto px-4 pb-4 space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="
              border
              border-slate-100
              rounded-3xl
              p-4
              hover:bg-slate-50
              duration-200
            "
          >
            <div className="flex gap-3">
              {/* ICON */}
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <MessageCircle size={16} className="text-violet-500" />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {notif.title || notif.message}
                </h3>

                {notif.title && notif.message && (
                  <p className="text-xs text-slate-600 mt-1 truncate">
                    {notif.message}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-slate-400">
                    {notif.time || "Baru saja"}
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-black
                      bg-slate-200
                      text-slate-600
                      px-2
                      py-1
                      rounded-md
                    "
                  >
                    DIBACA
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModalNotifications;
