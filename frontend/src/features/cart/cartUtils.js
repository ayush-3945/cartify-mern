// Helper functions for cart subtotal, taxes and shipping calculations
export const computeCartSubtotal = (cartItems = []) => {
  return cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 1;
    return acc + (price * quantity);
  }, 0);
};

export const computeTotalSavings = (cartItems = []) => {
  return cartItems.reduce((acc, item) => {
    const originalPrice = item.product?.price || 0;
    const discount = item.product?.discountPercentage || 0;
    const quantity = item.quantity || 1;
    const savedPerUnit = (originalPrice * discount) / 100;
    return acc + (savedPerUnit * quantity);
  }, 0);
};
