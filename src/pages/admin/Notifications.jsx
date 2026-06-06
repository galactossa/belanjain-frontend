import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Pesanan Baru",
      message: "Ada pesanan baru dari Denis.",
      time: "2 menit lalu",
      type: "success",
    },
    {
      id: 2,
      title: "Pembayaran Pending",
      message: "Pembayaran order #122 belum dikonfirmasi.",
      time: "10 menit lalu",
      type: "warning",
    },
    {
      id: 3,
      title: "Produk Habis",
      message: "Stock Headset Gaming hampir habis.",
      time: "1 jam lalu",
      type: "danger",
    },
  ];

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-5xl font-black text-slate-900">
            Notifications
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
            Semua notifikasi terbaru sistem.
          </p>
        </div>

        <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
          <Bell size={30} />
        </div>

      </div>

      {/* LIST */}
      <div className="mt-10 flex flex-col gap-5">

        {notifications.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[30px] p-6 border shadow-sm flex items-start justify-between hover:shadow-lg duration-300"
          >

            <div className="flex items-start gap-5">

              {/* ICON */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  item.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : item.type === "warning"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500"
                }`}
              >

                {item.type === "success" ? (
                  <CheckCircle size={28} />
                ) : item.type === "warning" ? (
                  <Clock size={28} />
                ) : (
                  <AlertCircle size={28} />
                )}

              </div>

              {/* TEXT */}
              <div>

                <h2 className="text-2xl font-black text-slate-900">
                  {item.title}
                </h2>

                <p className="text-slate-500 mt-2">
                  {item.message}
                </p>

                <p className="text-sm text-slate-400 mt-3">
                  {item.time}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </AdminLayout>
  );
}

export default Notifications;