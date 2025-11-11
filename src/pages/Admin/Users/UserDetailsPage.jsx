import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getEnrollmentStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
  getUserStatusBadge,
} from "@/lib/badgeUtils";
import {
  toggleEnrollmentBlock,
  updateEnrollmentExpiry,
} from "@/lib/enrollmentUtils";
import { formatDate, formatPrice, getRelativeTime } from "@/lib/helper";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  GraduationCap,
  Loader2,
  Phone,
  Search,
  Shield,
  ShieldOff,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);

  // Search states
  const [enrollmentSearch, setEnrollmentSearch] = useState("");
  const [bookOrderSearch, setBookOrderSearch] = useState("");

  // Editing states for enrollments
  const [editingEnrollmentExpiry, setEditingEnrollmentExpiry] = useState(null);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState("");
  const [togglingEnrollmentBlock, setTogglingEnrollmentBlock] = useState(null);
  const [togglingBookOrderBlock, setTogglingBookOrderBlock] = useState(null);

  useEffect(() => {
    // If no user data in state, redirect back to users
    if (!user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Handler functions for enrollment management
  const handleToggleEnrollmentBlock = async (enrollment) => {
    setTogglingEnrollmentBlock(enrollment.enrollment_id);
    const success = await toggleEnrollmentBlock(
      enrollment,
      (updater) => {
        // Update the enrollment in the user state
        setUser((prevUser) => ({
          ...prevUser,
          enrollments: prevUser.enrollments.map((e) =>
            e.enrollment_id === enrollment.enrollment_id ? updater(e) : e
          ),
        }));
      },
      () => setTogglingEnrollmentBlock(null)
    );
    if (!success) {
      setTogglingEnrollmentBlock(null);
    }
  };

  const handleUpdateEnrollmentExpiry = async (enrollment) => {
    const success = await updateEnrollmentExpiry(
      enrollment,
      selectedExpiryDate,
      (updater) => {
        // Update the enrollment in the user state
        setUser((prevUser) => ({
          ...prevUser,
          enrollments: prevUser.enrollments.map((e) =>
            e.enrollment_id === enrollment.enrollment_id ? updater(e) : e
          ),
        }));
      },
      () => {} // No loading state needed for expiry update
    );
    if (success) {
      setEditingEnrollmentExpiry(null);
      setSelectedExpiryDate("");
    }
  };

  // Filter functions
  const filteredEnrollments =
    user?.enrollments?.filter((enrollment) =>
      enrollment.course?.course_title
        ?.toLowerCase()
        .includes(enrollmentSearch.toLowerCase())
    ) || [];

  const filteredBookOrders =
    user?.book_orders?.filter((order) =>
      order.book?.title?.toLowerCase().includes(bookOrderSearch.toLowerCase())
    ) || [];

  const getStatusBadge = (isVerified, isBlocked) => {
    if (isBlocked) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
        >
          Blocked
        </Badge>
      );
    }
    if (isVerified) {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
        >
          Verified
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
      >
        Unverified
      </Badge>
    );
  };

  if (!user) {
    return (
      <UserDashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Loading User Details...
          </h2>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              User Details
            </h1>
            <p className="text-muted-foreground mt-1">
              User ID: <span className="font-mono">{user.user_id}</span>
            </p>
          </div>
          {getStatusBadge(user.is_verified, user.is_blocked)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <p className="font-mono text-sm">{user.user_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(user.is_verified, user.is_blocked)}
                  </div>
                </div>
              </div>

              <div className="border-t border-border my-4"></div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Registration Date
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span> {formatDate(user.createdAt)}</span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(user.createdAt)}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span> {formatDate(user.updatedAt)}</span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(user.updatedAt)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {user.book_orders?.length || 0}
                  </div>
                  <div className="text-sm text-blue-600">Book Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {user.enrollments?.length || 0}
                  </div>
                  <div className="text-sm text-green-600">Enrollments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Book Orders */}
          {user.book_orders && user.book_orders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Book Orders ({filteredBookOrders.length})
                </CardTitle>
                {/* Search */}
                <div className="flex items-center gap-2 mt-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by book name..."
                    value={bookOrderSearch}
                    onChange={(e) => setBookOrderSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredBookOrders.map((order, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            {order.book?.title || "Unknown Book"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Order ID: {order.payment?.book_order_id || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {order.payment?.status &&
                            getPaymentStatusBadge(order.payment.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Paid at:
                          </span>
                          <span className="font-medium ml-1">
                            {formatDate(order.payment?.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium ml-1 text-primary/70">
                            {getRelativeTime(order.payment?.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">Author:</span>
                          <span className="font-medium ml-1">
                            {order.book?.writter || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Batch:</span>
                          <span className="font-medium ml-1">
                            {order.book?.batch || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">
                            Book ID:
                          </span>
                          <span className="font-medium ml-1 font-mono text-xs">
                            {order.book?.book_id || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium ml-1">
                            {formatPrice(
                              order.payment?.meterial_price ||
                                order.book?.price ||
                                0
                            )}
                          </span>
                        </div>
                      </div>

                      {order.payment && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Payment:
                            </span>
                            <div className="flex gap-2">
                              {getPaymentMethodBadge(order.payment.method)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredBookOrders.length === 0 && bookOrderSearch && (
                    <p className="text-center text-muted-foreground py-4">
                      No book orders match your search.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Enrollments */}
          {user.enrollments && user.enrollments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Enrollments ({filteredEnrollments.length})
                </CardTitle>
                {/* Search */}
                <div className="flex items-center gap-2 mt-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by course name..."
                    value={enrollmentSearch}
                    onChange={(e) => setEnrollmentSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEnrollments.map((enrollment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {enrollment.course?.course_title ||
                              "Unknown Course"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Enrollment ID: {enrollment.enrollment_id}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 items-end ml-4">
                          {enrollment.status &&
                            getEnrollmentStatusBadge(enrollment.status)}
                          {enrollment.is_blocked &&
                            getUserStatusBadge(false, true)}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleToggleEnrollmentBlock(enrollment)
                            }
                            disabled={
                              togglingEnrollmentBlock ===
                              enrollment.enrollment_id
                            }
                            className="flex items-center gap-1 mt-1"
                          >
                            {togglingEnrollmentBlock ===
                            enrollment.enrollment_id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : enrollment.is_blocked ? (
                              <ShieldOff className="w-3 h-3" />
                            ) : (
                              <Shield className="w-3 h-3" />
                            )}
                            {enrollment.is_blocked ? "Unblock" : "Block"}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Paid at:
                          </span>
                          <span className="font-medium ml-1">
                            {formatDate(enrollment.payment?.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium ml-1 text-primary/70">
                            {getRelativeTime(enrollment.payment?.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium ml-1">
                            {formatPrice(enrollment.course?.price || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Batch:</span>
                          <span className="font-medium ml-1">
                            {enrollment.course?.batch || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Expiry Date Section */}
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Expiry:
                            </span>
                            {editingEnrollmentExpiry ===
                            enrollment.enrollment_id ? (
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  type="datetime-local"
                                  value={selectedExpiryDate}
                                  onChange={(e) =>
                                    setSelectedExpiryDate(e.target.value)
                                  }
                                  className="w-auto h-8"
                                />
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateEnrollmentExpiry(enrollment)
                                  }
                                  className="h-8"
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingEnrollmentExpiry(null);
                                    setSelectedExpiryDate("");
                                  }}
                                  className="h-8"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-medium">
                                  {formatDate(enrollment.expiry_date)}
                                </span>
                                {enrollment.expiry_date && (
                                  <span className="text-primary/70 text-xs">
                                    ({getRelativeTime(enrollment.expiry_date)})
                                  </span>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (enrollment.expiry_date) {
                                      setEditingEnrollmentExpiry(
                                        enrollment.enrollment_id
                                      );
                                      setSelectedExpiryDate(
                                        new Date(enrollment.expiry_date)
                                          .toISOString()
                                          .slice(0, 16)
                                      );
                                    }
                                  }}
                                  className="h-6 w-6 p-0"
                                  disabled={!enrollment.expiry_date}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {enrollment.payment && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Payment:
                            </span>
                            <div className="flex gap-2">
                              {getPaymentStatusBadge(enrollment.payment.status)}
                              {getPaymentMethodBadge(enrollment.payment.method)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredEnrollments.length === 0 && enrollmentSearch && (
                    <p className="text-center text-muted-foreground py-4">
                      No enrollments match your search.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
