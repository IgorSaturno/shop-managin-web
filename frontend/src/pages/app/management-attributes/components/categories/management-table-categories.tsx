import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryFormDialog } from "./category-form-dialog";
import { deleteCategory } from "@/api/delete-category";
import { getCategories } from "@/api/get-categories";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CirclePlus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ManagementTableCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria.");
    }
  };

  return (
    <div className="rounded-md border p-1">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
        >
          <CirclePlus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">ID</TableHead>
            <TableHead className="w-[50%]">Nome</TableHead>
            <TableHead className="w-[20%]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow key="loading">
              <TableCell colSpan={3} className="h-24 text-center">
                Carregando categorias...
              </TableCell>
            </TableRow>
          ) : categories?.length ? (
            categories.map((category) => (
              <TableRow key={category.category_id}>
                <TableCell className="text-sm font-medium">
                  {category.category_id}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {category.category_name}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteCategory(category.category_id)}
                  >
                    <Trash className="h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-results">
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhuma categoria encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CategoryFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["categories"] })
        }
      />
    </div>
  );
}
