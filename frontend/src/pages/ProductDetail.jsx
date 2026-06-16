import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import API from "../services/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Không tìm thấy sản phẩm");
        navigate("/");
      });
  }, [id, navigate]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng");
  };

  if (!product) {
    return <p className="page empty-state">Đang tải...</p>;
  }

  return (
    <main className="page">
      <section className="product-detail">
        <div className="product-detail-image">
          <ProductImage product={product} />
        </div>

        <div className="product-detail-info">
          <p className="eyebrow">{product.category || "TechStore"}</p>
          <h1>{product.name}</h1>

          <p className="detail-row">
            <b>Mô tả:</b> {product.description}
          </p>

          <p className="detail-row">
            <b>Giá:</b> {Number(product.price).toLocaleString("vi-VN")} VNĐ
          </p>

          <p className="detail-row">
            <b>Số lượng trong kho:</b> {product.stock}
          </p>

          <div className="detail-actions">
            {user?.role !== "admin" && (
              <button onClick={addToCart}>Thêm vào giỏ</button>
            )}

            <button className="secondary" onClick={() => navigate("/")}>
              Quay lại
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
