import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Loading from "@/components/shared/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getEnrollmentStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
} from "@/lib/badgeUtils";
import {
  toggleEnrollmentBlock,
  updateEnrollmentExpiry,
} from "@/lib/enrollmentUtils";
import { formatDate, formatPrice, getRelativeTime } from "@/lib/helper";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Edit,
  GraduationCap,
  Loader2,
  Phone,
  Shield,
  ShieldOff,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function EnrollmentDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState(
    location.state?.enrollment || null
  );
  const [togglingBlock, setTogglingBlock] = useState(false);
  const [editingExpiry, setEditingExpiry] = useState(false);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState("");
  const [savingChanges, setSavingChanges] = useState(false);

  useEffect(() => {
    // If no enrollment data in state, redirect back to enrollments
    if (!enrollment) {
      navigate("/admin/enrollments", { replace: true });
    }
  }, [enrollment, navigate]);

  const handleToggleBlock = async () => {
    await toggleEnrollmentBlock(enrollment, setEnrollment, setTogglingBlock);
  };

  const handleSaveChanges = async () => {
    if (selectedExpiryDate) {
      const success = await updateEnrollmentExpiry(
        enrollment,
        selectedExpiryDate,
        setEnrollment,
        setSavingChanges
      );
      if (success) {
        setEditingExpiry(false);
        setSelectedExpiryDate("");
      }
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
                    {getEnrollmentStatusBadge(enrollment.status)}
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
                <div className="flex items-center gap-2 mt-1">
                  {editingExpiry ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        value={selectedExpiryDate}
                        onChange={(e) => setSelectedExpiryDate(e.target.value)}
                        className="w-auto"
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveChanges}
                        disabled={savingChanges}
                      >
                        {savingChanges ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExpiry(false);
                          setSelectedExpiryDate("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span> {formatDate(enrollment.expiry_date)}</span> |
                        <span className="text-primary/70">
                          {" "}
                          {getRelativeTime(enrollment.expiry_date)}
                        </span>
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingExpiry(true);
                          setSelectedExpiryDate(
                            new Date(enrollment.expiry_date)
                              .toISOString()
                              .slice(0, 16)
                          );
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
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
                        {formatPrice(enrollment.payment.discount_amount || 0)}
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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Card Type
                      </label>
                      <p className="font-medium">
                        {enrollment.payment.card_type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Card Issuer
                      </label>
                      <p className="font-medium">
                        {enrollment.payment.card_issuer || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Withdrawal Amount
                      </label>
                      <p className="font-semibold">
                        {formatPrice(enrollment.payment.store_amount || 0)}
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
      {savingChanges && <Loading text="Saving changes" />}
    </UserDashboardLayout>
  );
}
