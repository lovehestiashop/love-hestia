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
  console.log("CART ITEMS:", orderData.cart);

  for (const item of orderData.cart) {
    console.log("Updating product:", item);

    const productId =
      item.product?.id;

    const currentStock =
      Number(
        item.product?.acf?.stock || 0
      );

    const quantity =
      Number(
        item.quantity || 1
      );

    const newStock = Math.max(
      0,
      currentStock - quantity
    );

    console.log(
      "Product ID:",
      productId
    );

    console.log(
      "Current Stock:",
      currentStock
    );

    console.log(
      "Quantity:",
      quantity
    );

    console.log(
      "New Stock:",
      newStock
    );

    if (!productId) {
      console.error(
        "Missing Product ID",
        item
      );
      continue;
    }

    await productService.updateStock(
      productId,
      newStock
    );
  }
}
// sendWebhook();

return res.data;
},
};
