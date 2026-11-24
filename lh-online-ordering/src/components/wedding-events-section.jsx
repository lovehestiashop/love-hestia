
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
        // Retrieve homepage ACF settings from WordPress
        const settings = await homeSettingsService.getSettings();

        // Support both the corrected field name and the earlier name
        const imageId =
          settings?.wedding_events_image ??
          settings?.["wedding_&_events_image"];

        if (!imageId) {
          console.warn("Wedding & Events image has not been selected.");
          return;
        }

        // Retrieve the actual image URL using its WordPress media ID
        const media = await mediaService.getById(imageId);

        if (isMounted && media?.source_url) {
          setImageUrl(media.source_url);
        }
      } catch (error) {
        console.error("Unable to load Wedding & Events image:", error);
      }
    };

    loadWeddingImage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-12 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

        {/* WEDDING & EVENTS IMAGE */}
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Love Hestia wedding and event floral arrangements"
              loading="lazy"
              className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[350px] md:h-[450px] rounded-lg bg-neutral-200 flex items-center justify-center">
              <p className="text-sm text-neutral-500">
                Wedding & Events photograph
              </p>
            </div>
          )}
        </div>

        {/* SECTION CONTENT */}
        <div className="text-center">

          <h2
            className="text-[28px] md:text-[36px] leading-tight mb-6 font-semibold text-neutral-700"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            For Weddings & Events
          </h2>

          <p className="text-[15px] md:text-[18px] leading-[2] text-neutral-600">
            From intimate gatherings to once-in-a-lifetime celebrations,
            we create floral details that feel true to your day.
            Explore bridal bouquets, wedding florals, and event flower bars,
            thoughtfully designed for the moments worth remembering.
          </p>

          {/* BUTTON */}
          <div className="flex justify-center mt-8">
            <Link
              to="/weddings-events"
              className="inline-flex items-center justify-center rounded-full border border-[#98776f] bg-[#98776f] px-9 py-3.5 text-sm md:text-base font-medium tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#806159] hover:border-[#806159] hover:shadow-lg"
            >
              Explore Weddings & Events
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WeddingEventsSectionComponent;
