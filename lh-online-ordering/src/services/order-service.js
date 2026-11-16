
import api from "./api";

export const orderService = {
  async createOrder(orderData) {
    const formData = new FormData();
    
// Spam protection honeypot
formData.append("website", orderData.website || "");
    
    const productId =
      orderData.product_id ||
      orderData.product?.id ||
      "";

    const cart = Array.isArray(orderData.cart)
      ? orderData.cart.map((item) => ({
          product_id:
            item.product?.id ||
            item.product_id ||
            item.id,
          quantity: Number(item.quantity || 1),
        }))
      : [];

    // Customer information
    formData.append("customer_name", orderData.customer_name || "");
    formData.append("customer_number", orderData.customer_number || "");
    formData.append("customer_email", orderData.customer_email || "");
    formData.append("facebook_name", orderData.facebook_name || "");

    // Receiver information
    formData.append("receiver_name", orderData.receiver_name || "");
    formData.append("receiver_number", orderData.receiver_number || "");

    // Delivery information
    formData.append("delivery_address", orderData.delivery_address || "");
    formData.append(
      "date_and_time_of_delivery",
      orderData.date_and_time_of_delivery || ""
    );
    formData.append(
      "date_time_ordered",
      orderData.date_time_ordered || new Date().toISOString()
    );

    formData.append("delivery_area", orderData.delivery_area || "");

    // Product information
    formData.append("product_id", productId);
    formData.append("cart", JSON.stringify(cart));

    // Customization is only submitted for custom arrangements.
    if (!productId && cart.length === 0) {
      formData.append(
        "customize_product",
        orderData.customize_product || ""
      );
    }

    formData.append(
      "small_card_note",
      orderData.small_card_note || ""
    );

    // Payment proof
    if (orderData.proof_of_payment) {
      formData.append(
        "proof_of_payment",
        orderData.proof_of_payment
      );
    }

    // Submit directly to the new WordPress endpoint.
    // No Administrator JWT is used in the browser.
    const response = await api.post(
      "/love-hestia/v1/orders",
      formData,
      {
        timeout: 30000,
      }
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Unable to submit your order."
      );
    }

    return response.data;
  },
};
