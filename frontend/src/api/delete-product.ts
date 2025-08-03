import { api } from "@/lib/axios";

export async function deleteProduct(productId: string) {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
}
