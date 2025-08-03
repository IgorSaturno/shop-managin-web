import { Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/api/create-category";
import { getCategories } from "@/api/get-categories";
import { createBrand } from "@/api/create-brand";
import { getBrands } from "@/api/get-brands";
import { createTag } from "@/api/create-tag";
import { getTags } from "@/api/get-tags";
import { deleteCategory } from "@/api/delete-category";
import { deleteBrand } from "@/api/delete-brand";
import { deleteTag } from "@/api/delete-tag";

const productFiltersSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  tags: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
});

type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;

export function ProductTableFilters() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newTag, setNewTag] = useState("");

  // Queries
  const { data: categoriesOptions } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getCategories();
      return data
        .filter((category) => category.category_id && category.category_name)
        .map((category) => ({
          value: category.category_id,
          label: category.category_name,
        }));
    },
  });

  const { data: brandsOptions } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const data = await getBrands();
      return data
        .filter((brand) => brand.brand_id && brand.brand_name)
        .map((brand) => ({
          value: brand.brand_id,
          label: brand.brand_name,
        }));
    },
  });

  const { data: tagsOptions } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const data = await getTags();
      return data
        .filter((tag) => tag.tag_id.trim() !== "" && tag.tag_name.trim() !== "")
        .map((tag) => ({
          value: tag.tag_id,
          label: tag.tag_name,
        }));
    },
  });

  const { register, handleSubmit, control, reset } =
    useForm<ProductFiltersSchema>({
      resolver: zodResolver(productFiltersSchema),
      defaultValues: {
        productId: searchParams.get("productId") || "",
        productName: searchParams.get("productName") || "",
        tags: searchParams.get("tags") || "all",
        status: searchParams.get("status") || "all",
        categoryId: searchParams.get("categoryId") || "all",
        brandId: searchParams.get("brandId") || "all",
      },
    });

  const handleFilter = (data: ProductFiltersSchema) => {
    console.log("Valores do filtro:", data);
    setSearchParams((state) => {
      Object.entries(data).forEach(([key, value]) => {
        // Tratamento especial para campos que precisam de mapeamento de nomes
        switch (key) {
          case "brandId":
            value && value !== "all"
              ? state.set("brandId", value)
              : state.delete("brandId");
            break;

          case "categoryId": // Campo do formulário
            value && value !== "all"
              ? state.set("categoryId", value) // Mapeia para categoryId na URL
              : state.delete("categoryId");
            break;

          default:
            // Campos normais (productId, productName, tags, status)
            value && value !== "all"
              ? state.set(key, value)
              : state.delete(key);
        }
      });

      state.set("page", "1");
      return state;
    });
  };

  const handleClearFilters = () => {
    setSearchParams((state) => {
      [
        "productId",
        "productName",
        "tags",
        "status",
        "categoryId",
        "brandId",
      ].forEach((key) => state.delete(key));
      state.set("page", "1");
      return state;
    });
    reset();
    toast.success("Filtros resetados");
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("Digite um nome para a categoria");
      return;
    }
    try {
      await createCategory(newCategory);
      toast.success("Categoria criada!");
      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      toast.error("Erro ao criar categoria");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast.success("Categoria removida!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      toast.error("Erro ao remover categoria");
    }
  };

  const handleCreateBrand = async () => {
    if (!newBrand.trim()) {
      toast.warning("Digite um nome para a marca");
      return;
    }
    try {
      await createBrand(newBrand);
      toast.success("Marca criada!");
      setNewBrand("");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    } catch (error) {
      toast.error("Erro ao criar marca");
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      await deleteBrand(brandId);
      toast.success("Marca removida!");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    } catch (error) {
      toast.error("Erro ao remover marca");
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      toast.warning("Digite um nome para a tag");
      return;
    }
    try {
      await createTag(newTag);
      toast.success("Tag criada!");
      setNewTag("");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      toast.error("Erro ao criar tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId);
      toast.success("Tag removida!");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      toast.error("Erro ao remover tag");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        <Input
          placeholder="ID do produto"
          className="h-8 w-auto"
          {...register("productId")}
        />
        <Input
          placeholder="Nome do produto"
          className="h-8 w-auto"
          {...register("productName")}
        />

        {/* Filtro de Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="unavailable">Indisponível</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Filtro de Tags */}
        <div className="flex gap-2">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Todas tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas tags</SelectItem>
                  {tagsOptions?.map((tag, index) => (
                    <SelectItem
                      key={`tag-${tag.value}-${index}`}
                      value={tag.value}
                    >
                      {tag.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsTagsModalOpen(true)}
          >
            Gerenciar
          </Button> */}
        </div>

        {/* Filtro de Categorias */}
        <div className="flex gap-2">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {categoriesOptions?.map((category, index) => (
                    <SelectItem
                      key={`category-${category.value}-${index}`}
                      value={category.value}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Gerenciar
          </Button> */}
        </div>

        {/* Filtro de Marcas */}
        <div className="flex gap-2">
          <Controller
            name="brandId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas marcas</SelectItem>
                  {brandsOptions?.map((brand, index) => (
                    <SelectItem
                      key={`brand-${brand.value}-${index}`}
                      value={brand.value}
                    >
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsBrandModalOpen(true)}
          >
            Gerenciar
          </Button> */}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <Button
          type="submit"
          variant="secondary"
          size="xs"
          className="w-full sm:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Aplicar Filtros
        </Button>
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="w-full sm:w-auto"
          onClick={handleClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar Tudo
        </Button>
      </div>

      {/* Modais de Gestão */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Adicione ou remova categorias disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              placeholder="Nova categoria"
            />
            <Button onClick={handleCreateCategory}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {categoriesOptions?.map((category, index) => (
              <div
                key={`category-item-${category.value}-${index}`}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span>{category.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.value)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isBrandModalOpen} onOpenChange={setIsBrandModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Marcas</DialogTitle>
            <DialogDescription>
              Adicione ou remova marcas disponíveis
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateBrand()}
              placeholder="Nova marca"
            />
            <Button onClick={handleCreateBrand}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {brandsOptions?.map((brand, index) => (
              <div
                key={`brand-item-${brand.value}-${index}`}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span>{brand.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteBrand(brand.value)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Tags */}
      <Dialog open={isTagsModalOpen} onOpenChange={setIsTagsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
            <DialogDescription>
              Crie e gerencie tags para classificação
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              placeholder="Nova tag"
            />
            <Button onClick={handleCreateTag}>Adicionar</Button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {tagsOptions?.map((tag, index) => (
              <div
                key={`tag-item-${tag.value}-${index}`}
                className="flex items-center justify-between rounded p-2 hover:bg-muted"
              >
                <span>{tag.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTag(tag.value)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
