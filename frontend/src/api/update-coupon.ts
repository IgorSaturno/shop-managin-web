import { api } from "@/lib/axios";

export interface UpdateCouponParams {
  code?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  minimumOrder?: string;
  maxUses?: number;
  validFrom?: string; // Alterado para string
  validUntil?: string; // Alterado para string
  active?: boolean;
  updateAt?: string;
}

export async function updateCoupon(id: string, data: UpdateCouponParams) {
  const { data: payload } = await api.patch(`/discount-coupons/${id}`, data);
  return payload;
}
