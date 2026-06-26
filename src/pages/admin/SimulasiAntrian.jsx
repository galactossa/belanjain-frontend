// src/pages/admin/SimulasiAntrian.jsx

import AdminLayout from "../../layouts/AdminLayout";
import { SlidersHorizontal, Play, Cpu, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../api/api";

const defaultChartData = [
  { jam: "00", antrian: 0, pesanan: 0 },
  { jam: "02", antrian: 0, pesanan: 0 },
  { jam: "04", antrian: 0, pesanan: 0 },
  { jam: "06", antrian: 0, pesanan: 0 },
  { jam: "08", antrian: 0, pesanan: 0 },
  { jam: "10", antrian: 0, pesanan: 0 },
  { jam: "12", antrian: 0, pesanan: 0 },
  { jam: "14", antrian: 0, pesanan: 0 },
  { jam: "16", antrian: 0, pesanan: 0 },
  { jam: "18", antrian: 0, pesanan: 0 },
  { jam: "20", antrian: 0, pesanan: 0 },
  { jam: "22", antrian: 0, pesanan: 0 },
];

const COLORS = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6"];

function SimulasiAntrian() {
  const [settings, setSettings] = useState({
    arrivalRate: 5,
    sellers: 1,
    payment: 10,
    confirm: 15,
    packing: 20,
  });
  const [simData, setSimData] = useState([]);
  const [simMetrics, setSimMetrics] = useState({
    totalQueue: 0,
    throughput: 0,
    avgWait: 0,
    bottleneck: "Packing & Kurir",
    sellerUtilization: 0,
  });
  const [hasRun, setHasRun] = useState(false);
  const [runId, setRunId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historicalData, setHistoricalData] = useState(null);
  const [bottleneckData, setBottleneckData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [showHistorical, setShowHistorical] = useState(false);

  // ================= FETCH HISTORICAL DATA =================
  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/simulasi/preview");
      const data = response.data.data;
      setHistoricalData(data);

      // Update settings dengan data dari database
      if (data.rata_rata_order_per_jam) {
        setSettings((prev) => ({
          ...prev,
          arrivalRate: Math.round(data.rata_rata_order_per_jam),
          sellers: data.jumlah_seller_aktif || 1,
          payment: Math.round(data.rata_rata_waktu_pembayaran_menit || 10),
          confirm: Math.round(
            data.rata_rata_waktu_konfirmasi_seller_menit || 15,
          ),
          packing: Math.round(data.rata_rata_waktu_packing_menit || 20),
        }));
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  // ================= BOTTLENECK ANALYSIS =================
  const analyzeBottleneck = (stages) => {
    const sorted = [...stages].sort((a, b) => b.duration - a.duration);
    const maxDuration = sorted[0]?.duration || 0;

    return stages.map((stage) => ({
      ...stage,
      isBottleneck: stage.duration === maxDuration && maxDuration > 0,
      percentage: maxDuration > 0 ? (stage.duration / maxDuration) * 100 : 0,
    }));
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ================= RUN SIMULATION =================
  const runSimulation = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/simulasi/real-data", {
        simulation_minutes: 480,
      });

      const data = response.data.data;
      const simulasi = data.simulasi;
      const historis = data.data_historis;

      // Generate chart data dari hasil simulasi
      const newData = defaultChartData.map((item, index) => {
        const peak =
          Math.sin((index / (defaultChartData.length - 1)) * Math.PI) * 0.55 +
          0.45;
        const antrian = Math.max(
          5,
          Math.round((simulasi.avg_queue_length || 15) * peak * 1.3),
        );
        const pesanan = Math.max(
          2,
          Math.round((simulasi.throughput_per_hour || 10) * peak * 0.8),
        );
        return {
          jam: item.jam,
          antrian: antrian,
          pesanan: pesanan,
        };
      });

      setSimData(newData);
      setSimMetrics({
        totalQueue: simulasi.total_orders_completed || 0,
        throughput: simulasi.throughput_per_hour || 0,
        avgWait: simulasi.avg_waiting_time_minutes || 0,
        bottleneck: simulasi.bottleneck || "Packing & Kurir",
        sellerUtilization: simulasi.seller_utilization || 0,
      });

      // Stage data untuk bottleneck visualization
      const stages = [
        {
          name: "Pembayaran",
          duration:
            historis?.rata_rata_waktu_pembayaran_menit || settings.payment,
        },
        {
          name: "Konfirmasi Seller",
          duration:
            historis?.rata_rata_waktu_konfirmasi_seller_menit ||
            settings.confirm,
        },
        {
          name: "Packing",
          duration: historis?.rata_rata_waktu_packing_menit || settings.packing,
        },
      ];

      const analyzedStages = analyzeBottleneck(stages);
      setBottleneckData(analyzedStages);

      // Stage distribution untuk pie chart
      setStageData(stages);

      setHasRun(true);
      setRunId((r) => r + 1);
      setShowHistorical(true);
    } catch (error) {
      console.error("Error running simulation:", error);
      console.warn("⚠️ Menggunakan simulasi lokal (belum ada data transaksi)");
      runLocalSimulation();
    } finally {
      setLoading(false);
    }
  };

  // ================= LOCAL SIMULATION (FALLBACK) =================
  const runLocalSimulation = () => {
    const loadFactor = settings.arrivalRate * 100;
    const delayFactor = settings.payment + settings.confirm + settings.packing;
    const sellerFactor = Math.max(0.35, 1 - (settings.sellers - 1) * 0.14);
    const baseDelay = delayFactor * sellerFactor + 6;

    const newData = defaultChartData.map((item, index) => {
      const peak =
        Math.sin((index / (defaultChartData.length - 1)) * Math.PI) * 0.55 +
        0.45;
      const antrian = Math.max(
        5,
        Math.round(loadFactor * peak + baseDelay * (1 + peak * 0.18)),
      );
      const pesanan = Math.max(
        2,
        Math.round(settings.arrivalRate * peak * 0.7),
      );
      return { jam: item.jam, antrian, pesanan };
    });

    const totalQueue = newData.reduce((sum, item) => sum + item.antrian, 0);
    const throughput = Number(
      (settings.arrivalRate * settings.sellers * 0.95).toFixed(2),
    );
    const avgWait = Number((baseDelay / settings.sellers).toFixed(1));

    const stages = [
      { name: "Pembayaran", duration: settings.payment },
      { name: "Konfirmasi Seller", duration: settings.confirm },
      { name: "Packing", duration: settings.packing },
    ];

    const bottleneck = stages.reduce(
      (max, stage) => (stage.duration > max.duration ? stage : max),
      stages[0],
    );

    const sellerUtilization = Math.min(
      100,
      Math.max(15, Math.round((settings.sellers / 5) * 100)),
    );

    const analyzedStages = analyzeBottleneck(stages);
    setBottleneckData(analyzedStages);
    setStageData(stages);

    setSimData(newData);
    setSimMetrics({
      totalQueue,
      throughput,
      avgWait,
      bottleneck: bottleneck.name,
      sellerUtilization,
    });
    setHasRun(true);
    setRunId((r) => r + 1);
  };

  // ================= RENDER BOTTLENECK CHART =================
  const renderBottleneckChart = () => {
    if (bottleneckData.length === 0) {
      return (
        <div className="text-slate-400 text-center py-4">
          Jalankan simulasi untuk melihat analisis
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bottleneckData.map((stage, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span
                className={`font-semibold ${stage.isBottleneck ? "text-red-500" : "text-slate-600"}`}
              >
                {stage.name}
                {stage.isBottleneck && " 🔴"}
              </span>
              <span className="text-slate-500">{stage.duration} menit</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  stage.isBottleneck ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(stage.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ================= RENDER PIE CHART =================
  const renderPieChart = () => {
    if (stageData.length === 0) {
      return (
        <div className="text-slate-400 text-center py-4">Tidak ada data</div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={stageData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="duration"
            nameKey="name"
            label={({ name, duration }) => `${name}: ${duration}m`}
            labelLine={false}
          >
            {stageData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <AdminLayout>
      <div className="bg-[#f5f7fb] min-h-screen px-8 py-7 w-full">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[38px] font-black text-slate-900">
              Simulasi Performa & Antrian Order
            </h1>
            <p className="text-slate-500 mt-2">
              Simulasikan throughput dan antrian order sistem BelanjaIn
              berdasarkan data real dari database.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchHistoricalData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 transition text-sm font-black"
            >
              <RefreshCw size={16} />
              Refresh Data
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
              />
              <span className="font-black text-[12px] tracking-widest">
                {loading ? "PROSES..." : "READY"}
              </span>
            </div>
          </div>
        </div>

        {/* 🔥 HISTORICAL DATA INFO */}
        {historicalData && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="font-black text-blue-600">
                📊 Data Historis:
              </span>
              <span>
                Total Pesanan:{" "}
                <strong>{historicalData.total_data_pesanan}</strong>
              </span>
              <span>
                Order/Jam:{" "}
                <strong>{historicalData.rata_rata_order_per_jam}</strong>
              </span>
              <span>
                Seller Aktif:{" "}
                <strong>{historicalData.jumlah_seller_aktif}</strong>
              </span>
              <span>
                Pembayaran:{" "}
                <strong>
                  {historicalData.rata_rata_waktu_pembayaran_menit} menit
                </strong>
              </span>
              <span>
                Konfirmasi:{" "}
                <strong>
                  {historicalData.rata_rata_waktu_konfirmasi_seller_menit} menit
                </strong>
              </span>
              <span>
                Packing:{" "}
                <strong>
                  {historicalData.rata_rata_waktu_packing_menit} menit
                </strong>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 text-yellow-700 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-[420px_1fr_380px] gap-6">
          {/* SIDEBAR KIRI - KONFIGURASI */}
          <div>
            <div className="bg-white rounded-[32px] p-7 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <SlidersHorizontal size={22} className="text-blue-600" />
                <h2 className="font-black text-lg">KONFIGURASI PARAMETER</h2>
              </div>
              <div className="space-y-7">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Laju Kedatangan Order</span>
                    <span className="bg-blue-50 px-3 py-1 rounded-xl text-blue-600 font-black text-sm">
                      {settings.arrivalRate} order / jam
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={settings.arrivalRate}
                    onChange={(e) =>
                      handleSettingChange("arrivalRate", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Seller Aktif</span>
                    <span className="bg-green-50 px-3 py-1 rounded-xl text-green-600 font-black text-sm">
                      {settings.sellers} seller
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={settings.sellers}
                    onChange={(e) =>
                      handleSettingChange("sellers", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Verifikasi Pembayaran</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-xl font-black text-sm">
                      {settings.payment} menit
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={settings.payment}
                    onChange={(e) =>
                      handleSettingChange("payment", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Konfirmasi Seller</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-xl font-black text-sm">
                      {settings.confirm} menit
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={settings.confirm}
                    onChange={(e) =>
                      handleSettingChange("confirm", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">Packing & Kurir</span>
                    <span className="bg-slate-100 px-3 py-1 rounded-xl font-black text-sm">
                      {settings.packing} menit
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={40}
                    value={settings.packing}
                    onChange={(e) =>
                      handleSettingChange("packing", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <button
                  onClick={runSimulation}
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl text-white font-black flex items-center justify-center gap-3 shadow-xl transition-all ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Play size={18} />
                  )}
                  {loading ? "MENJALANKAN..." : "JALANKAN SIMULASI"}
                </button>
              </div>
            </div>
          </div>

          {/* MIDDLE - METRIK */}
          <div>
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-400 text-sm uppercase tracking-wider">
                Simulasi Selesai (24 Jam)
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-slate-50 rounded-3xl p-5">
                  <p className="text-xs font-black text-slate-400 uppercase">
                    Total Antrian
                  </p>
                  <h2 className="text-4xl font-black text-blue-600 mt-2">
                    {hasRun ? simMetrics.totalQueue : "-"}
                  </h2>
                  <p className="font-black text-blue-600">Pesanan</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-5">
                  <p className="text-xs font-black text-slate-400 uppercase">
                    Throughput
                  </p>
                  <h2 className="text-4xl font-black text-green-600 mt-2">
                    {hasRun ? simMetrics.throughput : "-"}
                  </h2>
                  <p className="font-black text-green-600">/ Jam</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-3xl p-5 mt-5">
                <p className="text-xs uppercase font-black text-slate-400">
                  Rata-rata Waktu Tunggu
                </p>
                <div className="flex items-center justify-between mt-2">
                  <h2 className="text-4xl font-black text-red-500">
                    {hasRun ? `${simMetrics.avgWait} menit` : "-"}
                  </h2>
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-black ${
                      hasRun
                        ? simMetrics.avgWait > 60
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {hasRun
                      ? simMetrics.avgWait > 60
                        ? "KRITIS"
                        : "STABIL"
                      : "MENUNGGU"}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <span className="font-black text-sm">Utilisasi Seller</span>
                  <span className="font-black text-blue-600">
                    {hasRun ? `${simMetrics.sellerUtilization}%` : "-"}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{
                      width: hasRun ? `${simMetrics.sellerUtilization}%` : "0%",
                    }}
                  />
                </div>
              </div>
              <div className="mt-5 text-sm text-slate-500">
                <span className="font-black">Bottleneck: </span>
                {hasRun
                  ? simMetrics.bottleneck
                  : "Tekan tombol untuk menjalankan simulasi."}
              </div>
            </div>
          </div>

          {/* RIGHT - BOTTLENECK */}
          <div>
            <div className="bg-gradient-to-br from-[#08142e] to-[#0f274f] rounded-[32px] p-7 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <Cpu className="text-yellow-400" />
                <h3 className="font-black text-xl">IDENTIFIKASI BOTTLENECK</h3>
              </div>
              <p className="text-slate-400 text-sm uppercase">
                Tahap Paling Lambat
              </p>
              <h2 className="text-[32px] font-black text-yellow-400 mt-2">
                {hasRun ? simMetrics.bottleneck : "Belum ada data"}
              </h2>

              {/* 🔥 BOTTLENECK DETAIL CHART */}
              <div className="mt-6">{renderBottleneckChart()}</div>

              {/* 🔥 PIE CHART */}
              <div className="mt-6">
                <p className="text-xs text-slate-400 uppercase font-bold mb-3">
                  Distribusi Waktu Proses
                </p>
                {renderPieChart()}
              </div>

              <div className="bg-white/10 rounded-3xl p-5 mt-6">
                <h4 className="font-black text-yellow-400">
                  SARAN AI OPTIMIZER
                </h4>
                <p className="text-sm mt-3 leading-relaxed text-slate-200">
                  {hasRun
                    ? simMetrics.avgWait > 60
                      ? `🔴 Sistem overload! ${simMetrics.bottleneck} adalah bottleneck utama. Tambah seller dan optimasi proses.`
                      : simMetrics.avgWait > 30
                        ? `🟡 ${simMetrics.bottleneck} perlu dioptimasi. Pertimbangkan menambah resource.`
                        : `🟢 Sistem berjalan optimal. Pertahankan konfigurasi saat ini.`
                    : "Mulai simulasi agar optimizer memberi rekomendasi berdasarkan pengaturan Anda."}
                </p>
              </div>
            </div>
          </div>

          {/* CHART - FULL WIDTH */}
          <div className="col-span-3">
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-500 uppercase tracking-widest text-sm">
                  Distribusi Penundaan Antrian
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                    <span className="text-slate-500">Antrian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                    <span className="text-slate-500">Pesanan Selesai</span>
                  </div>
                </div>
              </div>
              <div className="h-[520px]">
                {hasRun ? (
                  <ResponsiveContainer key={runId} width="100%" height="100%">
                    <AreaChart data={simData} key={runId}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="jam" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip
                        formatter={(value) => [`${value} pesanan`, ""]}
                        labelFormatter={(label) => `Jam ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="antrian"
                        stroke="#f59e0b"
                        fill="#fbbf24"
                        fillOpacity={0.3}
                        name="Antrian"
                      />
                      <Area
                        type="monotone"
                        dataKey="pesanan"
                        stroke="#3B82F6"
                        fill="#60A5FA"
                        fillOpacity={0.2}
                        name="Pesanan Selesai"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg font-semibold">
                      Tekan tombol "JALANKAN SIMULASI"
                    </p>
                    <p className="text-sm">
                      untuk menampilkan chart distribusi antrian
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SimulasiAntrian;
