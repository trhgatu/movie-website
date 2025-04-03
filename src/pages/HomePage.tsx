import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useMovieStore } from "../store/movieStore";
import { Movie, movieService } from "../lib/api/movieService";
import { Hero } from "../components/Hero";
import { MovieGrid } from "../components/MovieGrid";
import { Button } from "../components/ui/button";

export function HomePage() {
  const { newMovies, isLoading, fetchNewMovies } = useMovieStore();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [tvSeries, setTvSeries] = useState<Movie[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isTvSeriesLoading, setIsTvSeriesLoading] = useState(true);

  // Fetch new movies
  useEffect(() => {
    fetchNewMovies();
  }, [fetchNewMovies]);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrending = async () => {
      setIsTrendingLoading(true);
      try {
        const response = await movieService.getMoviesByCategory("phim-le", 1);
        setTrendingMovies(response.items);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Fetch TV series
  useEffect(() => {
    const fetchTvSeries = async () => {
      setIsTvSeriesLoading(true);
      try {
        const response = await movieService.getMoviesByCategory("phim-bo", 1);
        setTvSeries(response.items);
      } catch (error) {
        console.error("Error fetching TV series:", error);
      } finally {
        setIsTvSeriesLoading(false);
      }
    };

    fetchTvSeries();
  }, []);

  // Set featured movie from new or trending movies
  useEffect(() => {
    if (trendingMovies.length > 0) {
      // Pick a random movie from trending for the hero
      const randomIndex = Math.floor(Math.random() * Math.min(5, trendingMovies.length));
      setFeaturedMovie(trendingMovies[randomIndex]);
    } else if (newMovies.length > 0) {
      setFeaturedMovie(newMovies[0]);
    }
  }, [newMovies, trendingMovies]);

  // ViewAll button component for grid sections
  const ViewAllAction = ({ to }: { to: string }) => (
    <Button variant="ghost" size="sm">
      <Link to={to} className="flex items-center gap-1">
        View All <FiChevronRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero movie={featuredMovie || undefined} isLoading={isLoading && !featuredMovie} />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* New Releases */}
        <MovieGrid
          title="New Releases"
          movies={newMovies}
          isLoading={isLoading}
          action={<ViewAllAction to="/category/phim-moi-cap-nhat" />}
        />

        {/* Trending Now */}
        <MovieGrid
          title="Trending Now"
          movies={trendingMovies}
          isLoading={isTrendingLoading}
          action={<ViewAllAction to="/category/phim-chieu-rap" />}
        />

        {/* TV Series */}
        <MovieGrid
          title="TV Series"
          movies={tvSeries}
          isLoading={isTvSeriesLoading}
          action={<ViewAllAction to="/category/phim-bo" />}
        />
      </div>
    </div>
  );
}