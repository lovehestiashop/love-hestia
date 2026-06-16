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

  /** Filter by product-type */
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

        {/* 2 columns on mobile */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
          
      {filteredProducts.map((item) => {
       console.log(item);

  const imageUrl =
    item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/placeholder.jpg";

  /** Price mapping */
  const price =
    item.acf?.price || item.meta?.price || item.price || 0;
const isAvailable = Boolean(item.acf?.availability);

            return (
              <div key={item.id} className="flex flex-col">
                {/* Image */}
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
    className="h-full w-full object-cover"
  />
</div>
                  <img
                    src={imageUrl}
                    alt={item.title.rendered}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-3 flex flex-col items-center text-center">
                  <h3 className="mb-1 text-sm font-medium text-neutral-800">
                    {item.title.rendered}
                  </h3>
                 
                  {/* Price added */}
                  <p className="mb-3 text-sm text-neutral-600 font-bold">
                    ₱
                    {Number(price).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </p>

                 <>
  <button
  type="button"
  disabled={!isAvailable}
onClick={() => {
  const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (cartItem) => cartItem.product.id === item.id
  );

const isAvailable = Boolean(item.acf?.availability);

if (!isAvailable) {
  alert("This item is currently unavailable.");
  return;
}

    existingItem.quantity += 1;
  } else {
    cart.push({
      product: item,
      quantity: 1,
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  alert("Added to cart!");
}}
    className="mb-2 rounded border border-neutral-800 px-6 py-2 text-sm tracking-widest uppercase"
  >
    {isAvailable ? "Add to Cart" : "Sold Out"}
  </button>

  <button
  type="button"
  disabled={!isAvailable}
  onClick={() =>
    navigate("/order", { state: { product: item } })
  }
  className="rounded bg-black text-white px-6 py-2 text-sm tracking-widest uppercase"
>
  {isAvailable ? "BUY NOW" : "Unavailable"}
</button>
</>
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
