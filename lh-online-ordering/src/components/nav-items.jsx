import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const navItemClass = `
  uppercase
  tracking-[0.15em]
  text-[16px]
  text-neutral-700
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
    <nav className="w-full px-6">
      <ul
        className="
          flex
          items-center
          justify-center
          gap-8
          md:gap-12
        "
      >
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
            className={`${navItemClass} flex items-center gap-2`}
          >
            <span style={{ fontSize: "15px" }}>
              🛒
            </span>

            <span>Cart</span>

            {cartCount > 0 && (
              <span
                style={{
                  background: "#3d3421",
                  color: "#fff",
                  borderRadius: "999px",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  padding: "0 4px",
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
