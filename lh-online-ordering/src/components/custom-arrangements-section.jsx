import { useEffect, useState } from "react";
import axios from "axios";

function CustomArrangementSectionComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pageRes = await axios.get(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const acf = pageRes.data.acf;

        const imageRes = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.custom_arrangement_image}`
        );

        setData({
          image: imageRes.data.source_url,
          title: acf.custom_arrangement_title,
          text: acf.custom_arrangement_text,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  if (!data) return null;

  return (
    <section className="py-12 bg-[#faf9f7] text-neutral-800">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">

        <div>
          <div className="w-full h-[350px] md:h-[450px] bg-white rounded-lg overflow-hidden flex items-center justify-center shadow-sm">
  <img
    src={data.image}
    alt={data.title}
    className="max-w-full max-h-full object-contain"
  />
</div>

        <div>
          <h2 className="text-[36px] mb-5 text-neutral-800">
            {data.title}
          </h2>

          <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
            {data.text}
          </p>
        </div>

      </div>
    </section>
  );
}

export default CustomArrangementSectionComponent;
