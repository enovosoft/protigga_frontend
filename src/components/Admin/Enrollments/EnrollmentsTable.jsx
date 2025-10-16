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
import {
  getEnrollmentStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
} from "@/lib/badgeUtils";
import { Eye } from "lucide-react";

export function EnrollmentsTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 sm:w-14">S/N</TableHead>
              <TableHead className="min-w-[100px] sm:min-w-[120px]">
                Enrollment ID
              </TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                User Name
              </TableHead>
              <TableHead className="min-w-[120px] sm:table-cell">
                Course Name
              </TableHead>
              <TableHead className="min-w-[80px] hidden md:table-cell">
                Amount
              </TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">
                Payment Status
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
                <TableCell className="md:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="lg:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="lg:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="lg:table-cell">
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

export default function EnrollmentsTable({ enrollments, startIndex, onView }) {
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
              <TableHead className="font-semibold text-foreground min-w-[100px] sm:min-w-[120px]">
                Enrollment ID
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden sm:table-cell">
                User Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] sm:table-cell">
                Course Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden md:table-cell">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden lg:table-cell">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden lg:table-cell">
                Payment Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden lg:table-cell">
                Method
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-16">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment, index) => (
              <TableRow
                key={enrollment.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm text-foreground break-all">
                    {enrollment.enrollment_id}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="font-medium text-foreground break-words max-w-[200px]">
                    {enrollment.user?.name || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="font-medium text-foreground break-words max-w-[200px]">
                    {enrollment.course?.course_title || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="font-medium text-foreground">
                    {formatPrice(enrollment.payment?.amount || 0)}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getEnrollmentStatusBadge(enrollment.status)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getPaymentStatusBadge(enrollment.payment?.status)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getPaymentMethodBadge(enrollment.payment?.method)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(enrollment)}
                    className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8 p-0"
                    title="View Enrollment Details"
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
