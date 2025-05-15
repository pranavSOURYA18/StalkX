
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <TrendingDown className="h-16 w-16 text-red-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">
          Looks like this page has crashed like a bear market!
        </p>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been delisted from our exchange.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button size="lg">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
