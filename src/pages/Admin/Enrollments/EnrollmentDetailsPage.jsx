import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import {
  getEnrollmentStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
} from "@/lib/badgeUtils";
import { formatDate, formatPrice, getRelativeTime } from "@/lib/helper";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  GraduationCap,
  Loader2,
  Phone,
  Shield,
  ShieldOff,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollmentDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState(
    location.state?.enrollment || null
  );
  const [togglingBlock, setTogglingBlock] = useState(false);

  useEffect(() => {
    // If no enrollment data in state, redirect back to enrollments
    if (!enrollment) {
      navigate("/admin/enrollments", { replace: true });
    }
  }, [enrollment, navigate]);

  const handleToggleBlock = async () => {
    if (!enrollment) return;

    setTogglingBlock(true);
    try {
      const response = await api.put("/enrollment", {
        enrollment_id: enrollment.enrollment_id,
        user_id: enrollment.user_id,
      });

      if (response.data.success) {
        // Update the local enrollment state
        setEnrollment((prev) => ({
          ...prev,
          is_blocked: !prev.is_blocked,
        }));
        toast.success(
          enrollment.is_blocked
            ? "Enrollment unblocked successfully!"
            : "Enrollment blocked successfully!"
        );
      } else {
        toast.error(
          response.data.message || "Failed to toggle enrollment block status"
        );
      }
    } catch (error) {
      console.error("Toggle block error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to toggle enrollment block status"
      );
    } finally {
      setTogglingBlock(false);
    }
  };

  if (!enrollment) {
    return (
      <UserDashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Loading Enrollment Details...
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
              Enrollment Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Enrollment ID:{" "}
              <span className="font-mono">{enrollment.enrollment_id}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Enrollment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Enrollment ID
                  </label>
                  <p className="font-mono text-sm">
                    {enrollment.enrollment_id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <p className="capitalize">{enrollment.enrollment_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    {getEnrollmentStatusBadge(enrollment.enrollment_status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Is Expired
                  </label>
                  <p
                    className={
                      enrollment.is_expired
                        ? "text-destructive"
                        : "text-success"
                    }
                  >
                    {enrollment.is_expired ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Enrollment Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        enrollment.is_blocked ? "destructive" : "success"
                      }
                    >
                      {enrollment.is_blocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={handleToggleBlock}
                  disabled={togglingBlock}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {togglingBlock ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : enrollment.is_blocked ? (
                    <ShieldOff className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {enrollment.is_blocked ? "Unblock" : "Block"}
                </Button>
              </div>
              <div className="border-t border-border my-4"></div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Enrollment Date
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span> {formatDate(enrollment.createdAt)}</span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(enrollment.createdAt)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Expiry Date
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span> {formatDate(enrollment.expiry_date)}</span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(enrollment.expiry_date)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment.course && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Course Title
                    </label>
                    <p className="font-semibold">
                      {enrollment.course.course_title}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Batch
                    </label>
                    <p>{enrollment.course.batch}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Course ID
                    </label>
                    <p className="font-mono text-sm">
                      {enrollment.course.course_id}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Price
                    </label>
                    <p className="font-semibold">
                      {formatPrice(enrollment.course.price)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment.payment && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment ID
                      </label>
                      <p className="font-mono text-sm">
                        {enrollment.payment.payment_id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Method
                      </label>
                      <div className="mt-1">
                        {getPaymentMethodBadge(enrollment.payment.method)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {getPaymentStatusBadge(enrollment.payment.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Currency
                      </label>
                      <p>{enrollment.payment.currency}</p>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Course Price
                      </label>
                      <p className="font-semibold">
                        {formatPrice(enrollment.payment.meterial_price || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Discount Amount
                      </label>
                      <p className="font-semibold text-green-600">
                        -{formatPrice(enrollment.payment.discount_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Total Amount
                      </label>
                      <p className="font-semibold">
                        {formatPrice(
                          enrollment.payment.product_price_with_quantity || 0
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Paid Amount
                      </label>
                      <p className="font-semibold text-green-600">
                        {formatPrice(enrollment.payment.paid_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Due Amount
                      </label>
                      <p className="font-semibold text-red-600">
                        {formatPrice(enrollment.payment.due_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Transaction ID
                      </label>
                      <p className="font-mono text-sm">
                        {enrollment.payment.Txn_ID}
                      </p>
                    </div>
                  </div>

                  {enrollment.payment.purpose && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Purpose
                      </label>
                      <p>{enrollment.payment.purpose}</p>
                    </div>
                  )}

                  {enrollment.payment.remarks && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Remarks
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.payment.remarks}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment.user && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="font-medium">
                      {enrollment.user.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <p>{enrollment.user.phone || "N/A"}</p>
                  </div>
                </>
              )}

              <div className="border-t border-border my-4"></div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="font-mono text-sm">{enrollment.user_id}</p>
              </div>

              {enrollment.wp_number && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    WhatsApp
                  </label>
                  <a
                    href={`https://wa.me/${enrollment.wp_number.replace(
                      "+",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-success/80 hover:underline"
                  >
                    {enrollment.wp_number}
                  </a>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  Facebook Profile Name
                </label>
                {enrollment.fb_name || "N/A"}
              </div>

              <div className="border-t border-border my-4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
