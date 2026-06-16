import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import API from "../services/api";

function AdminProducts() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    category: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = useCallback(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Không lấy được danh sách sản phẩm");
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

    fetchProducts();
  }, [fetchProducts, navigate, user]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
      category: "",
    });
    setSelectedImageFile(null);
    setPreviewUrl("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Tên sản phẩm và giá không được để trống");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("stock", form.stock);
    formData.append("category", form.category);

    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
        alert("Cập nhật sản phẩm thành công");
      } else {
        await API.post("/products", formData);
        alert("Thêm sản phẩm thành công");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = (product) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image || "",
      stock: product.stock,
      category: product.category || "",
    });
    setSelectedImageFile(null);
    setPreviewUrl("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này không?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  };

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Quản lý sản phẩm</h1>
        <p className="page-lead">
          Thêm, chỉnh sửa và theo dõi tồn kho sản phẩm đang hiển thị trên cửa
          hàng.
        </p>
      </section>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Tên sản phẩm"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
        />

        <label className="admin-file-field">
          <span>Ảnh sản phẩm</span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <div className="admin-image-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview ảnh sản phẩm" />
          ) : (
            <ProductImage product={{ name: form.name, image: form.image }} />
          )}
          <span>
            {selectedImageFile
              ? selectedImageFile.name
              : form.image || "Chưa chọn ảnh mới"}
          </span>
        </div>

        <input
          type="number"
          name="stock"
          placeholder="Số lượng trong kho"
          value={form.stock}
          onChange={handleChange}
        />

        <input
          type="text"
          name="category"
          placeholder="Danh mục"
          value={form.category}
          onChange={handleChange}
        />

        <div>
          <button type="submit">
            {editingId ? "Cập nhật" : "Thêm sản phẩm"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Hủy sửa
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table className="cart-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="admin-product-thumb">
                    <ProductImage product={product} />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{Number(product.price).toLocaleString("vi-VN")} VNĐ</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Sửa</button>
                  <button onClick={() => handleDelete(product.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminProducts;
