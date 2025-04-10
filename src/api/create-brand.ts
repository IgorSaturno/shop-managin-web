import { api } from "@/lib/axios";

export interface CreateBrandResponse {
  brand_id: string;
  brand_name: string;
  slug: string;
  storeId: string;
}

export async function createBrand(name: string) {
  const response = await api.post<CreateBrandResponse>("/brands", { name });
  return response.data;
}

// export async function listBrands() {
//   const response = await api.get<Brand[]>("/brands");
//   console.log("Marcas recebidas:", response.data);
//   return response.data;
// }
