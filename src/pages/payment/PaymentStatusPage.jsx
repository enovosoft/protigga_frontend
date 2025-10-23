import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentStatusPage = ({ status = "success" }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "text-success",
      title: "Payment Successful!",
      message:
        "Your transaction has been completed successfully. You will be redirected to your dashboard shortly.",
    },
    fail: {
      icon: XCircle,
      color: "text-destructive",
      title: "Payment Failed!",
      message:
        "Something went wrong with your payment. Please try again or contact support. You will be redirected to your dashboard shortly.",
    },
    cancel: {
      icon: AlertTriangle,
      color: "text-warning",
      title: "Payment Cancelled!",
      message:
        "You have cancelled the payment process. You will be redirected to your dashboard shortly.",
    },
  };

  const config = statusConfig[status] || statusConfig.success;
  const IconComponent = config.icon;

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 6000);
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  const progressPercentage = ((5 - timeLeft) / 5) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto relative">
        <CardHeader className="text-center ">
          {/* Progress Bar */}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-muted rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-center mb-4 mt-4">
            <IconComponent className={`w-16 h-16 ${config.color}`} />
          </div>
          <CardTitle className={`text-2xl font-bold ${config.color}`}>
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">{config.message}</p>
          <div className="text-sm text-secondary font-bold">
            Redirecting in {timeLeft} second{timeLeft !== 1 ? "s" : ""}...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;
