import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiFilm, FiTrendingUp, FiClock, FiFilter } from "react-icons/fi";
import { Movie, movieService } from "../lib/api/movieService";
import { MovieGrid } from "../components/MovieGrid";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const POPULAR_SEARCHES = [
  "Action", "Comedy", "Thriller", "Romance",
  "Marvel", "DC", "Anime", "K-Drama"
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Perform search when query parameter changes
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const response = await movieService.searchMovies(query);
        setMovies(response.items);
        setHasSearched(true);

        // Save to recent searches
        setRecentSearches(prev => {
          const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
          localStorage.setItem('recentSearches', JSON.stringify(updated));
          return updated;
        });

      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Apply a suggested search
  const applySearch = (term: string) => {
    setSearchQuery(term);
    setSearchParams({ q: term });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero search section */}
      <div className="w-full pt-32 pb-12 px-4 scroll-mt-24" id="search-section">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-center">
            Discover Amazing Content
            <div className="h-1 w-24 bg-primary mx-auto mt-4 rounded-full"></div>
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full max-w-3xl mx-auto gap-2 mb-12">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                <FiSearch className="h-5 w-5 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows, anime..."
                className="h-14 w-full rounded-full bg-white/5 backdrop-blur-sm pl-12 pr-12 ring-1 ring-border/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all focus:bg-white/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="h-14 rounded-full px-8">
              Search
            </Button>
          </form>

          {/* Popular and recent searches */}
          {!query && (
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
              {recentSearches.length > 0 && (
                <div className="w-full max-w-3xl">
                  <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-primary" />
                    Recent Searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 text-sm"
                        onClick={() => applySearch(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full max-w-3xl">
                <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <FiTrendingUp className="h-4 w-4 text-primary" />
                  Popular Searches
                </h2>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer px-4 py-2 text-sm"
                      onClick={() => applySearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Search Results */}
        {query && (
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch className="h-5 w-5 text-primary" />
                    Results for "{query}"
                  </>
                )}
              </h2>

              <Button variant="ghost" size="sm" className="gap-1">
                <FiFilter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <MovieGrid
              movies={movies}
              isLoading={isLoading}
              emptyMessage={`No movies found for "${query}". Try a different search term.`}
            />
          </div>
        )}

        {/* Initial State */}
        {!query && !hasSearched && (
          <div className="flex items-center justify-center rounded-lg bg-muted/10 backdrop-blur-sm py-16 text-center mt-8 border border-white/5 animate-fade-in">
            <div className="max-w-md px-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <FiFilm className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Find Your Next Favorite</h2>
              <p className="text-muted-foreground mb-6">
                Discover thousands of movies and TV shows. Search by title, actor, director, or genre.
              </p>
              <div className="text-sm text-center text-muted-foreground">
                Try searching for a movie title, actor name, or click one of the suggested searches above.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
