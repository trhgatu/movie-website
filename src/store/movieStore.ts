import { create } from "zustand";
import { Movie, MovieDetail, movieService } from "../lib/api/movieService";

interface MovieState {
  // Loading states
  isLoading: boolean;
  isDetailLoading: boolean;

  // Error states
  error: string | null;

  // Data
  newMovies: Movie[];
  movieDetail: MovieDetail | null;
  searchResults: Movie[];

  // Pagination
  currentPage: number;
  totalPages: number;

  // Actions
  fetchNewMovies: (page?: number) => Promise<void>;
  fetchMovieDetails: (slug: string) => Promise<void>;
  searchMovies: (keyword: string) => Promise<void>;
  resetSearchResults: () => void;
  setError: (error: string | null) => void;
}

export const useMovieStore = create<MovieState>((set) => ({
  // Initial states
  isLoading: false,
  isDetailLoading: false,
  error: null,
  newMovies: [],
  movieDetail: null,
  searchResults: [],
  currentPage: 1,
  totalPages: 1,

  // Actions
  fetchNewMovies: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await movieService.getNewMovies(page);
      set({
        newMovies: response.items,
        currentPage: response.params.pagination.currentPage,
        totalPages: response.params.pagination.totalPages,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch new movies"
      });
    }
  },

  fetchMovieDetails: async (slug: string) => {
    set({ isDetailLoading: true, error: null });
    try {
      const response = await movieService.getMovieDetails(slug);
      set({
        movieDetail: response.movie,
        isDetailLoading: false
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch movie details"
      });
    }
  },

  searchMovies: async (keyword: string) => {
    if (!keyword.trim()) {
      set({ searchResults: [] });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await movieService.searchMovies(keyword);
      set({
        searchResults: response.items,
        isLoading: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to search movies"
      });
    }
  },

  resetSearchResults: () => {
    set({ searchResults: [] });
  },

  setError: (error) => {
    set({ error });
  }
}));