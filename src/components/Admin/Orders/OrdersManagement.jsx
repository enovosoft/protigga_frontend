import OrdersTable, {
  OrdersTableSkeleton,
} from "@/components/Admin/Orders/OrdersTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import api from "@/lib/api";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrdersManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/orders?page=${page}&limit=${itemsPerPage}`
      );
      if (response.data.success) {
        const ordersData = response.data?.orders || [];
        setOrders(ordersData);
        setTotalPages(response.data.total_page || 1);
        setCurrentPage(response.data.curr_page || 1);
        setTotalItems(ordersData.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleView = (order) => {
    navigate(`/admin/orders/${order.id}`, { state: { order } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Orders Management
          </h2>
          <p className="text-muted-foreground mt-1">
            View and manage all book orders
          </p>
        </div>
      </div>

      {loading ? (
        <OrdersTableSkeleton />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-4">
            Orders will appear here once customers start purchasing books.
          </p>
        </div>
      ) : (
        <>
          <OrdersTable
            orders={orders}
            startIndex={(currentPage - 1) * itemsPerPage}
            onView={handleView}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}
