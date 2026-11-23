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

  // Read the bouquet details saved in the ACF Product Info fields.
  const bouquetSize = product?.acf?.bouquet_size;

  // Support the intended ACF field name and the likely auto-generated name.
  const bouquetHeight =
    product?.acf?.bouquet_height_cm ??
    product?.acf?.approx_height_cm;

  const hasBouquetSize =
    bouquetSize !== undefined &&
    bouquetSize !== null &&
    String(bouquetSize).trim() !== "";

  const hasBouquetHeight =
    bouquetHeight !== undefined &&
    bouquetHeight !== null &&
    String(bouquetHeight).trim() !== "";

  const hasBouquetDetails =
    hasBouquetSize || hasBouquetHeight;

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
          const media = await mediaService.getById(id);

          if (media?.source_url) {
            images.push(media.source_url);
          }
        } catch (err) {
          console.error("Unable to load product image:", err);
        }
      }

      setGallery(images);

      if (images.length > 0) {
        setSelectedImage(images[0]);
      } else {
        setSelectedImage(null);
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
