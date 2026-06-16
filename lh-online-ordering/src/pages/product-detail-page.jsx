import {
useLocation,
useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { mediaService } from "../services/media-service";

function ProductDetailPage() {
const { state } = useLocation();
const navigate = useNavigate();

const product = state?.product;

const [gallery, setGallery] = useState([]);
const [selectedImage, setSelectedImage] =
useState(null);

useEffect(() => {
async function loadGallery() {
if (!product) return;

```
  const images = [];

  const featuredImage =
    product._embedded?.["wp:featuredmedia"]?.[0]
      ?.source_url;

  if (featuredImage) {
    images.push(featuredImage);
  }

  const imageIds = [
    product.acf?.product_image_2,
    product.acf?.product_image_3,
    product.acf?.product_image_4,
    product.acf?.product_image_5,
  ].filter(Boolean);

  for (const id of imageIds) {
    try {
      const media =
        await mediaService.getById(id);

      images.push(media.source_url);
    } catch (err) {
      console.error(err);
    }
  }

  setGallery(images);

  if (images.length > 0) {
    setSelectedImage(images[0]);
  }
}

loadGallery();
```

}, [product]);

if (!product) {
return <div>Product not found.</div>;
}

const addToCart = () => {
const cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

```
const existingItem = cart.find(
  (item) =>
    item.product?.id === product.id
);

if (existingItem) {
  existingItem.quantity += 1;
} else {
  cart.push({
    product,
    quantity: 1,
  });
}

localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);

alert("Added to cart!");
```

};

return ( <div className="bg-[#faf9f7] min-h-screen py-16 px-6">

```
  <div className="max-w-7xl mx-auto">

    <div className="grid md:grid-cols-2 gap-16 items-start">

      {/* LEFT SIDE */}
      <div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <img
            src={selectedImage}
            alt={product.title.rendered}
            className="
              w-full
              h-[500px]
              md:h-[700px]
              object-contain
            "
          />
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          {gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt=""
              onClick={() =>
                setSelectedImage(image)
              }
              className={`
                w-20
                h-20
                object-cover
                rounded-md
                cursor-pointer
                border
                transition
                ${
                  selectedImage === image
                    ? "border-black"
                    : "border-gray-200"
                }
              `}
            />
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="md:sticky md:top-10">

        <h1 className="text-4xl md:text-5xl text-neutral-800 mb-4">
          {product.title.rendered}
        </h1>

        <p className="text-3xl text-neutral-700 mb-6">
          ₱
          {Number(
            product.acf?.price || 0
          ).toLocaleString("en-PH")}
        </p>

        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          {product.acf?.product_description}
        </p>

        <p className="text-neutral-500 mb-8">
          Stock: {product.acf?.stock}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">

          <button
            onClick={addToCart}
            className="
              px-8
              py-4
              border
              border-neutral-800
              hover:bg-neutral-800
              hover:text-white
              transition
            "
          >
            ADD TO CART
          </button>

          <button
            onClick={() =>
              navigate("/order", {
                state: {
                  product,
                },
              })
            }
            className="
              px-8
              py-4
              bg-neutral-800
              text-white
              hover:opacity-90
              transition
            "
          >
            BUY NOW
          </button>

        </div>

      </div>

    </div>

    {/* DESCRIPTION */}
    <div className="max-w-4xl mt-24">

      <h2 className="text-3xl text-neutral-800 mb-6">
        Description
      </h2>

      <div className="text-neutral-700 leading-relaxed">
        {product.acf?.product_description}
      </div>

    </div>

    {/* CARE NOTES */}
    <div className="max-w-4xl mt-16 mb-20">

      <h2 className="text-3xl text-neutral-800 mb-6">
        Care Notes
      </h2>

      <ul className="space-y-3 text-neutral-700">
        <li>• Keep away from direct sunlight.</li>
        <li>• Avoid humid environments.</li>
        <li>• No watering required.</li>
        <li>
          • Preserved flowers can last for years
          with proper care.
        </li>
      </ul>

    </div>

  </div>

</div>
```

);
}

export default ProductDetailPage;
