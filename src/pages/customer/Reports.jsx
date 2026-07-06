// src/pages/customer/Reports.jsx
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";

function CustomerReports() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  useEffect(() => {
    const fetchReports = async () => {
      if (!currentUser?.id_pengguna) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(
          `/laporan/pelapor/${currentUser.id_pengguna}`,
        );
        setReports(response.data.data.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [currentUser?.id_pengguna]);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("menunggu")) {
      return {
        label: "MENUNGGU",
        color: "bg-yellow-100 text-yellow-700",
        icon: <Clock size={14} />,
      };
    }
    if (s.includes("diproses")) {
      return {
        label: "DIPROSES",
        color: "bg-blue-100 text-blue-700",
        icon: <Clock size={14} />,
      };
    }
    if (s.includes("direspon")) {
      return {
        label: "DIRESPON",
        color: "bg-purple-100 text-purple-700",
        icon: <CheckCircle size={14} />,
      };
    }
    if (s.includes("selesai")) {
      return {
        label: "SELESAI",
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle size={14} />,
      };
    }
    if (s.includes("ditolak")) {
      return {
        label: "DITOLAK",
        color: "bg-red-100 text-red-700",
        icon: <XCircle size={14} />,
      };
    }
    return {
      label: status || "MENUNGGU",
      color: "bg-slate-100 text-slate-700",
      icon: <Clock size={14} />,
    };
  };

  const filteredReports = reports.filter((item) => {
    const matchSearch =
      (item.alasan || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.nama_produk || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (item.status || "").toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "menunggu", label: "Menunggu" },
    { id: "diproses", label: "Diproses" },
    { id: "direspon", label: "Direspon" },
    { id: "selesai", label: "Selesai" },
    { id: "ditolak", label: "Ditolak" },
  ];

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/customer")}
            className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-black">Riwayat Laporan</h1>
            <p className="text-slate-500 text-sm mt-1">
              Pantau status laporan produk bermasalah Anda
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari laporan..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                  filterStatus === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-700">
              Belum Ada Laporan
            </h3>
            <p className="text-slate-400 mt-2">
              {reports.length === 0
                ? "Anda belum membuat laporan apapun"
                : "Tidak ada laporan dengan filter ini"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((item) => {
              const status = getStatusBadge(item.status);
              return (
                <div
                  key={item.id_laporan}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">
                          #{item.id_laporan}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${status.color}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 mt-2">
                        {item.nama_produk || "Produk"}
                      </h3>

                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                        {item.alasan}
                      </p>

                      {item.respon_seller && (
                        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-purple-600">
                            📩 Respon Seller:
                          </p>
                          <p className="text-sm text-slate-700 mt-1">
                            {item.respon_seller}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {item.respon_seller_at
                              ? new Date(item.respon_seller_at).toLocaleString(
                                  "id-ID",
                                )
                              : "-"}
                          </p>
                        </div>
                      )}

                      {item.catatan_admin && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-blue-600">
                            📋 Catatan Admin:
                          </p>
                          <p className="text-sm text-slate-700 mt-1">
                            {item.catatan_admin}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {item.status === "menunggu" ||
                      item.status === "diproses" ? (
                        <span className="text-xs text-yellow-600 font-bold bg-yellow-50 px-4 py-2 rounded-xl">
                          ⏳ Menunggu Tindakan
                        </span>
                      ) : item.status === "direspon" ? (
                        <span className="text-xs text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl">
                          ✅ Sudah Direspon
                        </span>
                      ) : item.status === "selesai" ? (
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl">
                          ✅ Selesai
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}

export default CustomerReports;
