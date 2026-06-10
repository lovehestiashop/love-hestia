import { useEffect, useState } from "react";

function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(storedCart);
  }, []);

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
            <h3>{item.title.rendered}</h3>

            <p>
              ₱
              {Number(
                item.acf?.price || 0
              ).toLocaleString("en-PH")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default CartPage;
