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
   text-[42px]
md:text-[82px]
    text-center
    text-neutral-700
    mb-14
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    letterSpacing: "-0.02em",
  }}
>
  Your Selection
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
  padding: "16px 42px",
  border: "1px solid #8f857d",
  background: "#faf9f7",
  color: "#5f5a55",
  cursor: "pointer",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  fontSize: "11px",
  fontWeight: "500",
}}
        >
          Home
        </button>

        <button
          onClick={() => navigate("/shop")}
        style={{
  padding: "16px 42px",
  border: "none",
  background: "#6c635c",
  color: "#fff",
  cursor: "pointer",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  fontSize: "11px",
  fontWeight: "500",
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
                 width: isMobile ? "120px" : "160px",
height: isMobile ? "160px" : "220px",
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
    fontFamily: "'Cormorant Garamond', serif",
    fontSize:
  isMobile ? "22px" : "32px",
    fontWeight: "400",
    color: "#3d3d3d",
  }}
>
                    {
                      item.product?.title
                        ?.rendered
                    }
                  </h3>

             <p
  style={{
    marginBottom: "20px",
    color: "#7a7a7a",
    fontSize: "15px",
    letterSpacing: "0.05em",
  }}
>
  Price:
  <span
    style={{
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "600",
      marginLeft: "4px",
      color: "#5f5a55",
    }}
  >
    ₱
    {Number(
      item.product?.acf?.price || 0
    ).toLocaleString("en-PH")}
  </span>
</p> 

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      width: "140px",
                      border: "1px solid #ddd",
                      borderRadius: "999px",
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
    fontFamily: "'Roboto', sans-serif",
    fontWeight: "700",
  }}
>
  {item.quantity}
</span>

                    <button
                      onClick={() => {
                        const updatedCart = [
                          ...cart,
                        ];

const stock = Number(
  updatedCart[index].product?.acf?.stock ?? 0
);

if (updatedCart[index].quantity >= stock) {
  alert(`Only ${stock} item(s) available.`);
  return;
}

updatedCart[index].quantity += 1;

setCart(updatedCart);

localStorage.setItem(
  "cart",
  JSON.stringify(updatedCart)
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
    fontFamily: "'Roboto', sans-serif",
   fontSize: isMobile ? "20px" : "28px",
fontWeight: "600",
    marginBottom: "20px",
    color: "#5f5a55",
  }}
>
  ₱
  {(
    Number(
      item.product?.acf?.price || 0
    ) * item.quantity
  ).toLocaleString("en-PH")}
</p>

                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                    style={{
  padding: "12px 24px",
  border: "1px solid #d6d6d6",
  background: "#faf9f7",
  cursor: "pointer",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
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
    fontFamily: "'Cormorant Garamond', serif",
    fontSize:
  isMobile ? "28px" : "36px",
    fontWeight: "400",
    color: "#3d3d3d",
  }}
>
  Order Summary
</h2>
          <p>
  <strong>Subtotal:</strong>
  <span
    style={{
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "700",
      marginLeft: "4px",
    }}
  >
    ₱{subtotal.toLocaleString("en-PH")}
  </span>
</p>  

           <p>
<p>
  <strong>FREE DELIVERY:</strong>
  <span
    style={{
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "700",
      marginLeft: "4px",
      color: "#4CAF50",
    }}
  >
    (Cebu City Only)
  </span>
</p>
</p>

            <h2
  style={{
    marginTop: "10px",
    color: "#5f5a55",
  }}
>
  <span
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: isMobile ? "22px" : "30px",
      fontWeight: "400",
    }}
  >
    Total:
  </span>

  <span
    style={{
      fontFamily: "'Roboto', sans-serif",
      fontSize: isMobile ? "20px" : "28px",
      fontWeight: "600",
      marginLeft: "8px",
    }}
  >
    ₱{grandTotal.toLocaleString("en-PH")}
  </span>
</h2>
        

            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "8px",
                marginBottom: "20px",
              }}
            >
              Free delivery applies within Cebu City.
Additional fees may apply for areas outside Cebu City.
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
  marginTop: "25px",
  padding:
  isMobile ? "14px 28px" : "16px 42px",
  background: "#6c635c",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  fontSize: "11px",
  fontWeight: "500",
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
