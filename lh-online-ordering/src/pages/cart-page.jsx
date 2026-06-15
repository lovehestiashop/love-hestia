import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "50px 20px",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
        }}
      >
        My Cart
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "20px",
                padding: "20px",
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
                  height: "160px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1 }}>
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
                    item.product?.acf?.price ||
                      0
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

                      setCart(updatedCart);

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
                      const stock = Number(
                        item.product?.acf
                          ?.stock || 0
                      );

                      if (
                        item.quantity >= stock
                      ) {
                        alert(
                          `Only ${stock} available in stock`
                        );
                        return;
                      }

                      const updatedCart = [
                        ...cart,
                      ];

                      updatedCart[
                        index
                      ].quantity += 1;

                      setCart(updatedCart);

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

                {item.product?.acf?.stock <=
                  3 && (
                  <p
                    style={{
                      color: "#b45309",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    Only{" "}
                    {
                      item.product?.acf
                        ?.stock
                    }{" "}
                    left
                  </p>
                )}

                <p
                  style={{
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Total: ₱
                  {(
                    Number(
                      item.product?.acf
                        ?.price || 0
                    ) * item.quantity
                  ).toLocaleString(
                    "en-PH"
                  )}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(index)
                  }
                  style={{
                    padding: "10px 20px",
                    border:
                      "1px solid #000",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              borderTop:
                "2px solid #ddd",
              paddingTop: "25px",
              marginTop: "30px",
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
              <strong>
                Subtotal:
              </strong>{" "}
              ₱
              {subtotal.toLocaleString(
                "en-PH"
              )}
            </p>

            <p>
              <strong>
                Delivery Fee:
              </strong>{" "}
              ₱
              {deliveryFee.toLocaleString(
                "en-PH"
              )}
            </p>

            <h2>
              Total: ₱
              {grandTotal.toLocaleString(
                "en-PH"
              )}
            </h2>

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
                padding:
                  "14px 30px",
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
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
