import NavItemsComponent from "../components/nav-items";
import { useState } from "react";
import { Link } from "react-router-dom";

import CollectionsSectionComponent from "../components/collections-section";
import CustomArrangementSectionComponent from "../components/custom-arrangements-section";
import FooterComponent from "../components/footer";
import HeroSectionComponent from "../components/hero-section";
import OurStorySectionComponent from "../components/our-story-section";

import workshopImage from "../assets/workshop-image.jpg";

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  const floristForADayImages = [
  {
    imgUrl:
      "/8C9C0A66-92F7-4B30-8048-D7B962BEDF82.jpg",
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


  const nextImage = () => {
    setCurrentImage(
      (prev) => (prev + 1) % floristForADayImages.length
    );
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        prev === 0
          ? floristForADayImages.length - 1
          : prev - 1
    );
  };

return (
    <div className="text-neutral-700 bg-neutral-50">

      {/* HEADER */}
      <header className="bg-[#faf9f7] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <NavItemsComponent />
        </div>
      </header>

      {/* HERO SECTION */}
      <HeroSectionComponent />

      {/* COLLECTIONS */}
      <CollectionsSectionComponent />

      {/* CUSTOM ARRANGEMENTS */}
      <CustomArrangementSectionComponent />
  {/* FLORIST FOR A DAY */}
      <section className="py-16 bg-neutral-50 text-center">
        <h1 className="text-[42px] md:text-[80px] mb-4 whitespace-nowrap">
          Florist for a Day
        </h1>

        <p className="italic text-base md:text-lg mb-10 max-w-2xl mx-auto px-6">
          "There's no wrong way to make a bouquet. If it makes you smile,
          that's all the magic you need."
        </p>

        <div className="max-w-5xl mx-auto px-4">
          <div className="relative">

            {/* LEFT ARROW */}
            <button
              onClick={prevImage}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                z-10
                w-12
                h-12
                rounded-full
                bg-white/90
                shadow-lg
                text-3xl
                hover:bg-white
              "
            >
              ‹
            </button>

           {/* IMAGE */}
<div className="overflow-hidden rounded-xl bg-white">
  <img
    key={currentImage}
    src={floristForADayImages[currentImage]?.imgUrl}
    alt="Florist for a Day Workshop"
    className="
      w-full
      h-[320px]
      sm:h-[450px]
      md:h-[650px]
      object-contain
      animate-fade
    "
  />
</div>

            {/* RIGHT ARROW */}
            <button
              onClick={nextImage}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                z-10
                w-12
                h-12
                rounded-full
                bg-white/90
                shadow-lg
                text-3xl
                hover:bg-white
              "
            >
              ›
            </button>

          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-3 mt-6">
            {floristForADayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full ${
                  currentImage === index
                    ? "bg-black"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

      {/* WORKSHOP */}
      <section className="relative h-[400px] md:h-[600px] text-white text-center overflow-hidden">

        <div className="absolute inset-0">
          <img
            src={workshopImage}
            alt="Workshop Image"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/35"></div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">

          <h1 className="text-3xl md:text-5xl mb-3">
            Private Dried Flower Workshop
          </h1>

          <p className="mb-5 text-sm md:text-base">
            Birthdays · Bridal Shower · Events
          </p>

          <Link to="/workshop">
            <button className="border border-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-neutral-800 transition">
              Learn more
            </button>
          </Link>

        </div>
      </section>

    
  {/* OUR STORY */}
      <OurStorySectionComponent />
export default HomePage;
