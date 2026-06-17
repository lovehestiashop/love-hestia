import { Link } from "react-router-dom";

function CollectionsSectionComponent() {
  const collections = [
  {
    title: "Flower Bouquets",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/06/IMG_9440.jpeg",
    productKey: 5,
  },
  {
    title: "Vase Arrangements",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/06/IMG_9439.jpeg",
    productKey: 6,
  },
  {
    title: "Flower Dome",
    image:
      "https://api.lovehestia.shop/wp-content/uploads/2026/01/DSC02766.jpg",
    productKey: 7,
  },
];

  return (
    <section className="bg-neutral-50 py-20 text-center">
      <h2
  className="
    mb-16
    text-center
    text-[42px]
    md:text-[72px]
    font-light
    text-neutral-700
    leading-none
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
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

             <p
  className="
    text-[22px]
    md:text-[30px]
    font-light
    text-neutral-700
  "
  style={{
    fontFamily: "'Cormorant Garamond', serif",
  }}
>
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
