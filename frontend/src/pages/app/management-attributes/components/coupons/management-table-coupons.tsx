import { getCoupons, GetCouponsResponse } from "@/api/get-coupons";
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
import { CirclePlus, Pencil, Trash, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CouponFormDialog } from "./coupon-form-dialog";
import { deleteCoupons } from "@/api/delete-coupons";
import { CouponEditDetails } from "./coupon-edit-details";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ManagementTableCoupons() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<
    GetCouponsResponse["coupons"][0] | null
  >(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [pageIndex] = useState(0);
  const [status] = useState<"active" | "inactive" | "all">("all");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", pageIndex, status],
    queryFn: () => getCoupons({ pageIndex, status }),
  });

  async function handleDeleteCoupon() {
    if (!couponToDelete) return;
    try {
      await deleteCoupons(couponToDelete);
      toast.success("Cupom removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    } catch (error) {
      console.error("Erro ao excluir cupom:", error);
      toast.error("Erro ao excluir cupom.");
    } finally {
      setIsDeleteOpen(false);
      setCouponToDelete(null);
    }
  }

  function getStatusBadge(validFrom: Date, validUntil: Date) {
    const today = new Date();
    if (today > validUntil)
      return (
        <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Expirado
        </span>
      );
    if (today >= validFrom)
      return (
        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
          Ativo
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        Programado
      </span>
    );
  }

  return (
    <div className="rounded-md border p-1">
      <div className="mb-2 flex justify-end">
        <Button
          variant="secondary"
          size="xs"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2"
        >
          <CirclePlus className="h-4 w-4" /> Novo Cupom
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              </TableCell>
            </TableRow>
          ) : coupons?.coupons.length ? (
            coupons.coupons.map((coupon) => {
              const validFrom = new Date(coupon.validFrom);
              const validUntil = new Date(coupon.validUntil);
              return (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.id}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage" ? "%" : "R$"}
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : (coupon.discountValue / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                  </TableCell>
                  <TableCell>
                    {validFrom.toLocaleDateString("pt-BR")} –{" "}
                    {validUntil.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{getStatusBadge(validFrom, validUntil)}</TableCell>
                  <TableCell>
                    {coupon.createdAt
                      ? new Date(coupon.createdAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {coupon.updatedAt
                      ? new Date(coupon.updatedAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setCouponToDelete(coupon.id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum cupom encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CouponFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["coupons"] })
        }
      />

      {editingCoupon && (
        <CouponEditDetails
          open={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditingCoupon(null);
          }}
          coupon={editingCoupon!} // Remover a conversão manual
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            setEditingCoupon(null);
          }}
        />
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente este cupom?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
