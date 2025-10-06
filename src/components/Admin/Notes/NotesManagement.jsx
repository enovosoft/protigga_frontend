import NoteDialog from "@/components/Admin/Notes/NoteDialog";
import NotesTable, {
  NotesTableSkeleton,
} from "@/components/Admin/Notes/NotesTable";
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
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function NotesManagement() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");
      if (response.data.success) {
        let notes = response.data?.notes || [];

        notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotes(notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAdd = () => {
    setSelectedNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  const handleView = (note) => {
    navigate("/notes/view", { state: { note } });
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete("/note", {
        data: {
          note_id: noteToDelete.note_id,
          slug: noteToDelete.slug,
        },
      });

      toast.success(response.data?.message || "Note deleted successfully!");
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      // Fetch notes again to update the list
      await fetchNotes();
    } catch (error) {
      await fetchNotes();

      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(notes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotes = notes.slice(startIndex, endIndex);

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Notes Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage all study notes and materials
            </p>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </div>

        {loading ? (
          <NotesTableSkeleton />
        ) : notes.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first note!
            </p>
            <Button onClick={handleAdd} variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Note
            </Button>
          </div>
        ) : (
          <>
            <NotesTable
              notes={currentNotes}
              startIndex={startIndex}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={notes.length}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <NoteDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          note={selectedNote}
          onSuccess={fetchNotes}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the note{" "}
                <span className="font-semibold text-foreground">
                  "{noteToDelete?.note_name}"
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
    </UserDashboardLayout>
  );
}
