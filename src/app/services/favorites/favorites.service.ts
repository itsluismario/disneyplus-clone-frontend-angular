// src/app/services/favorites/favorites.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TMovie } from '../../interfaces/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey = 'favoriteMovies';
  private favoritesSubject = new BehaviorSubject<TMovie[]>(this.loadFavorites());
  favorites$ = this.favoritesSubject.asObservable();

  private loadFavorites(): TMovie[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  toggleFavorite(movie: TMovie) {
    const favorites = this.favoritesSubject.value;
    const index = favorites.findIndex(m => m.id === movie.id);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(movie);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    this.favoritesSubject.next([...favorites]);
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesSubject.value.some(m => m.id === movieId);
  }
}
