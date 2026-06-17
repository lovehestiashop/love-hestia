import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(storedCart);
  }, []);

  function removeFromCart(indexToRemove) {
    const updatedCart = cart.filter(
      (_, index) => index !== indexToRemove
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product?.acf?.price || 0) *
        item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 200 : 0;

  const grandTotal = subtotal + deliveryFee;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "50px 20px",
      }}
    >
    
<h1
  className="
    text-[48px]
    md:text-[72px]
    text-center
    text-neutral-700
    mb-12
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
  }}
>
  My Cart
</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#fff",
            color: "#000",
            border: "1px solid #000",
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/shop")}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          + Add More Items
        </button>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                padding: "25px",
                border: "1px solid #ddd",
                marginBottom: "20px",
                alignItems: "flex-start",
              }}
            >
              <img
                src={
                  item.product?._embedded?.[
                    "wp:featuredmedia"
                  ]?.[0]?.media_details?.sizes
                    ?.large?.source_url ||
                  item.product?._embedded?.[
                    "wp:featuredmedia"
                  ]?.[0]?.source_url
                }
                alt={
                  item.product?.title?.rendered
                }
                style={{
                  width: "160px",
                  height: "220px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: isMobile
                    ? "column"
                    : "row",
                  justifyContent:
                    "space-between",
                  alignItems: isMobile
                    ? "stretch"
                    : "flex-start",
                }}
              >
                <div>
                  <h3
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {
                      item.product?.title
                        ?.rendered
                    }
                  </h3>

                  <p
                    style={{
                      marginBottom: "15px",
                      color: "#666",
                    }}
                  >
                    Price: ₱
                    {Number(
                      item.product?.acf?.price || 0
                    ).toLocaleString("en-PH")}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      width: "120px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      marginBottom: "12px",
                      background: "#fff",
                    }}
                  >
                    <button
                      onClick={() => {
                        const updatedCart = [
                          ...cart,
                        ];

                        if (
                          updatedCart[index]
                            .quantity > 1
                        ) {
                          updatedCart[
                            index
                          ].quantity -= 1;
                        } else {
                          updatedCart.splice(
                            index,
                            1
                          );
                        }

                        setCart(
                          updatedCart
                        );

                        localStorage.setItem(
                          "cart",
                          JSON.stringify(
                            updatedCart
                          )
                        );
                      }}
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        fontWeight: "600",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => {
                        const updatedCart = [
                          ...cart,
                        ];

                        updatedCart[
                          index
                        ].quantity += 1;

                        setCart(
                          updatedCart
                        );

                        localStorage.setItem(
                          "cart",
                          JSON.stringify(
                            updatedCart
                          )
                        );
                      }}
                      style={{
                        border: "none",
                        background:
                          "transparent",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: isMobile
                      ? "left"
                      : "right",
                    minWidth: isMobile
                      ? "100%"
                      : "180px",
                    marginTop: isMobile
                      ? "20px"
                      : "0",
                  }}
                >
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "500",
                      marginBottom: "20px",
                    }}
                  >
                    ₱
                    {(
                      Number(
                        item.product?.acf
                          ?.price || 0
                      ) * item.quantity
                    ).toLocaleString("en-PH")}
                  </p>

                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #000",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop: "2px solid #ddd",
              marginTop: "40px",
              paddingTop: "30px",
              textAlign: "right",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Order Summary
            </h2>

            <p>
              <strong>Subtotal:</strong> ₱
              {subtotal.toLocaleString("en-PH")}
            </p>

            <p>
              <strong>
                Starting Delivery Fee:
              </strong>{" "}
              ₱200
            </p>

            <h2
              style={{
                marginTop: "5px",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              Total: ₱
              {grandTotal.toLocaleString(
                "en-PH"
              )}
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "8px",
                marginBottom: "20px",
              }}
            >
              Final delivery fee will be
              calculated at checkout.
            </p>

            <button
              onClick={() =>
                navigate("/order", {
                  state: {
                    cart,
                    subtotal,
                    deliveryFee,
                    grandTotal,
                  },
                })
              }
              style={{
                marginTop: "20px",
                padding: "14px 30px",
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                letterSpacing: "1px",
              }}
            >
              CHECKOUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
