// src/app/services/favorites/favorites.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TMovie } from '../../interfaces/movie.interface';

interface FavoriteResponse {
  success: boolean;
  message?: string;
  data?: {
    results: TMovie[];
    page: number;
    totalPages: number;
    totalResults: number;
  };
}

interface FavoriteStatus {
  success: boolean;
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api/v1/favorites';
  private favoritesSubject = new BehaviorSubject<TMovie[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  private async loadFavorites() {
    try {
      const response = await firstValueFrom(
        this.http.get<FavoriteResponse>(this.apiUrl)
      );

      if (response.success && response.data) {
        this.favoritesSubject.next(response.data.results);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async toggleFavorite(movie: TMovie) {
    try {
      const isFavorite = await this.isFavorite(movie.id);

      if (isFavorite) {
        // Remove from favorites
        const response = await firstValueFrom(
          this.http.delete<FavoriteResponse>(`${this.apiUrl}/${movie.id}`)
        );

        if (response.success) {
          const currentFavorites = this.favoritesSubject.value;
          this.favoritesSubject.next(
            currentFavorites.filter(m => m.id !== movie.id)
          );
        }
      } else {
        // Add to favorites
        const response = await firstValueFrom(
          this.http.post<FavoriteResponse>(this.apiUrl, movie)
        );

        if (response.success) {
          const currentFavorites = this.favoritesSubject.value;
          this.favoritesSubject.next([...currentFavorites, movie]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  async isFavorite(movieId: number): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<FavoriteStatus>(`${this.apiUrl}/${movieId}/check`)
      );
      return response.success && response.isFavorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  async getFavorites(page: number = 1, limit: number = 10) {
    try {
      const response = await firstValueFrom(
        this.http.get<FavoriteResponse>(
          `${this.apiUrl}?page=${page}&limit=${limit}`
        )
      );

      if (response.success && response.data) {
        this.favoritesSubject.next(response.data.results);
        return response.data;
      }

      // Add default return for when success is false or data is undefined
      return {
        results: [],
        page: 1,
        totalPages: 0,
        totalResults: 0
      };

    } catch (error) {
      console.error('Error getting favorites:', error);
      // Add return value for error case
      return {
        results: [],
        page: 1,
        totalPages: 0,
        totalResults: 0
      };
    }
  }
}
