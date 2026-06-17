import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const navItemClass = `
  relative
  transition-all
  duration-300
  hover:text-neutral-500
`;

function NavItemsComponent() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartCount(cart.length);
  }, []);

  return (
    <nav className="w-full px-6 md:px-12">
      <ul
        className="
          flex
          flex-wrap
          items-center
          justify-center
          gap-8
          md:gap-14
          text-[22px]
          md:text-[28px]
          text-neutral-700
        "
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <li>
          <Link
            to="/"
            className={navItemClass}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/shop"
            className={navItemClass}
          >
            Shop
          </Link>
        </li>

        <li>
          <Link
            to="/faq"
            className={navItemClass}
          >
            FAQ's
          </Link>
        </li>

        <li>
          <Link
            to="/cart"
            className="flex items-center gap-2"
          >
            <span
              style={{
                fontSize: "20px",
              }}
            >
              🛒
            </span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span
                style={{
                  background: "#3d3421",
                  color: "#fff",
                  borderRadius: "999px",
                  minWidth: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  padding: "0 6px",
                  fontFamily: "sans-serif",
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
