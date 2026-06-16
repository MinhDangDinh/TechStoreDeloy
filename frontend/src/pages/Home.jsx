import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import API from "../services/api";

const PRODUCTS_PER_PAGE = 12;

function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Không lấy được danh sách sản phẩm");
      });
  }, []);

  const addToCart = (product) => {
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

  const categoryStats = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      if (!product.category) return acc;
      acc.set(product.category, (acc.get(product.category) || 0) + 1);
      return acc;
    }, new Map());

    const sortedCategories = Array.from(counts.entries()).sort(([a], [b]) =>
      a.localeCompare(b, "vi")
    );

    return [
      { name: "all", label: "Tất cả", count: products.length },
      ...sortedCategories.map(([name, count]) => ({ name, label: name, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const matchKeyword = product.name
        .toLowerCase()
        .includes(normalizedKeyword);
      const matchCategory = category === "all" || product.category === category;

      return matchKeyword && matchCategory;
    });
  }, [products, keyword, category]);

  const hasActiveFilter = keyword.trim() || category !== "all";
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );
  const pageStart = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    pageStart,
    pageStart + PRODUCTS_PER_PAGE
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const resetFilters = () => {
    setKeyword("");
    setCategory("all");
    setCurrentPage(1);
  };

  return (
    <main className="page">
      <section className="page-header">
        <p className="eyebrow">TechStore</p>
        <h1>Khám phá thiết bị công nghệ cho công việc và giải trí</h1>
        <p className="page-lead">
          Chọn nhanh laptop, điện thoại, phụ kiện và thiết bị gaming với danh mục
          rõ ràng, giá hiển thị minh bạch và thao tác mua hàng gọn nhẹ.
        </p>
      </section>

      <section className="store-toolbar">
        <div className="filter-box">
          <div className="filter-row">
            <label className="search-field">
              <span>Tìm kiếm</span>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </label>

            <label className="select-field">
              <span>Danh mục</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categoryStats.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </select>
            </label>

          </div>

          <div className="category-filter" aria-label="Lọc theo danh mục">
            {categoryStats.map((cat) => (
              <button
                aria-pressed={category === cat.name}
                className={`category-chip ${
                  category === cat.name ? "is-active" : ""
                }`}
                key={cat.name}
                onClick={() => {
                  setCategory(cat.name);
                  setCurrentPage(1);
                }}
                type="button"
              >
                <span>{cat.label}</span>
                <small>{cat.count}</small>
              </button>
            ))}

            {hasActiveFilter && (
              <button
                className="clear-filter"
                onClick={resetFilters}
                type="button"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <p className="empty-state">Không tìm thấy sản phẩm phù hợp.</p>
      ) : (
        <>
          <section className="product-grid">
            {currentProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <ProductImage product={product} />
                </div>

                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-meta">
                  <span className="price">
                    {Number(product.price).toLocaleString("vi-VN")} VNĐ
                  </span>
                  <span className="stock">Kho: {product.stock}</span>
                </div>

                <div className="product-actions">
                  <Link to={`/products/${product.id}`}>Chi tiết</Link>

                  {user?.role !== "admin" && (
                    <button onClick={() => addToCart(product)}>Thêm giỏ</button>
                  )}
                </div>
              </article>
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Chuyển trang sản phẩm">
              <span>
                Trang {currentPage}/{totalPages}
              </span>

              <div className="pagination-actions">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  type="button"
                >
                  Trước
                </button>

                {pageNumbers.map((page) => (
                  <button
                    aria-current={currentPage === page ? "page" : undefined}
                    className={currentPage === page ? "is-active" : ""}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    type="button"
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  type="button"
                >
                  Sau
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </main>
  );
}

export default Home;
