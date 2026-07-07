import { Link } from "react-router-dom";

import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";

function ShopPage() {
  const collections = [
    {
      title: "Flower Bouquets",
      image:
        "https://api.lovehestia.shop/wp-content/uploads/2026/07/Flower-Bouquet.jpeg",
      productKey: 5,
    },
    {
      title: "Vase Arrangements",
      image:
        "https://api.lovehestia.shop/wp-content/uploads/2026/07/Vase-arrnagements.jpeg",
      productKey: 6,
    },
    {
      title: "Flower Dome",
      image:
        "https://api.lovehestia.shop/wp-content/uploads/2026/01/DSC02766.jpg",
      productKey: 7,
    },
  ];

  return (
    <div className="bg-[#faf9f7]">
      <HeaderComponent />

      <section className="py-20 md:py-24">
        <h2
          className="
            mb-20
            text-center
            text-[52px]
            md:text-[82px]
            font-light
            text-neutral-700
            leading-none
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Collections
        </h2>

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            grid-cols-1
            gap-8
            px-6
            sm:grid-cols-2
            md:grid-cols-3
            md:gap-10
          "
        >
          {collections.map((item) => (
            <Link
              key={item.title}
              to={`/shop/${item.productKey}`}
            >
              <div className="group">

                <div
                  className="
                    relative
                    aspect-[3/4]
                    overflow-hidden
                  "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/10
                      transition-all
                      duration-500
                      group-hover:bg-black/20
                    "
                  />
                </div>

               <div className="mt-3 text-center">
  <h3
    className="
      text-[42px]
      md:text-[64px]
      font-normal
      text-neutral-700
      leading-none
    "
    style={{
      fontFamily:
        "'Cormorant Garamond', serif",
    }}
  >
    {item.title}
  </h3>
</div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

export default ShopPage;
