
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

// The four occasions configured in WordPress.
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

// Get occasion IDs assigned to a product.
function getProductOccasionIds(product) {
  const assigned =
    product?.occasions ??
    product?.occasion ??
    [];

  const values = Array.isArray(assigned)
    ? assigned
    : [assigned];

  return values
    .map((value) => {
      if (value && typeof value === "object") {
        return Number(value.id ?? value.term_id);
      }

      return Number(value);
    })
    .filter((value) => Number.isFinite(value));
}

function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const productTypeId = Number(id);

  const [products, setProducts] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState("high-to-low");
  const [selectedOccasion, setSelectedOccasion] = useState("");

  // Retrieve products and occasions from WordPress.
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

      // Load products.
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
          console.error(
            "Unable to cache products:",
            err
          );
        }
      } else {
        console.error(
          "Failed to load products:",
          productsResult.reason
        );
      }

      // Load occasions.
      if (occasionsResult.status === "fulfilled") {
        setOccasions(
          Array.isArray(occasionsResult.value)
            ? occasionsResult.value
            : []
        );
      } else {
        console.error(
          "Failed to load occasions:",
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

  // Match the four preferred occasions with WordPress term IDs.
  const occasionOptions = useMemo(() => {
    return OCCASION_CONFIG
      .map((config) => {
        const matchingTerm = occasions.find(
          (term) =>
            String(term.slug).toLowerCase() === config.slug
        );

        if (!matchingTerm) {
          return null;
        }

        return {
          id: matchingTerm.id,
          name: config.name,
          slug: config.slug,
        };
      })
      .filter(Boolean);
  }, [occasions]);

  // Find the selected occasion name for the page heading.
  const selectedOccasionName = occasionOptions.find(
    (occasion) =>
      String(occasion.id) === String(selectedOccasion)
  )?.name;

  // Change the heading when an occasion is selected.
  const pageTitle = selectedOccasionName
    ? `Arrangements for ${selectedOccasionName}`
    : PRODUCT_TYPE_MAP[productTypeId] || "Products";

  // FILTER PRODUCTS BY COLLECTION OR GLOBAL OCCASION.
  const filteredProducts = useMemo(() => {
    const selectedOccasionId = selectedOccasion
      ? Number(selectedOccasion)
      : null;

    return products
      .filter((item) => {
        // When an occasion is selected, include matching
        // products from ALL collections:
        // Flower Bouquets, Vase Arrangements and Flower Domes.

        if (selectedOccasionId !== null) {
          const assignedOccasionIds =
            getProductOccasionIds(item);

          return assignedOccasionIds.includes(
            selectedOccasionId
          );
        }

        // When All Occasions is selected, show only products
        // belonging to the current collection.
        return (
          item["product-type"]?.includes(productTypeId) ??
          false
        );
      })
      .sort((a, b) => {
        // Check product availability.
        const stockA = Number(a.acf?.stock ?? 0);
        const stockB = Number(b.acf?.stock ?? 0);

        const availableA = stockA > 0;
        const availableB = stockB > 0;

        // Available products always appear first.
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
            text-[36px]
            md:text-[72px]
            font-light
            text-neutral-700
            leading-none
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {pageTitle}
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
                cursor-pointer
                focus:outline-none
                focus:ring-1
                focus:ring-neutral-500
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
                cursor-pointer
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
