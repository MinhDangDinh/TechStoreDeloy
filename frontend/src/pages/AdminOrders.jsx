import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminOrders() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(() => {
    API.get("/orders")
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Không lấy được danh sách đơn hàng");
      });
  }, []);

  useEffect(() => {
    if (!user) {
      alert("Bạn cần đăng nhập");
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      alert("Chỉ admin được truy cập trang này");
      navigate("/");
      return;
    }

    fetchOrders();
  }, [fetchOrders, navigate, user]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });

      alert("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật thất bại");
    }
  };

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
        <p className="eyebrow">Admin</p>
        <h1>Quản lý đơn hàng</h1>
        <p className="page-lead">
          Theo dõi trạng thái đơn và cập nhật tiến độ xử lý cho khách hàng.
        </p>
      </section>

      {orders.length === 0 ? (
        <p className="empty-state">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="table-wrap">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Tổng tiền</th>
                <th>Thông tin giao hàng</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.fullname}</td>
                  <td>{order.email}</td>
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
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="shipping">Đang giao hàng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
