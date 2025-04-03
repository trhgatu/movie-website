import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Movie } from "../lib/api/movieService";
import { MovieGrid } from "../components/MovieGrid";
import { Pagination } from "../components/Pagination";

type CategoryType = "category" | "genre" | "country" | "year";

interface ApiResponse {
  status: string;
  paginate: {
    current_page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
  };
  cat?: {
    name: string;
    title: string;
    slug: string;
  };
  items: {
    name: string;
    slug: string;
    original_name: string;
    thumb_url: string;
    poster_url: string;
    created: string;
    modified: string;
    description: string;
    total_episodes: number;
    current_episode: string;
    time: string;
    quality: string;
    language: string;
    director: string | null;
    casts: string;
  }[];
}

export function CategoryPage() {
  const { slug, type = "category" } = useParams<{ slug: string; type?: CategoryType }>();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);

    const fetchMovies = async () => {
      try {
        let response: ApiResponse;

        switch (type) {
          case "genre":
            response = await fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=${currentPage}`).then(res => res.json());
            setCategoryTitle(`Genre: ${formatTitle(slug)}`);
            break;
          case "country":
            response = await fetch(`https://phim.nguonc.com/api/films/quoc-gia/${slug}?page=${currentPage}`).then(res => res.json());
            setCategoryTitle(`Country: ${formatTitle(slug)}`);
            break;
          case "year":
            response = await fetch(`https://phim.nguonc.com/api/films/nam-phat-hanh/${slug}?page=${currentPage}`).then(res => res.json());
            setCategoryTitle(`Released in ${slug}`);
            break;
          default:
            response = await fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=${currentPage}`).then(res => res.json());
            setCategoryTitle(response.cat?.title || formatTitle(slug));
        }

        // Map API response items to our Movie type
        const mappedMovies = response.items.map(item => {
          // Convert array of categories to the required structure
          const categoryData: Record<string, {
            group: {
              id: string;
              name: string;
            };
            list: {
              id: string;
              name: string;
            }[];
          }> = {};

          if (item.language) {
            const categories = item.language.split(', ');
            categoryData['1'] = {
              group: {
                id: '1',
                name: 'Thể loại'
              },
              list: categories.map((cat, index) => ({
                id: `cat-${index}`,
                name: cat
              }))
            };
          }

          return {
            id: item.slug,
            name: item.name,
            original_name: item.original_name,
            slug: item.slug,
            thumb_url: item.thumb_url,
            poster_url: item.poster_url,
            /* year: parseInt(item.time.match(/\d{4}/)?.[0] || '0', 10), */
            category: categoryData,
            type: item.total_episodes > 1 ? 'series' : 'single',
            sub_docquyen: false,
            chieurap: item.quality === 'HD' || item.quality.includes('CINEMA'),
            trailer_url: '',
          };
        });

        setMovies(mappedMovies);
        setPagination({
          currentPage: response.paginate.current_page,
          totalPages: response.paginate.total_page,
        });
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [slug, type, currentPage]);

  // Helper function to format category titles
  const formatTitle = (slug: string): string => {
    const formattedTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Special cases and common acronyms
    return formattedTitle
      .replace("Phim Moi Cap Nhat", "New Releases")
      .replace("Phim Bo", "TV Series")
      .replace("Phim Le", "Movies")
      .replace("Phim Chieu Rap", "Cinema Movies")
      .replace("Hoat Hinh", "Animation");
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryTitle}</h1>
        <p className="text-muted-foreground">
          {!isLoading && `Showing ${movies.length} results`}
        </p>
      </div>

      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        emptyMessage={`No movies found in this ${type}.`}
        className="mb-8"
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}