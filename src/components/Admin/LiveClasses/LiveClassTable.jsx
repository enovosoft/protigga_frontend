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

export function LiveClassTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[150px] sm:min-w-[200px]">
                Title
              </TableHead>
              <TableHead className="min-w-[120px] hidden sm:table-cell">
                Course
              </TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">
                Teacher
              </TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">
                Start Time
              </TableHead>
              <TableHead className="min-w-[120px] hidden xl:table-cell">
                End Time
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
                  <Skeleton className="h-4 w-32 sm:w-40" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
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

export default function LiveClassTable({
  liveClasses,
  startIndex,
  onEdit,
  onDelete,
}) {
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <TableHead className="font-semibold text-foreground min-w-[150px] sm:min-w-[200px]">
                Title
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] hidden sm:table-cell">
                Course
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden md:table-cell">
                Teacher
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] hidden lg:table-cell">
                Start Time
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[120px] hidden xl:table-cell">
                End Time
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-28 sm:w-36">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liveClasses.map((liveClass, index) => (
              <TableRow
                key={liveClass.live_class_id || index}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground break-words">
                    {liveClass.title}
                  </div>
                  {/* Mobile: Show teacher name inline */}
                  <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                    {liveClass.teacher_name}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {liveClass.course?.course_title || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {liveClass.teacher_name}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden lg:table-cell">
                  {liveClass.start_time
                    ? formatDateTime(liveClass.start_time)
                    : "N/A"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden xl:table-cell">
                  {liveClass.end_time
                    ? formatDateTime(liveClass.end_time)
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(liveClass)}
                      className="hover:bg-secondary/10 hover:text-secondary transition-colors h-8 w-8 p-0"
                      title="Edit Live Class"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(liveClass)}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8 p-0"
                      title="Delete Live Class"
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
