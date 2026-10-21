
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
function decodeHtmlEntities(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

const fallbackCollections = [
  {
    id: "bouquets",
    title: "Flower Bouquets",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/07/Flower-Bouquet.jpeg",
    destinationPath: "/shop/5",
    displayOrder: 1,
  },
  {
    id: "vase-arrangements",
    title: "Vase Arrangements",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/07/Vase-arrnagements.jpeg",
    destinationPath: "/shop/6",
    displayOrder: 2,
  },
  {
    id: "flower-dome",
    title: "Flower Dome",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/04/IMG_0566-scaled.jpeg",
    destinationPath: "/shop/7",
    displayOrder: 3,
  },
];

function CollectionsSectionComponent() {
  const [collections, setCollections] = useState(
    fallbackCollections
  );

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
          .sort(
            (a, b) => a.displayOrder - b.displayOrder
          );

        if (!cancelled && fetchedCollections.length > 0) {
          setCollections(fetchedCollections);
        }
      } catch (error) {
        console.error(
          "Could not load collections from WordPress:",
          error
        );
      }
    }

    loadCollections();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-neutral-50 py-20 text-center">
      <h2
        className="
          mb-16
          text-center
          text-[42px]
          md:text-[72px]
          font-semibold
          text-neutral-700
          leading-none
        "
        style={{
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        Our Collections
      </h2>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-10 px-4 sm:px-6 md:grid-cols-4">
        {collections.map((item) => (
          <Link
            key={item.id}
            to={item.destinationPath}
            className="block"
          >
            <div className="group flex cursor-pointer flex-col items-center">
              <div className="relative mb-4 aspect-[3/4] w-full max-w-[280px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <p
                className="
                  text-[18px]
                  md:text-[28px]
                  font-medium
                  text-neutral-700
                "
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CollectionsSectionComponent;
