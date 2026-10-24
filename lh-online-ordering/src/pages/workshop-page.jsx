
import { useEffect, useState } from "react";
import axios from "axios";

import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

const WORDPRESS_API =
  "https://api.lovehestia.shop/wp-json/wp/v2";

function WorkshopPage() {
  const [data, setData] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const pageResponse = await axios.get(
          `${WORDPRESS_API}/pages/4973`,
          {
            params: {
              _fields: "acf",
            },
          }
        );

        const acf = pageResponse.data?.acf;

        if (!acf) {
          throw new Error(
            "Workshop page fields could not be loaded."
          );
        }

        // Read up to six workshop images from WordPress.
        const imageIds = [
          acf.workshop_image_1,
          acf.workshop_image_2,
          acf.workshop_image_3,
          acf.workshop_image_4,
          acf.workshop_image_5,
          acf.workshop_image_6,
        ].filter(
          (id) =>
            id !== null &&
            id !== undefined &&
            id !== "" &&
            id !== false
        );

        // Load image details concurrently.
        // If one image fails, the remaining images can still display.
        const imageResults = await Promise.all(
          imageIds.map(async (imageId) => {
            try {
              const response = await axios.get(
                `${WORDPRESS_API}/media/${imageId}`,
                {
                  params: {
                    _fields: "source_url,media_details",
                  },
                }
              );

              const media = response.data;
              const sizes = media.media_details?.sizes || {};

              // Prefer a generated, appropriately sized image.
              return (
                sizes["1536x1536"]?.source_url ||
                sizes.large?.source_url ||
                sizes.medium_large?.source_url ||
                media.source_url ||
                null
              );
            } catch (imageError) {
              console.error(
                `Failed to load workshop image ${imageId}:`,
                imageError
              );

              return null;
            }
          })
        );

        const images = imageResults.filter(Boolean);

        if (cancelled) return;

        setData({
          title: acf.workshop_title || "Workshop",
          pricing: acf.workshop_pricing || "",
          details: acf.workshop_details || "",
          howToBook: acf.how_to_book || "",
          images,
        });

        setCurrentImage(0);
      } catch (loadError) {
        console.error(
          "Failed to load workshop page:",
          loadError
        );

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Automatically change photos every five seconds.
  useEffect(() => {
    const imageCount = data?.images?.length ?? 0;

    if (imageCount < 2) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage(
        (previous) => (previous + 1) % imageCount
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.images?.length]);

  return (
    <div className="bg-[#faf9f7]">
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">
        {/* WORKSHOP PHOTO SLIDESHOW */}
        <div className="mx-auto max-w-7xl px-4 pt-12">
          {loading ? (
            <div
              className="
                flex
                min-h-[350px]
                items-center
                justify-center
                text-lg
                font-medium
                text-neutral-600
                md:min-h-[700px]
              "
              role="status"
            >
              Loading workshop photos...
            </div>
          ) : error ? (
            <p
              className="py-24 text-center text-neutral-600"
              role="alert"
            >
              We couldn't load the workshop page.
              Please refresh and try again.
            </p>
          ) : data.images.length > 0 ? (
            <>
              {/* IMAGE — NO ARROWS */}
              <div className="overflow-hidden rounded-xl">
                <img
                  key={data.images[currentImage]}
                  src={data.images[currentImage]}
                  alt={`Love Hestia workshop photo ${currentImage + 1}`}
                  fetchPriority="high"
                  decoding="async"
                  className="
                    h-[350px]
                    w-full
                    object-cover
                    md:h-[700px]
                  "
                />
              </div>

              {/* NAVIGATION DOTS */}
              {data.images.length > 1 && (
                <div className="mt-6 flex justify-center gap-3">
                  {data.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Show workshop photo ${index + 1}`}
                      aria-current={
                        currentImage === index
                          ? "true"
                          : undefined
                      }
                      className={`
                        h-3
                        w-3
                        rounded-full
                        transition-colors
                        ${
                          currentImage === index
                            ? "bg-black"
                            : "bg-gray-300"
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="py-24 text-center text-neutral-600">
              No workshop photos are available yet.
            </p>
          )}
        </div>

        {/* WORKSHOP CONTENT */}
        {!loading && !error && data && (
          <div className="mx-auto max-w-4xl px-6 py-20">
            <h1 className="mb-14 text-center text-4xl">
              {data.title}
            </h1>

            {/* PRICING */}
            <div className="mb-14">
              <h2 className="mb-5 text-2xl font-medium">
                Pricing
              </h2>

              <div
                className="
                  text-base
                  leading-relaxed
                  [&_ul]:list-disc
                  [&_ul]:pl-6
                  [&_ul]:space-y-2
                "
                dangerouslySetInnerHTML={{
                  __html: data.pricing,
                }}
              />
            </div>

            {/* WORKSHOP DETAILS */}
            <div>
              <h2 className="mb-5 text-2xl font-medium">
                Workshop Details
              </h2>

              <div
                className="
                  text-base
                  leading-relaxed
                  [&_ul]:list-disc
                  [&_ul]:pl-6
                  [&_ul]:space-y-2
                "
                dangerouslySetInnerHTML={{
                  __html: data.details,
                }}
              />
            </div>

            {/* HOW TO BOOK */}
            <div className="mt-14">
              <h2 className="mb-5 text-2xl font-medium">
                How to Book
              </h2>

              <div
                className="
                  text-base
                  leading-relaxed
                  [&_ol]:list-decimal
                  [&_ol]:pl-6
                  [&_ol]:space-y-2
                "
                dangerouslySetInnerHTML={{
                  __html: data.howToBook,
                }}
              />
            </div>

            {/* CONTACT BUTTON */}
            <div className="mt-20 text-center">
              <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-neutral-600">
                Let's plan your workshop together.
              </p>

              <a
                href="https://www.instagram.com/lovehestiaflowers"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block
                  border
                  border-neutral-800
                  px-8
                  py-3
                  tracking-wide
                  text-neutral-800
                  transition-all
                  duration-300
                  hover:bg-neutral-800
                  hover:text-white
                "
              >
                Contact Us
              </a>
            </div>
          </div>
        )}
      </section>

      <FooterComponent />
    </div>
  );
}

export default WorkshopPage;
