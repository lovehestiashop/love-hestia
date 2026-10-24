
import NavItemsComponent from "../components/nav-items";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CollectionsSectionComponent from "../components/collections-section";
import CustomArrangementSectionComponent from "../components/custom-arrangements-section";
import FooterComponent from "../components/footer";
import HeroSectionComponent from "../components/hero-section";
import OurStorySectionComponent from "../components/our-story-section";
import InstagramFeedSection from "../components/instagram-feed-section";

import workshopImage from "../assets/workshop-image.jpg";

const floristForADayImages = [
  {
    imgUrl: "/8C9C0A66-92F7-4B30-8048-D7B962BEDF82.jpg",
  },
  {
    imgUrl: "/IMG_8789.jpeg",
  },
  {
    imgUrl: "/IMG_8790.jpeg",
  },
  {
    imgUrl: "/IMG_8791.jpeg",
  },
];

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  // AUTOMATICALLY CHANGE PHOTO EVERY FIVE SECONDS.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(
        (previous) =>
          (previous + 1) % floristForADayImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-neutral-700 bg-neutral-50">

      {/* HEADER */}
      <header className="bg-[#faf9f7] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <NavItemsComponent />
        </div>
      </header>

      {/* HERO */}
      <HeroSectionComponent />

      {/* COLLECTIONS */}
      <CollectionsSectionComponent />

      {/* CUSTOM ARRANGEMENTS */}
      <CustomArrangementSectionComponent />

      {/* FLORIST FOR A DAY */}
      <section className="py-16 bg-neutral-50 text-center">
        <h1
          className="
            text-[42px]
            md:text-[80px]
            mb-4
            whitespace-nowrap
            text-neutral-700
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
          }}
        >
          Florist for a Day
        </h1>

        <p className="italic text-base md:text-lg mb-10 max-w-2xl mx-auto px-6">
          "There's no wrong way to make a bouquet. If it makes you smile,
          that's all the magic you need."
        </p>

        <div className="max-w-5xl mx-auto px-4">
          {/* AUTOMATIC SLIDESHOW — NO ARROWS */}
          <div className="overflow-hidden rounded-xl bg-white">
            <img
              key={currentImage}
              src={floristForADayImages[currentImage].imgUrl}
              alt={`Florist for a Day Workshop - Photo ${currentImage + 1}`}
              loading="lazy"
              className="
                w-full
                h-[320px]
                sm:h-[450px]
                md:h-[650px]
                object-contain
              "
            />
          </div>

          {/* CLICKABLE SLIDESHOW DOTS */}
          <div
            className="flex justify-center gap-3 mt-6"
            aria-label="Workshop photo navigation"
          >
            {floristForADayImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImage(index)}
                aria-label={`Show workshop photo ${index + 1}`}
                aria-current={
                  currentImage === index ? "true" : undefined
                }
                className={`
                  w-3
                  h-3
                  rounded-full
                  transition-colors
                  duration-300
                  ${
                    currentImage === index
                      ? "bg-black"
                      : "bg-gray-300 hover:bg-gray-400"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRIVATE WORKSHOP BANNER */}
      <section className="relative h-[500px] md:h-[800px] text-white text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={workshopImage}
            alt="Love Hestia private floral workshop"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 58%",
            }}
          />

          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
          <h2 className="text-3xl md:text-5xl mb-3">
            Private Dried Flower Workshop
          </h2>

          <p className="mb-5 text-sm md:text-base">
            Birthdays · Bridal Shower · Events
          </p>

          <Link
            to="/workshop"
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
            "
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* OUR STORY */}
      <OurStorySectionComponent />

      {/* INSTAGRAM FEED */}
      <InstagramFeedSection />

      {/* FOOTER */}
      <FooterComponent />

    </div>
  );
}

export default HomePage;
