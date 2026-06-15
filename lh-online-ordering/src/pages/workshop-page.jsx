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

        const imageRequests = imageIds.map((id) =>
          axios.get(
            `https://api.lovehestia.shop/wp-json/wp/v2/media/${id}`
          )
        );

        const imageResponses = await Promise.all(imageRequests);

        const images = imageResponses.map(
          (res) => res.data.source_url
        );

        setData({
          title: acf.workshop_title,
          details: acf.workshop_details,
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

  if (!data) return null;

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">

        {/* HERO SLIDER */}
        <div className="max-w-7xl mx-auto pt-12 px-4">

          <div className="relative">

            {/* LEFT */}
            <button
              onClick={prevImage}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                z-20
                w-12
                h-12
                rounded-full
                bg-white/90
                shadow-lg
                text-3xl
              "
            >
              ‹
            </button>

            {/* IMAGE */}
            <div className="overflow-hidden rounded-xl">
              <img
                key={currentImage}
                src={data.images[currentImage]}
                alt="Workshop"
                className="
                  w-full
                  h-[350px]
                  md:h-[700px]
                  object-cover
                  transition-all
                  duration-700
                "
              />
            </div>

            {/* RIGHT */}
            <button
              onClick={nextImage}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                z-20
                w-12
                h-12
                rounded-full
                bg-white/90
                shadow-lg
                text-3xl
              "
            >
              ›
            </button>
          </div>

          {/* DOTS */}
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

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-6 py-20">

          <h1 className="text-center text-4xl mb-10">
            {data.title}
          </h1>

          <div className="whitespace-pre-line leading-relaxed text-sm md:text-base">
            {data.details}
          </div>

        </div>

      </section>

      <FooterComponent />
    </div>
  );
}

export default WorkshopPage;
