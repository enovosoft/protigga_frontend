import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const PinMessage = ({ variant = "success", message, className }) => {
  const variants = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-success/50",
      textColor: "text-primary",
      borderColor: "border-success/40",
      iconColor: "text-primary",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-warning/50",
      textColor: "text-primary",
      borderColor: "border-warning/40",
      iconColor: "text-primary",
    },
    invalid: {
      icon: XCircle,
      bgColor: "bg-destructive/50",
      textColor: "text-primary",
      borderColor: "border-destructive/40",
      iconColor: "text-primary",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-destructive/50",
      textColor: "text-primary",
      borderColor: "border-destructive/40",
      iconColor: "text-primary",
    },
    info: {
      icon: Info,

      bgColor: "bg-secondary/50",
      textColor: "text-primary",
      borderColor: "border-secondary/40",
      iconColor: "text-primary",
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
