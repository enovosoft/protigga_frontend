import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = () => {
      // Clear authentication
      logout();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    };

    performLogout();
  }, [navigate, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Logging Out</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-muted-foreground text-center">
            Please wait while we log you out...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
