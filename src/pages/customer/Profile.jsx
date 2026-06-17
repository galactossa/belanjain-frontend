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
import { sellers } from "../../data/sellers";
import { users } from "../../data/users";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const profileUser =
    users.find((u) => u.id === currentUser?.id) || currentUser;
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [followedStores, setFollowedStores] = useState([]);
  useEffect(() => {
    const stores =
      JSON.parse(localStorage.getItem(`followedStores_${currentUser?.id}`)) ||
      [];

    const normalized = stores
      .map((store) => (typeof store === "number" ? store : store?.id))
      .filter((storeId) => typeof storeId === "number");

    setFollowedStores(normalized);
  }, [currentUser?.id]);

  const followedStoreSellers = followedStores
    .map((storeId) => sellers.find((store) => store.id === storeId))
    .filter(Boolean);

  const navigate = useNavigate();
  const location = useLocation();
  const [saldo, setSaldo] = useState(
    Number(localStorage.getItem(`saldo_${currentUser?.id}`)) ||
      currentUser?.balance ||
      250000,
  );
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");

  const [showEdit, setShowEdit] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");
  const [myVoucher, setMyVoucher] = useState(
    JSON.parse(localStorage.getItem(`myVoucher_${currentUser?.id}`)) || [],
  );
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [showAlamatDrawer, setShowAlamatDrawer] = useState(false);
  const [email, setEmail] = useState(currentUser?.email || "");
  const [showPointModal, setShowPointModal] = useState(false);

  const [points, setPoints] = useState(
    Number(localStorage.getItem(`points_${currentUser?.id}`)) ||
      currentUser?.points ||
      0,
  );

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem(`pointHistory_${currentUser?.id}`)) || [],
  );
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      setPoints(
        Number(localStorage.getItem(`points_${user.id}`)) || user.points || 0,
      );

      setSaldo(
        Number(localStorage.getItem(`saldo_${user.id}`)) ||
          user.balance ||
          250000,
      );

      setHistory(
        JSON.parse(localStorage.getItem(`pointHistory_${user.id}`)) || [],
      );
    }
  }, []);
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedUser = {
        ...currentUser,
        photo: reader.result,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      window.location.reload();
    };

    reader.readAsDataURL(file);
  };
  const redeemVoucher = (voucher) => {
    if (points < voucher.pointCost) {
      return;
    }
    const updatedVoucher = [...myVoucher, voucher];

    setMyVoucher(updatedVoucher);

    localStorage.setItem(
      `myVoucher_${currentUser.id}`,
      JSON.stringify(updatedVoucher),
    );
    const newPoint = points - voucher.pointCost;

    setPoints(newPoint);

    localStorage.setItem(`points_${currentUser.id}`, newPoint);

    const updatedUser = {
      ...currentUser,
      points: newPoint,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const newHistory = [
      {
        title: `Redeem ${voucher.code}`,
        point: `-${voucher.pointCost}`,
        type: "minus",
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      ...history,
    ];

    setHistory(newHistory);

    localStorage.setItem(
      `pointHistory_${currentUser.id}`,
      JSON.stringify(newHistory),
    );
  };
  const unfollowStore = (id) => {
    const updated = followedStores.filter((storeId) => storeId !== id);

    setFollowedStores(updated);

    localStorage.setItem(
      `followedStores_${currentUser.id}`,
      JSON.stringify(updated),
    );
  };
  return (
    <>
      <div className="bg-slate-50 min-h-screen">
        {/* HEADER */}
        <div className="bg-white border-b">
          <div className="max-w-[1700px] mx-auto px-10 h-16 flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/customer")}
                className="
    w-8
    h-8
    rounded-xl
    hover:bg-slate-100
    flex
    items-center
    justify-center
  "
              >
                <ArrowLeft size={20} className="text-slate-800" />
              </button>

              <h1 className="text-2xl font-black">
                {activeTab === "profile" ? "Profil Saya" : "Pengaturan"}
              </h1>
            </div>

            {/* RIGHT TAB */}
            <div
              className="
    bg-slate-100
    p-1
    rounded-2xl
    flex
    gap-1
  "
            >
              <button
                onClick={() => setActiveTab("profile")}
                className={`
    px-4
    h-8
    rounded-xl
    font-bold
    text-sm
    transition-all
    duration-300
    ${
      activeTab === "profile"
        ? "bg-white text-blue-600 shadow"
        : "text-slate-600"
    }
  `}
              >
                Profil Saya
              </button>

              <button
                onClick={() => setActiveTab("setting")}
                className={`
    px-4
    h-8
    rounded-xl
    font-bold
    text-sm
    transition-all
    duration-300
    ${
      activeTab === "setting"
        ? "bg-white text-blue-600 shadow"
        : "text-slate-600"
    }
  `}
              >
                Pengaturan
              </button>
            </div>
          </div>
        </div>
        {/* CONTENT */}

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
              <div
                className="
    bg-white
    rounded-3xl
    border
    p-7
    shadow-sm
  "
              >
                {!showEdit ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      {/* AVATAR */}
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
                          className="
      w-20
      h-20
      rounded-2xl
      overflow-hidden
      cursor-pointer
      flex
      items-center
      justify-center
      bg-blue-600
      text-white
      text-3xl
      font-black
      shadow-lg
      relative
    "
                        >
                          {currentUser?.photo ? (
                            <img
                              src={currentUser.photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : profileUser?.avatar ? (
                            <img
                              src={profileUser.avatar}
                              alt={profileUser?.name || "Avatar"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            currentUser?.name?.charAt(0)
                          )}

                          {/* HOVER CAMERA */}
                          <div
                            className="
        absolute
        inset-0
        bg-black/50
        opacity-0
        group-hover:opacity-100
        duration-300
        flex
        items-center
        justify-center
      "
                          >
                            <Camera size={24} />
                          </div>
                        </label>
                      </div>

                      {/* INFO */}
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black">
                            {currentUser.name}
                          </h2>

                          <span
                            className="
                      px-3
                      py-1
                      rounded-full
                      bg-orange-100
                      text-orange-500
                      text-xs
                      font-bold
                      "
                          >
                            GOLD MEMBER
                          </span>
                        </div>

                        <p className="text-slate-500 mt-1">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowEdit(true)}
                      className="
    w-10
    h-10
    rounded-xl
    border
    flex
    items-center
    justify-center
  "
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    {/* FOTO */}
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
                        className="
          w-24
          h-24
          rounded-3xl
          overflow-hidden
          bg-blue-600
          text-white
          text-4xl
          font-black
          flex
          items-center
          justify-center
          relative
          cursor-pointer
        "
                      >
                        {currentUser?.photo ? (
                          <img
                            src={currentUser.photo}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : profileUser?.avatar ? (
                          <img
                            src={profileUser.avatar}
                            alt={profileUser?.name || "Avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          currentUser?.name?.charAt(0)
                        )}

                        <div
                          className="
            absolute
            inset-0
            bg-black/50
            opacity-0
            group-hover:opacity-100
            duration-300
            flex
            items-center
            justify-center
          "
                        >
                          <Camera size={24} />
                        </div>
                      </label>
                    </div>

                    {/* INPUT */}
                    <div className="flex-1 space-y-4">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="
          w-full
          h-12
          bg-slate-100
          rounded-2xl
          px-5
          font-bold
          outline-none
        "
                      />

                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
          w-full
          h-12
          bg-slate-100
          rounded-2xl
          px-5
          font-bold
          outline-none
        "
                      />
                    </div>

                    {/* BUTTON */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEdit(false)}
                        className="
          w-14
          h-14
          rounded-2xl
          bg-slate-100
          flex
          items-center
          justify-center
        "
                      >
                        <X />
                      </button>

                      <button
                        onClick={() => {
                          const updatedUser = {
                            ...currentUser,
                            name,
                            email,
                          };

                          localStorage.setItem(
                            "currentUser",
                            JSON.stringify(updatedUser),
                          );

                          setShowEdit(false);

                          window.location.reload();
                        }}
                        className="
          w-14
          h-14
          rounded-2xl
          bg-blue-600
          text-white
          flex
          items-center
          justify-center
        "
                      >
                        <Save />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 mt-5">
                {/* POINT */}
                <div
                  onClick={() => setShowPointModal(true)}
                  className="
    bg-white
    rounded-3xl
    border
    p-5
    text-center
    cursor-pointer
    hover:shadow-lg
    duration-300
  "
                >
                  <div
                    className="
      w-12
      h-12
      mx-auto
      rounded-xl
      bg-orange-50
      flex
      items-center
      justify-center
    "
                  >
                    <Trophy size={20} className="text-orange-500" />
                  </div>

                  <p className="text-xs text-slate-400 mt-3">POIN SAYA</p>

                  <h3 className="font-black text-xl mt-1">{points} Poin</h3>
                </div>

                {/* VOUCHER */}
                <div
                  onClick={() => setShowVoucherModal(true)}
                  className="
    bg-white
    rounded-3xl
    border
    p-5
    text-center
    cursor-pointer
    hover:shadow-lg
    duration-300
  "
                >
                  <div
                    className="
                w-12
                h-12
                mx-auto
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                "
                  >
                    <Gift size={20} className="text-blue-600" />
                  </div>

                  <p className="text-xs text-slate-400 mt-3">VOUCHER</p>

                  <h3 className="font-black text-xl mt-1">
                    {myVoucher.length} Voucher
                  </h3>
                </div>

                {/* SALDO */}
                <div
                  onClick={() => setShowSaldoModal(true)}
                  className="
    bg-white
    rounded-3xl
    border
    p-5
    text-center
    cursor-pointer
    hover:shadow-lg
    duration-300
  "
                >
                  <div
                    className="
                w-12
                h-12
                mx-auto
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                "
                  >
                    <CreditCard size={20} className="text-blue-600" />
                  </div>

                  <p className="text-xs text-slate-400 mt-3">SALDO</p>

                  <h3 className="font-black text-xl mt-1">
                    Rp {saldo.toLocaleString("id-ID")}
                  </h3>
                </div>
              </div>

              {/* PROGRESS */}
              <div
                className="
            bg-white
            rounded-3xl
            border
            p-6
            mt-5
            "
              >
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

                  <span>
                    <span>{points} / 2000 POIN</span>
                  </span>

                  <span>PLATINUM</span>
                </div>
              </div>

              {/* IDENTITAS */}
              <div
                className="
            bg-white
            rounded-3xl
            border
            p-6
            mt-5
            "
              >
                <h3 className="font-black text-xl mb-5">INFORMASI IDENTITAS</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400">USERNAME</p>

                    <p className="font-black mt-1">{currentUser.name}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs text-slate-400">TERDAFTAR SEJAK</p>

                    <p className="font-black mt-1">Januari 2024</p>
                  </div>
                </div>

                {/* ALAMAT */}
                <div
                  onClick={() => setShowAlamatDrawer(true)}
                  className="
    mt-4
    bg-blue-50
    rounded-2xl
    px-4
    py-4
    flex
    items-center
    justify-between
    cursor-pointer
    hover:bg-blue-100
    duration-300
  "
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-blue-600" />

                    <span className="font-semibold text-blue-600">
                      Kelola Daftar Alamat
                    </span>
                  </div>

                  <ChevronRight size={18} className="text-blue-600" />
                </div>

                {/* SELLER BANNER */}
                <div
                  className="
              mt-5
              rounded-3xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              p-6
              text-white
              "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                  w-12
                  h-12
                  rounded-xl
                  bg-white/20
                  flex
                  items-center
                  justify-center
                  "
                    >
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
                    className="
    mt-5
    w-full
    h-12
    bg-white
    rounded-2xl
    text-blue-600
    font-black
  "
                  >
                    BUKA TOKO GRATIS SEKARANG
                  </button>
                </div>
              </div>

              {/* TOKO DIIKUTI */}
              <div
                className="
    bg-white
    rounded-3xl
    border
    p-6
    mt-5
  "
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-black">TOKO YANG DIIKUTI</h3>

                  <span
                    className="
        px-3
        py-1
        bg-slate-100
        rounded-full
        text-sm
      "
                  >
                    {followedStoreSellers.length} Toko
                  </span>
                </div>

                {followedStoreSellers.length === 0 ? (
                  <div
                    className="
        mt-5
        border-2
        border-dashed
        rounded-3xl
        h-40
        flex
        flex-col
        items-center
        justify-center
        text-slate-400
      "
                  >
                    <Store size={40} />

                    <p className="font-semibold mt-3">
                      Belum Ada Toko yang Diikuti
                    </p>

                    <p className="text-sm">
                      Cari produk menarik dan ikuti toko favoritmu
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {followedStoreSellers.map((store) => (
                      <div
                        key={store.id}
                        onClick={() => navigate(`/customer/store/${store.id}`)}
                        className="
            bg-slate-50
            rounded-3xl
            p-4
            flex
            items-center
            justify-between
            cursor-pointer
            hover:bg-slate-100
            duration-300
          "
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="
                w-14
                h-14
                rounded-2xl
                object-cover
                border
              "
                          />

                          <div>
                            <h4
                              className="
                  font-black
                  text-blue-600
                "
                            >
                              {store.name}
                            </h4>

                            <p className="text-sm text-slate-500">
                              {store.city}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unfollowStore(store.id);
                          }}
                          className="
              px-4
              h-10
              rounded-xl
              bg-red-50
              text-red-500
              font-bold
              text-sm
            "
                        >
                          BATAL IKUTI
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
