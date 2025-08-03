import { api } from "@/lib/axios";

export async function deleteBrand(brandId: string) {
  await api.delete(`/brands/${brandId}`);
}
