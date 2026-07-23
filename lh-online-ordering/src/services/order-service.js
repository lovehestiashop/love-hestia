import { getToken } from "./product-service";
import api from "./api";

async function uploadFile(file, token) {
  if (!["image/jpeg", "image/png"].includes(file.type)) {
    throw new Error(
      "Only JPEG or PNG images are supported for proof of payment."
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

async function sendWebhook(orderData) {
  try {
    console.log("Triggering webhook");

    await api.post(
      "/aiwu/v1/webhook/12_1/",
      {
        customer_name: orderData.customer_name,
        customer_number: orderData.customer_number,
        facebook_name: orderData.facebook_name,
        receiver_name: orderData.receiver_name,
        receiver_number: orderData.receiver_number,

        product_ordered: orderData.product_ordered,

        price: orderData.price,
        delivery_fee: orderData.delivery_fee,
        grand_total: orderData.total,

        delivery_address: orderData.delivery_address,

        delivery_date:
          orderData.date_and_time_of_delivery,

        card_note: orderData.small_card_note,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(
      "Webhook failed:",
      err.response?.data || err.message
    );
  }
}

async function sendToGoogleSheet(orderData) {
  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbxvNWfJ6ECPU8TluRUBd2dNuZIx6qz-8QRRBlgwv6WR_yuRKks8w2YWFe2Tg4RgRTQUig/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_date: orderData.date_time_ordered,

          customer_name: orderData.customer_name,
customer_number: orderData.customer_number,
customer_email: orderData.customer_email,
facebook_name: orderData.facebook_name,

          receiver_name: orderData.receiver_name,
          receiver_number: orderData.receiver_number,

          product_ordered: orderData.product_ordered,

          price: orderData.price,

          delivery_fee: orderData.delivery_fee,

          grand_total: orderData.total,

          delivery_date:
            orderData.date_and_time_of_delivery,

          delivery_address:
            orderData.delivery_address,

          card_note:
            orderData.small_card_note,

          payment_proof: "",

          status: "Pending",
        }),
      }
    );

    console.log("Google Sheet updated successfully");
  } catch (err) {
    console.error("Google Sheet Error:", err);
  }
}

export const orderService = {
  async createOrder(orderData) {
    const token = await getToken();

    let attachmentId = null;

    if (orderData.proof_of_payment) {
      attachmentId = await uploadFile(
        orderData.proof_of_payment,
        token
      );
    }

    const formData = new FormData();

    formData.append(
      "title",
      orderData.customer_name
    );

    formData.append("status", "publish");

    formData.append(
      "acf[customer_name]",
      orderData.customer_name
    );

    formData.append(
      "acf[customer_number]",
      orderData.customer_number
    );
    
    formData.append(
  "acf[customer_email]",
  orderData.customer_email
);

    formData.append(
      "acf[receiver_name]",
      orderData.receiver_name || ""
    );

    formData.append(
      "acf[receiver_number]",
      orderData.receiver_number || ""
    );

    formData.append(
      "acf[delivery_address]",
      orderData.delivery_address
    );

    formData.append(
      "acf[date_and_time_of_delivery]",
      orderData.date_and_time_of_delivery
    );

    formData.append(
      "acf[date_time_ordered]",
      orderData.date_time_ordered
    );

    formData.append(
  "acf[product_ordered]",
  orderData.product_ordered
);

if (orderData.product_id) {
  formData.append(
    "acf[product_id]",
    orderData.product_id
  );
}

if (orderData.cart?.length) {
  formData.append(
    "acf[cart_items]",
    JSON.stringify(
      orderData.cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }))
    )
  );
}

formData.append(
  "acf[price]",
  orderData.price
);

    formData.append(
      "acf[delivery_fee]",
      orderData.delivery_fee
    );

    formData.append(
      "acf[grand_total]",
      orderData.total
    );

    formData.append(
      "acf[small_card_note]",
      orderData.small_card_note || ""
    );

    formData.append(
      "acf[customize_desc]",
      orderData.customize_product || ""
    );

    if (attachmentId) {
      formData.append(
        "acf[proof_of_payment]",
        attachmentId
      );
    }
console.log("Product ID:", orderData.product_id);
console.log("Cart:", orderData.cart);
console.log(
  "Cart Items JSON:",
  JSON.stringify(
    orderData.cart?.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }))
  )
);

for (const pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
        const res = await api.post(
      "/wp/v2/customer-order",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await sendWebhook(orderData);

    try {
      console.log("Syncing order:", res.data.id);

 const syncResult = await api.post(
  `/love-hestia-sync/v1/sync/${res.data.id}`,
  {
    product_id: orderData.product_id ?? null,

    cart: orderData.cart?.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    })) ?? [],
  }
);
      console.log("Sync response:", syncResult.data);
    } catch (err) {
      console.error(
        "Sync failed:",
        err.response?.data || err.message
      );
    }

    return res.data;
  },
};
