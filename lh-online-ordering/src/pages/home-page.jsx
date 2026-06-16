import NavItemsComponent from "../components/nav-items";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import CollectionsSectionComponent from "../components/collections-section";
import CustomArrangementSectionComponent from "../components/custom-arrangements-section";
import FooterComponent from "../components/footer";
import HeroSectionComponent from "../components/hero-section";
import OurStorySectionComponent from "../components/our-story-section";

import workshopImage from "../assets/workshop-image.jpg";

function HomePage() {
  const [currentImage, setCurrentImage] = useState(0);

  const [floristForADayImages, setFloristForADayImages] =
    useState([]);

  useEffect(() => {
    const loadFloristImages = async () => {
      try {
        useEffect(() => {
  if (!floristForADayImages.length) return;

  const interval = setInterval(() => {
    setCurrentImage(
      (prev) =>
        (prev + 1) %
        floristForADayImages.length
    );
  }, 4000);

  return () => clearInterval(interval);
}, [floristForADayImages]);
        const res = await axios.get(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const acf = res.data.acf;

        const imageIds = [
          acf.florist_image_1,
          acf.florist_image_2,
          acf.florist_image_3,
          acf.florist_image_4,
        ].filter(Boolean);

        const images = await Promise.all(
          imageIds.map(async (id) => {
            const mediaRes = await axios.get(
              `https://api.lovehestia.shop/wp-json/wp/v2/media/${id}`
            );

            return {
              imgUrl: mediaRes.data.source_url,
            };
          })
        );

        setFloristForADayImages(images);
      } catch (error) {
        console.error(error);
      }
    };

    loadFloristImages();
  }, []);

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

  if (!floristForADayImages.length) {
    return null;
  }

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

      {/* OUR STORY */}
      <OurStorySectionComponent />

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

           {/* IMAGE */}
<div
  className="overflow-hidden rounded-xl bg-white"
  onTouchStart={(e) => {
    window.touchStartX =
      e.changedTouches[0].screenX;
  }}
  onTouchEnd={(e) => {
    const touchEndX =
      e.changedTouches[0].screenX;

    if (
      window.touchStartX - touchEndX >
      50
    ) {
      setCurrentImage(
        (prev) =>
          (prev + 1) %
          floristForADayImages.length
      );
    }

    if (
      touchEndX - window.touchStartX >
      50
    ) {
      setCurrentImage(
        (prev) =>
          prev === 0
            ? floristForADayImages.length -
              1
            : prev - 1
      );
    }
  }}
>
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

export default HomePage;
