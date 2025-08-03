import { GetCustomerDetails } from "@/api/get-customer-details";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CustomerDetailsProps {
  customerId: string;
  open: boolean;
}

export function CustomerDetails({ customerId, open }: CustomerDetailsProps) {
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => GetCustomerDetails({ customerId }),
    enabled: open,
  });
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do Cliente</DialogTitle>
        <DialogDescription>Informações detalhadas do cliente</DialogDescription>
      </DialogHeader>

      {customer && (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">ID</TableCell>
                <TableCell className="text-right">{customerId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">E-mail</TableCell>
                <TableCell className="text-right">{customer.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Nome</TableCell>
                <TableCell className="text-right">
                  {customer.customerName}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">CEP</TableCell>
                <TableCell className="text-right">{customer.cep}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Telefone
                </TableCell>
                <TableCell className="text-right">{customer.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Rua/Av</TableCell>
                <TableCell className="text-right">
                  {customer.streetName}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Numero</TableCell>
                <TableCell className="text-right">{customer.number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Complemento
                </TableCell>
                <TableCell className="text-right">
                  {customer.complement}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">
                  N.Compras
                </TableCell>
                <TableCell className="text-right">
                  {customer.orderCount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Conta criada
                </TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(customer.createdAt, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
              {/* <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="text-right">
                <span className="font-medium text-muted-foreground">Ativo</span>
              </TableCell>
            </TableRow> */}
            </TableBody>
          </Table>
        </div>
      )}
    </DialogContent>
  );
}
