import { Routes, Route } from "react-router-dom";
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
import ProductsCustomer from "./pages/customer/Products";
import CategoriesCustomer from "./pages/customer/Categories";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import Chat from "./pages/customer/Chat";
import Checkout from "./pages/customer/Checkout";
import CustomerProductDetail from "./pages/customer/ProductDetail";
import Profile from "./pages/customer/Profile";
import Wishlist from "./pages/customer/Wishlist";
import StoreDetail from "./pages/customer/StoreDetail";
function App() {
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
      <Route path="/customer" element={<Home />} />

      <Route path="/customer/products" element={<ProductsCustomer />} />

      <Route path="/customer/categories" element={<CategoriesCustomer />} />

      <Route path="/customer/cart" element={<Cart />} />

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
      <Route path="/customer/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;
