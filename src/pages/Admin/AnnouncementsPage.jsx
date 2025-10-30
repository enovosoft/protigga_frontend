import AnnouncementsManagement from "@/components/Admin/Announcements/AnnouncementsManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AnnouncementsPage() {
  return (
    <AdminLayout>
      {" "}
      <AnnouncementsManagement useLayout={false} />
    </AdminLayout>
  );
}
