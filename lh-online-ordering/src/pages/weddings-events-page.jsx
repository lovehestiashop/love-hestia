
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavItemsComponent from "../components/nav-items";
import FooterComponent from "../components/footer";

import { homeSettingsService } from "../services/home-settings-service";
import { mediaService } from "../services/media-service";

function WeddingsEventsPage() {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadWeddingImage = async () => {
      try {
        const settings = await homeSettingsService.getSettings();

        const imageId =
          settings?.wedding_events_image ??
          settings?.["wedding_&_events_image"];

        if (!imageId) return;

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
    <div className="min-h-screen bg-[#faf9f7] text-neutral-700">

      {/* HEADER */}
      <header className="bg-[#faf9f7] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <NavItemsComponent />
        </div>
      </header>

      {/* COMING SOON SECTION */}
      <main className="px-5 py-16 md:py-24">

        <div className="max-w-6xl mx-auto">

          {/* FLORAL IMAGE */}
          <div className="relative h-[350px] sm:h-[450px] md:h-[580px] overflow-hidden rounded-lg">

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Love Hestia flower bar and tablescape styling"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "center center",
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#e9ded5]" />
            )}

            <div className="absolute inset-0 bg-black/25" />

            {/* IMAGE TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5">

              <p className="text-xs md:text-sm tracking-[0.25em] uppercase mb-5">
                Something beautiful is blooming
              </p>

              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-normal"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 500,
                }}
              >
                Coming Soon
              </h1>

              <div className="w-16 h-px bg-white/80 mt-6" />

            </div>
          </div>

          {/* COMING SOON MESSAGE */}
          <div className="max-w-2xl mx-auto text-center py-14 md:py-20">

            <p className="text-xs tracking-[0.2em] uppercase text-[#98776f] mb-4">
              Love Hestia Floral Experiences
            </p>

            <h2
              className="text-3xl md:text-5xl text-neutral-700 mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
              }}
            >
              A little more magic is on its way.
            </h2>

            <p className="text-sm md:text-base leading-8 text-neutral-600 mb-8">
              We're preparing something special for your celebrations.
              Soon, you'll be able to explore our flower bars and
              thoughtfully styled tablescapes for weddings, birthdays,
              and intimate gatherings.
            </p>

            <p
              className="text-lg italic text-[#98776f] mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Thoughtfully styled, beautifully remembered.
            </p>

            {/* BACK TO HOME */}
            <Link
              to="/"
              className="
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-[#98776f]
                bg-[#98776f]
                px-9
                py-3
                text-sm
                font-medium
                tracking-wide
                text-white
                shadow-md
                transition-all
                duration-300
                hover:bg-[#806159]
                hover:border-[#806159]
              "
            >
              Back to Home
            </Link>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <FooterComponent />

    </div>
  );
}

export default WeddingsEventsPage;
