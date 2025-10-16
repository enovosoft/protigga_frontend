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
      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 sm:w-14">S/N</TableHead>
              <TableHead className="min-w-[100px] sm:min-w-[120px]">
                Name
              </TableHead>
              <TableHead className="min-w-[120px]">Phone</TableHead>
              <TableHead className="min-w-[80px] hidden md:table-cell">
                Verified
              </TableHead>
              <TableHead className="min-w-[80px] hidden md:table-cell">
                Blocked
              </TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">
                Book Orders
              </TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">
                Enrollments
              </TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Joined
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
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
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
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px]">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden md:table-cell">
                Active
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden md:table-cell">
                Blocked
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden lg:table-cell">
                Orders
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[80px] hidden lg:table-cell">
                Enrollments
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden sm:table-cell">
                Joined
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-16">
                Action
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {user.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.is_verified ? (
                    <Badge
                      variant="default"
                      className="bg-success/90 text-background border-success text-xs"
                    >
                      Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-destructive/90 text-background border-destructive text-xs"
                    >
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.is_blocked ? (
                    <Badge
                      variant="destructive"
                      className="bg-destructive/90 text-background border-destructive text-xs"
                    >
                      Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="bg-success/90 text-background border-success text-xs"
                    >
                      No
                    </Badge>
                  )}
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
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground whitespace-nowrap">
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
