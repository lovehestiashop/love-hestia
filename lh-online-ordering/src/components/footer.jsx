import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function FooterComponent() {
  return (
    <footer className="bg-[#faf9f7] text-neutral-700">

      {/* TOP SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* QUICK LINKS */}
        <div>
          <h3
            className="
              text-[34px]
              md:text-[42px]
              text-neutral-700
              mb-8
              leading-none
            "
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Quick Links
          </h3>

          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="text-[15px] tracking-wide hover:text-black transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="text-[15px] tracking-wide hover:text-black transition"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/faq"
                className="text-[15px] tracking-wide hover:text-black transition"
              >
                FAQ's
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3
            className="
              text-[34px]
              md:text-[42px]
              text-neutral-700
              mb-8
              leading-none
            "
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Contact Us
          </h3>

          <div className="space-y-4 text-[15px] text-neutral-600">
            <p>lovehestiashop@gmail.com</p>

            <p>
              Instagram: @lovehestiaflowers
            </p>

            <p>
              +63 961 712 9672
            </p>
          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-neutral-200"></div>

      {/* BOTTOM */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">

        <div className="flex gap-8 mb-5">

          <a
            href="https://www.facebook.com/giftshophestia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-neutral-500 hover:text-neutral-800 transition"
          >
            <FaFacebookF size={20} />
          </a>

          <a
            href="https://www.instagram.com/lovehestiaflowers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-neutral-500 hover:text-neutral-800 transition"
          >
            <FaInstagram size={20} />
          </a>

        </div>

        <p className="text-[13px] tracking-wide text-neutral-500">
          © 2026 Love Hestia
        </p>

      </div>

    </footer>
  );
}

export default FooterComponent;
