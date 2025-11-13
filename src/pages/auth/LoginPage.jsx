import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import apiInstance from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [successRedirect, setSuccessRedirect] = useState("/dashboard");

  const { login, isAuthenticated } = useAuth();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    // Check for message in location state
    if (location.state?.message) {
      setMessage({
        variant: location.state.variant || "warning",
        text: location.state.message,
      });
    }
    if (location.state?.successRedirect) {
      setSuccessRedirect(location.state.successRedirect);
    }
  }, [location.state]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiInstance.post("/auth/login", {
        phone: `+880${data.phone}`,
        password: data.password,
      });
      if (response.status === 200) {
        toast.success(response?.data?.message || "Login successful!");
        login();

        window.location.href = successRedirect;
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        // User not verified, redirect to verify account
        navigate("/auth/verify-account", { state: { phone: data.phone } });
      } else {
        toast.error(
          error.response?.data?.errors?.[0]?.message ||
            error.response?.data?.message ||
            "Login failed"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-3 sm:p-4">
      {/* Back Button */}
      <Button
        variant="secondary"
        size="sm"
        className="fixed top-3 sm:top-4 left-3 sm:left-4 z-10 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-3 text-center pb-3 sm:pb-4">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <PinMessage
                  variant={message.variant || "warning"}
                  message={message.text || "login to continue"}
                  className="mb-3 sm:mb-4"
                />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 200,
              }}
              className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Sign in to continue your learning journey
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm sm:text-base font-medium"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <div className="absolute left-11 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex items-center">
                    <span className="text-sm font-medium">+880</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="1XXXXXXXXX"
                    className="pl-20 h-10 sm:h-11"
                    {...form.register("phone")}
                  />
                </div>
                {form.formState.errors.phone && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm sm:text-base font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    to="/auth/reset-password"
                    className="text-xs sm:text-sm text-secondary hover:text-secondary/80 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-10 sm:h-11"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/auth/register"
                  className="text-secondary hover:text-secondary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
