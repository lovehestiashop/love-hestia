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
            <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "110px",
    border: "1px solid #ddd",
    padding: "12px 16px",
    marginBottom: "12px",
  }}
>
  <button
    onClick={() => {
      const updatedCart = [...cart];

      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1);
      }

      setCart(updatedCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );
    }}
    style={{
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "20px",
      color: "#999",
    }}
  >
    −
  </button>

  <span>{item.quantity}</span>

  <button
    onClick={() => {
      const stock =
        Number(item.product?.acf?.stock || 0);

      if (item.quantity >= stock) {
        alert(
          `Only ${stock} available in stock`
        );
        return;
      }

      const updatedCart = [...cart];

      updatedCart[index].quantity += 1;

      setCart(updatedCart);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );
    }}
    style={{
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "20px",
      color: "#999",
    }}
  >
    +
  </button>
</div> 
  );
}

export default CartPage;
