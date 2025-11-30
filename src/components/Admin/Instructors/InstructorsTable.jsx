import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

export default function InstructorsTable({ instructors, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instructor</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Academy</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No instructors found
              </TableCell>
            </TableRow>
          ) : (
            instructors.map((instructor) => (
              <TableRow key={instructor.instractor_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={instructor.image}
                        alt={instructor.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {instructor.name?.charAt(0)?.toUpperCase() || "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {instructor.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{instructor.designation}</Badge>
                </TableCell>
                <TableCell>{instructor.teaching_experience}</TableCell>
                <TableCell>
                  <Badge variant="outline">{instructor.student_count}</Badge>
                </TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={instructor.academy}
                >
                  {instructor.academy}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(instructor)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(instructor)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function InstructorsTableSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Instructor</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Academy</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
