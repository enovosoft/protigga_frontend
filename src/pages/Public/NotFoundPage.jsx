import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Sorry, the page you are looking for doesn't exist or has been
              moved.
            </p>
          </div>
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
