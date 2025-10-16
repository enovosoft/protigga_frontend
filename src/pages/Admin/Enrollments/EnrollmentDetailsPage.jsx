import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  User,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollmentDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const enrollment = location.state?.enrollment || null;

  useEffect(() => {
    // If no enrollment data in state, redirect back to enrollments
    if (!enrollment) {
      navigate("/dashboard", { replace: true });
    }
  }, [enrollment, navigate]);

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
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
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
          {getEnrollmentStatusBadge(enrollment.status)}
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
                        Material Price
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
                        {formatPrice(enrollment.payment.amount || 0)}
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
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="font-mono text-sm">{enrollment.user_id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
