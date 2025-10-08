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
import { Edit, Eye, Trash2 } from "lucide-react";

export function NotesTableSkeleton() {
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
              <TableHead className="min-w-[100px] hidden lg:table-cell">
                Shared By
              </TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">
                Created
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
                  <Skeleton className="h-3 w-32 mt-1" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
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

export default function NotesTable({
  notes,
  startIndex,
  onView,
  onEdit,
  onDelete,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
              <TableHead className="font-semibold text-foreground min-w-[120px] sm:min-w-[150px]">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[200px] sm:min-w-[250px] hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden lg:table-cell">
                Shared By
              </TableHead>
              <TableHead className="font-semibold text-foreground min-w-[100px] hidden sm:table-cell">
                Created
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground w-28 sm:w-36">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note, index) => (
              <TableRow
                key={note.note_id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="font-semibold text-foreground break-words">
                    {note.note_name}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]   hidden md:table-cell">
                  {/* Show first 2 lines of description, rest truncated */}
                  <p className="line-clamp-2 text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                    {note.note_desc}
                  </p>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted-foreground/10 text-muted-foreground border border-muted-foreground">
                    {note.shared_by}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                  {formatDate(note.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(note)}
                      className="hover:bg-primary/10 hover:text-primary transition-colors h-8 w-8 p-0"
                      title="View Note"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(note)}
                      className="hover:bg-secondary/10 hover:text-secondary transition-colors h-8 w-8 p-0"
                      title="Edit Note"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(note)}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8 p-0"
                      title="Delete Note"
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
