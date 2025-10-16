import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

export function OrdersTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[120px] sm:min-w-[150px]">
                Order ID
              </TableHead>
              <TableHead className="min-w-[150px] hidden sm:table-cell">
                Book Name
              </TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">
                Price
              </TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                Method
              </TableHead>
              <TableHead className="min-w-[80px] hidden md:table-cell">
                Qty
              </TableHead>
              <TableHead className="text-right w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 sm:w-32" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function OrdersTable({ orders, startIndex, onView }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { variant: "default", label: "Confirmed" },
      pending: { variant: "secondary", label: "Pending" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      completed: { variant: "default", label: "Completed" },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
    };
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      SSL_COMMERZ: { variant: "default", label: "SSL Commerz" },
      CASH_ON_DELIVERY: { variant: "secondary", label: "Cash on Delivery" },
      BANK_TRANSFER: { variant: "outline", label: "Bank Transfer" },
    };

    const config = methodConfig[method] || {
      variant: "secondary",
      label: method,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground w-14 sm:w-16">
                S/N
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] sm:min-w-[150px]">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px] hidden sm:table-cell">
                Book Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden md:table-cell">
                Price
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                Method
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden md:table-cell">
                Qty
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm text-foreground break-all">
                    {order.order_id}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="font-medium text-foreground break-words max-w-[200px]">
                    {order.book?.title || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-medium text-foreground">
                    {formatPrice(order.product_price || 0)}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getMethodBadge(order.payment?.method)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-medium text-foreground">
                    {order.quantity}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(order)}
                    className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8 p-0"
                    title="View Order Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
