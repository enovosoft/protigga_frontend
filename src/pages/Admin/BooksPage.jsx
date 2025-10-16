import BooksManagement from "@/components/Admin/Books/BooksManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminBooksPage() {
  return (
    <AdminLayout>
      <BooksManagement useLayout={false} />
    </AdminLayout>
  );
}
