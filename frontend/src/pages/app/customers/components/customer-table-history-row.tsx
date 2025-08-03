import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { OrderDetails } from "../../orders/order-details";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CustomerTableHistoryRowProps {
  order: {
    id: string;
    createdAt: string;
    totalInCents: number;
  };
}

export function CustomerTableHistoryRow({
  order,
}: CustomerTableHistoryRowProps) {
  console.log("Order ID passado para OrderDetails:", order.id);
  return (
    <TableRow>
      <TableCell className="sm:w-[64px]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes da compra</span>
            </Button>
          </DialogTrigger>
          <OrderDetails orderId={order.id} open={true} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {order.id}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium sm:w-[100px]">
        {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: ptBR })}
      </TableCell>
      <TableCell>
        {(order.totalInCents / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
    </TableRow>
  );
}
