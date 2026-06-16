import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
