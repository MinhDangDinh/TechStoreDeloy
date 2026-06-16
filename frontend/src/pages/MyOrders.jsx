import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyOrders() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập để xem đơn hàng");
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      alert("Admin không sử dụng trang đơn hàng cá nhân");
      navigate("/admin/orders");
      return;
    }

    API.get("/orders/my-orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Không lấy được danh sách đơn hàng");
      });
  }, [navigate, user]);

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatShippingMethod = (method) => {
    switch (method) {
      case "standard":
        return "Giao hàng tiêu chuẩn";
      case "fast":
        return "Giao hàng nhanh";
      default:
        return method || "-";
    }
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "ewallet":
        return "Ví điện tử";
      default:
        return method || "-";
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Tài khoản</p>
        <h1>Đơn hàng của tôi</h1>
      </section>

      {orders.length === 0 ? (
        <p className="empty-state">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Tổng tiền</th>
                <th>Thông tin giao hàng</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {Number(order.total_amount).toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td>
                    <div className="order-extra">
                      <span>Người nhận: {order.receiver_name || "-"}</span>
                      <span>SĐT: {order.receiver_phone || "-"}</span>
                      <span>Địa chỉ: {order.shipping_address || "-"}</span>
                      <span>Vận chuyển: {formatShippingMethod(order.shipping_method)}</span>
                      <span>Thanh toán: {formatPaymentMethod(order.payment_method)}</span>
                      {order.note && <span>Ghi chú: {order.note}</span>}
                    </div>
                  </td>
                  <td>{formatStatus(order.status)}</td>
                  <td>{new Date(order.created_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default MyOrders;
