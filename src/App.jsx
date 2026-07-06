// src/App.jsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import api from "./api/api";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProductDetail from "./pages/ProductDetail";
import PublicStoreDetail from "./pages/StoreDetail";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import UsersAdmin from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Transactions from "./pages/admin/Transactions";
import Vouchers from "./pages/admin/Vouchers";
import Admins from "./pages/admin/Admins";
import SystemSettings from "./pages/admin/SystemSettings";
import ChatSeller from "./pages/admin/ChatSeller";
import DashboardSeller from "./pages/seller/DashboardSeller";
import ProductsSeller from "./pages/seller/Products";
import OrdersSeller from "./pages/seller/OrdersSeller";
import ObrolanSeller from "./pages/seller/ObrolanSeller";
import Analystics from "./pages/seller/Analystics";
import Settings from "./pages/seller/Settings";
import SimulasiAntrian from "./pages/admin/SimulasiAntrian";
import StoreProfile from "./pages/seller/StoreProfile";
import AddProduct from "./pages/seller/AddProduct";
/* ================= CUSTOMER ================= */
import Home from "./pages/customer/Home";
import Orders from "./pages/customer/Orders";
import Chat from "./pages/customer/Chat";
import Checkout from "./pages/customer/Checkout";
import CustomerProductDetail from "./pages/customer/ProductDetail";
import Profile from "./pages/customer/Profile";
import StoreDetail from "./pages/customer/StoreDetail";
/* ================= 🔥 REPORT ================= */
import CustomerReports from "./pages/customer/Reports";
import SellerComplaints from "./pages/seller/Complaints";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ================= HANDLE GOOGLE OAUTH CALLBACK =================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      navigate("/");
      return;
    }

    if (token) {
      console.log(
        "🔑 Token received from Google:",
        token.substring(0, 20) + "...",
      );

      localStorage.setItem("token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const fetchUser = async () => {
        try {
          console.log("📡 Fetching user data from /pengguna/me...");
          const response = await api.get("/pengguna/me");
          console.log("✅ Full response from /pengguna/me:", response.data);

          const user = response.data.data;
          console.log("👤 User data received:", user);
          console.log("👤 User name:", user.nama);

          localStorage.setItem("currentUser", JSON.stringify(user));

          let redirectUrl = "/customer";
          if (user.role === "admin") redirectUrl = "/admin";
          else if (user.role === "penjual") redirectUrl = "/seller";

          console.log("🔄 Redirecting to:", redirectUrl);
          window.location.href = redirectUrl;
        } catch (error) {
          console.error("❌ Error fetching user:", error);
          console.error("❌ Error response:", error.response?.data);
          localStorage.removeItem("token");
          navigate("/");
        }
      };
      fetchUser();

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product-detail/:id" element={<ProductDetail />} />
      <Route path="/store/:id" element={<PublicStoreDetail />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/admin" element={<DashboardAdmin />} />
      <Route path="/admin/users" element={<UsersAdmin />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/categories" element={<Categories />} />
      <Route path="/admin/transactions" element={<Transactions />} />
      <Route path="/admin/vouchers" element={<Vouchers />} />
      <Route path="/admin/admins" element={<Admins />} />
      <Route path="/admin/settings" element={<SystemSettings />} />
      <Route path="/admin/chat-seller" element={<ChatSeller />} />
      <Route path="/admin/simulasi-antrian" element={<SimulasiAntrian />} />

      <Route path="/seller" element={<DashboardSeller />} />
      <Route path="/seller/dashboard" element={<DashboardSeller />} />
      <Route path="/seller/products" element={<ProductsSeller />} />
      <Route path="/seller/orders" element={<OrdersSeller />} />
      <Route path="/seller/chat" element={<ObrolanSeller />} />
      <Route path="/seller/analystics" element={<Analystics />} />
      <Route path="/seller/settings" element={<Settings />} />
      <Route path="/seller/store-profile" element={<StoreProfile />} />
      <Route path="/seller/add-product" element={<AddProduct />} />
      {/* 🔥 ROUTE KOMPLAIN SELLER */}
      <Route path="/seller/complaints" element={<SellerComplaints />} />

      <Route path="/customer" element={<Home />} />
      <Route path="/customer/orders" element={<Orders />} />
      <Route path="/customer/chat/:id" element={<Chat />} />
      <Route path="/customer/chat" element={<Chat />} />
      <Route path="/customer/checkout" element={<Checkout />} />
      <Route
        path="/customer/product-detail/:id"
        element={<CustomerProductDetail />}
      />
      <Route path="/customer/store/:id" element={<StoreDetail />} />
      <Route path="/customer/profile" element={<Profile />} />
      {/* 🔥 ROUTE LAPORAN CUSTOMER */}
      <Route path="/customer/reports" element={<CustomerReports />} />
    </Routes>
  );
}

export default App;
