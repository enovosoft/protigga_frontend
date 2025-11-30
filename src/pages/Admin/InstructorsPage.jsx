import InstructorsManagement from "@/components/Admin/Instructors/InstructorsManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminInstructorsPage() {
  return (
    <AdminLayout>
      <div className="w-full">
        <InstructorsManagement useLayout={false} />
      </div>
    </AdminLayout>
  );
}
