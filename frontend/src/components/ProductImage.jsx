const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const UPLOADS_BASE_URL = `${API_ORIGIN}/uploads/products`;
const NO_IMAGE_SRC = `${UPLOADS_BASE_URL}/no-image.png`;

function getImageSrc(image) {
  return image ? `${UPLOADS_BASE_URL}/${image}` : NO_IMAGE_SRC;
}

function ProductImage({ product, className = "" }) {
  return (
    <img
      alt={product?.name || "Sản phẩm"}
      className={className}
      src={getImageSrc(product?.image)}
      onError={(e) => {
        if (!e.currentTarget.src.endsWith(NO_IMAGE_SRC)) {
          e.currentTarget.src = NO_IMAGE_SRC;
        }
      }}
    />
  );
}

export default ProductImage;