
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

function WeddingEventsSectionComponent() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadWeddingImage = async () => {
      try {
        // Get homepage settings from WordPress ACF
        const settings = await homeSettingsService.getSettings();

        // Get Wedding & Events image ID
        const imageId =
          settings?.wedding_events_image ??
          settings?.["wedding_&_events_image"];

        if (!imageId) {
          console.warn(
            "Wedding & Events image has not been selected."
          );
          return;
        }

        // Retrieve the actual image URL from WordPress
        const media = await mediaService.getById(imageId);

        if (isMounted && media?.source_url) {
          setImageUrl(media.source_url);
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
    <section className="relative h-[500px] md:h-[800px] text-white text-center overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Love Hestia Flower Bar and Tablescape Styling"
            loading="lazy"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center center",
            }}
          />
        ) : (
          <div className="w-full h-full bg-neutral-300" />
        )}

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* CENTERED CONTENT */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

        {/* HEADING */}
        <h2
          className="text-3xl md:text-5xl mb-3 font-normal"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
          }}
        >
          Withered Fleur Bar & Tablescape Styling
        </h2>

        {/* DESCRIPTION */}
        <p className="mb-5 text-sm md:text-base max-w-3xl leading-relaxed">
          A little floral magic for weddings, birthdays, and intimate
          gatherings. Thoughtfully styled, beautifully remembered.
        </p>

        {/* BUTTON */}
        <Link
          to="/weddings-events"
          className="
            inline-block
            border
            border-white
            px-6
            py-2
            rounded-full
            text-sm
            hover:bg-white
            hover:text-neutral-800
            transition
            duration-300
          "
        >
          Learn more
        </Link>

      </div>
    </section>
  );
}

export default WeddingEventsSectionComponent;
