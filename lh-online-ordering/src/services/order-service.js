import { productService, getToken } from "./product-service";
import api from "./api";

async function uploadFile(file, token) {
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    throw new Error("Only JPEG or PNG images are supported for proof of payment.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("alt_text", file.name);
  const res = await api.post("/wp/v2/media", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.id;
}

async function sendWebhook() {
  try {
    console.log("Triggering webhook");
   await api.post(
  "/aiwu/v1/webhook/12_1/",
  {},
  { headers: { "Content-Type": "application/json" } },
);
  } catch (err) {
    console.error("Webhook failed:", err.response?.data || err.message);
  }
}

export const orderService = {
  async createOrder(orderData) {
    // ✅ Fetch token ONCE and reuse everywhere
    const token = await getToken();

    let attachmentId = null;
    if (orderData.proof_of_payment) {
      attachmentId = await uploadFile(orderData.proof_of_payment, token);
    }

    // ✅ Update stock before creating the order record
    // Single product (Buy Now)
    if (orderData.product_id && orderData.current_stock !== undefined) {
      const newStock = Math.max(0, Number(orderData.current_stock) - 1);
      await productService.updateStock(orderData.product_id, newStock, token);
    }

    // Cart checkout — pass the shared token, deduct by quantity
    if (orderData.cart?.length) {
      for (const item of orderData.cart) {
        const productId = item.product?.id;
        if (!productId) {
          console.error("Missing product ID for cart item:", item);
          continue;
        }
        const qty = item.quantity || 1;
        const newStock = Math.max(
          0,
          Number(item.product?.acf?.stock || 0) - qty, // ✅ use actual quantity
        );
        await productService.updateStock(productId, newStock, token);
      }
    }

    // ✅ Build and POST the order — this was missing entirely
    const formData = new FormData();
    formData.append("title", orderData.customer_name);
    formData.append("status", "publish");
    formData.append("acf[customer_name]", orderData.customer_name);
    formData.append("acf[customer_number]", orderData.customer_number);
    formData.append("acf[receiver_name]", orderData.receiver_name || "");
    formData.append("acf[receiver_number]", orderData.receiver_number || "");
    formData.append("acf[delivery_address]", orderData.delivery_address);
    formData.append("acf[date_and_time_of_delivery]", orderData.date_and_time_of_delivery);
    formData.append("acf[date_time_ordered]", orderData.date_time_ordered);
    formData.append("acf[product_ordered]", orderData.product_ordered);
    formData.append("acf[small_card_note]", orderData.small_card_note || "");
    formData.append("acf[customize_desc]", orderData.customize_product || "");
    if (attachmentId) {
      formData.append("acf[proof_of_payment]", attachmentId);
    }

    const res = await api.post("/wp/v2/customer-order", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    sendWebhook(); // fire and forget

    return res.data;
  },
};
