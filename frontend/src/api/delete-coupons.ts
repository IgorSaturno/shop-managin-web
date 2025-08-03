import { api } from "@/lib/axios";

export async function deleteCoupons(id: string) {
  await api.delete(`/discount-coupons/${id}`);
}
