import { useEffect, useState } from "react";
import axios from "axios";

import FooterComponent from "../components/footer";
import HeaderComponent from "../components/header";

function WorkshopPage() {
  const [data, setData] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pageRes = await axios.get(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const acf = pageRes.data.acf;

        const imageIds = [
          acf.workshop_image_1,
          acf.workshop_image_2,
          acf.workshop_image_3,
          acf.workshop_image_4,
        ].filter(Boolean);

        const imageResponses = await Promise.all(
          imageIds.map((id) =>
            axios.get(
              `https://api.lovehestia.shop/wp-json/wp/v2/media/${id}`
            )
          )
        );

        const images = imageResponses.map(
          (res) => res.data.source_url
        );

      setData({
  title: acf.workshop_title,
  pricing: acf.workshop_pricing,
  details: acf.workshop_details,
  howToBook: acf.how_to_book,
  images,
});
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!data?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentImage(
        (prev) => (prev + 1) % data.images.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  const nextImage = () => {
    setCurrentImage(
      (prev) => (prev + 1) % data.images.length
    );
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) =>
        prev === 0
          ? data.images.length - 1
          : prev - 1
    );
  };

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">

        {/* Hero Slider */}
        <div className="max-w-7xl mx-auto pt-12 px-4">

          <div className="relative">

            <button
              onClick={prevImage}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2 z-20
                w-12 h-12 rounded-full
                bg-white/90 shadow-lg text-3xl
              "
            >
              ‹
            </button>

            <div className="overflow-hidden rounded-xl">
              <img
                src={data.images[currentImage]}
                alt="Workshop"
                className="
                  w-full
                  h-[350px]
                  md:h-[700px]
                  object-cover
                "
              />
            </div>

            <button
              onClick={nextImage}
              className="
                absolute right-4 top-1/2
                -translate-y-1/2 z-20
                w-12 h-12 rounded-full
                bg-white/90 shadow-lg text-3xl
              "
            >
              ›
            </button>

          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {data.images.map((_, index) => (
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-20">

          <h1 className="text-center text-4xl mb-14">
            {data.title}
          </h1>

          {/* Pricing */}
          <div className="mb-14">
            <h2 className="text-2xl font-medium mb-5">
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

          {/* Workshop Details */}
          <div>
            <h2 className="text-2xl font-medium mb-5">
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
          {/* How To Book */}
<div className="mt-14">
  <h2 className="text-2xl font-medium mb-5">
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

        </div>

      </section>

      <FooterComponent />
    </div>
  );
}

export default WorkshopPage;
