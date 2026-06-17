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
    product?.acf?.availability
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
      {/* BREADCRUMB */}

      <div
  style={{
    marginBottom: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
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

  <span>
    {product.title.rendered}
  </span>

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
    <span
      onClick={() => navigate("/")}
      style={{
        cursor: "pointer",
      }}
    >
      Home
    </span>

    {" / "}

    <span
      onClick={() => navigate("/shop")}
      style={{
        cursor: "pointer",
      }}
    >
      Shop
    </span>

    {" / "}

    <span>
      {product.title.rendered}
    </span>
  </div>

</div>

      <div
        style={{
          display: "flex",
          gap: "80px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT COLUMN */}

        <div
          style={{
            flex: 1,
            minWidth: "350px",
          }}
        >
          <img
            src={selectedImage}
            alt={product.title.rendered}
            style={{
              width: "100%",
              display: "block",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            {gallery.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  onClick={() =>
                    setSelectedImage(image)
                  }
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
                    transition:
                      "all 0.3s ease",
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div
          style={{
            flex: 1,
            minWidth: "350px",
          }}
        >
          <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "25px",
  }}
>
</div>
          <h1
            style={{
              fontSize: "68px",
              lineHeight: "0.95",
              marginBottom: "15px",
              color: "#5f5a55",
              fontWeight: "300",
              fontFamily:
                "'Cormorant Garamond', serif",
            }}
          >
            {product.title.rendered}
          </h1>

          <h2
            style={{
              fontSize: "34px",
              marginBottom: "40px",
              color: "#7d746c",
              fontWeight: "400",
              fontFamily:
                "'Cormorant Garamond', serif",
            }}
          >
            ₱
            {Number(
              product.acf?.price || 0
            ).toLocaleString("en-PH")}{" "}
            PHP
          </h2>

          <div
            style={{
              maxWidth: "550px",
              lineHeight: "2",
              color: "#666",
              fontSize: "15px",
              marginBottom: "50px",
            }}
          >
            <p>
              {
                product.acf
                  ?.product_description
              }
            </p>
          </div>

          {isAvailable ? (
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
                      localStorage.getItem(
                        "cart"
                      )
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

                  alert(
                    "Added to cart!"
                  );
                }}
                style={{
                  padding:
                    "16px 42px",
                  border:
                    "1px solid #888",
                  background:
                    "#ffffff",
                  cursor: "pointer",
                  letterSpacing:
                    "3px",
                  textTransform:
                    "uppercase",
                  fontSize: "12px",
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/order",
                    {
                      state: {
                        product,
                      },
                    }
                  )
                }
                style={{
                  padding:
                    "16px 42px",
                  border: "none",
                  background:
                    "#5d5650",
                  color: "#fff",
                  cursor: "pointer",
                  letterSpacing:
                    "3px",
                  textTransform:
                    "uppercase",
                  fontSize: "12px",
                }}
              >
                Buy Now
              </button>
            </div>
          ) : (
            <div>
              <p
                style={{
                  color:
                    "#8b8b8b",
                  letterSpacing:
                    "4px",
                  textTransform:
                    "uppercase",
                  marginBottom:
                    "20px",
                  fontFamily:
                    "'Cormorant Garamond', serif",
                  fontSize:
                    "16px",
                }}
              >
                Sold Out
              </p>

              <button
                disabled
                style={{
                  padding:
                    "16px 42px",
                  border:
                    "1px solid #ccc",
                  background:
                    "#f3f3f3",
                  color:
                    "#999",
                  cursor:
                    "not-allowed",
                  letterSpacing:
                    "3px",
                  textTransform:
                    "uppercase",
                  fontSize:
                    "12px",
                }}
              >
                Unavailable
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
