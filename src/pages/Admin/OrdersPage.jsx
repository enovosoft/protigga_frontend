import ManualOrderDialog from "@/components/Admin/Orders/ManualOrderDialog";
import OrdersManagement from "@/components/Admin/Orders/OrdersManagement";
import AdminLayout from "@/components/shared/AdminLayout";
import { useRef } from "react";

export default function AdminOrdersPage() {
  const ordersManagementRef = useRef();

  const handleOrderCreated = () => {
    if (ordersManagementRef.current) {
      ordersManagementRef.current.fetchOrders();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Orders Management
            </h1>
            <p className="text-muted-foreground">
              Manage and view all book orders
            </p>
          </div>
          <div className="flex-shrink-0">
            <ManualOrderDialog onOrderCreated={handleOrderCreated} />
          </div>
        </div>
        <OrdersManagement ref={ordersManagementRef} useLayout={false} />
      </div>
    </AdminLayout>
  );
}
