// src/app/interfaces/movie.interface.ts
export interface TMovie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  rating: number;
  popularity: number;
  genres: any[];
  runtime: number | null;
  tagline: string | null;
}

export interface TMovieResponse {
  results: TMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TPaginatedMovieResponse extends TMovieResponse {
  hasMore: boolean;
}

