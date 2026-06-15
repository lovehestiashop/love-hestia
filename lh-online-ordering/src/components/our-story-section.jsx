import { useEffect, useState } from "react";
import axios from "axios";

function OurStorySectionComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pageRes = await axios.get(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const acf = pageRes.data.acf;

        const imageRes = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.our_story_image}`
        );

        setData({
          image: imageRes.data.source_url,
          title: acf.our_story_title,
          text: acf.our_story_text,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  if (!data) return null;

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 px-6 items-center">

        <div className="order-1 md:order-2">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[350px] md:h-[450px] object-cover rounded-lg"
          />
        </div>

        <div className="order-2 md:order-1">
          <h2 className="text-[36px] mb-5">
            {data.title}
          </h2>

          <p className="text-sm leading-relaxed whitespace-pre-line">
            {data.text}
          </p>
        </div>

      </div>
    </section>
  );
}

export default OurStorySectionComponent;
