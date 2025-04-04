import { Link } from "react-router-dom";
import { FiPlay, FiInfo, FiClock, FiCalendar, FiUser, FiPlus } from "react-icons/fi";
import { Movie } from "../lib/api/movieService";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeroProps {
  movie?: Movie;
  isLoading?: boolean;
}

export function Hero({ movie, isLoading = false }: HeroProps) {
  const placeholderMovie: Movie = {
    id: "placeholder",
    name: "Loading Amazing Movie",
    original_name: "Original Title",
    slug: "",
    thumb_url: "",
    poster_url: "",
    year: 2023,
    category: {},
    type: "single",
    sub_docquyen: false,
    chieurap: true,
    trailer_url: "",
  };

  const displayMovie = movie || placeholderMovie;

  // Get poster URL or fallback placeholder
  const posterUrl = displayMovie.poster_url || displayMovie.thumb_url || "";
  const hasValidUrl = posterUrl.trim().length > 0;
  const backgroundImage = hasValidUrl ? `url(${posterUrl})` : 'url(/placeholder-image.svg)';

  // Find categories to display
  const getCategories = () => {
    if (!displayMovie.category) return [];

    // Check for array-style categories first (older code)
    if (Array.isArray(displayMovie.category)) {
      return displayMovie.category.slice(0, 3);
    }

    // Handle new category structure
    const categoryGroups = Object.values(displayMovie.category);
    if (categoryGroups.length === 0) return [];

    // Get the first category group with items
    const firstGroup = categoryGroups.find(group => group.list && group.list.length > 0);
    return firstGroup ? firstGroup.list.map(item => item.name).slice(0, 3) : [];
  };

  const categories = getCategories();

  // Get year from movie data
  const getYear = () => {
    if (displayMovie.year) return displayMovie.year;

    if (displayMovie.time) {
      const yearMatch = displayMovie.time.match(/\d{4}/);
      if (yearMatch) return yearMatch[0];
    }

    return null;
  };

  const year = getYear();

  return (
    <section className="relative h-[95vh] min-h-[700px] w-full overflow-hidden pt-24">
      {/* Background gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40 z-10"></div>

      {/* Background poster image with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1500 transform scale-110"
        style={{
          backgroundImage: backgroundImage,
          backgroundPosition: 'center 20%',
          filter: 'brightness(0.8) contrast(1.2)',
        }}
      >
        {/* Dynamic animated overlay pattern */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      {/* Content container */}
      <div className="container relative z-20 mx-auto flex h-full items-center px-4">
        <div className="max-w-3xl animate-fade-in">
          {isLoading ? (
            <div className="space-y-8">
              <div className="h-16 w-2/3 animate-pulse rounded-lg bg-muted/30"></div>
              <div className="h-32 w-full animate-pulse rounded-lg bg-muted/30"></div>
              <div className="flex space-x-4">
                <div className="h-12 w-36 animate-pulse rounded-lg bg-muted/30"></div>
                <div className="h-12 w-36 animate-pulse rounded-lg bg-muted/30"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 backdrop-blur-sm p-8 transform translate-y-0 hover:translate-y-[-5px] transition-all duration-500">
              {/* Featured/New tag */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="default" className="text-md px-3 py-1 animate-pulse">
                  {displayMovie.chieurap ? "TRENDING" : "NEW RELEASE"}
                </Badge>
                {displayMovie.quality && (
                  <Badge variant="outline" className="bg-black/30 border-white/10 text-white">
                    {displayMovie.quality}
                  </Badge>
                )}
                {displayMovie.sub_docquyen && (
                  <Badge variant="outline" className="bg-amber-500/70 border-white/10 text-white">
                    EXCLUSIVE
                  </Badge>
                )}
              </div>

              {/* Movie title with animated underline and 3D effect */}
              <div className="relative">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-white md:text-4xl lg:text-5xl drop-shadow-lg"
                    style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  {displayMovie.name}
                </h1>
                <div className="absolute -bottom-3 left-0 h-1 w-32 bg-gradient-to-r from-primary to-primary/0 rounded-full animate-pulse"></div>
              </div>

              {/* Original title */}
              <h2 className="text-xl text-gray-300 font-medium">{displayMovie.original_name}</h2>

              {/* Movie metadata with beautiful icons and formatting */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300 text-base pt-2">
                {year && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <FiCalendar className="h-4 w-4 text-primary" />
                    <span>{year}</span>
                  </div>
                )}
                {displayMovie.time && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <FiClock className="h-4 w-4 text-primary" />
                    <span>{displayMovie.time}</span>
                  </div>
                )}
                {displayMovie.total_episodes && (
                  <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {displayMovie.total_episodes} Episodes
                    </span>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/5 hover:border-white/10 transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Description with custom style */}
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 rounded-full"></div>
                <p className="text-lg text-gray-200 max-w-2xl line-clamp-3 pl-4">
                  {displayMovie.description || "No description available."}
                </p>
              </div>

              {/* Action buttons with enhanced design */}
              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  size="lg"
                  className="h-12 px-6 bg-white text-black rounded-full gap-2 text-base font-medium group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {displayMovie.slug ? (
                      <Link to={`/movie/${displayMovie.slug}`} className="flex items-center gap-2">
                        <FiPlay className="h-4 w-4" />
                        Watch Now
                      </Link>
                    ) : (
                      <>
                        <FiPlay className="h-4 w-4" />
                        Watch Now
                      </>
                    )}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 rounded-full gap-2 text-base font-medium border-white/20 bg-black/30 backdrop-blur-sm hover:bg-black/50 group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {displayMovie.slug ? (
                      <Link to={`/movie/${displayMovie.slug}`} className="flex items-center gap-2">
                        <FiInfo className="h-4 w-4 group-hover:text-primary transition-colors" />
                        More Info
                      </Link>
                    ) : (
                      <>
                        <FiInfo className="h-4 w-4 group-hover:text-primary transition-colors" />
                        More Info
                      </>
                    )}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-white/20 bg-black/30 backdrop-blur-sm hover:bg-black/50 hover:border-primary/50 transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                </Button>
              </div>

              {/* Director and cast info */}
              {(displayMovie.director || displayMovie.casts) && (
                <div className="text-gray-300 mt-5 space-y-2 pl-2 border-l-2 border-primary/30">
                  {displayMovie.director && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-white">Director:</span>
                      <span>{displayMovie.director}</span>
                    </div>
                  )}
                  {displayMovie.casts && (
                    <div className="flex items-start gap-2 text-sm">
                      <FiUser className="h-4 w-4 text-primary mt-0.5" />
                      <span className="flex-1 line-clamp-2">{displayMovie.casts}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 z-20 hidden lg:block">
        <div className="h-40 w-40 rounded-full bg-primary/10 backdrop-blur-xl animate-pulse"></div>
      </div>

      <div className="absolute top-40 left-10 z-5 hidden lg:block">
        <div className="h-20 w-20 rounded-full bg-primary/5 backdrop-blur-xl"></div>
      </div>

      {/* Bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
}