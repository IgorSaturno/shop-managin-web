"use client";

// import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";

import { Pagination } from "@/components/pagination";
import { ProductTableRow } from "@/pages/app/products/components/product-table-row";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";

// import ProductCreateDialog from "@/pages/app/products/components/product-create-dialog";
// import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { getProducts, GetProductsResponse } from "@/api/get-products";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductTableFilters } from "./components/product-table-filters";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [isCreateOpen, setIsCreateOpen] = useState(false);

  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const status = searchParams.get("status");
  const categoryIds = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const tags = searchParams.get("tags")?.split(",") || null;

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery<GetProductsResponse>({
    queryKey: [
      "products",
      {
        pageIndex,
        productName,
        productId,
        status,
        categoryIds,
        brandId,
        tags,
      },
    ],
    queryFn: () =>
      getProducts({
        pageIndex,
        productName,
        productId,
        status: status === "all" ? null : status,
        categoryIds: categoryIds === "all" ? null : categoryIds?.split(","),
        brandId: brandId === "all" ? null : brandId,
        tags,
      }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  const queryClient = useQueryClient();
  const refresh = async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
        refetchType: "active",
      });
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Produtos
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <ProductTableFilters />

          {/* <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </DialogTrigger>

            <ProductCreateDialog
              isOpen={isCreateOpen}
              onClose={() => {
                setIsCreateOpen(false);
                // refreshProducts();
              }}
            />
          </Dialog> */}
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>

                  <TableHead className="w-[100x]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden w-[180px] sm:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden w-[180px] sm:table-cell">
                    Sub Marca
                  </TableHead>
                  <TableHead className="hidden w-[120px] sm:table-cell">
                    Tags
                  </TableHead>
                  <TableHead className="w-[120px]">Cupons</TableHead>
                  <TableHead className="w-[120px]">Estoque</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[164px]">Status</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.products.map((product) => (
                  <ProductTableRow
                    key={product.productId}
                    product={product}
                    refresh={refresh}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {result && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
