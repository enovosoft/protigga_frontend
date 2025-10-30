import OrdersTable, {
  OrdersTableSkeleton,
} from "@/components/Admin/Orders/OrdersTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import DropDownWithSearch from "@/components/shared/DropDownWithSearch";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api, { downloadExcelFile } from "@/lib/api";
import { Download, Eye, Search } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrdersManagement = forwardRef(({ useLayout = true }, ref) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const [searchForm, setSearchForm] = useState({
    book_id: "",
    start_date: "",
    end_date: "",
  });
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [books, setBooks] = useState([]);
  const [bookSearch, setBookSearch] = useState("");
  const [bookPopoverOpen, setBookPopoverOpen] = useState(false);

  const fetchOrders = async (page = 1, searchParams = {}) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", itemsPerPage.toString());

      // Add search parameters if provided
      if (searchParams.book_id && searchParams.book_id !== "all")
        params.append("book_id", searchParams.book_id);
      if (searchParams.start_date)
        params.append("start_date", searchParams.start_date);
      if (searchParams.end_date)
        params.append("end_date", searchParams.end_date);

      const response = await api.get(`/orders?${params.toString()}`);
      if (response.data.success) {
        const ordersData = response.data?.orders || [];
        const booksData = response.data?.books || [];
        setOrders(ordersData);
        setBooks(booksData);
        setTotalPages(response.data.total_page || 1);
        setCurrentPage(response.data.curr_page || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchOrders,
  }));

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleView = (order) => {
    navigate(`/admin/orders/${order.id}`, { state: { order } });
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      await fetchOrders(1, searchForm);
      setCurrentPage(1); // Reset to first page when searching
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (searchForm.start_date)
        params.append("start_date", searchForm.start_date);
      if (searchForm.end_date) params.append("end_date", searchForm.end_date);

      const filename = `orders_${searchForm.start_date || "all"}_to_${
        searchForm.end_date || "all"
      }.xlsx`;

      await downloadExcelFile(`/orders-excel?${params.toString()}`, filename);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      // You might want to show a toast error here
    } finally {
      setDownloading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const content = (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <Label htmlFor="search_book" className="text-sm font-medium">
              Book
            </Label>
            <DropDownWithSearch
              id="search_book"
              className="mt-1"
              items={[{ id: "all", title: "All Books" }, ...books]}
              displayKey="title"
              value={searchForm.book_id}
              onChange={(value) => handleSearchChange("book_id", value)}
              placeholder="Select a book"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="search_start_date" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="search_start_date"
              type="date"
              value={searchForm.start_date}
              onChange={(e) => handleSearchChange("start_date", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="search_end_date" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="search_end_date"
              type="date"
              value={searchForm.end_date}
              onChange={(e) => handleSearchChange("end_date", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-1">
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="flex items-center gap-2 w-full"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </Button>
          </div>
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
          {hasSearched &&
            orders.length > 0 &&
            (searchForm.start_date || searchForm.end_date) && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleDownloadExcel}
                  disabled={downloading}
                  variant="success"
                  className="flex items-center gap-2"
                >
                  {downloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>
            )}

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
      {downloading && <Loading text="Preparing download" />}
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
});

OrdersManagement.displayName = "OrdersManagement";

export default OrdersManagement;
