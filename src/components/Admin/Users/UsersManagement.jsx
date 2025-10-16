import UsersTable, {
  UsersTableSkeleton,
} from "@/components/Admin/Users/UsersTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import api from "@/lib/api";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UsersManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      if (response.data.success) {
        let users = response.data?.users || [];

        // Sort by created date (newest first)
        users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user) => {
    navigate(`/admin/users/${user.id}`, { state: { user } });
  };

  // Pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Users Management
          </h2>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users
          </p>
        </div>
      </div>

      {loading ? (
        <UsersTableSkeleton />
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No users yet</h3>
          <p className="text-muted-foreground mb-4">
            Users will appear here once they register on the platform.
          </p>
        </div>
      ) : (
        <>
          <UsersTable
            users={currentUsers}
            startIndex={startIndex}
            onView={handleView}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={users.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
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
