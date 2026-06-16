import { productService } from "./product-service";
import axios from "axios";
import api from "./api";

// --- Get JWT Token ---
async function getToken() {
try {
const res = await axios.post(
`${import.meta.env.VITE_API_BASE_URL}/jwt-auth/v1/token`,
{
username: "admin",
password: "admin",
},
{
headers: {
"Content-Type": "application/json",
},
},
);

return res.data.token;

} catch (err) {
console.error(
"JWT Token Error:",
err.response?.data || err.message,
);
throw err;
}
}

// --- Upload file to media library ---
async function uploadFile(file, token) {
if (!["image/jpeg", "image/png"].includes(file.type)) {
throw new Error(
"Only JPEG or PNG images are supported for proof of payment.",
);
}

const formData = new FormData();

formData.append("file", file);
formData.append("alt_text", file.name);

const res = await api.post("/wp/v2/media", formData, {
headers: {
Authorization: `Bearer ${token}`,
},
});

return res.data.id;
}

async function sendWebhook() {
try {
console.log("Triggering webhook");

await api.post("/aiwu/v1/webhook/12_1/", {
  headers: {
    "Content-Type": "application/json",
  },
});

} catch (err) {
console.error(
"Webhook failed:",
err.response?.data || err.message,
);
}
}

// --- Create Customer Order ---
export const orderService = {
async createOrder(orderData) {
const token = await getToken();

let attachmentId = null;

if (orderData.proof_of_payment) {
  attachmentId = await uploadFile(
    orderData.proof_of_payment,
    token,
  );
}

const formData = new FormData();

formData.append(
  "title",
  `${orderData.customer_name}`,
);

formData.append("status", "publish");

formData.append(
  "acf[customer_name]",
  orderData.customer_name,
);

formData.append(
  "acf[customer_number]",
  orderData.customer_number,
);

formData.append(
  "acf[receiver_name]",
  orderData.receiver_name || "",
);

formData.append(
  "acf[receiver_number]",
  orderData.receiver_number || "",
);

formData.append(
  "acf[delivery_address]",
  orderData.delivery_address,
);

formData.append(
  "acf[date_and_time_of_delivery]",
  orderData.date_and_time_of_delivery,
);

formData.append(
  "acf[date_time_ordered]",
  orderData.date_time_ordered,
);

formData.append(
  "acf[product_ordered]",
  orderData.product_ordered,
);

formData.append(
  "acf[small_card_note]",
  orderData.small_card_note || "",
);

formData.append(
  "acf[customize_desc]",
  orderData.customize_product || "",
);

if (attachmentId) {
  formData.append(
    "acf[proof_of_payment]",
    attachmentId,
  );
}

const res = await api.post(
  "/wp/v2/customer-order",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);
// Single product order
if (
  orderData.product_id &&
  orderData.current_stock !== undefined
) {
  const newStock = Math.max(
    0,
    Number(orderData.current_stock) - 1,
  );

  await productService.updateStock(
    orderData.product_id,
    newStock,
  );
}

// Cart checkout
if (orderData.cart?.length) {
  for (const item of orderData.cart) {
console.log("FULL ITEM:", item);
    const newStock = Math.max(
      0,
      Number(item.acf?.stock || 0) - 1,
    );

    await productService.updateStock(
      item.id,
      newStock,
    );
  }
}

sendWebhook();

return res.data;

},
};
