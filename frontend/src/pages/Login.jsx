import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-updated"));

      alert("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <main className="form-page">
      <h1>Đăng nhập</h1>

      <form onSubmit={handleSubmit} className="form">
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

        <button type="submit">Đăng nhập</button>
      </form>
    </main>
  );
}

export default Login;
