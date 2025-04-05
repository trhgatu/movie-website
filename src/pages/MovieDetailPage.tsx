import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FiPlay, FiClock, FiCalendar, FiFlag, FiUser, FiVideo, FiInfo } from "react-icons/fi";
import { MovieDetail, Episode, movieService } from "../lib/api/movieService";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MovieGrid } from "../components/MovieGrid";
import { Badge } from "../components/ui/badge";

export function MovieDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [selectedServer, setSelectedServer] = useState<number>(0);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      try {
        if (slug) {
          const data = await movieService.getMovieDetails(slug);
          setMovie(data.movie);
          if (data.movie.episodes && data.movie.episodes.length > 0) {
            setSelectedServer(0);
            if (data.movie.episodes[0].items && data.movie.episodes[0].items.length > 0) {
              setSelectedEpisode(data.movie.episodes[0].items[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovie();
  }, [slug]);

  // Helper to get genres from category
  const getGenres = () => {
    if (!movie?.category) return [];

    // Look for the category group with name "Thể loại"
    const genreCategory = Object.values(movie.category).find(
      cat => cat.group.name === "Thể loại"
    );

    return genreCategory?.list || [];
  };

  // Helper to get country from category
  const getCountry = () => {
    if (!movie?.category) return [];

    const countryCategory = Object.values(movie.category).find(
      cat => cat.group.name === "Quốc gia"
    );

    return countryCategory?.list || [];
  };

  // Check if selected episode has a valid embed URL
  const hasValidEmbedUrl = selectedEpisode && selectedEpisode.embed && selectedEpisode.embed.trim() !== '';

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-screen px-3 md:px-4 pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="flex flex-col items-center justify-center pt-12 md:pt-20">
          <div className="h-16 w-16 md:h-20 md:w-20 animate-spin rounded-full border-3 md:border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm md:text-base text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto min-h-screen px-3 md:px-4 pt-16 md:pt-20 pb-8 md:pb-12">
        <div className="flex flex-col items-center justify-center pt-8 md:pt-20">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Movie Not Found</h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground text-center max-w-md">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-6 md:mt-8">
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const genres = getGenres();
  const countries = getCountry();

  return (
    <div className="min-h-screen">
      {/* Movie Hero Section */}
      <div
        className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] w-full overflow-hidden bg-cover bg-center pt-16 md:pt-20"
        style={{
          backgroundImage: `url(${movie.poster_url || movie.thumb_url})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50"></div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="container relative z-10 mx-auto flex min-h-full items-center px-3 md:px-4 py-8 md:py-16 lg:py-24">
          <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">
            {/* Movie Poster with floating effect */}
            <div className="mx-auto md:mx-0 mb-6 md:mb-8 w-56 sm:w-64 md:w-72 lg:w-80 shrink-0 transform hover:translate-y-[-5px] transition-all duration-500">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-purple-600 rounded-xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src={movie.thumb_url || '/placeholder-poster.svg'}
                    alt={movie.name}
                    className="h-full w-full object-cover"
                  />

                  {/* Quality badge */}
                  {movie.quality && (
                    <div className="absolute top-2 md:top-3 right-2 md:right-3">
                      <Badge variant="default" className="text-xs bg-primary/90 shadow-lg">
                        {movie.quality}
                      </Badge>
                    </div>
                  )}

                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/80 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <FiPlay className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick action button */}
              {selectedEpisode && (
                <Button
                  size="lg"
                  className="mt-4 md:mt-6 w-full gap-2 rounded-xl h-10 md:h-12 lg:h-14 text-sm md:text-base bg-white from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                  onClick={() => {
                    const element = document.getElementById('player-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <FiPlay className="h-4 w-4 md:h-5 md:w-5 text-black" />
                  <span className="text-black">
                    Watch Now
                  </span>
                </Button>
              )}
            </div>

            {/* Movie Info with glass effect */}
            <div className="max-w-3xl backdrop-blur-sm bg-black/20 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/5 shadow-xl animate-fade-in mt-2 md:mt-0">
              {/* Movie title with animated underline */}
              <div className="relative mb-2 md:mb-3">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  {movie.name}
                </h1>
                <div className="absolute -bottom-2 md:-bottom-3 left-0 h-0.5 md:h-1 w-16 md:w-24 lg:w-32 bg-gradient-to-r from-primary to-primary/0 rounded-full"></div>
              </div>

              <h2 className="mb-3 md:mb-6 text-base md:text-xl lg:text-2xl text-gray-300 font-medium">{movie.original_name}</h2>

              {/* Categories with improved styling */}
              <div className="mb-4 md:mb-6 lg:mb-8 flex flex-wrap gap-1.5 md:gap-2">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-primary/70 px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-white backdrop-blur-sm hover:bg-primary transition-colors duration-200"
                  >
                    {genre.name}
                  </Link>
                ))}
                {countries.map((country) => (
                  <Link
                    key={country.id}
                    to={`/country/${country.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-full bg-white/10 px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>

              {/* Movie stats with cards layout */}
              <div className="mb-4 md:mb-6 lg:mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiClock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Duration</div>
                    <div className="text-sm md:text-base text-white">{movie.time || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiCalendar className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Episodes</div>
                    <div className="text-sm md:text-base text-white">{movie.current_episode}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiFlag className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Countries</div>
                    <div className="text-sm md:text-base text-white line-clamp-1">{countries.map(c => c.name).join(", ") || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiUser className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Cast</div>
                    <div className="text-sm md:text-base text-white line-clamp-1">{movie.casts || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiVideo className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Director</div>
                    <div className="text-sm md:text-base text-white line-clamp-1">{movie.director || "N/A"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl bg-white/5 p-2 md:p-3 backdrop-blur-sm">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/20">
                    <FiInfo className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-gray-400">Language</div>
                    <div className="text-sm md:text-base text-white line-clamp-1">{movie.language || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 lg:h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8 lg:py-12">
        {/* Synopsis with prettier design */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold">Synopsis</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
          </div>
          <div
            className="prose prose-invert max-w-none prose-sm md:prose-base rounded-xl md:rounded-2xl bg-white/5 p-4 md:p-6 lg:p-8 shadow-lg border border-white/5 backdrop-blur-sm"
            dangerouslySetInnerHTML={{ __html: movie.description || movie.content || "" }}
          />
        </div>

        {/* Episodes */}
        {movie.episodes && movie.episodes.length > 0 && (
          <div className="mb-8 md:mb-12 lg:mb-16">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold">Watch {movie.name}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>

            {/* Server selection */}
            {movie.episodes.length > 1 && (
              <Tabs defaultValue={selectedServer.toString()}
                onValueChange={(value: string) => setSelectedServer(parseInt(value))}
                className="mb-4 md:mb-6">
                <TabsList className="w-full overflow-x-auto flex-nowrap md:w-auto p-0.5 md:p-1 bg-white/5 backdrop-blur-sm">
                  {movie.episodes.map((server, index) => (
                    <TabsTrigger key={index} value={index.toString()} className="text-xs md:text-sm flex-1 md:flex-none data-[state=active]:bg-primary">
                      {server.server_name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            {/* Episode selection */}
            {movie.episodes[selectedServer]?.items.length > 1 && (
              <div className="mb-6 md:mb-8 bg-white/5 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/5">
                <h3 className="mb-3 md:mb-4 text-base md:text-lg font-medium flex items-center gap-2">
                  <span className="h-1.5 md:h-2 w-1.5 md:w-2 rounded-full bg-primary"></span>
                  Episodes
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 md:gap-2">
                  {movie.episodes[selectedServer].items.map((episode) => (
                    <Button
                      key={episode.slug}
                      variant={selectedEpisode?.slug === episode.slug ? "default" : "outline"}
                      className={`text-xs md:text-sm h-8 md:h-9 px-1.5 md:px-3 py-0 text-center transition-all ${selectedEpisode?.slug === episode.slug ? 'bg-primary hover:bg-primary/90' : 'hover:bg-white/10 border-white/10'}`}
                      onClick={() => setSelectedEpisode(episode)}
                    >
                      {episode.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Player section with improved UI */}
            {selectedEpisode && hasValidEmbedUrl && (
              <div id="player-section" className="mb-8 md:mb-12 lg:mb-16 scroll-mt-24 md:scroll-mt-32">
                <div className="flex flex-wrap justify-between items-center mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold flex items-center gap-1.5 md:gap-2">
                    <span className="h-2 md:h-3 w-2 md:w-3 rounded-full bg-primary animate-pulse"></span>
                    <span className="line-clamp-1">
                      {movie.name} - {movie.episodes[selectedServer].server_name} - Episode {selectedEpisode.name}
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-0">
                    {movie.quality && (
                      <Badge variant="outline" className="text-xs bg-black/30 border-white/10">{movie.quality}</Badge>
                    )}
                    <Badge variant="outline" className="text-xs bg-green-500/20 border-green-500/30 text-green-400">PLAYING</Badge>
                  </div>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl md:rounded-2xl shadow-2xl border border-white/5 group">
                  <div className="absolute inset-0 bg-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/80 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <FiPlay className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                  </div>
                  <iframe
                    src={selectedEpisode.embed}
                    title={`${movie.name} - ${selectedEpisode.name}`}
                    frameBorder="0"
                    allowFullScreen
                    className="absolute left-0 top-0 h-full w-full"
                  ></iframe>
                </div>

                <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 md:gap-4">
                  <Button variant="ghost" size="sm" className="h-8 md:h-9 gap-1.5 md:gap-2 text-xs md:text-sm bg-white/5 hover:bg-white/10">
                    <FiPlay className="h-3 w-3 md:h-4 md:w-4" /> Resume
                  </Button>

                  <p className="text-xs md:text-sm text-muted-foreground">
                    Enjoying {movie.name}? <Link to="#related" className="text-primary hover:underline">Find similar content</Link>
                  </p>
                </div>
              </div>
            )}

            {selectedEpisode && !hasValidEmbedUrl && (
              <div id="player-section" className="mb-8 md:mb-12 lg:mb-16 scroll-mt-24 md:scroll-mt-32">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl md:rounded-2xl border border-white/5 bg-gradient-to-br from-muted/50 to-black/50 flex items-center justify-center shadow-2xl">
                  <div className="text-center px-4 md:px-8 py-6 md:py-10 rounded-xl md:rounded-2xl backdrop-blur-sm bg-black/30 max-w-xs md:max-w-lg">
                    <FiPlay className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 text-primary/50 mx-auto mb-3 md:mb-6" />
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-4">Source Unavailable</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
                      This content is currently unavailable. This could be due to regional restrictions or temporary service issues.
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                      <Button variant="outline" size="sm" onClick={() => setSelectedServer((selectedServer + 1) % movie.episodes.length)} className="h-8 md:h-10 text-xs md:text-sm border-white/10 bg-white/5 hover:bg-white/10">
                        Try Another Server
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 md:h-10 text-xs md:text-sm hover:bg-white/10">
                        Report Issue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendations with improved layout */}
        {movie.recommended && movie.recommended.length > 0 && (
          <div className="mb-6 md:mb-8 lg:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold">You May Also Like</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
            <MovieGrid movies={movie.recommended} />
          </div>
        )}
      </div>
    </div>
  );
}