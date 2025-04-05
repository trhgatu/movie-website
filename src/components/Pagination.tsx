import { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className,
  onPageChange,
}: PaginationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Determine link based on current location
  const getPageUrl = (page: number) => {
    if (baseUrl) return `${baseUrl}?page=${page}`;

    const url = new URL(window.location.origin + location.pathname + location.search);
    url.searchParams.set("page", page.toString());
    return `${location.pathname}${url.search}`;
  };

  // Create pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxDisplayedPages = 5;

    // Always show first page
    items.push(1);

    const startPage = Math.max(2, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 3);

    // Adjust if we're at the end
    if (endPage < startPage) endPage = startPage;

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push("ellipsis-start");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push("ellipsis-end");
    }

    // Always show last page if it exists
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  const handleClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Custom navigation handler with scroll to top
  const handleNavigate = (page: number) => {
    navigate(getPageUrl(page));
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex justify-center", className)} aria-label="Pagination">
      <ul className="flex items-center gap-1.5">
        {/* Previous Page */}
        <li>
          {currentPage > 1 ? (
            onPageChange ? (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:-translate-x-0.5"
                onClick={() => handleClick(currentPage - 1)}
                aria-label="Previous page"
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:-translate-x-0.5"
                onClick={() => handleNavigate(currentPage - 1)}
                aria-label="Previous page"
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 opacity-50 cursor-not-allowed"
              disabled
              aria-label="Previous page"
            >
              <FiChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </li>

        {/* Page Numbers */}
        {paginationItems.map((item, index) => {
          if (item === "ellipsis-start" || item === "ellipsis-end") {
            return (
              <li key={item}>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </li>
            );
          }

          const page = item as number;
          const isActive = page === currentPage;

          return (
            <li key={`${page}-${index}`}>
              {onPageChange ? (
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-9 w-9 transition-all duration-200",
                    isActive
                      ? "shadow-md transform scale-105"
                      : "hover:bg-primary/10 hover:border-primary hover:scale-105"
                  )}
                  onClick={() => handleClick(page)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Button>
              ) : (
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-9 w-9 transition-all duration-200",
                    isActive
                      ? "shadow-md transform scale-105 bg-white text-black"
                      : "hover:bg-primary/10 hover:border-primary hover:scale-105"
                  )}
                  onClick={() => handleNavigate(page)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Button>
              )}
            </li>
          );
        })}

        {/* Next Page */}
        <li>
          {currentPage < totalPages ? (
            onPageChange ? (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:translate-x-0.5"
                onClick={() => handleClick(currentPage + 1)}
                aria-label="Next page"
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:translate-x-0.5"
                onClick={() => handleNavigate(currentPage + 1)}
                aria-label="Next page"
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 opacity-50 cursor-not-allowed"
              disabled
              aria-label="Next page"
            >
              <FiChevronRight className="h-4 w-4" />
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}