import AdminLayout from "../../layouts/AdminLayout";
import { SlidersHorizontal, Play, Cpu } from "lucide-react";
import { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultChartData = [
  { jam: "00", antrian: 0 },
  { jam: "02", antrian: 0 },
  { jam: "04", antrian: 0 },
  { jam: "06", antrian: 0 },
  { jam: "08", antrian: 0 },
  { jam: "10", antrian: 0 },
  { jam: "12", antrian: 0 },
  { jam: "14", antrian: 0 },
  { jam: "16", antrian: 0 },
  { jam: "18", antrian: 0 },
  { jam: "20", antrian: 0 },
  { jam: "22", antrian: 0 },
];

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

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const runSimulation = () => {
    const loadFactor = settings.arrivalRate * 100;
    const delayFactor = settings.payment + settings.confirm + settings.packing;
    const sellerFactor = Math.max(0.35, 1 - (settings.sellers - 1) * 0.14);
    const baseDelay = delayFactor * sellerFactor + 6;

    const newData = defaultChartData.map((item, index) => {
      const peak =
        Math.sin((index / (defaultChartData.length - 1)) * Math.PI) * 0.55 +
        0.45;
      const antrian = Math.max(
        35,
        Math.round(loadFactor * peak + baseDelay * (1 + peak * 0.18)),
      );
      return { jam: item.jam, antrian };
    });

    const totalQueue = newData.reduce((sum, item) => sum + item.antrian, 0);
    const throughput = Number(
      (settings.arrivalRate * settings.sellers * 0.95).toFixed(2),
    );
    const avgWait = Number((baseDelay / settings.sellers).toFixed(1));
    const bottleneck =
      settings.packing >= settings.confirm &&
      settings.packing >= settings.payment
        ? "Packing & Kurir"
        : settings.confirm >= settings.payment
          ? "Konfirmasi Seller"
          : "Verifikasi Pembayaran";
    const sellerUtilization = Math.min(
      100,
      Math.max(15, Math.round((settings.sellers / 5) * 100)),
    );

    setSimData(newData);
    setSimMetrics({
      totalQueue,
      throughput,
      avgWait,
      bottleneck,
      sellerUtilization,
    });
    setHasRun(true);
    setRunId((r) => r + 1);
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
              Simulasikan throughput dan antrian order sistem BelanjaIn secara
              real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-black text-[12px] tracking-widest">
              ENGINE READY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[420px_1fr_380px] gap-6">
          <div>
            <div className="bg-white rounded-[32px] p-7 border border-slate-200 shadow-sm h-[650px]">
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
                    max={15}
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
                    max={5}
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
                    min={5}
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
                    min={5}
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
                    min={5}
                    max={40}
                    value={settings.packing}
                    onChange={(e) =>
                      handleSettingChange("packing", Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={runSimulation}
                  className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center gap-3 shadow-xl"
                >
                  <Play size={18} />
                  JALANKAN SIMULASI
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm h-[650px] flex flex-col">
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
                  <span className="px-4 py-2 rounded-xl bg-red-100 text-red-600 font-black text-xs">
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
                    className="h-full bg-blue-600"
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

          <div>
            <div className="bg-gradient-to-br from-[#08142e] to-[#0f274f] rounded-[32px] p-7 text-white h-[650px] flex flex-col">
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
              <p className="mt-4 text-slate-300 leading-relaxed">
                {hasRun
                  ? "Tahap ini adalah hambatan utama yang memengaruhi waktu tunggu pengguna."
                  : "Jalankan simulasi untuk melihat rekomendasi bottleneck."}
              </p>
              <div className="bg-white/10 rounded-3xl p-5 mt-8">
                <h4 className="font-black text-yellow-400">
                  SARAN AI OPTIMIZER
                </h4>
                <p className="text-sm mt-3 leading-relaxed text-slate-200">
                  {hasRun
                    ? "Pertimbangkan meningkatkan seller dan mempercepat proses packing untuk stabilkan antrian."
                    : "Mulai simulasi agar optimizer memberi rekomendasi berdasarkan pengaturan Anda."}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-500 uppercase tracking-widest text-sm mb-6">
                Distribusi Penundaan Antrian
              </h3>
              <div className="h-[520px]">
                {hasRun ? (
                  <ResponsiveContainer key={runId} width="100%" height="100%">
                    <AreaChart data={simData} key={runId}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jam" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="antrian"
                        stroke="#f59e0b"
                        fill="#fbbf24"
                        fillOpacity={0.35}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-lg font-semibold">
                    Tekan tombol "JALANKAN SIMULASI" untuk menampilkan chart.
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
