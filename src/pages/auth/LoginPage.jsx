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
import PinMessage from "@/components/shared/PinMessage";
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-10 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          {message && (
            <PinMessage
              variant={message.variant}
              message={message.text}
              className="mb-4"
            />
          )}
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <div className="absolute left-11 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground flex items-center">
                  <span className="text-sm font-medium">+880</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1XXXXXXXXX"
                  className="pl-20"
                  {...form.register("phone")}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/auth/reset-password"
                  className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
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
                  className="pl-10 pr-10"
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
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
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
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="text-center text-sm">
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
