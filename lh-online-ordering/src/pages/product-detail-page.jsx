
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

  // Get bouquet size from ACF.
  const bouquetSize = product?.acf?.bouquet_size;

  // Get bouquet height from either possible ACF field name.
  const bouquetHeight = [
    product?.acf?.bouquet_height_cm,
    product?.acf?.approx_height_cm,
  ].find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );

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
  const [selectedImage, setSelectedImage] = useState(null);

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
          console.error(
            "Unable to load product image:",
            err
          );
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
        margin: "0 auto",
        padding: "60px 30px",
        background: "#faf9f7",
        minHeight: "100vh",
      }}
    >
      {/* BREADCRUMB */}
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

        {" / "}

        <span
          onClick={() => navigate("/shop")}
          style={{ cursor: "pointer" }}
        >
          Shop
        </span>

        {" / "}

        <span
          onClick={() => navigate("/shop/5")}
          style={{ cursor: "pointer" }}
        >
          Flower Bouquets
        </span>

        {" / "}

        <span>{product.title.rendered}</span>

        {" / "}

        <span
          onClick={() => navigate("/cart")}
          style={{
            cursor: "pointer",
            color: "#5f5a55",
          }}
        >
          Cart
        </span>
      </div>

      {/* PRODUCT LAYOUT */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "70px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT COLUMN: PRODUCT IMAGES */}
        <div
          style={{
            flex: "1 1 450px",
            minWidth: "min(100%, 350px)",
          }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={product.title.rendered}
              style={{
                width: "100%",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                minHeight: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f1efec",
                color: "#8b8b8b",
              }}
            >
              Product image unavailable
            </div>
          )}

          {/* PRODUCT IMAGE THUMBNAILS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            {gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title.rendered} view ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                style={{
                  width: "100px",
                  height: "130px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "6px",
                  border:
                    selectedImage === image
                      ? "1px solid #555"
                      : "1px solid #ddd",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT INFORMATION */}
        <div
          style={{
            flex: "1 1 450px",
            minWidth: "min(100%, 350px)",
          }}
        >
          {/* PRODUCT NAME */}
          <h1
            style={{
              fontSize:
                window.innerWidth <= 768
                  ? "34px"
                  : "52px",
              lineHeight: "1",
              marginBottom: "15px",
              color: "#5f5a55",
              fontWeight: "300",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {product.title.rendered}
          </h1>

          {/* PRODUCT PRICE */}
          <h2
            style={{
              fontSize:
                window.innerWidth <= 768
                  ? "22px"
                  : "28px",
              marginBottom: hasBouquetDetails
                ? "22px"
                : "40px",
              color: "#5f5a55",
              fontWeight: "600",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            ₱
            {Number(
              product.acf?.price || 0
            ).toLocaleString("en-PH")}
          </h2>

          {/* BOUQUET SIZE AND HEIGHT */}
          {/* Visible only on the individual product page */}
          {hasBouquetDetails && (
            <div
              style={{
                maxWidth: "490px",
                marginTop: "0",
                marginBottom: "30px",
                padding: "16px 20px",
                background: "#f7f5f2",
                border: "1px solid #e8e3dc",
                borderRadius: "4px",
              }}
            >
              {hasBouquetSize && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    marginBottom: hasBouquetHeight
                      ? "10px"
                      : "0",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  <span>Arrangement Size</span>

                  <strong
                    style={{ color: "#5f5a55" }}
                  >
                    {String(bouquetSize).trim()}
                  </strong>
                </div>
              )}

              {hasBouquetHeight && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  <span>Approx. Height</span>

                <strong
  style={{ color: "#5f5a55" }}
>
  {(Number(bouquetHeight) / 2.54).toFixed(1)} in
</strong>
                </div>
              )}
            </div>
          )}

          {/* ADD TO CART / BUY NOW */}
          {isAvailable ? (
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "50px",
              }}
            >
              {/* ADD TO CART */}
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
                    const stock = Number(
                      product.acf?.stock ?? 0
                    );

                    if (existingItem.quantity < stock) {
                      existingItem.quantity += 1;
                    } else {
                      alert(
                        "Only " +
                          stock +
                          " item(s) available in stock."
                      );
                      return;
                    }
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
                  padding: "16px 42px",
                  border: "1px solid #888",
                  background: "#ffffff",
                  cursor: "pointer",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Add to Cart
              </button>

              {/* BUY NOW */}
              <button
                onClick={() =>
                  navigate("/order", {
                    state: {
                      product,
                    },
                  })
                }
                style={{
                  padding:
                    window.innerWidth <= 768
                      ? "14px 24px"
                      : "16px 42px",
                  border: "none",
                  background: "#5d5650",
                  color: "#fff",
                  cursor: "pointer",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Buy Now
              </button>
            </div>
          ) : (
            /* SOLD OUT */
            <div style={{ marginBottom: "50px" }}>
              <p
                style={{
                  color: "#8b8b8b",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "16px",
                }}
              >
                Sold Out
              </p>

              <button
                disabled
                style={{
                  padding: "16px 42px",
                  border: "1px solid #ccc",
                  background: "#f3f3f3",
                  color: "#999",
                  cursor: "not-allowed",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                Unavailable
              </button>
            </div>
          )}

          {/* PRODUCT DESCRIPTION */}
          <div
            style={{
              maxWidth: "550px",
              lineHeight: "2",
              color: "#666",
              fontSize: "15px",
              marginBottom: "30px",
            }}
          >
            <p>
              {product.acf?.product_description}
            </p>
          </div>

          {/* FLOWER CARE */}
          <div
            style={{
              maxWidth: "550px",
              marginBottom: "50px",
              padding: "20px",
              background: "#f7f5f2",
              border: "1px solid #e8e3dc",
              borderRadius: "4px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                color: "#5f5a55",
                marginBottom: "12px",
                fontWeight: "500",
              }}
            >
              A Timeless Keepsake
            </h3>

            <p
              style={{
                color: "#666",
                fontSize: "14px",
                lineHeight: "1.9",
                marginBottom: "18px",
              }}
            >
              Made with real preserved and dried
              flowers, your arrangement is designed
              to be enjoyed for 1–2 years or longer
              with proper care. Each bloom is
              naturally delicate and unique, making
              every piece a lasting reminder of
              life's meaningful moments.
            </p>

            <h4
              style={{
                fontSize: "14px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#5f5a55",
                marginBottom: "10px",
              }}
            >
              Flower Care
            </h4>

            <ul
              style={{
                paddingLeft: "18px",
                margin: 0,
                color: "#666",
                lineHeight: "2",
                fontSize: "14px",
              }}
            >
              <li>
                1. Keep away from direct sunlight to
                preserve color and texture.
              </li>

              <li>
                2. Place in a cool, dry area away from
                humidity and moisture.
              </li>

              <li>
                3. Handle gently, as preserved and
                dried flowers are naturally fragile.
              </li>

              <li>
                4. Lightly dust with a soft brush or
                air blower when needed.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
