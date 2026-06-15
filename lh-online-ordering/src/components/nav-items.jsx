import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const navItemClass =
  "relative transition-colors duration-300 hover:text-gray-300";

function NavItemsComponent() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartCount(cart.length);
  }, []);

return (
  <nav className="w-full px-4 md:px-10">
    <ul className="flex flex-wrap items-center gap-6 md:gap-12 text-base md:text-lg font-normal tracking-wide">
      <li>
        <Link to="/" className={navItemClass}>
          Home
        </Link>
      </li>

      <li>
        <Link to="/shop" className={navItemClass}>
          Shop
        </Link>
      </li>

      <li>
        <Link to="/faq" className={navItemClass}>
          FAQ's
        </Link>
      </li>

      <li>
        <Link
          to="/cart"
          className="flex items-center gap-2"
        >
          <span style={{ fontSize: "22px" }}>
            🛒
          </span>

          <span>Cart</span>

          {cartCount > 0 && (
            <span
              style={{
                background: "#000",
                color: "#fff",
                borderRadius: "999px",
                minWidth: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                padding: "0 6px",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </li>
    </ul>
  </nav>
);
}

export default NavItemsComponent;
