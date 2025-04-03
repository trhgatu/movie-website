import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-4 text-9xl font-bold tracking-tight">404</h1>
      <h2 className="mb-6 text-3xl font-semibold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <div className="flex gap-4">
        <Button>
          <Link to="/">Go Home</Link>
        </Button>
        <Button variant="outline">
          <Link to="/category/phim-moi-cap-nhat">Browse Movies</Link>
        </Button>
      </div>
    </div>
  );
}