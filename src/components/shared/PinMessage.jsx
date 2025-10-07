import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PinMessage = ({ variant = "success", message, className }) => {
  const variants = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-success/10",
      textColor: "text-success",
      borderColor: "border-success/20",
      iconColor: "text-success",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-warning/10",
      textColor: "text-warning",
      borderColor: "border-warning/20",
      iconColor: "text-warning",
    },
    invalid: {
      icon: XCircle,
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      borderColor: "border-destructive/20",
      iconColor: "text-destructive",
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", config.iconColor)} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default PinMessage;
