import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập để xem giỏ hàng");
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      alert("Admin không sử dụng chức năng giỏ hàng");
      navigate("/admin/products");
      return;
    }
  }, [navigate, user]);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("Bạn cần đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống");
      return;
    }

    navigate("/checkout");
  };

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Thanh toán</p>
        <h1>Giỏ hàng</h1>
      </section>

      {cart.length === 0 ? (
        <p className="empty-state">Giỏ hàng đang trống.</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price.toLocaleString("vi-VN")} VNĐ</td>
                    <td>
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span className="quantity">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </td>
                    <td>
                      {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td>
                      <button onClick={() => removeItem(item.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ</h2>

          <button className="checkout-btn" onClick={handleCheckout}>
            Tiến hành thanh toán
          </button>
        </>
      )}
    </main>
  );
}

export default Cart;
