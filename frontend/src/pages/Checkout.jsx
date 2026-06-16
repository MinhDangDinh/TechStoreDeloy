import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const [form, setForm] = useState({
    receiver_name: user?.fullname || "",
    receiver_phone: "",
    shipping_address: "",
    shipping_method: "standard",
    payment_method: "cod",
    note: "",
  });

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập để thanh toán");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Giỏ hàng đang trống");
      navigate("/cart");
    }
  }, [cart.length, navigate, user]);

  useEffect(() => {
    if (!user) return;

    API.get("/users/profile")
      .then((res) => {
        setForm((currentForm) => ({
          ...currentForm,
          receiver_name: currentForm.receiver_name || res.data.fullname || "",
          receiver_phone: currentForm.receiver_phone || res.data.phone || "",
          shipping_address:
            currentForm.shipping_address || res.data.address || "",
        }));
      })
      .catch(() => {
        // Checkout vẫn dùng được nếu không lấy được profile.
      });
  }, [user]);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.receiver_name || !form.receiver_phone || !form.shipping_address) {
      alert("Vui lòng nhập đủ thông tin giao hàng");
      return;
    }

    const items = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    try {
      const res = await API.post("/orders", {
        items,
        ...form,
      });

      alert(`Đặt hàng thành công! Mã đơn hàng: ${res.data.orderId}`);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/my-orders");
    } catch (err) {
      alert(err.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  return (
    <main className="checkout-page">
      <section className="page-header">
        <p className="eyebrow">Thanh toán</p>
        <h1>Hoàn tất đơn hàng</h1>
        <p className="page-lead">
          Kiểm tra giỏ hàng, nhập thông tin nhận hàng và chọn phương thức thanh
          toán mô phỏng.
        </p>
      </section>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <h2>Thông tin giao hàng</h2>

            <label className="form-field">
              <span>Họ tên người nhận</span>
              <input
                name="receiver_name"
                type="text"
                value={form.receiver_name}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Số điện thoại</span>
              <input
                name="receiver_phone"
                type="text"
                value={form.receiver_phone}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Địa chỉ giao hàng</span>
              <input
                name="shipping_address"
                type="text"
                value={form.shipping_address}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Ghi chú</span>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Ví dụ: Giao giờ hành chính"
              />
            </label>
          </section>

          <section className="checkout-section">
            <h2>Vận chuyển và thanh toán</h2>

            <label className="form-field">
              <span>Phương thức vận chuyển</span>
              <select
                name="shipping_method"
                value={form.shipping_method}
                onChange={handleChange}
              >
                <option value="standard">Giao hàng tiêu chuẩn</option>
                <option value="fast">Giao hàng nhanh</option>
              </select>
            </label>

            <label className="form-field">
              <span>Phương thức thanh toán</span>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
              >
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="ewallet">Ví điện tử</option>
              </select>
            </label>
          </section>

          <button type="submit">Xác nhận đặt hàng</button>
        </form>

        <aside className="checkout-summary">
          <h2>Đơn hàng</h2>

          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>Số lượng: {item.quantity}</span>
                </div>
                <b>{(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ</b>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Tổng tiền</span>
            <strong>{totalAmount.toLocaleString("vi-VN")} VNĐ</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
