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

  const isAvailable = Boolean(
    Number(product?.acf?.stock ?? 0) > 0
  );

  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] =
    useState(null);

  useEffect(() => {
    async function loadGallery() {
      if (!product) return;

      const images = [];

      const featuredImage =
        product._embedded?.[
          "wp:featuredmedia"
        ]?.[0]?.source_url;

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
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "60px 30px",
        background: "#faf9f7",
        minHeight: "100vh",
      }}
    >
     
{/* BREADCRUMB — keep this section only once on the page */}
<div
  style={{
    marginBottom: "50px",
    fontSize: "13px",
    color: "#8b8b8b",
    letterSpacing: "2px",
    textTransform: "uppercase",
  }}
>
  <span
    onClick={() => navigate("/")}
    style={{ cursor: "pointer" }}
  >
    Home
  </span>
