import { apiClient } from "./client";

export interface MovieResponse {
  status: string;
  items: Movie[];
  params?: {
    pagination: Pagination;
  };
  paginate?: {
    current_page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
  };
  seo?: SEO;
}

export interface MovieDetailResponse {
  status: string;
  movie: MovieDetail;
  seo?: SEO;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryGroup {
  group: {
    id: string;
    name: string;
  };
  list: CategoryItem[];
}

// API response interfaces
interface ApiResponseItem {
  slug: string;
  id?: string;
  name: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  quality?: string;
  time?: string;
  total_episodes?: number;
  current_episode?: string;
  language?: string;
  director?: string;
  casts?: string;
  description?: string;
  created?: string;
  modified?: string;
}

interface ApiResponseData {
  status: string;
  items: ApiResponseItem[];
  paginate?: {
    current_page: number;
    total_page: number;
    total_items: number;
    items_per_page: number;
  };
  seo?: SEO;
}

export interface Movie {
  id: string;
  name: string;
  original_name: string;
  slug: string;
  thumb_url?: string;
  poster_url?: string;
  year?: number;
  category?: Record<string, CategoryGroup>;
  type?: string;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  trailer_url?: string;
  time?: string;
  total_episodes?: number;
  current_episode?: string;
  quality?: string;
  language?: string;
  director?: string;
  casts?: string;
  description?: string;
  created?: string;
  modified?: string;
}

export interface MovieDetail extends Movie {
  description: string;
  content?: string;
  quality: string;
  language?: string;
  director: string;
  casts: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  created?: string;
  modified?: string;
  episodes: {
    server_name: string;
    items: Episode[];
  }[];
  recommended?: Movie[];
}

export interface Episode {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface SEO {
  title: string;
  description: string;
  keywords: string;
}
const mapApiItemToMovie = (item: ApiResponseItem): Movie => {
  const categoryData: Record<string, CategoryGroup> = {};

  if (item.language) {
    const categories = item.language.split(', ');
    categoryData['1'] = {
      group: {
        id: '1',
        name: 'Thể loại'
      },
      list: categories.map((cat: string, index: number) => ({
        id: `cat-${index}`,
        name: cat
      }))
    };
  }
  let year = undefined;
  if (item.time) {
    const yearMatch = item.time.match(/\d{4}/);
    if (yearMatch) {
      year = parseInt(yearMatch[0], 10);
    }
  }

  return {
    id: item.slug || item.id || '',
    name: item.name,
    original_name: item.original_name,
    slug: item.slug,
    thumb_url: item.thumb_url,
    poster_url: item.poster_url,
    year,
    category: categoryData,
    type: item.total_episodes && item.total_episodes > 1 ? 'series' : 'single',
    sub_docquyen: Boolean(false),
    chieurap: Boolean(item.quality === 'HD' || (item.quality && item.quality.includes('CINEMA'))),
    trailer_url: '',
    time: item.time,
    total_episodes: item.total_episodes,
    current_episode: item.current_episode,
    quality: item.quality,
    language: item.language,
    director: item.director,
    casts: item.casts,
    description: item.description,
    created: item.created,
    modified: item.modified
  };
};

export const movieService = {
  getNewMovies: async (page = 1) => {
    const response = await apiClient.get<ApiResponseData>(`/films/phim-moi-cap-nhat?page=${page}`);
    const data = response.data;
    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },

  getMoviesByCategory: async (slug: string, page = 1) => {
    const response = await apiClient.get<ApiResponseData>(`/films/danh-sach/${slug}?page=${page}`);
    const data = response.data;

    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },


  getMovieDetails: async (slug: string) => {
    const response = await apiClient.get<MovieDetailResponse>(`/film/${slug}`);
    return response.data;
  },

  getMoviesByGenre: async (slug: string, page = 1) => {
    const response = await apiClient.get<ApiResponseData>(`/films/the-loai/${slug}?page=${page}`);
    const data = response.data;

    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },


  getMoviesByCountry: async (slug: string, page = 1) => {
    const response = await apiClient.get<ApiResponseData>(`/films/quoc-gia/${slug}?page=${page}`);
    const data = response.data;
    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },

  getMoviesByYear: async (year: string, page = 1) => {
    const response = await apiClient.get<ApiResponseData>(`/films/nam-phat-hanh/${year}?page=${page}`);
    const data = response.data;
    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },

  // Search movies
  searchMovies: async (keyword: string) => {
    const response = await apiClient.get<ApiResponseData>(`/films/search?keyword=${keyword}`);
    const data = response.data;

    // Map API response items to our Movie interface
    const mappedMovies = data.items.map(mapApiItemToMovie);

    return {
      status: data.status,
      items: mappedMovies,
      params: {
        pagination: {
          currentPage: data.paginate?.current_page || 1,
          totalPages: data.paginate?.total_page || 1,
          totalItems: data.paginate?.total_items || 0,
          totalItemsPerPage: data.paginate?.items_per_page || 10
        }
      }
    };
  },
};