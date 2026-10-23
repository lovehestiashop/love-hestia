
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import api from "../services/api";

function decodeHtmlEntities(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function ShopPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCollections() {
      try {
        const response = await api.get("/wp/v2/collection", {
          params: {
            acf_format: "standard",
            per_page: 100,
          },
        });

        const fetchedCollections = response.data
          .map((item) => ({
            id: item.id,
            title: decodeHtmlEntities(
              item.title?.rendered || "Collection"
            ),
            image: item.acf?.collection_image,
            destinationPath:
              item.acf?.destination_path || "/shop",
            displayOrder: Number(
              item.acf?.display_order ?? 999
            ),
          }))
          .filter((item) => item.image)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        if (!cancelled) {
          setCollections(fetchedCollections);
        }
      } catch (err) {
        console.error("Failed to load shop collections:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCollections();

    return () => {
      cancelled = true;
    };
  }, []);

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

        {loading ? (
          <p className="py-12 text-center text-sm text-neutral-500" role="status">
            Loading collections...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-neutral-600" role="alert">
            We couldn't load the collections. Please refresh the page.
          </p>
        ) : collections.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-600">
            No collections are currently available.
          </p>
        ) : (
          <div
            className="
              mx-auto
              grid
              w-full
              max-w-7xl
              grid-cols-2
              gap-x-4
              gap-y-8
              px-4
              sm:gap-x-6
              sm:px-6
              md:grid-cols-3
              md:gap-x-10
              md:gap-y-16
            "
          >
            {collections.map((item) => (
              <Link
                key={item.id}
                to={item.destinationPath}
                className="block min-w-0"
              >
                <div className="group">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
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
                        font-normal
                        text-neutral-700
                        leading-tight
                      "
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(22px, 2.5vw, 34px)",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <FooterComponent />
    </div>
  );
}

export default ShopPage;
