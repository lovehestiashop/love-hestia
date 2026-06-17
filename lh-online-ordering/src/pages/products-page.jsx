import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import { productService } from "../services/product-service";

const PRODUCT_TYPE_MAP = {
  7: "Flower Dome",
  6: "Vase Arrangements",
  5: "Flower Bouquets",
};

const STORAGE_KEY = "all_products";

function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productTypeId = Number(id);

  const title = PRODUCT_TYPE_MAP[productTypeId] || "Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    productService
      .getAll()
      .then((data) => {
        setProducts(data);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(data)
        );
      })
      .catch((err) => {
        console.error(
          "Failed to load products",
          err
        );
      })
      .finally(() => setLoading(false));

    effectRan.current = true;
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) =>
        item["product-type"]?.includes(
          productTypeId
        )
      )
      .sort((a, b) => {
        const priceA = Number(
          a.acf?.price || 0
        );

        const priceB = Number(
          b.acf?.price || 0
        );

        return priceB - priceA;
      });
  }, [products, productTypeId]);

  if (loading) {
    return (
      <p className="py-24 text-center">
        Loading...
      </p>
    );
  }

  return (
    <div className="bg-[#faf9f7]">
      <HeaderComponent />

      <section className="py-20 md:py-24">

        <h2
          className="
            mb-16
            text-center
            text-[42px]
            md:text-[72px]
            font-light
            text-neutral-700
            leading-none
          "
          style={{
            fontFamily:
              "'Cormorant Garamond', serif",
          }}
        >
          {title}
        </h2>

        <div
          className="
            mx-auto
            max-w-7xl
            grid
            grid-cols-2
            gap-x-6
            gap-y-12
            px-5
            md:grid-cols-3
            md:gap-x-10
            md:gap-y-16
          "
        >
          {filteredProducts.map((item) => {
            const imageUrl =
              item._embedded?.[
                "wp:featuredmedia"
              ]?.[0]?.source_url ||
              "/placeholder.jpg";

            const price =
              item.acf?.price ||
              item.meta?.price ||
              item.price ||
              0;

            const isAvailable =
              Boolean(
                item.acf?.availability
              );

            return (
              <div
                key={item.id}
                className="group flex flex-col"
              >
                <div
                  className="
                    relative
                    overflow-hidden
                    cursor-pointer
                    aspect-[3/4]
                  "
                  onClick={() =>
                    navigate(
                      `/product/${item.id}`,
                      {
                        state: {
                          product: item,
                        },
                      }
                    )
                  }
                >
                  <img
                    src={imageUrl}
                    alt={
                      item.title.rendered
                    }
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
                </div>

                <div className="mt-5 text-center">

                  <h3
                    className="
                      text-[20px]
                      md:text-[28px]
                      font-light
                      text-neutral-700
                      leading-tight
                    "
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', serif",
                    }}
                  >
                    {item.title.rendered}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[16px]
                      md:text-[18px]
                      text-neutral-600
                      tracking-wide
                    "
                  >
                    ₱
                    {Number(
                      price
                    ).toLocaleString(
                      "en-PH",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}{" "}
                    PHP
                  </p>

                  {!isAvailable && (
                    <div className="mt-4">
                      <span
                        className="
                          inline-block
                          border
                          border-neutral-500
                          px-4
                          py-1
                          text-[10px]
                          tracking-[0.3em]
                          uppercase
                          text-neutral-600
                        "
                      >
                        Sold Out
                      </span>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </section>

      <FooterComponent />
    </div>
  );
}

export default ProductsPage;
