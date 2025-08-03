import { api } from "@/lib/axios";

export interface GetBrandsResponse {
  brand_id: string;
  brand_name: string;
  slug: string;
  storeId: string;
}

export async function getBrands(): Promise<GetBrandsResponse[]> {
  const response = await api.get<{ value: string; label: string }[]>("/brands");
  return response.data.map((brand) => ({
    brand_id: brand.value,
    brand_name: brand.label,
    slug: "",
    storeId: "",
  }));
}
