
import { useEffect, useMemo, useState } from "react";
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

// The four occasions and their WordPress slugs.
const OCCASION_CONFIG = [
  {
    name: "Birthday",
    slug: "birthday",
  },
  {
    name: "Anniversary",
    slug: "anniversary",
  },
  {
    name: "Just Because / Thank You",
    slug: "just-because-thank-you",
  },
  {
    name: "Graduation / Congratulations",
    slug: "graduation-congratulations",
  },
];

// Read assigned occasion IDs from a product.
// WordPress REST returns taxonomy assignments as an array of term IDs.
function getProductOccasionIds(product) {
  const assigned =
    product?.occasion ??
    product?.occasions ??
    [];

  const values = Array.isArray(assigned)
    ? assigned
    : [assigned];

  return values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const productTypeId = Number(id);
  const title = PRODUCT_TYPE_MAP[productTypeId] || "Products";

  const [products, setProducts] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState("high-to-low");
  const [selectedOccasion, setSelectedOccasion] = useState("");

  // Retrieve products and occasion terms from WordPress.
  useEffect(() => {
    let isActive = true;

    async function loadData() {
      const results = await Promise.allSettled([
        productService.getAll(),
        productService.getOccasions(),
      ]);

      if (!isActive) return;

      const productsResult = results[0];
      const occasionsResult = results[1];

      if (productsResult.status === "fulfilled") {
        const data = Array.isArray(productsResult.value)
          ? productsResult.value
          : [];

        setProducts(data);

        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
          );
        } catch (err) {
          console.error("Unable to cache products:", err);
        }
      } else {
        console.error(
          "Failed to load products:",
          productsResult.reason
        );
      }

      if (occasionsResult.status === "fulfilled") {
        setOccasions(
          Array.isArray(occasionsResult.value)
            ? occasionsResult.value
            : []
        );
      } else {
        console.error(
          "Failed to load occasions. Check the WordPress REST API:",
          occasionsResult.reason
        );
      }

      setLoading(false);
    }

    loadData();

    return () => {
      isActive = false;
    };
  }, []);

  // Reset the occasion filter when changing product collections.
  useEffect(() => {
    setSelectedOccasion("");
  }, [productTypeId]);

  // Match the four preferred occasions with their real WordPress IDs.
  const occasionOptions = useMemo(() => {
    return OCCASION_CONFIG
      .map((config) => {
        const matchingTerm =
          occasions.find(
            (term) =>
              String(term.slug).toLowerCase() === config.slug
          ) ||
          occasions.find(
            (term) =>
              String(term.name).trim().toLowerCase() ===
              config.name.toLowerCase()
          );

        if (!matchingTerm) {
          return null;
        }

        return {
          id: matchingTerm.id,
          name: config.name,
        };
      })
      .filter(Boolean);
  }, [occasions]);

  // Filter products by collection and occasion, then sort.
  const filteredProducts = useMemo(() => {
    const selectedOccasionId = selectedOccasion
      ? Number(selectedOccasion)
      : null;

    return products
      .filter((item) =>
        item["product-type"]?.includes(productTypeId)
      )
      .filter((item) => {
        // Show all products when no occasion is selected.
        if (selectedOccasionId === null) {
          return true;
        }

        const assignedOccasionIds =
          getProductOccasionIds(item);

        return assignedOccasionIds.includes(
          selectedOccasionId
        );
      })
      .sort((a, b) => {
        // Check product availability.
        const stockA = Number(a.acf?.stock ?? 0);
        const stockB = Number(b.acf?.stock ?? 0);

        const availableA = stockA > 0;
        const availableB = stockB > 0;

        // Available products always come first.
        if (availableA !== availableB) {
          return availableA ? -1 : 1;
        }

        // Sort by price within each availability group.
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
  }, [
    products,
    productTypeId,
    selectedOccasion,
    sortOrder,
  ]);

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

        {/* SHOP BY OCCASION AND PRICE SORTING */}
        <div
          className="
            mx-auto
            mb-10
            flex
            max-w-7xl
            flex-col
            gap-4
            px-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          {/* OCCASION FILTER */}
          <label
            className="
              flex
              flex-col
              items-start
              gap-2
              text-sm
              text-neutral-700
            "
          >
            <span className="whitespace-nowrap">
              Shop by Occasion:
            </span>

            <select
              value={selectedOccasion}
              onChange={(e) =>
                setSelectedOccasion(e.target.value)
              }
              disabled={occasionOptions.length === 0}
              className="
                w-full
                min-w-[240px]
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
                disabled:cursor-not-allowed
                disabled:bg-neutral-100
              "
            >
              <option value="">
                All Occasions
              </option>

              {occasionOptions.map((occasion) => (
                <option
                  key={occasion.id}
                  value={String(occasion.id)}
                >
                  {occasion.name}
                </option>
              ))}
            </select>
          </label>

          {/* PRICE SORTING */}
          <label
            className="
              flex
              flex-col
              items-start
              gap-2
              text-sm
              text-neutral-700
              sm:flex-row
              sm:items-center
            "
          >
            <span className="whitespace-nowrap">
              Sort by price:
            </span>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              className="
                w-full
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
            {selectedOccasion
              ? "No arrangements found for this occasion. Please try another option."
              : "No products are currently available in this collection."}
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

                    {/* SOLD OUT BADGE */}
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
