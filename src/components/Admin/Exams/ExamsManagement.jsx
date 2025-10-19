import ExamDialog from "@/components/Admin/Exams/ExamDialog";
import ExamsTable, {
  ExamsTableSkeleton,
} from "@/components/Admin/Exams/ExamsTable";
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
import api from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ExamsManagement({ useLayout = true }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await api.get("/exams");
      if (response.data.success) {
        let exams = response.data?.exams || [];

        exams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setExams(exams);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAdd = () => {
    setSelectedExam(null);
    setDialogOpen(true);
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setDialogOpen(true);
  };

  const handleDeleteClick = (exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!examToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(`/exam/${examToDelete.exam_id}`);

      toast.success(response.data?.message || "Exam deleted successfully!");
      setDeleteDialogOpen(false);
      setExamToDelete(null);
      // Fetch exams again to update the list
      await fetchExams();
    } catch (error) {
      await fetchExams();

      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete exam");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = exams.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Exams Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage all exams and assessments
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Exam
        </Button>
      </div>

      {loading ? (
        <ExamsTableSkeleton />
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No exams yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first exam!
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Exam
          </Button>
        </div>
      ) : (
        <>
          <ExamsTable
            exams={currentExams}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            deleting={deleting}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={exams.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <ExamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exam={selectedExam}
        onSuccess={fetchExams}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the exam{" "}
              <span className="font-semibold text-foreground">
                "{examToDelete?.exam_title}"
              </span>
              . This action cannot be undone.
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
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}
