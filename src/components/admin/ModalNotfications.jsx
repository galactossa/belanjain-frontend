import { Check, Trash2, ChevronUp, ChevronDown } from "lucide-react";

function ModalNotifications({
  open,
  onClose,
  notifications,
  setNotifications,
}) {
  if (!open) return null;

  const handleDelete = (id) => {
    const updated = notifications.filter((item) => item.id !== id);

    setNotifications(updated);
  };

  const handleReadAll = () => {
    setNotifications([]);
  };

  return (
    <div className="absolute top-14 right-0 z-50">
      <div
        className="
          w-[340px]
          bg-[#F4F4F4]
          rounded-[28px]
          shadow-2xl
          border
          border-slate-200
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2
            className="
              text-[13px]
              font-black
              uppercase
              tracking-[2px]
              text-slate-400
            "
          >
            NOTIFIKASI ({notifications.length})
          </h2>

          <button
            onClick={handleReadAll}
            className="
              text-[11px]
              font-black
              uppercase
              text-blue-600
              hover:text-blue-700
            "
          >
            SEMUA DIBACA
          </button>
        </div>

        {/* CONTENT */}
        <div className="relative px-5 pb-5">
          {/* ARROW TOP */}
          <ChevronUp
            size={18}
            className="
              absolute
              right-2
              top-2
              text-slate-400
            "
          />

          {/* ARROW BOTTOM */}
          <ChevronDown
            size={18}
            className="
              absolute
              right-2
              bottom-2
              text-slate-400
            "
          />

          {/* LIST */}
          <div
            className="
              max-h-[260px]
              overflow-y-auto
              pr-4
              space-y-4

              [&::-webkit-scrollbar]:w-3
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-400
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="
                    bg-[#ECECEC]
                    border
                    border-[#C8D9FF]
                    rounded-[18px]
                    p-4
                    flex
                    gap-3
                  "
                >
                  {/* CONTENT */}
                  <div className="flex-1">
                    <p
                      className="
                        text-[14px]
                        font-semibold
                        text-slate-700
                        leading-relaxed
                      "
                    >
                      {item.message || item.title}
                    </p>

                    <p
                      className="
                        text-[12px]
                        text-slate-400
                        mt-2
                      "
                    >
                      {item.time || "Baru saja"}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="flex flex-col gap-2">
                    <button
                      className="
                        w-6
                        h-6
                        rounded-md
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Check size={14} className="text-blue-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="
                        w-6
                        h-6
                        rounded-md
                        bg-slate-100
                        hover:bg-red-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Trash2 size={13} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="
                  py-12
                  text-center
                  text-slate-400
                  font-medium
                "
              >
                Tidak ada notifikasi
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalNotifications;
