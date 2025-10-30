import CoursesTable, {
  CoursesTableSkeleton,
} from "@/components/Admin/Courses/CoursesTable";
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
import { useNavigate } from "react-router-dom";

export default function CoursesManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        let courses = response.data?.courses || [];

        courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCourses(courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = () => {
    navigate("/admin/courses/new");
  };

  const handleEdit = (course) => {
    navigate(`/admin/courses/${course.slug}`);
  };

  const handleView = (course) => {
    navigate(`/courses/${course.slug}`);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(`/course/${courseToDelete.slug}`);

      toast.success(response.data?.message || "Course deleted successfully!");
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      // Fetch courses again to update the list
      await fetchCourses();
    } catch (error) {
      await fetchCourses();

      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses
    .slice(startIndex, endIndex)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Courses Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage all courses and programs
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {loading ? (
        <CoursesTableSkeleton />
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first course!
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Course
          </Button>
        </div>
      ) : (
        <>
          <CoursesTable
            courses={currentCourses}
            startIndex={startIndex}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            deleting={deleting}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={courses.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course{" "}
              <span className="font-semibold text-foreground">
                "{courseToDelete?.course_title}"
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
