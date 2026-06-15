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
<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <button
    onClick={() => {
      const cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const existingItem = cart.find(
        (item) =>
          item.product?.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          product,
          quantity: 1,
        });
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      alert("Added to cart!");
    }}
    style={{
      padding: "12px 25px",
      border: "1px solid #000",
      background: "#fff",
      cursor: "pointer",
    }}
  >
    ADD TO CART
  </button>

  <button
    onClick={() =>
      navigate("/order", {
        state: {
          product,
        },
      })
    }
    style={{
      padding: "12px 25px",
      border: "none",
      background: "#000",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    BUY NOW
  </button>
</div>
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
