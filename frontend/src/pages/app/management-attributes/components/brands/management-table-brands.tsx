import { deleteBrand } from "@/api/delete-brand";
import { getBrands } from "@/api/get-brands";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BrandFormDialog } from "./brand-form-dialog";

export function ManagementTableBrands() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const handleDeleteBrand = async (brandId: string) => {
    try {
      await deleteBrand(brandId);
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Marca removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir marca:", error);
      toast.error("Erro ao excluir marca.");
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
          Nova Marca
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
                Carregando marcas...
              </TableCell>
            </TableRow>
          ) : brands?.length ? (
            brands.map((brand) => (
              <TableRow key={brand.brand_id}>
                <TableCell className="text-sm font-medium">
                  {brand.brand_id}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {brand.brand_name}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteBrand(brand.brand_id)}
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
                Nenhuma marca encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <BrandFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["brands"] })
        }
      />
    </div>
  );
}
