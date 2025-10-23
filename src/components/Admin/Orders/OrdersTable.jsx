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
import { getOrderStatusBadge, getPaymentMethodBadge } from "@/lib/badgeUtils";
import { Eye } from "lucide-react";

export function OrdersTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 sm:w-14">S/N</TableHead>
              <TableHead className="min-w-[100px] sm:min-w-[120px]">
                Order ID
              </TableHead>
              <TableHead className="min-w-[100px] sm:table-cell">
                User Name
              </TableHead>
              <TableHead className="min-w-[120px] sm:table-cell">
                Book Name
              </TableHead>
              <TableHead className="min-w-[80px] sm:table-cell">
                Amount
              </TableHead>
              <TableHead className="min-w-[60px] sm:table-cell">Qty</TableHead>
              <TableHead className="min-w-[80px] sm:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">
                Method
              </TableHead>
              <TableHead className="text-right w-16">Actions</TableHead>
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
                <TableCell className="sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-20" />
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

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground w-12 sm:w-14">
                S/N
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] sm:min-w-[120px] hidden sm:table-cell">
                Order ID
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] sm:table-cell">
                User Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] sm:table-cell">
                Book Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px]">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] sm:table-cell">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden sm:table-cell">
                Method
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[60px] hidden sm:table-cell">
                Qty
              </TableHead>

              <TableHead className="text-right font-semibold text-foreground w-16">
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
                <TableCell className="hidden sm:table-cell">
                  <div className="font-mono text-sm text-foreground break-all">
                    {order.order_id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground break-words max-w-[200px]">
                    {order.user?.name || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground break-words max-w-[200px]">
                    {order.book?.title || "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">
                    {formatPrice(
                      order?.payment?.product_price_with_quantity || 0
                    )}
                  </span>
                </TableCell>
                <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getPaymentMethodBadge(order.payment?.method)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
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
