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
    <nav className="flex justify-center">
      <ul className="flex gap-20 text-lg font-normal tracking-wide">
        <li>
          <Link to="/" className={navItemClass}>
            Home
          </Link>
        </li>
        <li>
  <Link to="/cart" className={navItemClass}>
    Cart {cartCount > 0 ? `(${cartCount})` : ""}
  </Link>
</li>
        <li>
          <Link to="/shop" className={navItemClass}>
            Shop
          </Link>
        </li>
        {/* <li>
          <Link to="/customize" className={navItemClass}>
            Customize
          </Link>
        </li> */}
        <li>
          <Link to="/faq" className={navItemClass}>
            FAQ's
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavItemsComponent;
