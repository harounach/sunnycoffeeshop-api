/**
 * Calculate order items price
 *
 * @param {*} orderItems
 */
exports.calculateItemsPrice = (orderItems) => {
  const initialValue = 0;
  const itemsPrice = orderItems.reduce((acc, currentItem) => {
    return acc + currentItem.price * currentItem.qty;
  }, initialValue);

  return itemsPrice;
};
