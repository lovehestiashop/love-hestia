
import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import { productService } from "../services/product-service";

const PRODUCT_TYPE_MAP = {
  7: "Flower Dome",
  6: "Vase Arrangements",
  5: "Flower Bouquets",
  78: "Valentine's Day",
};

const STORAGE_KEY = "all_products";

function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productTypeId = Number(id);

  const title = PRODUCT_TYPE_MAP[productTypeId] || "Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("high-to-low");

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
        console.error("Failed to load products", err);
      })
      .finally(() => setLoading(false));

    effectRan.current = true;
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) =>
        item["product-type"]?.includes(productTypeId)
      )
      .sort((a, b) => {
        const priceA = Number(
          a.acf?.price ??
          a.meta?.price ??
          a.price ??
          0
        );

        const priceB = Number(
          b.acf?.price ??
          b.meta?.price ??
          b.price ??
          0
        );

        return sortOrder === "low-to-high"
          ? priceA - priceB
          : priceB - priceA;
      });
  }, [products, productTypeId, sortOrder]);

  if (loading) {
    return (
      <p className="py-24 text-center text-lg md:text-xl text-neutral-600">
        Loading products...
      </p>
    );
  }

  return (
    <div className="bg-[#faf9f7]">
      <HeaderComponent />

      <section className="py-20 md:py-24">
        {/* PAGE TITLE */}
        <h2
          className="
            mb-8
            text-center
            text-[42px]
            md:text-[72px]
            font-light
            text-neutral-700
            leading-none
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {title}
        </h2>

        {/* PRICE SORTING */}
        <div className="mx-auto mb-10 flex max-w-7xl justify-end px-5">
          <label className="flex items-center gap-3 text-sm text-neutral-700">
            <span className="whitespace-nowrap">
              Sort by price:
            </span>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="
                max-w-[190px]
                border
                border-neutral-300
                bg-white
                px-3
                py-2
                text-sm
                text-neutral-700
                focus:outline-none
                focus:ring-1
                focus:ring-neutral-500
              "
            >
              <option value="high-to-low">
                Highest to lowest
              </option>

              <option value="low-to-high">
                Lowest to highest
              </option>
            </select>
          </label>
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-neutral-600">
            No products are currently available in this collection.
          </p>
        ) : (
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
                item._embedded?.["wp:featuredmedia"]?.[0]
                  ?.source_url || "/placeholder.jpg";

              const price =
                item.acf?.price ??
                item.meta?.price ??
                item.price ??
                0;

              const stock = Number(item.acf?.stock ?? 0);
              const isAvailable = stock > 0;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col"
                >
                  {/* PRODUCT IMAGE */}
                  <div
                    className="
                      relative
                      aspect-[3/4]
                      overflow-hidden
                      cursor-pointer
                    "
                    onClick={() =>
                      navigate(`/product/${item.id}`, {
                        state: {
                          product: item,
                        },
                      })
                    }
                  >
                    <img
                      src={imageUrl}
                      alt={item.title?.rendered || "Product"}
                      loading="lazy"
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

                    {/* BOTTOM-LEFT SOLD OUT BADGE */}
                    {!isAvailable && (
                      <div
                        className="
                          absolute
                          bottom-2
                          left-2
                          z-10
                          pointer-events-none
                        "
                      >
                        <span
                          className="
                            inline-block
                            rounded-full
                            bg-[#f5eedc]
                            px-3
                            py-1
                            text-[11px]
                            font-medium
                            tracking-wide
                            text-[#6b624f]
                          "
                        >
                          Sold out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* PRODUCT NAME AND PRICE */}
                  <div className="mt-5 text-center">
                    <h3
                      className="
                        text-[20px]
                        md:text-[28px]
                        font-semibold
                        text-neutral-700
                        leading-tight
                      "
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', serif",
                      }}
                    >
                      {item.title?.rendered || "Product"}
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
                      {Number(price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <FooterComponent />
    </div>
  );
}

export default ProductsPage;
