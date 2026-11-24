
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

// Extract a direct image URL from different WordPress image formats.
function getDirectImageUrl(image) {
  if (typeof image === "string" && /^https?:\/\//i.test(image)) {
    return image;
  }

  if (image && typeof image === "object") {
    const url =
      image.url ||
      image.source_url ||
      image.guid?.rendered ||
      image.sizes?.large?.source_url ||
      image.sizes?.large ||
      image.sizes?.medium_large?.source_url ||
      image.sizes?.medium_large ||
      image.sizes?.full?.url;

    if (typeof url === "string" && /^https?:\/\//i.test(url)) {
      return url;
    }
  }

  return "";
}

function WeddingEventsSectionComponent() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadWeddingImage = async () => {
      try {
        // Get homepage settings from WordPress.
        const response = await homeSettingsService.getSettings();

        const settings =
          response?.acf ||
          response?.data?.acf ||
          response?.data ||
          response ||
          {};

        // Support different ACF field names.
        const imageValue =
          settings?.wedding_events_image ??
          settings?.["wedding_&_events_image"] ??
          settings?.weddingEventsImage;

        if (!imageValue) {
          console.warn(
            "Wedding & Events image has not been selected in WordPress."
          );
          return;
        }

        // Check whether ACF already returned an image URL.
        const directUrl = getDirectImageUrl(imageValue);

        if (directUrl) {
          if (isMounted) {
            setImageUrl(directUrl);
          }
          return;
        }

        // Extract WordPress media ID.
        const imageId =
          typeof imageValue === "object"
            ? imageValue.ID ?? imageValue.id
            : imageValue;

        if (!imageId) {
          throw new Error("Invalid Wedding & Events image data.");
        }

        // Retrieve the WordPress media image.
        const mediaResponse = await mediaService.getById(imageId);

        const media =
          mediaResponse?.data ||
          mediaResponse?.media ||
          mediaResponse;

        // Support different WordPress media response formats.
        const resolvedUrl =
          getDirectImageUrl(media) ||
          getDirectImageUrl(media?.media_details);

        if (!resolvedUrl) {
          throw new Error(
            "WordPress did not return a valid Wedding & Events image URL."
          );
        }

        if (isMounted) {
          setImageUrl(resolvedUrl);
        }

      } catch (error) {
        console.error(
          "Unable to load Wedding & Events image:",
          error
        );
      }
    };

    loadWeddingImage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative h-[500px] md:h-[800px] overflow-hidden text-center text-white">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 bg-neutral-300">

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Love Hestia Withered Fleur Bar and Tablescape Styling"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
            onError={() => {
              console.error(
                "Wedding & Events background image could not be displayed:",
                imageUrl
              );
              setImageUrl("");
            }}
          />
        )}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* CENTERED CONTENT */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

        {/* HEADING */}
        <h2
          className="mb-3 text-3xl font-normal md:text-5xl"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
          }}
        >
          Withered Fleur Bar & Tablescape Styling
        </h2>

        {/* DESCRIPTION */}
        <p className="mb-5 max-w-3xl text-sm leading-relaxed md:text-base">
          A little floral magic for weddings, birthdays, and intimate
          gatherings. Thoughtfully styled, beautifully remembered.
        </p>

        {/* BUTTON */}
        <Link
          to="/weddings-events"
          className="
            inline-block
            rounded-full
            border
            border-white
            px-6
            py-2
            text-sm
            transition
            duration-300
            hover:bg-white
            hover:text-neutral-800
          "
        >
          Learn more
        </Link>

      </div>
    </section>
  );
}

export default WeddingEventsSectionComponent;
