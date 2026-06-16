import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { mediaService } from "../services/media-service";

function ProductDetailPage() {
 const { state } = useLocation();
const navigate = useNavigate();

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
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "50px 30px",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "60px",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {/* LEFT SIDE - IMAGE */}
      <div
        style={{
          flex: "1",
          minWidth: "400px",
        }}
      >
        <img
          src={selectedImage}
          alt={product.title.rendered}
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "block",
          }}
        />
{/* THUMBNAILS */}
<div
  style={{
    display: "flex",
    gap: "18px",
    marginTop: "25px",
    flexWrap: "wrap",
    alignItems: "center",
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
        width: "130px",
        height: "180px",
        objectFit: "cover",
        cursor: "pointer",
        border:
          selectedImage === image
            ? "2px solid #000"
            : "1px solid #ddd",
        transition: "0.3s ease",
      }}
    />
  ))}
</div>
       

      {/* RIGHT SIDE - PRODUCT INFO */}
      <div
        style={{
          flex: "1",
          minWidth: "350px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
            fontWeight: "500",
          }}
        >
          {product.title.rendered}
        </h1>

        <h2
          style={{
            marginBottom: "30px",
            fontWeight: "400",
          }}
        >
          ₱
          {Number(
            product.acf?.price || 0
          ).toLocaleString("en-PH")}
        </h2>

        {/* DESCRIPTION */}
        <div
          style={{
            marginBottom: "40px",
            lineHeight: "1.9",
            color: "#444",
          }}
        >
          <p>
            {product.acf?.product_description}
          </p>
        </div>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              const cart =
                JSON.parse(
                  localStorage.getItem("cart")
                ) || [];

              const existingItem =
                cart.find(
                  (item) =>
                    item.product?.id ===
                    product.id
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
              padding: "14px 30px",
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
              padding: "14px 30px",
              border: "none",
              background: "#000",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  </div>
);


}

export default ProductDetailPage;
