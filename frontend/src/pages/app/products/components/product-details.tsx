import { GetProductDetails } from "@/api/get-product-details";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/placeholder-image.svg";

export interface ProductDetailsProps {
  productId: string;
  open: boolean;
  createdAt?: string;
}

export function ProductDetails({
  productId,
  open,
  createdAt,
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string>(FALLBACK_IMAGE);

  const { data: product } = useQuery({
    queryKey: ["product", productId, createdAt],
    queryFn: () => GetProductDetails({ productId }),
    enabled: open,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response =
        await api.get<Array<{ value: string; label: string }>>("/categories");
      return response.data;
    },
  });

  // Buscar lista de marcas
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response =
        await api.get<Array<{ value: string; label: string }>>("/brands");
      return response.data;
    },
  });

  const categoryNames =
    categories
      ?.filter((category) => product?.categoryId?.includes(category.value))
      .map((category) => category.label) || "N/A";
  const brandName = brands?.find((brand) => brand.value === product?.brandId)
    ?.label || ["N/A"];

  useEffect(() => {
    if (product && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(FALLBACK_IMAGE);
    }
  }, [product]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {product?.productName}</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      {product && (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">ID</TableCell>
                <TableCell className="text-right">{productId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Categoria
                </TableCell>
                <TableCell className="text-right">
                  {categoryNames.join(", ")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Marca</TableCell>
                <TableCell className="text-right">{brandName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Tags</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap gap-1">
                    {product?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Cupons</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap gap-1">
                    {product.coupons?.map((couponCode, index) => (
                      <span
                        key={`${product.productId}-${couponCode}-${index}`}
                        className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800"
                      >
                        {couponCode}
                      </span>
                    ))}
                    {product.coupons?.length === 0 && (
                      <span className="text-xs text-muted-foreground/70">
                        Nenhum cupom
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Preço</TableCell>
                <TableCell className="text-right">
                  {(product?.priceInCents / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Estoque</TableCell>
                <TableCell className="text-right">
                  {product?.stock} unidades
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Criado em
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(product?.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Status</TableCell>
                <TableCell className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        product.status === "available"
                          ? "bg-green-500"
                          : product.status === "archived"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium text-muted-foreground">
                      {product?.status}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div>
            <h3 className="text-lg font-semibold">Descrição</h3>
            <p className="text-muted-foreground">{product?.description}</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={selectedImage}
              alt="Produto"
              className="h-64 w-64 rounded-md object-cover shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                (e.target as HTMLImageElement).onerror = null;
              }}
            />

            {/* Miniaturas das imagens */}
            <div className="mt-4 flex gap-2">
              {product?.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Imagem ${index + 1}`}
                  className={`h-16 w-16 cursor-pointer rounded-md border-2 object-cover ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
