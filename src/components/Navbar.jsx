import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary font-primary">প্রতিজ্ঞা</h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              Courses
            </Link>
            <Link 
              to="/notes" 
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              Notes
            </Link>
            <Link 
              to="/books" 
              className="text-sm font-medium text-foreground hover:text-secondary transition-colors"
            >
              Books
            </Link>
          </div>
        </div>

        <Button onClick={handleDashboardClick} className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
      </div>
    </nav>
  );
}
