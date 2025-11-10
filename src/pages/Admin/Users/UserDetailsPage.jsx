import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEnrollmentStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
  getUserStatusBadge,
} from "@/lib/badgeUtils";
import { formatDate, formatPrice, getRelativeTime } from "@/lib/helper";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user || null;

  useEffect(() => {
    // If no user data in state, redirect back to users
    if (!user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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
                  Recent Book Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.book_orders.slice(0, 5).map((order, index) => (
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
                          {user.is_blocked && getUserStatusBadge(false, true)}
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
                  Recent Enrollments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.enrollments.slice(0, 5).map((enrollment, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            {enrollment.course?.course_title ||
                              "Unknown Course"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Enrollment ID: {enrollment.enrollment_id}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {enrollment.status &&
                            getEnrollmentStatusBadge(enrollment.status)}

                          {user.is_blocked && getUserStatusBadge(false, true)}
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
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
