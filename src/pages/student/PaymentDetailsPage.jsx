import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEnrollmentStatusBadge,
  getOrderStatusBadge,
  getPaymentStatusBadge,
} from "@/lib/badgeUtils";
import { formatDate, formatPrice } from "@/lib/helper";
import { useStoreState } from "easy-peasy";
import { Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const PaymentDetailsPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const student = useStoreState((s) => s.student);
  const payments = student?.payments || [];
  const bookOrders = student?.bookOrders || [];

  const handlePrint = () => {
    window.print();
  };

  // Find payment by transaction ID
  const payment = [...payments, ...bookOrders.map((bo) => bo.payment)].find(
    (p) => {
      const txnId = p.Txn_ID || p.book_order?.Txn_ID;
      return txnId === transactionId;
    }
  );

  // Get related book/course info
  const bookOrder = payment?.book_order;
  const courseEnrollment = payment?.course_enrollment;

  const relatedBook = bookOrders.find(
    (bo) => bo.payment.Txn_ID === payment?.Txn_ID
  )?.book;
  const relatedCourse = student?.enrollments?.find(
    (e) => e.id === courseEnrollment?.course_id
  );

  if (!payment) {
    return (
      <StudentDashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Payment not found for "{transactionId}".
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate(-1)}>Go back</Button>
            </div>
          </CardContent>
        </Card>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body { font-size: 12px; }
            .no-print { display: none !important; }
            .print-break-inside-avoid { break-inside: avoid; }
            .print-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .print-space-y-2 > * + * { margin-top: 0.5rem !important; }
            .print-p-4 { padding: 1rem !important; }
          }
        `,
        }}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-center items-center">
            <CardTitle className="text-2xl font-bold text-center">
              Payment Receipt
            </CardTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="no-print hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
          <div className="text-center border-b pb-4">
            <div className="flex justify-center">
              {getPaymentStatusBadge(payment.status)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Header */}

          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid print-grid-cols-1 print-space-y-2">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Transaction Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span>{payment.Txn_ID || bookOrder?.Txn_ID || "—"}</span>
                </div>
                {bookOrder && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span>{bookOrder.order_id}</span>
                  </div>
                )}
                {courseEnrollment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Enrollment ID:
                    </span>
                    <span>{courseEnrollment.enrollment_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At:</span>
                  <span>
                    {formatDate(
                      bookOrder?.createdAt || courseEnrollment.createdAt
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Transaction Date:
                  </span>
                  <span>{formatDate(payment.tran_date)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>{payment.method || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Card Type/Issuer:
                  </span>
                  <span>{payment.card_type || payment.card_issuer || "—"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material Price:</span>
                  <span>{formatPrice(payment.meterial_price)}</span>
                </div>
                {bookOrder && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{bookOrder?.quantity || "—"}</span>
                  </div>
                )}
                {bookOrder && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>
                      {formatPrice(payment.product_price_with_quantity)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-green-600">
                    {formatPrice(payment.discount_amount)}
                  </span>
                </div>
                {bookOrder && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Charge:
                    </span>
                    <span>{formatPrice(payment.delevery_charge)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      Number(payment.product_price_with_quantity) +
                        Number(payment.delevery_charge) -
                        Number(payment.discount_amount)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="text-green-600">
                    {formatPrice(payment.paid_amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Amount:</span>
                  <span className="text-red-600">
                    {formatPrice(payment.due_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          {bookOrder && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Book Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid print-grid-cols-1 print-space-y-2">
                <div className="space-y-2">
                  <div>
                    <strong>Order ID:</strong> {bookOrder.order_id}
                  </div>
                  <div>
                    <strong>Book ID:</strong> {bookOrder.book_id}
                  </div>
                  <div>
                    <strong>Book Name:</strong> {relatedBook?.title || "—"}
                  </div>
                  <div>
                    <strong>Unit Price:</strong>{" "}
                    {bookOrder.product_price
                      ? `${bookOrder.product_price} ${
                          payment.currency || "BDT"
                        }`
                      : "—"}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {bookOrder.quantity}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <strong>Status:</strong>{" "}
                    {getOrderStatusBadge(bookOrder.status)}
                  </div>
                  <div>
                    <strong>Customer Name:</strong>{" "}
                    {student?.profile?.name || "—"}
                  </div>
                  <div>
                    <strong>Customer Phone:</strong>{" "}
                    {student?.profile?.phone || "—"}
                  </div>
                  <div>
                    <strong>Address:</strong> {bookOrder.address}
                  </div>
                  <div>
                    <strong>Alternative Phone:</strong>{" "}
                    {bookOrder.alternative_phone || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {courseEnrollment && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">
                Course Enrollment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid print-grid-cols-1 print-space-y-2">
                <div className="space-y-2">
                  <div>
                    <strong>Transaction ID:</strong> {payment.Txn_ID || "—"}
                  </div>
                  <div>
                    <strong>Enrollment ID:</strong>{" "}
                    {courseEnrollment.enrollment_id}
                  </div>
                  <div>
                    <strong>Course ID:</strong> {courseEnrollment.course_id}
                  </div>
                  <div>
                    <strong>Course Name:</strong> {relatedCourse?.name || "—"}
                  </div>
                  <div>
                    <strong>Batch:</strong> {relatedCourse?.batch || "—"}
                  </div>
                  <div>
                    <strong>Enrollment Type:</strong>{" "}
                    {courseEnrollment.enrollment_type}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <strong>Status:</strong>{" "}
                    {getEnrollmentStatusBadge(courseEnrollment.status)}
                  </div>
                  <div>
                    <strong>Customer Name:</strong>{" "}
                    {student?.profile?.name || "—"}
                  </div>
                  <div>
                    <strong>Customer Phone:</strong>{" "}
                    {student?.profile?.phone || "—"}
                  </div>
                  <div>
                    <strong>WhatsApp Number:</strong>{" "}
                    {courseEnrollment.wp_number}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Thank you for your business with Protigga!
            </p>
            <div className="mt-4 no-print">
              <Button onClick={() => navigate(-1)}>Close</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </StudentDashboardLayout>
  );
};

export default PaymentDetailsPage;
