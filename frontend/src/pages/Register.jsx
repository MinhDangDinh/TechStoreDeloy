import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <main className="form-page">
      <h1>Đăng ký</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="fullname"
          placeholder="Họ tên"
          value={form.fullname}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Đăng ký</button>
      </form>
    </main>
  );
}

export default Register;
