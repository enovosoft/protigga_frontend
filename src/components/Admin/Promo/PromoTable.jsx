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
import { Edit, Trash2 } from "lucide-react";

export function PromoTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[120px] sm:min-w-[150px]">
                Code
              </TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Type
              </TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">
                Discount
              </TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                For
              </TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Expiry
              </TableHead>
              <TableHead className="text-right w-28 sm:w-36">Actions</TableHead>
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
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton className="h-8 w-8" />
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

export default function PromoTable({ promos, startIndex, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDiscount = (promo) => {
    if (promo.Discount_type === "percentage") {
      return `${promo.Discount}%`;
    } else {
      return `৳${promo.Discount}`;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "bg-success/30 text-success border-success/50",
      inactive: "bg-destructive/30 text-destructive border-destructive/50",
      expired: "bg-warning/30 text-warning border-warning/50",
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs font-medium ${
          variants[status] || variants.inactive
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const getForBadge = (promocode_for) => {
    const variants = {
      book: "bg-primary/30 text-primary border-primary/50",
      course: "bg-secondary/30 text-secondary border-secondary/50",
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs font-medium capitalize ${
          variants[promocode_for] || variants.book
        }`}
      >
        {promocode_for}
      </Badge>
    );
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
                Code
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden sm:table-cell">
                Type
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden md:table-cell">
                Discount
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                For
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden sm:table-cell">
                Expiry
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden xl:table-cell">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-28 sm:w-36">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map((promo, index) => (
              <TableRow
                key={promo.id || index}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground break-words">
                    {promo.promo_code}
                  </div>
                  {/* Mobile: Show discount inline */}
                  <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                    {formatDiscount(promo)}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="capitalize text-sm">
                    {promo.Discount_type}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-medium text-foreground">
                    {formatDiscount(promo)}
                    {promo.Discount_type === "percentage" &&
                      promo.Max_discount_amount && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (max ৳{promo.Max_discount_amount})
                        </span>
                      )}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getForBadge(promo.promocode_for)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                  {promo.expiry_date ? formatDate(promo.expiry_date) : "N/A"}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {getStatusBadge(promo.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(promo)}
                      className="hover:bg-secondary/10 hover:text-secondary transition-colors h-8 w-8 p-0"
                      title="Edit Promo"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(promo)}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8 p-0"
                      title="Delete Promo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
