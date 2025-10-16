import NotesManagement from "@/components/Admin/Notes/NotesManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminNotesPage() {
  return (
    <AdminLayout>
      <NotesManagement useLayout={false} />
    </AdminLayout>
  );
}
