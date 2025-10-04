import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDashboardClick = () => {
    navigate("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <h1 className="text-2xl font-bold text-primary font-primary">
              প্রতিজ্ঞা
            </h1>
          </Link>

          {/* Desktop Navigation */}
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

        <div className="flex items-center gap-4">
          <Button
            onClick={handleDashboardClick}
            className="gap-2 hidden sm:flex"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-primary fill-primary" />
            ) : (
              <Menu className="h-5 w-5 text-primary fill-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block py-3 px-4 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="block py-3 px-4 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Courses
              </Link>
              <Link
                to="/notes"
                className="block py-3 px-4 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Notes
              </Link>
              <Link
                to="/books"
                className="block py-3 px-4 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Books
              </Link>
              <Link
                to="/auth"
                className="block py-3 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
