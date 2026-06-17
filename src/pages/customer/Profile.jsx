import {
  ArrowLeft,
  Pencil,
  Trophy,
  Gift,
  CreditCard,
  MapPin,
  Store,
  ChevronRight,
  Camera,
  Save,
  X,
} from "lucide-react";
import PointModal from "../../components/customer/profile/PointModal";
import Pengaturan from "../../components/customer/profile/Pengaturan";
import DrawerAlamat from "../../components/customer/profile/DrawerAlamat";
import VoucherModal from "../../components/customer/profile/VoucherModal";
import SaldoModal from "../../components/customer/profile/SaldoModal";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import OpenStoreModal from "../../components/customer/profile/OpenStoreModal";
import { useState, useEffect } from "react";
import Footer from "../../components/home/Footer";
import api from "../../api/api";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [myVoucher, setMyVoucher] = useState([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [showAlamatDrawer, setShowAlamatDrawer] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [followedStores, setFollowedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membershipLevel, setMembershipLevel] = useState("REGULAR");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/pengguna/me");
        const userData = response.data.data;
        setUser(userData);
        setName(userData.nama);
        setEmail(userData.email);

        // Fetch points
        const pointsRes = await api.get(
          `/loyalty/points/pengguna/${userData.id_pengguna}`,
        );
        setPoints(pointsRes.data.data.total_points || 0);

        // Fetch point history
        const historyRes = await api.get(
          `/loyalty/history/pengguna/${userData.id_pengguna}`,
        );
        setHistory(historyRes.data.data || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchProfile();
    else setLoading(false);
  }, [currentUser]);

  // ================= FETCH MEMBERSHIP LEVEL =================
  useEffect(() => {
    const fetchMembership = async () => {
      if (!user?.id_pengguna && !currentUser?.id_pengguna) return;
      try {
        const userId = user?.id_pengguna || currentUser?.id_pengguna;
        const response = await api.get(`/loyalty/membership/${userId}`);
        const level = response.data.data?.membership_level || "Regular";
        setMembershipLevel(level.toUpperCase());
      } catch (error) {
        console.error("Error fetching membership:", error);
        setMembershipLevel("REGULAR");
      }
    };
    fetchMembership();
  }, [user, currentUser]);

  // Load vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get("/voucher");
        setMyVoucher(response.data.data || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  // ================= HANDLE PHOTO UPLOAD =================
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const userId = user?.id_pengguna || currentUser.id_pengguna;
      const response = await api.post(
        `/pengguna/${userId}/upload-foto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Upload response:", response.data);
      const imageUrl = response.data.data.url_foto;
      console.log("Image URL:", imageUrl);

      const updatedUser = { ...currentUser, url_foto: imageUrl };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser({ ...user, url_foto: imageUrl });

      alert("Foto profil berhasil diupload!");
      // 🔥 Force reload untuk melihat perubahan
      window.location.reload();
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(error.response?.data?.message || "Gagal upload foto");
    }
  };

  // ================= REDEEM VOUCHER =================
  const redeemVoucher = async (voucher) => {
    if (points < voucher.pointCost) {
      alert("Poin tidak cukup!");
      return;
    }

    try {
      await api.put("/loyalty/points/redeem", {
        id_pengguna: currentUser.id,
        poin_dipakai: voucher.pointCost,
      });

      const pointsRes = await api.get(
        `/loyalty/points/pengguna/${currentUser.id}`,
      );
      const newPoints = pointsRes.data.data.total_points || 0;
      setPoints(newPoints);

      const updatedUser = { ...currentUser, points: newPoints };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      const voucherRes = await api.get("/voucher");
      setMyVoucher(voucherRes.data.data || []);

      alert(`Voucher ${voucher.kode} berhasil diredeem!`);
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      alert(error.response?.data?.message || "Gagal redeem voucher");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <div className="bg-slate-50 min-h-screen">
          <div className="text-center py-20">User tidak ditemukan</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        <div className="bg-white border-b">
          <div className="max-w-[1700px] mx-auto px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/customer")}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-slate-800" />
              </button>
              <h1 className="text-2xl font-black">
                {activeTab === "profile" ? "Profil Saya" : "Pengaturan"}
              </h1>
            </div>
            <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 h-8 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "profile"
                    ? "bg-white text-blue-600 shadow"
                    : "text-slate-600"
                }`}
              >
                Profil Saya
              </button>
              <button
                onClick={() => setActiveTab("setting")}
                className={`px-4 h-8 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === "setting"
                    ? "bg-white text-blue-600 shadow"
                    : "text-slate-600"
                }`}
              >
                Pengaturan
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto py-8 px-4"
            >
              {/* USER CARD */}
              <div className="bg-white rounded-3xl border p-7 shadow-sm">
                {!showEdit ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          id="profileImage"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="profileImage"
                          className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center bg-blue-600 text-white text-3xl font-black shadow-lg relative"
                        >
                          {currentUser?.url_foto ? (
                            <img
                              src={currentUser.url_foto}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : currentUser?.photo ? (
                            <img
                              src={currentUser.photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            currentUser?.name?.charAt(0) || "U"
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center">
                            <Camera size={24} />
                          </div>
                        </label>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black">
                            {user?.nama || currentUser.name}
                          </h2>
                          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-500 text-xs font-bold">
                            {membershipLevel || "REGULAR"} MEMBER
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          {user?.email || currentUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEdit(true)}
                      className="w-10 h-10 rounded-xl border flex items-center justify-center"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        id="profileImageEdit"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="profileImageEdit"
                        className="w-24 h-24 rounded-3xl overflow-hidden bg-blue-600 text-white text-4xl font-black flex items-center justify-center relative cursor-pointer"
                      >
                        {currentUser?.url_foto ? (
                          <img
                            src={currentUser.url_foto}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : currentUser?.photo ? (
                          <img
                            src={currentUser.photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          currentUser?.name?.charAt(0) || "U"
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center">
                          <Camera size={24} />
                        </div>
                      </label>
                    </div>
                    <div className="flex-1 space-y-4">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 bg-slate-100 rounded-2xl px-5 font-bold outline-none"
                      />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 bg-slate-100 rounded-2xl px-5 font-bold outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEdit(false)}
                        className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center"
                      >
                        <X />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(
                              `/pengguna/${user?.id_pengguna || currentUser.id}`,
                              { nama: name, email: email },
                            );
                            const updatedUser = { ...currentUser, name, email };
                            localStorage.setItem(
                              "currentUser",
                              JSON.stringify(updatedUser),
                            );
                            setShowEdit(false);
                            window.location.reload();
                          } catch (error) {
                            console.error("Error updating profile:", error);
                            alert(
                              error.response?.data?.message ||
                                "Gagal update profil",
                            );
                          }
                        }}
                        className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center"
                      >
                        <Save />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div
                  onClick={() => setShowPointModal(true)}
                  className="bg-white rounded-3xl border p-5 text-center cursor-pointer hover:shadow-lg duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-orange-50 flex items-center justify-center">
                    <Trophy size={20} className="text-orange-500" />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">POIN SAYA</p>
                  <h3 className="font-black text-xl mt-1">{points} Poin</h3>
                </div>
                <div
                  onClick={() => setShowVoucherModal(true)}
                  className="bg-white rounded-3xl border p-5 text-center cursor-pointer hover:shadow-lg duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center">
                    <Gift size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">VOUCHER</p>
                  <h3 className="font-black text-xl mt-1">
                    {myVoucher.length} Voucher
                  </h3>
                </div>
                <div
                  onClick={() => setShowSaldoModal(true)}
                  className="bg-white rounded-3xl border p-5 text-center cursor-pointer hover:shadow-lg duration-300"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">SALDO</p>
                  <h3 className="font-black text-xl mt-1">
                    Rp {saldo.toLocaleString("id-ID")}
                  </h3>
                </div>
              </div>

              <div className="bg-white rounded-3xl border p-6 mt-5">
                <div className="flex justify-between mb-5">
                  <h3 className="font-black">PROGRESS LEVEL</h3>
                  <span className="text-blue-600 text-sm font-bold">
                    Kejar Platinum
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${Math.min((points / 2000) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-4">
                  <span>GOLD</span>
                  <span>{points} / 2000 POIN</span>
                  <span>PLATINUM</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border p-6 mt-5">
                <h3 className="font-black text-xl mb-5">INFORMASI IDENTITAS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400">USERNAME</p>
                    <p className="font-black mt-1">
                      {user?.nama || currentUser.name}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400">TERDAFTAR SEJAK</p>
                    <p className="font-black mt-1">
                      {new Date(
                        user?.created_at || Date.now(),
                      ).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => setShowAlamatDrawer(true)}
                  className="mt-4 bg-blue-50 rounded-2xl px-4 py-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 duration-300"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      Kelola Daftar Alamat
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-blue-600" />
                </div>
                <div className="mt-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Store size={22} />
                    </div>
                    <div>
                      <h4 className="font-black text-xl">
                        MULAI JUALAN DI BELANJAIN
                      </h4>
                      <p className="text-sm text-blue-100">
                        Buka toko gratis & dapatkan profit optimal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStoreModal(true)}
                    className="mt-5 w-full h-12 bg-white rounded-2xl text-blue-600 font-black"
                  >
                    BUKA TOKO GRATIS SEKARANG
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="setting"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto py-8 px-4"
            >
              <Pengaturan />
            </motion.div>
          )}
        </AnimatePresence>

        <PointModal
          show={showPointModal}
          onClose={() => setShowPointModal(false)}
          points={points}
          history={history}
          redeemVoucher={redeemVoucher}
        />
        <VoucherModal
          show={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          vouchers={myVoucher}
        />
        <SaldoModal
          show={showSaldoModal}
          onClose={() => setShowSaldoModal(false)}
          saldo={saldo}
          setSaldo={setSaldo}
        />
        <DrawerAlamat
          show={showAlamatDrawer}
          onClose={() => setShowAlamatDrawer(false)}
        />
        <OpenStoreModal
          show={showStoreModal}
          onClose={() => setShowStoreModal(false)}
        />
      </div>
      <Footer />
    </>
  );
}

export default Profile;
