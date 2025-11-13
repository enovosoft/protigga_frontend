import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Component } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  handleGoBack = () => {
    this.setState({ hasError: false });
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Simple 500 error page
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something Went Wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Something went wrong while accessing this page. Please try
                refreshing the page or go back to the homepage.
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={this.handleGoBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Button onClick={this.handleGoHome} className="gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
