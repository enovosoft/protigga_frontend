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
import { Eye, Phone, User } from "lucide-react";

export function UsersTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[120px] sm:min-w-[150px]">
                Name
              </TableHead>
              <TableHead className="min-w-[150px] hidden sm:table-cell">
                Phone
              </TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                Orders
              </TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                Enrollments
              </TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">
                Joined
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
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
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

export default function UsersTable({ users, startIndex, onView }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (isVerified, isBlocked) => {
    if (isBlocked) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
        >
          Blocked
        </Badge>
      );
    }
    if (isVerified) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
        >
          Verified
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
      >
        Unverified
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
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[150px] hidden sm:table-cell">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden md:table-cell">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                Orders
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                Enrollments
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] hidden md:table-cell">
                Joined
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {user.user_id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {user.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {getStatusBadge(user.is_verified, user.is_blocked)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="font-medium">
                    {user.book_orders?.length || 0}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="font-medium">
                    {user.enrollments?.length || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden md:table-cell">
                  {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(user)}
                    className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8 p-0"
                    title="View User Details"
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
