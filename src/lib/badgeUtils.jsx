import { Badge } from "@/components/ui/badge";

/**
 * Get status badge for orders
 */
export const getOrderStatusBadge = (status) => {
  const statusConfig = {
    confirmed: {
      variant: "default",
      label: "Confirmed",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    },
    cancelled: {
      variant: "destructive",
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    },
    completed: {
      variant: "default",
      label: "Completed",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary",
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * Get payment method badge
 */
export const getPaymentMethodBadge = (method) => {
  const methodConfig = {
    BKASH: {
      variant: "default",
      label: "bKash",
      className: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-100",
    },
    NAGAD: {
      variant: "default",
      label: "Nagad",
      className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
    },
    STRIPE: {
      variant: "default",
      label: "Stripe",
      className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100",
    },
    SSL_COMMERZ: {
      variant: "default",
      label: "SSL Commerz",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    },
    CASH: {
      variant: "secondary",
      label: "Cash",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    },
    OTHER: {
      variant: "outline",
      label: "Other",
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    },
    BANK: {
      variant: "outline",
      label: "Bank Transfer",
      className: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-100",
    },
  };

  const config = methodConfig[method] || {
    variant: "secondary",
    label: method,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * Get payment status badge
 */
export const getPaymentStatusBadge = (status) => {
  const statusConfig = {
    PENDING: {
      variant: "secondary",
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    },
    SUCCESS: {
      variant: "default",
      label: "Success",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    },
    FAILED: {
      variant: "destructive",
      label: "Failed",
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    },
    REFUNDED: {
      variant: "outline",
      label: "Refunded",
      className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
    },
    CANCELLED: {
      variant: "destructive",
      label: "Cancelled",
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary",
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

/**
 * Get enrollment status badge
 */
export const getEnrollmentStatusBadge = (status) => {
  const statusConfig = {
    active: {
      variant: "default",
      label: "Active",
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    },
    inactive: {
      variant: "secondary",
      label: "Inactive",
      className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    },
    expired: {
      variant: "destructive",
      label: "Expired",
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    },
    success: {
      variant: "default",
      label: "Success",
      className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary",
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  };

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};