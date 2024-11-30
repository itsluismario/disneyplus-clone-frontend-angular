// src/app/services/movie.service.ts
import { Injectable } from '@angular/core';
import { TPaginatedMovieResponse } from '../../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/api/v1';
  private pageSize = 20;

async getAllMovies(page: number = 1): Promise<TPaginatedMovieResponse> {
  try {
    const response = await fetch(
      `${this.apiUrl}/movies?page=${page}`
    );
    const data = await response.json();

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
}
