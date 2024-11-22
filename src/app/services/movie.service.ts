// movie.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie, MovieResponse } from '../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'YOUR_API_KEY';
  private baseUrl = 'https://api.themoviedb.org/3';
  private favoriteMovies = new BehaviorSubject<Movie[]>([]);

  constructor(private http: HttpClient) {}

  getMovies(page: number = 1, searchQuery: string = ''): Observable<MovieResponse> {
    const endpoint = searchQuery
      ? `${this.baseUrl}/search/movie`
      : `${this.baseUrl}/movie/popular`;

    const params = {
      api_key: this.apiKey,
      page: page.toString(),
      query: searchQuery
    };

    return this.http.get<MovieResponse>(endpoint, { params });
  }

  toggleFavorite(movie: Movie): void {
    const currentFavorites = this.favoriteMovies.value;
    const index = currentFavorites.findIndex(m => m.id === movie.id);

    if (index === -1) {
      this.favoriteMovies.next([...currentFavorites, movie]);
    } else {
      currentFavorites.splice(index, 1);
      this.favoriteMovies.next([...currentFavorites]);
    }
  }

  getFavorites(): Observable<Movie[]> {
    return this.favoriteMovies.asObservable();
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteMovies.value.some(movie => movie.id === movieId);
  }
}
