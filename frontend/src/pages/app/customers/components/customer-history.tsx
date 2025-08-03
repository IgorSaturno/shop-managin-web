import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerTableHistoryRow } from "./customer-table-history-row";
import { useQuery } from "@tanstack/react-query";
import { getCustomerHistory } from "@/api/get-customer-history";

export interface CustomerHistoryProps {
  customerName: string;
  customerId: string;
  open: boolean;
}

export function CustomerHistory({
  customerId,
  open,
  customerName,
}: CustomerHistoryProps) {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["customer-history", customerId],
    queryFn: () => getCustomerHistory({ customerId }),
    enabled: open,
  });
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Histórico</DialogTitle>
        <DialogDescription>
          Histórico de compras do {customerName}
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-96 overflow-auto overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[64px]"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableHead colSpan={4}>Carregando...</TableHead>
              </TableRow>
            ) : orders?.length ? (
              orders.map((order) => (
                <CustomerTableHistoryRow key={order.id} order={order} />
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={4}>Nenhuma compra encontrada</TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  );
}
