// src/pages/seller/Complaints.jsx - FULL LENGKAP

import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  MessageSquare,
  Send,
  Package,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import SellerLayout from "../../layouts/SellerLayout";
import api from "../../api/api";

function SellerComplaints() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [storeId, setStoreId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [showDetail, setShowDetail] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    menunggu: 0,
    diproses: 0,
    direspon: 0,
    selesai: 0,
    ditolak: 0,
  });

  // Fetch store ID
  useEffect(() => {
    const fetchStore = async () => {
      if (!currentUser?.id_pengguna) return;
      try {
        const response = await api.get(`/toko/user/${currentUser.id_pengguna}`);
        setStoreId(response.data.data.id_toko);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
    };
    fetchStore();
  }, [currentUser?.id_pengguna]);

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/laporan/seller/${storeId}`);
        console.log("🔍 Complaints response:", response.data);

        const data = response.data.data.data || [];
        setComplaints(data);

        const statsRes = await api.get(`/laporan/seller/${storeId}/statistik`);
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [storeId]);

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

  const handleResponse = async (complaintId) => {
    if (!responseText.trim() || responseText.trim().length < 5) {
      alert("Respon minimal 5 karakter");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/laporan/${complaintId}/seller-response`, {
        respon: responseText.trim(),
      });

      const response = await api.get(`/laporan/seller/${storeId}`);
      setComplaints(response.data.data.data || []);

      const statsRes = await api.get(`/laporan/seller/${storeId}/statistik`);
      setStats(statsRes.data.data);

      setShowDetail(null);
      setResponseText("");
      alert("✅ Respon berhasil dikirim!");
    } catch (error) {
      console.error("Error sending response:", error);
      alert(error.response?.data?.message || "Gagal mengirim respon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (complaintId, status) => {
    if (
      !window.confirm(`Yakin ingin mengubah status ke ${status.toUpperCase()}?`)
    )
      return;

    try {
      await api.put(`/laporan/${complaintId}/status`, { status });

      const response = await api.get(`/laporan/seller/${storeId}`);
      setComplaints(response.data.data.data || []);

      const statsRes = await api.get(`/laporan/seller/${storeId}/statistik`);
      setStats(statsRes.data.data);

      alert(`✅ Status diubah ke ${status.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Gagal update status");
    }
  };

  const filteredComplaints = complaints.filter((item) => {
    const matchSearch =
      (item.alasan || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.pelapor_nama || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.produk?.nama_produk || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "semua" ||
      (item.status || "").toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  const tabs = [
    { id: "semua", label: "Semua", count: stats.total },
    { id: "menunggu", label: "Menunggu", count: stats.menunggu },
    { id: "diproses", label: "Diproses", count: stats.diproses },
    { id: "direspon", label: "Direspon", count: stats.direspon },
    { id: "selesai", label: "Selesai", count: stats.selesai },
    { id: "ditolak", label: "Ditolak", count: stats.ditolak },
  ];

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hitung hari sejak laporan dibuat
  const getDaysSince = (date) => {
    if (!date) return 0;
    const created = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black">Komplain Masuk</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola dan respon komplain dari pembeli
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white rounded-2xl border p-4">
            <p className="text-xs text-slate-400 font-bold">Total</p>
            <p className="text-2xl font-black mt-1">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4">
            <p className="text-xs text-yellow-600 font-bold">Menunggu</p>
            <p className="text-2xl font-black text-yellow-700 mt-1">
              {stats.menunggu}
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
            <p className="text-xs text-blue-600 font-bold">Diproses</p>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {stats.diproses}
            </p>
          </div>
          <div className="bg-purple-50 rounded-2xl border border-purple-200 p-4">
            <p className="text-xs text-purple-600 font-bold">Direspon</p>
            <p className="text-2xl font-black text-purple-700 mt-1">
              {stats.direspon}
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-200 p-4">
            <p className="text-xs text-green-600 font-bold">Selesai</p>
            <p className="text-2xl font-black text-green-700 mt-1">
              {stats.selesai}
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari komplain..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition flex items-center gap-2 ${
                  filterStatus === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filterStatus === tab.id ? "bg-white/20" : "bg-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center mt-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-700">
              Tidak Ada Komplain
            </h3>
            <p className="text-slate-400 mt-2">
              {complaints.length === 0
                ? "Belum ada komplain dari pembeli"
                : "Tidak ada komplain dengan filter ini"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {filteredComplaints.map((item) => {
              const status = getStatusBadge(item.status);
              const isActionable =
                item.status === "menunggu" ||
                item.status === "diproses" ||
                item.status === "direspon";
              const daysSince = getDaysSince(item.created_at);
              const isUrgent = daysSince >= 3;

              return (
                <div
                  key={item.id_laporan}
                  className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition ${
                    isUrgent && isActionable
                      ? "border-red-300 bg-red-50/30"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* LEFT - INFO */}
                    <div className="flex-1">
                      {/* HEADER */}
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
                        {isUrgent && isActionable && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-black">
                            <Clock size={12} />
                            {daysSince} Hari
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {formatDate(item.created_at)}
                        </span>
                      </div>

                      {/* PRODUK YANG DIKOMPLAIN */}
                      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.produk?.url_gambar ||
                              "https://via.placeholder.com/80"
                            }
                            alt={item.produk?.nama_produk || "Produk"}
                            className="w-20 h-20 rounded-xl object-cover border"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/80?text=No+Image";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Package size={16} className="text-blue-500" />
                              <h3 className="font-bold text-slate-900">
                                {item.produk?.nama_produk ||
                                  "Produk tidak ditemukan"}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                              <span>ID: #{item.produk?.id_produk || "-"}</span>
                              <span>•</span>
                              <span>
                                Harga: Rp{" "}
                                {Number(item.produk?.harga || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </span>
                              <span>•</span>
                              <span>Stok: {item.produk?.stok || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ALASAN KOMPLAIN */}
                      <div className="mt-3">
                        <p className="text-sm text-slate-600">
                          <span className="font-bold text-slate-700">
                            Alasan:
                          </span>{" "}
                          {item.alasan}
                        </p>
                      </div>

                      {/* PELAPOR */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>Pelapor: {item.pelapor_nama || "-"}</span>
                        </div>
                        <span>•</span>
                        <span>Email: {item.pelapor_email || "-"}</span>
                      </div>

                      {/* RESPON SELLER */}
                      {item.respon_seller && (
                        <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-purple-600">
                            📩 Respon Anda:
                          </p>
                          <p className="text-sm text-slate-700 mt-1">
                            {item.respon_seller}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {item.respon_seller_at
                              ? formatDate(item.respon_seller_at)
                              : "-"}
                          </p>
                        </div>
                      )}

                      {/* CATATAN ADMIN */}
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

                    {/* RIGHT - ACTIONS */}
                    <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
                      {/* 🔥 TOMBOL RESPON & SELESAI/TOLAK - TETAP ADA UNTUK MENUNGGU, DIPROSES, DAN DIRESPON */}
                      {isActionable && (
                        <>
                          <button
                            onClick={() =>
                              setShowDetail(
                                showDetail === item.id_laporan
                                  ? null
                                  : item.id_laporan,
                              )
                            }
                            className={`px-4 py-2 rounded-xl text-white font-bold text-sm transition flex items-center gap-2 ${
                              showDetail === item.id_laporan
                                ? "bg-slate-600 hover:bg-slate-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            <MessageSquare size={16} />
                            {showDetail === item.id_laporan
                              ? "Tutup"
                              : "Respon"}
                          </button>

                          {/* 🔥 TOMBOL SELESAI & TOLAK - TETAP ADA */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleResolve(item.id_laporan, "selesai")
                              }
                              className="flex-1 px-3 py-2 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition"
                            >
                              ✅ Selesai
                            </button>
                            <button
                              onClick={() =>
                                handleResolve(item.id_laporan, "ditolak")
                              }
                              className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
                            >
                              ❌ Tolak
                            </button>
                          </div>
                        </>
                      )}

                      {item.status === "selesai" && (
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl text-center">
                          ✅ Selesai
                        </span>
                      )}
                      {item.status === "ditolak" && (
                        <span className="text-xs text-red-600 font-bold bg-red-50 px-4 py-2 rounded-xl text-center">
                          ❌ Ditolak
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RESPON FORM */}
                  {showDetail === item.id_laporan && isActionable && (
                    <div className="mt-4 border-t pt-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                        <p className="text-sm text-yellow-700">
                          ⚠️ Komplain ini sudah{" "}
                          <strong>{daysSince} hari</strong> belum ditindak.
                          {daysSince >= 3 &&
                            " Segera respon untuk menghindari teguran admin!"}
                        </p>
                      </div>
                      <textarea
                        rows={3}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Tulis respon Anda untuk pembeli..."
                        className="w-full rounded-xl border border-slate-200 p-4 resize-none outline-none focus:border-blue-500"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleResponse(item.id_laporan)}
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-xl text-white font-bold text-sm flex items-center gap-2 ${
                            isSubmitting
                              ? "bg-blue-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          <Send size={16} />
                          {isSubmitting ? "Mengirim..." : "Kirim Respon"}
                        </button>
                        <button
                          onClick={() => setShowDetail(null)}
                          className="px-6 py-2 rounded-xl bg-slate-100 font-bold text-sm hover:bg-slate-200"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}

export default SellerComplaints;
