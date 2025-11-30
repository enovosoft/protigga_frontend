import InstructorDialog from "@/components/Admin/Instructors/InstructorDialog";
import InstructorsTable, {
  InstructorsTableSkeleton,
} from "@/components/Admin/Instructors/InstructorsTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function InstructorsManagement({ useLayout = true }) {
  // Admin store state and actions
  const instructors = useStoreState((state) => state.admin.instructors);
  const loading = useStoreState((state) => state.admin.loading);

  const fetchInstructors = useStoreActions(
    (actions) => actions.admin.fetchInstructors
  );

  // Local state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const handleAdd = () => {
    setSelectedInstructor(null);
    setDialogOpen(true);
  };

  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setDialogOpen(true);
  };

  const handleDeleteClick = (instructor) => {
    setInstructorToDelete(instructor);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!instructorToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete("/instractor", {
        params: {
          instractor_id: instructorToDelete.instractor_id,
        },
      });

      toast.success(
        response.data?.message || "Instructor deleted successfully!"
      );
      setDeleteDialogOpen(false);
      setInstructorToDelete(null);
      // Refresh instructors from store
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete instructor"
      );
    } finally {
      setDeleting(false);
      await fetchInstructors();
    }
  };

  const handleInstructorDialogSuccess = async () => {
    await fetchInstructors();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter instructors based on search term (Local Frontend filtering)
  const filteredInstructors = instructors.filter((instructor) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      instructor.name?.toLowerCase().includes(searchLower) ||
      instructor.designation?.toLowerCase().includes(searchLower) ||
      instructor.academy?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstructors = filteredInstructors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Layout = useLayout ? UserDashboardLayout : "div";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Instructors</h1>
            <p className="text-muted-foreground">
              Manage all instructors in the system
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Instructor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search instructors by name, designation, or academy..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <InstructorsTableSkeleton />
        ) : (
          <InstructorsTable
            instructors={currentInstructors}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Add/Edit Dialog */}
        <InstructorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          instructor={selectedInstructor}
          onSuccess={handleInstructorDialogSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {instructorToDelete?.name}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
