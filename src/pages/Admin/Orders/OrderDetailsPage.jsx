import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getOrderStatusBadge,
  getPaymentMethodBadge,
  getPaymentStatusBadge,
} from "@/lib/badgeUtils";
import { formatDate, formatPrice, getRelativeTime } from "@/lib/helper";
import { ArrowLeft, Calendar, CreditCard, MapPin, Package } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;

  useEffect(() => {
    // If no order data in state, redirect back to orders
    if (!order) {
      navigate("/dashboard", { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <UserDashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Loading Order Details...
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              Order Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Order ID: <span className="font-mono">{order.order_id}</span>
            </p>
          </div>
          {getOrderStatusBadge(order.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </label>
                  <p className="font-mono text-sm">{order.order_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Quantity
                  </label>
                  <p className="font-semibold">{order.quantity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Price
                  </label>
                  <p className="font-semibold">
                    {formatPrice(order.product_price || 0)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm">{order.Txn_ID}</p>
                </div>
              </div>

              <div className="border-t border-border my-4"></div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Order Date
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.createdAt)} </span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(order.createdAt)}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(order.updatedAt)} </span> |
                  <span className="text-primary/70">
                    {" "}
                    {getRelativeTime(order.updatedAt)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Book Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Book Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.book && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Title
                    </label>
                    <p className="font-semibold">{order.book.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Author
                    </label>
                    <p>{order.book.writter}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Batch
                    </label>
                    <p>{order.book.batch}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Book ID
                    </label>
                    <p className="font-mono text-sm">{order.book.book_id}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {order.book.description}
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
              {order.payment && (
                <>
                  {/* Basic Payment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment ID
                      </label>
                      <p className="font-mono text-sm">
                        {order.payment.payment_id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Method
                      </label>
                      <div className="mt-1">
                        {getPaymentMethodBadge(order.payment.method)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {getPaymentStatusBadge(order.payment.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Currency
                      </label>
                      <p>{order.payment.currency}</p>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Price per Item and Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Price per Item
                      </label>
                      <p className="font-semibold">
                        {formatPrice(order.payment.meterial_price || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Quantity
                      </label>
                      <p className="font-semibold text-lg">{order.quantity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Delivery Charge
                      </label>
                      <p className="font-semibold">
                        {formatPrice(order.payment.delevery_charge || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Discount Amount
                      </label>
                      <p className="font-semibold text-success">
                        -{formatPrice(order.payment.discount_amount || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Main Payment Calculations */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Total Amount{" "}
                        <span className="text-xs">(Price with quantity)</span>
                      </label>
                      <p className="font-semibold">
                        {formatPrice(
                          order.payment.product_price_with_quantity || 0
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Advance Charge
                      </label>
                      <p className="font-semibold">
                        {formatPrice(order.payment.advance_charge_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Paid Amount
                      </label>
                      <p className="font-semibold text-green-600">
                        {formatPrice(order.payment.paid_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Due Amount
                      </label>
                      <p className="font-semibold text-red-600">
                        {formatPrice(order.payment.due_amount || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Customer Related Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Will Customer Get Amount
                      </label>
                      <p className="font-medium">
                        {order.payment.willCustomerGetAmount ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Customer Receivable Amount
                      </label>
                      <p className="font-semibold">
                        {formatPrice(
                          order.payment.customer_receivable_amount || 0
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Transaction ID
                      </label>
                      <p className="font-mono text-sm">
                        {order.payment.Txn_ID}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  {/* Additional Card Properties */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Card Type
                      </label>
                      <p className="font-medium">
                        {order.payment.card_type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Card Issuer
                      </label>
                      <p className="font-medium">
                        {order.payment.card_issuer || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Withdrawal Amount
                      </label>
                      <p className="font-semibold">
                        {formatPrice(order.payment.store_amount || 0)}
                      </p>
                    </div>
                  </div>

                  {order.payment.remarks && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Remarks
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {order.payment.remarks}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Information */}
              {order.user && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      Customer Name
                    </label>
                    <p className="font-medium">{order.user.name || "N/A"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      Phone
                    </label>
                    <p>{order.user.phone || "N/A"}</p>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="whitespace-pre-line">{order.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  Alternative Phone
                </label>
                <p>{order.alternative_phone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
