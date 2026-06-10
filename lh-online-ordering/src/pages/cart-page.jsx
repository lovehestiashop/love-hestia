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

  return (
    <div style={{ padding: "50px" }}>
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item, index) => (
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
                item._embedded?.["wp:featuredmedia"]?.[0]
                  ?.media_details?.sizes?.large?.source_url ||
                item._embedded?.["wp:featuredmedia"]?.[0]
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

            <h3>{item.title?.rendered}</h3>

            <p>
              ₱
              {Number(
                item.acf?.price || 0
              ).toLocaleString("en-PH")}
            </p>

            <button
              onClick={() => removeFromCart(index)}
              style={{
                padding: "8px 15px",
                marginRight: "10px",
                border: "1px solid #000",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Remove
            </button>

            <button
              onClick={() =>
                navigate("/order", {
                  state: { product: item },
                })
              }
              style={{
                padding: "8px 15px",
                border: "1px solid #000",
                background: "#000",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Checkout
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CartPage;
