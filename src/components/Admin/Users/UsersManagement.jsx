import UsersTable, {
  UsersTableSkeleton,
} from "@/components/Admin/Users/UsersTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UsersManagement({ useLayout = true }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchForm, setSearchForm] = useState({
    user_id: "",
    name: "",
    phone: "",
  });
  const [searching, setSearching] = useState(false);

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
    navigate(`/admin/users/${user.user_id}`, { state: { user } });
  };

  const handleToggleBlock = async (user) => {
    try {
      const response = await api.put("/user", {
        user_id: user.user_id,
      });

      if (response.data.success) {
        toast.success(
          user.is_blocked
            ? "User unblocked successfully!"
            : "User blocked successfully!"
        );
        // Refresh the users list
        fetchUsers();
      } else {
        toast.error(
          response.data.message || "Failed to toggle user block status"
        );
      }
    } catch (error) {
      console.error("Toggle block error:", error);
      toast.error(
        error.response?.data?.message || "Failed to toggle user block status"
      );
    }
  };

  const handleSearch = async () => {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchForm.user_id.trim())
      params.append("user_id", searchForm.user_id.trim());
    if (searchForm.name.trim()) params.append("name", searchForm.name.trim());
    if (searchForm.phone.trim())
      params.append("phone", searchForm.phone.trim());

    if (params.toString() === "") {
      toast.error("Please enter at least one search criteria");
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/search/user?${params.toString()}`);
      if (response.data.success) {
        let users = response.data?.data || [];
        // Sort by created date (newest first)
        users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(users);
        setCurrentPage(1); // Reset to first page
        toast.success(`Found ${users.length} user(s)`);
      } else {
        toast.error(response.data.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
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

      {/* Search Form */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search_user_id" className="text-sm font-medium">
              User ID
            </Label>
            <Input
              id="search_user_id"
              value={searchForm.user_id}
              onChange={(e) => handleSearchChange("user_id", e.target.value)}
              placeholder="Enter user ID"
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="search_name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="search_name"
              value={searchForm.name}
              onChange={(e) => handleSearchChange("name", e.target.value)}
              placeholder="Enter user name"
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="search_phone" className="text-sm font-medium">
              Phone
            </Label>
            <Input
              id="search_phone"
              value={searchForm.phone}
              onChange={(e) => handleSearchChange("phone", e.target.value)}
              placeholder="+8801xxxxxxxx"
              className="mt-1"
            />
          </div>
          <div>
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="flex items-center gap-2"
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
            onToggleBlock={handleToggleBlock}
            currentUser={currentUser}
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
