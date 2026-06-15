import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { mediaService } from "../services/media-service";

function ProductDetailPage() {
  const { state } = useLocation();

  const product = state?.product;
  const [gallery, setGallery] = useState([]);
const [selectedImage, setSelectedImage] =
  useState(null);
useEffect(() => {
  async function loadGallery() {
    if (!product) return;

    const images = [];

    const featuredImage =
      product._embedded?.["wp:featuredmedia"]?.[0]
        ?.source_url;

    if (featuredImage) {
      images.push(featuredImage);
    }

    const imageIds = [
      product.acf?.product_image_2,
      product.acf?.product_image_3,
      product.acf?.product_image_4,
      product.acf?.product_image_5,
    ].filter(Boolean);

    for (const id of imageIds) {
      try {
        const media =
          await mediaService.getById(id);

        images.push(media.source_url);
      } catch (err) {
        console.error(err);
      }
    }

    setGallery(images);

    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }

  loadGallery();
}, [product]);
  if (!product) {
    return <div>Product not found.</div>;
  }


  return (
    <div style={{ padding: "50px" }}>
     <div>
  <img
    src={selectedImage}
    alt={product.title.rendered}
    style={{
      width: "500px",
      maxWidth: "100%",
      marginBottom: "20px",
    }}
  />

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    {gallery.map((image, index) => (
      <img
        key={index}
        src={image}
        alt=""
        onClick={() =>
          setSelectedImage(image)
        }
        style={{
          width: "80px",
          height: "80px",
          objectFit: "cover",
          cursor: "pointer",
          border:
            selectedImage === image
              ? "2px solid black"
              : "1px solid #ddd",
        }}
      />
    ))}
  </div>
</div>

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
