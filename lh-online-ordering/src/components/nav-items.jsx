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
    <nav className="w-full px-10">
      <ul className="flex w-full items-center text-lg font-normal tracking-wide">
        <li>
          <Link to="/" className={navItemClass}>
            Home
          </Link>
        </li>

        <li className="ml-20">
          <Link to="/shop" className={navItemClass}>
            Shop
          </Link>
        </li>

        <li className="ml-20">
          <Link to="/faq" className={navItemClass}>
            FAQ's
          </Link>
        </li>

        <li className="ml-auto">
          <Link
            to="/cart"
            className="flex items-center gap-2"
          >
            <span style={{ fontSize: "24px" }}>
              🛒
            </span>

            {cartCount > 0 && (
              <span
                style={{
                  background: "#000",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
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
