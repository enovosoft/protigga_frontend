import OrdersManagement from "@/components/Admin/Orders/OrdersManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrdersManagement useLayout={false} />
    </AdminLayout>
  );
}
