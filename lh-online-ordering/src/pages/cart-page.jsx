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
    <div style={{ padding: "50px" }}>
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
              }}
            >
              <img
                src={
                  item.product?._embedded?.["wp:featuredmedia"]?.[0]
                    ?.media_details?.sizes?.large
                    ?.source_url ||
                  item.product?._embedded?.["wp:featuredmedia"]?.[0]
                    ?.source_url
                }
                alt={item.title?.rendered}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />

              <h3>{item.product?.title?.rendered}</h3>

{item.product?.acf?.stock <= 3 && (
  <p
    style={{
      color: "#b45309",
      fontWeight: "600",
      marginBottom: "8px",
    }}
  >
    Only {item.product?.acf?.stock} left
  </p>
)}

<p>
 ₱
{(
  Number(item.product?.acf?.price || 0) *
  item.quantity
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
          ))}

          <div
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "2px solid #ddd",
            }}
          >
            <p>
              <strong>Subtotal:</strong> ₱
              {subtotal.toLocaleString("en-PH")}
            </p>

            <p>
              <strong>Delivery Fee:</strong> ₱
              {deliveryFee.toLocaleString("en-PH")}
            </p>

            <h2>
              Total: ₱
              {grandTotal.toLocaleString("en-PH")}
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
                padding: "12px 25px",
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginTop: "15px",
              }}
            >
              Checkout All
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
