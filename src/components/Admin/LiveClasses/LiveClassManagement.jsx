import LiveClassDialog from "@/components/Admin/LiveClasses/LiveClassDialog";
import LiveClassTable, {
  LiveClassTableSkeleton,
} from "@/components/Admin/LiveClasses/LiveClassTable";
import AdminLayout from "@/components/shared/AdminLayout";
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

export default function LiveClassManagement({ useLayout = true }) {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLiveClass, setSelectedLiveClass] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [liveClassToDelete, setLiveClassToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLiveClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/live-classes");
      if (response.data.success) {
        let liveClasses = response.data?.live_classes || [];

        liveClasses.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLiveClasses(liveClasses);
      }
    } catch (error) {
      console.error("Error fetching live classes:", error);
      toast.error("Failed to fetch live classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const handleAdd = () => {
    setSelectedLiveClass(null);
    setDialogOpen(true);
  };

  const handleEdit = (liveClass) => {
    setSelectedLiveClass(liveClass);
    setDialogOpen(true);
  };

  const handleDeleteClick = (liveClass) => {
    setLiveClassToDelete(liveClass);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!liveClassToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(
        `/live-class/${liveClassToDelete.live_class_id}`
      );

      toast.success(
        response.data?.message || "Live class deleted successfully!"
      );
      setDeleteDialogOpen(false);
      setLiveClassToDelete(null);
      // Fetch live classes again to update the list
      await fetchLiveClasses();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete live class"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (selectedLiveClass) {
        // Update existing live class
        const response = await api.put(
          `/live-class/${selectedLiveClass.live_class_id}`,
          data
        );
        toast.success(
          response.data?.message || "Live class updated successfully!"
        );
      } else {
        // Create new live class
        const response = await api.post("/live-class", data);
        toast.success(
          response.data?.message || "Live class created successfully!"
        );
      }
      await fetchLiveClasses();
      setDialogOpen(false);
      setSelectedLiveClass(null);
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Filter and pagination
  const totalPages = Math.ceil(liveClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLiveClasses = liveClasses.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Live Classes Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage all live classes and virtual sessions
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Live Class
          </Button>
        </div>
      </div>

      {loading ? (
        <LiveClassTableSkeleton />
      ) : liveClasses.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No live classes yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first live class!
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Live Class
          </Button>
        </div>
      ) : (
        <>
          <LiveClassTable
            liveClasses={currentLiveClasses}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={liveClasses.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <LiveClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        liveClass={selectedLiveClass}
        onSave={handleSave}
        isLoading={saving}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the live class{" "}
              <span className="font-semibold text-foreground">
                "{liveClassToDelete?.title}"
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

  return useLayout ? <AdminLayout>{content}</AdminLayout> : content;
}
