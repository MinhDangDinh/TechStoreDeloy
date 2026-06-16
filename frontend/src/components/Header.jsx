import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const syncUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("auth-updated", syncUser);
    window.addEventListener("profile-updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-updated", syncUser);
      window.removeEventListener("profile-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">TS</span>
        <span className="brand-text">
          <span className="brand-name">TechStore</span>
          <span className="brand-subtitle">Thiết bị công nghệ</span>
        </span>
      </Link>

      <nav>
        <Link to="/">Trang chủ</Link>

        {user?.role === "customer" && (
          <>
            <Link to="/cart">Giỏ hàng</Link>
            <Link to="/my-orders">Đơn hàng của tôi</Link>
          </>
        )}

        {user ? (
          <>
            {user.role === "admin" && (
              <>
                <Link to="/admin/products">Sản phẩm</Link>
                <Link to="/admin/orders">Đơn hàng</Link>
              </>
            )}

            <Link className="user-greeting" to="/profile">
              Xin chào, {user.fullname}
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
