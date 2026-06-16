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
          title: acf.workshop_title || "",
          intro: acf.workshop_intro || "",
          pricing: acf.workshop_pricing || "",
          details: acf.workshop_details || "",
          images,
        });
      } catch (error) {
        console.error("Workshop Error:", error);
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

  console.log("Workshop Data:", data);
console.log("Workshop Intro Raw:", data?.intro);
console.log("Workshop Intro Type:", typeof data?.intro);

  return (
    <div>
      <HeaderComponent />

      <section className="bg-[#faf9f7] text-neutral-700">

        {/* HERO SLIDER */}
        <div className="max-w-7xl mx-auto pt-12 px-4">

          <div className="relative">

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

            <div className="overflow-hidden rounded-xl">
              {data.images.length > 0 && (
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
              )}
            </div>

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
          <div className="bg-yellow-100 p-4 mb-6">
  TEST: {data.intro}
</div>

          {/* INTRO */}
          {data.intro && (
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="leading-relaxed">
                {data.intro}
              </p>
            </div>
          )}

          {/* PRICING */}
          {data.pricing && (
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-4">
                Pricing
              </h2>

              <div
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.pricing,
                }}
              />
            </div>
          )}

          {/* DETAILS */}
          {data.details && (
            <div>
              <h2 className="text-2xl font-medium mb-4">
                Workshop Details
              </h2>

              <div
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{
                  __html: data.details,
                }}
              />
            </div>
          )}

        </div>

      </section>

      <FooterComponent />
    </div>
  );
}

export default WorkshopPage;
