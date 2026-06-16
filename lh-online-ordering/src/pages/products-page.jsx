import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../components/header";
import FooterComponent from "../components/footer";
import { productService } from "../services/product-service";

const PRODUCT_TYPE_MAP = {
  7: "Flower Dome",
  6: "Vases & Baskets",
  5: "Flower Bouquets",
};

const STORAGE_KEY = "all_products";

function ProductsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productTypeId = Number(id);

  const title = PRODUCT_TYPE_MAP[productTypeId] || "Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    productService
      .getAll()
      .then((data) => {
        setProducts(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      })
      .catch((err) => {
        console.error("Failed to load products", err);
      })
      .finally(() => setLoading(false));

    effectRan.current = true;
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) =>
        item["product-type"]?.includes(productTypeId)
      )
      .sort((a, b) => {
        const priceA = Number(a.acf?.price || 0);
        const priceB = Number(b.acf?.price || 0);

        return priceB - priceA;
      });
  }, [products, productTypeId]);

  if (loading) {
    return <p className="py-24 text-center">Loading...</p>;
  }

  return (
    <div>
      <HeaderComponent />

      <section className="bg-neutral-50 py-16">
        <h2 className="mb-10 text-center text-2xl font-medium text-neutral-800">
          {title}
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map((item) => {
            const imageUrl =
              item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "/placeholder.jpg";

            const price =
              item.acf?.price ||
              item.meta?.price ||
              item.price ||
              0;

            const isAvailable = Boolean(
              item.acf?.availability
            );

            return (
              <div
                key={item.id}
                className="flex flex-col"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-neutral-200 cursor-pointer"
                  onClick={() =>
                    navigate(`/product/${item.id}`, {
                      state: {
                        product: item,
                      },
                    })
                  }
                >
                  <img
                    src={imageUrl}
                    alt={item.title.rendered}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="mt-3 flex flex-col items-center text-center">
                  <h3 className="mb-1 text-sm font-medium text-neutral-800">
                    {item.title.rendered}
                  </h3>

                  <p className="mb-2 text-sm font-bold text-neutral-600">
                    ₱
                    {Number(price).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                  {isAvailable ? (
                    <span className="text-sm font-medium text-green-700">
                      Available
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-600">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

export default ProductsPage;
