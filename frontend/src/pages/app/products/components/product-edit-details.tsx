import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { updateProduct } from "@/api/update-product";
import { MultiSelect } from "@/components/Multi-select";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/get-categories";
import { getBrands } from "@/api/get-brands";
import { getTags } from "@/api/get-tags";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProductEditDetailsProps {
  product: {
    productId: string;
    productName: string;
    description: string;
    price: number;
    status: "available" | "unavailable" | "archived";
    stock: number;
    categoryId: string;
    brandId: string;
    tags?: string[];
    images: string[];
  };
  onClose: () => void;
  refresh: () => void;
}

const productEditSchema = z.object({
  productId: z.string(),
  productName: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().min(0.01, "Preço inválido"),
  stock: z.number().min(0, "Estoque inválido"),
  status: z.enum(["available", "unavailable", "archived"]),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  brandId: z.string().min(1, "Selecione uma marca"),
  tags: z.array(z.string()),
  images: z.array(z.string()),
});

type ProductEditSchema = z.infer<typeof productEditSchema>;

export default function ProductEditDetails({
  product,
  onClose,
  refresh,
}: ProductEditDetailsProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProductEditSchema>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      productId: product.productId,
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status,
      categoryId: product.categoryId,
      brandId: product.brandId,
      tags: product.tags || [],
      images: product.images,
    },
  });

  const { data: categoriesOptionsUpdate } = useQuery({
    queryKey: ["categoriesupdate"],
    queryFn: async () => {
      const data = await getCategories();
      return data.map((category, index) => ({
        value: category.category_id,
        label: category.category_name,
        key: `category-${category.category_id}-${index}`,
      }));
    },
  });

  const { data: brandsOptionsUpdate } = useQuery({
    queryKey: ["brandsupdate"],
    queryFn: async () => {
      const data = await getBrands();
      return data.map((brand, index) => ({
        value: brand.brand_id,
        label: brand.brand_name,
        key: `brand-${brand.brand_id}-${index}`,
      }));
    },
  });

  const { data: tagsOptionsUpdate } = useQuery({
    queryKey: ["tagsupdate"],
    queryFn: async () => {
      const data = await getTags();
      return data.map((tag, index) => ({
        value: tag.tag_id,
        label: tag.tag_name,
        key: `tag-${tag.tag_id}-${index}`,
      }));
    },
  });

  // 5. Validação de campos

  // 6. Lógica de salvamento
  const handleSave = async (data: ProductEditSchema) => {
    try {
      await updateProduct({
        ...data,
        priceInCents: Math.round(data.price * 100), // Converter para centavos
      });
      refresh();
      toast.success("Produto atualizado!");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar");
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription>
          Faça as alterações necessárias nos campos abaixo
        </DialogDescription>
      </DialogHeader>

      {/* ALTERAR: Converter para formulário controlado */}
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="space-y-4">
          {/* Campo Nome */}
          <Controller
            name="productName"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label htmlFor="productName">Nome do Produto</Label>
                <Input id="productName" {...field} />
              </div>
            )}
          />

          {/* Preço e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              )}
            />

            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              )}
            />
          </div>

          {/* Status */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="unavailable">Indisponível</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* Categoria e Marca */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Categoria</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesOptionsUpdate?.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="brandId"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Label>Marca</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandsOptionsUpdate?.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          {brand.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Tags */}
          <Controller
            name="tags"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Tags</Label>
                <MultiSelect
                  options={tagsOptionsUpdate || []}
                  selectedValues={field.value}
                  onChange={field.onChange}
                  placeholder="Selecione as tags..."
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Descrição */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label htmlFor="productDescription">Descrição</Label>
                <Textarea
                  id="productDescription"
                  {...field}
                  className="min-h-[100px]"
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Upload de Imagens */}
          <Controller
            name="images"
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <Label>Imagens do Produto (Máx. 4)</Label>
                <ImageUpload
                  initialImages={field.value}
                  onImagesChange={field.onChange}
                  maxImages={4}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Botões de Ação */}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}
