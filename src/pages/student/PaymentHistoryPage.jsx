import StudentDashboardLayout from "@/components/shared/StudentDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaymentStatusBadge } from "@/lib/badgeUtils";
import { formatDate } from "@/lib/helper";
import { useStoreState } from "easy-peasy";
import { CreditCard, Eye } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filterType = location.state?.filterType || null;

  const student = useStoreState((s) => s.student);

  const displayPayments = useMemo(() => {
    const payments = student.payments || [];
    const bookOrders = student.bookOrders || [];
    let list = [];

    // Add payments from payments array
    payments.forEach((p) => {
      list.push({
        payment: p,
        type: p.payment_type || "payment",
        date: p.tran_date || p.book_order?.createdAt || p.createdAt,
        txnId: p.Txn_ID || p.book_order?.Txn_ID,
        meta: p.book_order
          ? {
              book: bookOrders.find((bo) => bo.payment?.Txn_ID === p.Txn_ID)
                ?.book,
            }
          : null,
      });
    });

    // Add payments from bookOrders that might not be in payments array
    bookOrders.forEach((bo) => {
      const exists = list.some((item) => item.txnId === bo.payment?.Txn_ID);
      if (!exists) {
        list.push({
          payment: bo.payment,
          type: "book_order",
          date:
            bo.payment.tran_date ||
            bo.payment.book_order?.createdAt ||
            bo.payment.createdAt,
          txnId: bo.payment?.Txn_ID || bo.payment?.book_order?.Txn_ID,
          meta: { book: bo.book },
        });
      }
    });

    // Apply filter if requested
    if (filterType) {
      list = list.filter((item) => item.type === filterType);
    }

    // Sort by date descending
    list.sort((a, b) => {
      const aDate = new Date(a.date || 0);
      const bDate = new Date(b.date || 0);
      return bDate - aDate;
    });

    return list;
  }, [student, filterType]);

  const handleView = (txnId) => {
    navigate(`/dashboard/payments/${encodeURIComponent(txnId)}`);
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>

          <CardContent>
            {displayPayments.length === 0 ? (
              <Card className="b-0">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Transactions Found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    You haven't made any payments yet. Your transaction history
                    will appear here once you make a purchase.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-muted-foreground">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        S/N
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">
                        Txn ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden lg:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Item
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayPayments.map((entry, index) => {
                      const itemName =
                        entry.meta?.book?.title ||
                        (entry.payment.course_enrollment
                          ? student?.enrollments?.find(
                              (e) =>
                                e.id ===
                                entry.payment.course_enrollment.course_id
                            )?.name
                          : "—");

                      return (
                        <tr
                          key={entry.txnId + index}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-mono hidden md:table-cell">
                            {entry.txnId || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm hidden lg:table-cell">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-4 py-3 text-sm ">
                            {entry.type === "book_order" ? (
                              <span className="block mx-auto w-fit   px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ">
                                Book Order
                              </span>
                            ) : entry.type === "enrollment" ? (
                              <span className="block mx-auto w-fit   px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ">
                                Enrollment
                              </span>
                            ) : (
                              <span className="block mx-auto w-fit   px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {entry.type.replace("_", " ")}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{itemName}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            {entry.payment.paid_amount
                              ? `${entry.payment.paid_amount} ${
                                  entry.payment.currency || "BDT"
                                }`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getPaymentStatusBadge(entry.payment.status)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleView(entry.txnId)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentDashboardLayout>
  );
};

export default PaymentHistoryPage;
