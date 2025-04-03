import { ReactNode } from "react";
import { MovieCard } from "./MovieCard";
import { Movie } from "../lib/api/movieService";
import { cn } from "../lib/utils";
import { FiFilm } from "react-icons/fi";

interface MovieGridProps {
  title?: string;
  movies: Movie[];
  isLoading?: boolean;
  className?: string;
  emptyMessage?: string;
  action?: ReactNode;
}

export function MovieGrid({
  title,
  movies,
  isLoading = false,
  className,
  emptyMessage = "No movies found.",
  action,
}: MovieGridProps) {
  const skeletonArray = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section className={cn("space-y-6", className)}>
      {/* Grid Header with animated underline */}
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              <div className="absolute -bottom-1 left-0 h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
            </div>
          )}
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Movie Grid with animations */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {skeletonArray.map((index) => (
            <div
              key={index}
              className="aspect-[2/3] w-full animate-pulse rounded-xl bg-gradient-to-br from-muted/80 to-muted"
              style={{
                animationDelay: `${index * 0.05}s`,
                animationDuration: "1.5s",
              }}
            ></div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id || index}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-60 items-center justify-center rounded-xl border border-dashed border-border bg-card/50 shadow-sm">
          <FiFilm className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-center text-xl text-muted-foreground font-medium">{emptyMessage}</p>
          <p className="text-center text-sm text-muted-foreground/60 mt-2">Try adjusting your search or filter options</p>
        </div>
      )}
    </section>
  );
}