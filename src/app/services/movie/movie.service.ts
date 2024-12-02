import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TPaginatedMovieResponse } from '../../interfaces/movie.interface';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getAllMovies(page: number = 1): Promise<TPaginatedMovieResponse> {
    try {
      const data = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/movies?page=${page}`)
      );

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch movies');
      }

      return {
        results: data.data.results,
        page: data.data.page,
        total_pages: data.data.totalPages,
        total_results: data.data.totalResults,
        hasMore: data.data.hasMore
      };

    } catch (error) {
      throw error;
    }
  }

  async searchMovies(query: string): Promise<TPaginatedMovieResponse> {
    try {
      if (!query) {
        throw new Error('Search query is required');
      }

      const data = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/movies/search?q=${encodeURIComponent(query)}`)
      );

      if (!data.success) {
        throw new Error(data.message || 'Failed to search movies');
      }

      return {
        results: data.data.results,
        page: data.data.page,
        total_pages: data.data.totalPages,
        total_results: data.data.totalResults,
        hasMore: data.data.page < data.data.totalPages
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
}
