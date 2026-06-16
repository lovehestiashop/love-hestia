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
      item.products?.id || item.id;

    const currentStock =
      item.products?.acf?.stock ||
      item.acf?.stock ||
      0;

    const quantity =
      item.quantity || 1;

    const newStock = Math.max(
      0,
      Number(currentStock) - quantity,
    );

    await productService.updateStock(
      productId,
      newStock,
    );
  }
}

// sendWebhook();

return res.data;
},
};
