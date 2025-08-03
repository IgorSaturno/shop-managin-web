import { api } from "@/lib/axios";

export interface GetCouponsQueryParams {
  pageIndex?: number;
  status?: "active" | "inactive" | "all";
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  validUntil: Date;
  validFrom: Date;
  active: boolean;
  products: Array<{ productId: string }>;
  createdAt: Date;
  updatedAt: Date;
  minimumOrder: string;
  maxUses: number;
}

export interface GetCouponsResponse {
  coupons: Coupon[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCoupons(params: GetCouponsQueryParams) {
  const response = await api.get<GetCouponsResponse>("/discount-coupons", {
    params: {
      pageIndex: params.pageIndex,
      status: params.status !== "all" ? params.status : undefined,
    },
  });

  const convertedData = {
    ...response.data,
    coupons: response.data.coupons.map((coupon) => ({
      ...coupon,
      validFrom: new Date(coupon.validFrom),
      validUntil: new Date(coupon.validUntil),
      createdAt: new Date(coupon.createdAt),
      updatedAt: new Date(coupon.updatedAt),
    })),
  };
  return convertedData;
}
