import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlay, FiInfo, FiAward, FiStar } from "react-icons/fi";
import { Movie } from "../lib/api/movieService";
import { cn, truncateText } from "../lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleMovieClick = (slug: string) => {
    navigate(`/movie/${slug}`);
  };

  const firstCategory = movie.category ?
    Object.values(movie.category).find(cat => cat.list && cat.list.length > 0) : null;

  const yearCategory = movie.category ?
    Object.values(movie.category).find(cat => cat.group?.name === "Năm") : null;
  const movieYear = yearCategory?.list[0]?.name || movie.year || "";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md md:rounded-xl bg-background shadow-md transition-all duration-500",
        isHovered ? "scale-[1.05] z-10 shadow-xl" : "hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => movie.slug && handleMovieClick(movie.slug)}
    >
      <Link to={`/movie/${movie.slug}`} className="block h-full w-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md md:rounded-xl">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
              }`}
            style={{ backgroundImage: `url(${imageError ? '/placeholder-image.svg' : movie.thumb_url})` }}
          ></div>
          {!isLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-muted/50"></div>
          )}
          {!imageError && (
            <img
              src={movie.thumb_url}
              alt={movie.name}
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                isLoading ? "opacity-0 blur-2xl scale-110" : "opacity-100 blur-0 scale-100",
                isHovered ? "scale-110" : "scale-100"
              )}
              onLoad={() => {
                setIsLoading(false);
                setIsLoaded(true);
              }}
              onError={() => {
                setIsLoading(false);
                setImageError(true);
              }}
            />
          )}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent",
              isHovered ? "opacity-100" : "opacity-70",
              "transition-opacity duration-300"
            )}
          ></div>

          {/* Quality badge */}
          {movie.chieurap && (
            <Badge variant="secondary" className="absolute right-1.5 md:right-2 top-1.5 md:top-2 px-1 md:px-1.5 py-0 md:py-0.5 text-[8px] md:text-xs bg-primary text-primary-foreground">
              <FiAward className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
              PREMIUM
            </Badge>
          )}

          {/* Episode count badge */}
          {movie.total_episodes && movie.total_episodes > 1 && (
            <Badge variant="outline" className="absolute left-1.5 md:left-2 top-1.5 md:top-2 px-1 md:px-1.5 py-0 md:py-0.5 text-[8px] md:text-xs bg-black/50 text-white border-none backdrop-blur-sm">
              {movie.total_episodes} EP
            </Badge>
          )}

          {/* Movie year */}
          {movieYear && !movie.total_episodes && (
            <Badge variant="outline" className="absolute left-1.5 md:left-2 top-1.5 md:top-2 px-1 md:px-1.5 py-0 md:py-0.5 text-[8px] md:text-xs bg-black/50 text-white border-none backdrop-blur-sm">
              {movieYear}
            </Badge>
          )}

          {/* Hover overlay with actions */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end p-2 md:p-4 text-white",
              isHovered ? "opacity-100" : "opacity-0",
              "transition-opacity duration-300"
            )}
          >
            {isHovered && (
              <div className="flex flex-col gap-2 md:gap-4 transform transition-all duration-300 animate-slide-up">
                <h3 className="font-bold text-sm md:text-lg leading-tight">
                  {truncateText(movie.name, 20)}
                </h3>

                <div className="flex gap-1.5 md:gap-2">
                  <Button size="sm" variant="default" className="h-6 md:h-8 px-2 md:px-3 text-xs rounded-full">
                    <FiPlay className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Play
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 md:h-8 px-2 md:px-3 text-xs rounded-full bg-white/10 border-none hover:bg-white/20">
                    <FiInfo className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> Info
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mt-0.5 md:mt-1">
                  {movie.quality && (
                    <Badge variant="outline" className="text-[8px] md:text-xs bg-black/20 text-white border-none">
                      {movie.quality}
                    </Badge>
                  )}

                  {movie.language && (
                    <Badge variant="outline" className="text-[8px] md:text-xs bg-black/20 text-white border-none">
                      {movie.language}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movie info (only visible when not hovered) */}
        <div className={cn(
          "p-2 md:p-3 transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
          <h3 className="text-sm md:text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-1">
            {movie.name}
          </h3>
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 line-clamp-1">
            {movie.original_name}
          </p>

          {/* Rating info */}
          <div className="flex items-center mt-1 md:mt-2 text-[10px] md:text-xs text-amber-500">
            <FiStar className="h-3 w-3 md:h-3.5 md:w-3.5 fill-current mr-0.5 md:mr-1" />
            <span>9.2</span>
            <span className="text-muted-foreground ml-1 md:ml-1.5 text-[8px] md:text-[10px]">{movie.time}</span>
          </div>

          {/* Categories */}
          {firstCategory && firstCategory.list.length > 0 && (
            <div className="mt-1 md:mt-2 flex flex-wrap gap-0.5 md:gap-1">
              {firstCategory.list.slice(0, 2).map((item) => (
                <Badge key={item.id} variant="secondary" className="px-1 md:px-1.5 py-0 text-[8px] md:text-[10px] font-normal">
                  {item.name}
                </Badge>
              ))}
              {firstCategory.list.length > 2 && (
                <Badge variant="outline" className="px-1 md:px-1.5 py-0 text-[8px] md:text-[10px] font-normal">
                  +{firstCategory.list.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}