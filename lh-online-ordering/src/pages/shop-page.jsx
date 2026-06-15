import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";

function ShopPage() {
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

  return (
    <div>
      <HeaderComponent />

      <section className="bg-neutral-50 py-24">

        <h2 className="mb-14 text-center text-3xl font-medium text-neutral-800">
          Collections
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 md:grid-cols-3">

          {collections.map((item) => (
            <Link
              key={item.title}
              to={`/shop/${item.productKey}`}
            >
              <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden">

                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/25 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-[15px] font-medium tracking-widest uppercase text-white">
                    {item.title}
                  </h3>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </section>

      <FooterComponent />
    </div>
  );
}

export default ShopPage;
