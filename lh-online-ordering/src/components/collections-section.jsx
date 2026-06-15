import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CollectionsSectionComponent() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const pageRes = await axios.get(
          "https://api.lovehestia.shop/wp-json/wp/v2/pages/4973?_fields=acf"
        );

        const acf = pageRes.data.acf;

        const image1 = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.collection_image_1}`
        );

        const image2 = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.collection_image_2}`
        );

        const image3 = await axios.get(
          `https://api.lovehestia.shop/wp-json/wp/v2/media/${acf.collection_image_3}`
        );

        setCollections([
          {
            title: acf.collection_title_1,
            image: image1.data.source_url,
            productKey: 5,
          },
          {
            title: acf.collection_title_2,
            image: image2.data.source_url,
            productKey: 6,
          },
          {
            title: acf.collection_title_3,
            image: image3.data.source_url,
            productKey: 7,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    loadCollections();
  }, []);

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="bg-neutral-50 py-20 text-center">
      <h2 className="mb-14 md:text-[36px] text-3xl font-medium text-neutral-800">
        Our Collections
      </h2>

      {/* MOBILE */}
      <div className="md:hidden max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-6 mb-10">
          {collections.slice(0, 2).map((item) => (
            <Link
              key={item.title}
              to={`/shop/${item.productKey}`}
            >
              <div className="group flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <p className="mt-4 text-[12px] font-medium tracking-widest uppercase text-neutral-800">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to={`/shop/${collections[2].productKey}`}
            className="w-[45%] max-w-[170px]"
          >
            <div className="group flex flex-col items-center">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={collections[2].image}
                  alt={collections[2].title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <p className="mt-4 text-[12px] font-medium tracking-widest uppercase text-neutral-800">
                {collections[2].title}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:grid mx-auto max-w-5xl grid-cols-3 gap-15 px-6">
        {collections.map((item) => (
          <Link
            key={item.title}
            to={`/shop/${item.productKey}`}
          >
            <div className="group flex cursor-pointer flex-col items-center">
              <div className="relative mb-6 h-86 w-70 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <p className="text-[13px] font-medium tracking-widest uppercase text-neutral-800">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CollectionsSectionComponent;
