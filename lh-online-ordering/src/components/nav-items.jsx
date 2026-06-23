import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/love-hestia-logo-3.png";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartCount(cart.length);
  }, []);

  return (
    <nav className="w-full">

      {/* Desktop Navigation */}
      <div className="hidden md:block">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src={logo}
              alt="Love Hestia"
              className="h-32 w-auto"
            />
          </Link>
        </div>

        {/* Menu */}
        <ul
          className="
            flex
            items-center
            justify-center
            gap-12
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

      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-6">

        <div className="flex items-center justify-between">

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-neutral-700"
          >
            ☰
          </button>

          <Link to="/">
            <img
              src={logo}
              alt="Love Hestia"
              className="h-12 w-auto"
            />
          </Link>

          <Link
            to="/cart"
            className="relative text-2xl"
          >
            🛒

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-3
                  bg-[#3d3421]
                  text-white
                  text-[10px]
                  rounded-full
                  min-w-[18px]
                  h-[18px]
                  flex
                  items-center
                  justify-center
                "
              >
                {cartCount}
              </span>
            )}
          </Link>

        </div>

        {menuOpen && (
          <div className="mt-6 flex flex-col gap-5">

            <Link
              to="/"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>

            <Link
              to="/faq"
              className={navItemClass}
              onClick={() => setMenuOpen(false)}
            >
              FAQ's
            </Link>

          </div>
        )}

      </div>

    </nav>
  );
}

export default NavItemsComponent;
