import UserDashboardLayout from "@/components/shared/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || null;

  useEffect(() => {
    // If no order data in state, redirect back to orders
    if (!order) {
      navigate("/admin/orders", { replace: true });
    }
  }, [order, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        variant: "secondary",
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      SUCCESS: {
        variant: "default",
        label: "Success",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      FAILED: {
        variant: "destructive",
        label: "Failed",
        className: "bg-red-100 text-red-800 border-red-200",
      },
      REFUNDED: {
        variant: "outline",
        label: "Refunded",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      CANCELLED: {
        variant: "destructive",
        label: "Cancelled",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
      confirmed: {
        variant: "default",
        label: "Confirmed",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      pending: {
        variant: "secondary",
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      cancelled: {
        variant: "destructive",
        label: "Cancelled",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
      completed: {
        variant: "default",
        label: "Completed",
        className: "bg-green-100 text-green-800 border-green-200",
      },
    };

    const config = statusConfig[status] || {
      variant: "secondary",
      label: status,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        variant={config.variant}
        className={`capitalize ${config.className}`}
      >
        {config.label}
      </Badge>
    );
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      BKASH: {
        variant: "default",
        label: "bKash",
        className: "bg-pink-100 text-pink-800 border-pink-200",
      },
      NAGAD: {
        variant: "default",
        label: "Nagad",
        className: "bg-orange-100 text-orange-800 border-orange-200",
      },
      STRIPE: {
        variant: "default",
        label: "Stripe",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      SSL_COMMERZ: {
        variant: "default",
        label: "SSL Commerz",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      CASH: {
        variant: "secondary",
        label: "Cash",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      OTHER: {
        variant: "outline",
        label: "Other",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
      BANK: {
        variant: "outline",
        label: "Bank Transfer",
        className: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
      CASH_ON_DELIVERY: {
        variant: "secondary",
        label: "Cash on Delivery",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      BANK_TRANSFER: {
        variant: "outline",
        label: "Bank Transfer",
        className: "bg-indigo-100 text-indigo-800 border-indigo-200",
      },
    };

    const config = methodConfig[method] || {
      variant: "secondary",
      label: method,
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

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
            <Button variant="ghost" onClick={() => navigate("/admin/orders")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Order Details
              </h1>
              <p className="text-muted-foreground mt-1">
                Order ID: <span className="font-mono">{order.order_id}</span>
              </p>
            </div>
          </div>
          {getStatusBadge(order.status)}
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
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <p className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.updatedAt)}
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
                        {getMethodBadge(order.payment.method)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Amount
                      </label>
                      <p className="font-semibold">
                        {formatPrice(order.payment.amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(order.payment.status)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border my-4"></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Currency
                      </label>
                      <p>{order.payment.currency}</p>
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

                  {order.payment.purpose && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Purpose
                      </label>
                      <p>{order.payment.purpose}</p>
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
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="whitespace-pre-line">{order.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Alternative Phone
                </label>
                <p>{order.alternative_phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
