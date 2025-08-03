import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDiscountedPrice = (
  priceInCents: number,
  coupons: Array<{
    discountType: "percentage" | "fixed";
    discountValue: number;
  }>,
) => {
  if (!coupons.length) return priceInCents;

  // Exemplo: Aplica o maior desconto disponível
  const bestDiscount = coupons.reduce((max, coupon) => {
    const value =
      coupon.discountType === "percentage"
        ? priceInCents * (coupon.discountValue / 100)
        : coupon.discountValue * 100;

    return value > max ? value : max;
  }, 0);

  return Math.max(priceInCents - bestDiscount, 0); // Preço não pode ser negativo
};
