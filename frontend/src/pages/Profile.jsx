import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/users/profile")
      .then((res) => {
        setForm({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          role: res.data.role || "",
        });
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Không lấy được hồ sơ");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put("/users/profile", {
        fullname: form.fullname,
        phone: form.phone,
        address: form.address,
      });

      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...currentUser,
        id: res.data.id,
        fullname: res.data.fullname,
        email: res.data.email,
        role: res.data.role,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profile-updated"));

      setForm({
        fullname: res.data.fullname || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        role: res.data.role || "",
      });

      alert("Cập nhật hồ sơ thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert("Vui lòng nhập đầy đủ thông tin đổi mật khẩu");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới và nhập lại mật khẩu mới không khớp");
      return;
    }

    try {
      await API.put("/users/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Đổi mật khẩu thành công");
    } catch (err) {
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  if (loading) {
    return <p className="page empty-state">Đang tải hồ sơ...</p>;
  }

  const initials = form.fullname
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <main className="profile-page">
      <section className="profile-overview">
        <div className="profile-avatar">{initials || "TS"}</div>
        <p className="eyebrow">Tài khoản</p>
        <h1>{form.fullname}</h1>
        <p>{form.email}</p>
        <span className="profile-role">{form.role}</span>

        <div className="profile-mini-list">
          <span>SĐT: {form.phone || "Chưa cập nhật"}</span>
          <span>Địa chỉ: {form.address || "Chưa cập nhật"}</span>
        </div>
      </section>

      <div className="profile-panels">
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Thông tin</p>
              <h2>Hồ sơ cá nhân</h2>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Họ tên</span>
              <input
                name="fullname"
                type="text"
                value={form.fullname}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} readOnly />
            </label>

            <div className="profile-field-grid">
              <label className="form-field">
                <span>Số điện thoại</span>
                <input
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Vai trò</span>
                <input name="role" type="text" value={form.role} readOnly />
              </label>
            </div>

            <label className="form-field">
              <span>Địa chỉ</span>
              <input
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
              />
            </label>

            <button type="submit">Cập nhật hồ sơ</button>
          </form>
        </section>

        <section className="profile-card password-section">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">Bảo mật</p>
              <h2>Đổi mật khẩu</h2>
            </div>
          </div>

          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <label className="form-field">
              <span>Mật khẩu hiện tại</span>
              <input
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <div className="profile-field-grid">
              <label className="form-field">
                <span>Mật khẩu mới</span>
                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </label>

              <label className="form-field">
                <span>Nhập lại mật khẩu mới</span>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </label>
            </div>

            <button type="submit">Đổi mật khẩu</button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;
