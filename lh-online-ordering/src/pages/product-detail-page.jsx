import { useLocation } from "react-router-dom";

function ProductDetailPage() {
  const { state } = useLocation();

  const product = state?.product;

  if (!product) {
    return <div>Product not found.</div>;
  }

  const imageUrl =
    product._embedded?.["wp:featuredmedia"]?.[0]
      ?.source_url;

  return (
    <div style={{ padding: "50px" }}>
      <img
        src={imageUrl}
        alt={product.title.rendered}
        style={{
          width: "400px",
          maxWidth: "100%",
        }}
      />

      <h1>{product.title.rendered}</h1>

      <h2>
        ₱
        {Number(
          product.acf?.price || 0
        ).toLocaleString("en-PH")}
      </h2>

      <p>
        Stock: {product.acf?.stock}
      </p>

      <p>
        {product.acf?.product_description}
      </p>
    </div>
  );
}

export default ProductDetailPage;
