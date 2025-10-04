import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/10 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary font-primary">প্রতিজ্ঞা Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your learning dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have successfully logged in. This is your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
