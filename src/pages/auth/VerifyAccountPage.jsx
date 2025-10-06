import OtpVerification from "@/components/OtpVerification";
import apiInstance from "@/lib/api";
import { Loader2 } from "lucide-react";
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
