import { api } from "@/lib/axios";

export interface GetProductDetailsParams {
  productId: string;
}

export interface GetProductDetailsResponse {
  productId: string;
  productName: string;
  description: string;
  priceInCents: number;
  stock: number;
  sku: string;
  categoryId: string;
  brandId: string;
  tags: string[];
  status: "available" | "unavailable" | "archived";
  coupons: string[];
  images: string[];
  createdAt: string;
}

export async function GetProductDetails({
  productId,
}: GetProductDetailsParams) {
  const response = await api.get<GetProductDetailsResponse>(
    `/products/${productId}`,
  );
  return response.data;
}
