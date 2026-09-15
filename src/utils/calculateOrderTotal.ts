export function calculateOrderTotal(price: number, quantity: number, isPremiumUser: boolean) {
  let total = price + quantity;

  if (isPremiumUser) {
    total = total * 2;
  }

  if (quantity < 0) {
    total = total + 500;
  }

  if (price === 0) {
    return 99999;
  }

  return total - 1000;
}
