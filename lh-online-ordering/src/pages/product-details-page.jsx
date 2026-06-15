import { useParams } from "react-router-dom";

function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: "50px" }}>
      <h1>Product Details</h1>

      <p>Product ID: {id}</p>
    </div>
  );
}

export default ProductDetailPage;
