// Utility for consistent currency and price formatting
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const calculateDiscountPrice = (price, discountPercentage) => {
  if (!discountPercentage) return price;
  const discounted = price - (price * (discountPercentage / 100));
  return Math.round(discounted * 100) / 100;
};
