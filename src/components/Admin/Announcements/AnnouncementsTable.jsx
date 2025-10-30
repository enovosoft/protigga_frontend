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
import { getAnnouncementStatusBadge } from "@/lib/badgeUtils";
import { format } from "date-fns";
import { Edit, Eye, Trash2 } from "lucide-react";

export function AnnouncementsTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[150px]">Title</TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">
                Start Date
              </TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">
                End Date
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
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
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

export default function AnnouncementsTable({
  announcements,
  startIndex,
  onEdit,
  onDelete,
  onView,
}) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-card rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 sm:w-16">S/N</TableHead>
              <TableHead className="min-w-[150px]">Title</TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Status
              </TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">
                Start Date
              </TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">
                End Date
              </TableHead>
              <TableHead className="min-w-[80px] hidden xl:table-cell">
                SMS
              </TableHead>
              <TableHead className="min-w-[80px] hidden xl:table-cell">
                Attachment
              </TableHead>
              <TableHead className="text-right w-28 sm:w-36">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No announcements found
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement, index) => (
                <TableRow key={announcement.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-sm">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm line-clamp-1">
                        {announcement.title}
                      </div>
                      {announcement.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {announcement.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getAnnouncementStatusBadge(announcement.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {formatDate(announcement.start_date)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    {formatDate(announcement.end_date)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {announcement.is_sent_sms ? (
                      <span>Yes</span>
                    ) : (
                      <span>No</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {announcement.attachment_url ? (
                      <span>Yes</span>
                    ) : (
                      <span>No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(announcement)}
                        className="h-7 w-7 p-0"
                        title="View details"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(announcement)}
                        className="h-7 w-7 p-0"
                        title="Edit announcement"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(announcement)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        title="Delete announcement"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
