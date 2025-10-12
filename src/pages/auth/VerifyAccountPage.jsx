import OtpVerification from "@/components/OtpVerification";
import apiInstance from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyAccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const phone = location.state?.phone;
    if (!phone) {
      navigate("/auth/login");
      return;
    }
    setPhoneNumber(phone);

    const resendOtp = async () => {
      try {
        const response = await apiInstance.post("/auth/resend-otp", {
          phone: `+880${phone}`,
        });
        if (response.data.success) {
          setIsLoading(false);
        } else {
          toast.error("Failed to send OTP");
          navigate("/auth/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send OTP");
        navigate("/auth/login");
      }
    };

    resendOtp();
  }, [location.state, navigate]);

  const handleVerificationSuccess = () => {
    navigate("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-secondary transition-colors bg-card hover:bg-accent rounded-md border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Sending OTP...</p>
        </div>
      </div>
    );
  }

  return (
    <OtpVerification
      phoneNumber={phoneNumber}
      onSuccess={handleVerificationSuccess}
    />
  );
}
